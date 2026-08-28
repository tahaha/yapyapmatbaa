/**
 * Kampanya deposu (Campaign Store)
 */

const storageKey = 'yapyapmatbaa_campaigns_v1';
const eventName = 'yapyapmatbaa-campaigns-changed';

const clone = (v) => JSON.parse(JSON.stringify(v));

export const defaultCampaigns = [
  {
    id: 'camp-kartvizit-1',
    title: '1000 Kartvizit Kampanyasi',
    description: 'Standart duz kesim kartvizitlerde ozel fiyat.',
    productSlug: 'kartvizit',
    campaignPrice: 299,
    oldPrice: 345,
    badgeText: 'Firsat',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    active: true,
    featured: true,
    sortOrder: 1,
  },
  {
    id: 'camp-brosur-1',
    title: 'A5 Brosur Kampanyasi',
    description: '1000 adet A5 brosur ozel kampanya fiyatiyla.',
    productSlug: 'brosur',
    campaignPrice: 580,
    oldPrice: 715,
    badgeText: 'Sinirli Sure',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    active: true,
    featured: true,
    sortOrder: 2,
  },
];

function normalizeCampaign(camp) {
  return {
    id: camp.id || `camp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: camp.title || '',
    description: camp.description || '',
    productSlug: camp.productSlug || '',
    campaignPrice: Number(camp.campaignPrice) || 0,
    oldPrice: Number(camp.oldPrice) || 0,
    badgeText: camp.badgeText || '',
    startDate: camp.startDate || '',
    endDate: camp.endDate || '',
    active: camp.active !== false,
    featured: camp.featured !== false,
    sortOrder: Number(camp.sortOrder) || 0,
  };
}

export function getCampaigns() {
  if (typeof window === 'undefined') return clone(defaultCampaigns).map(normalizeCampaign);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (Array.isArray(stored) && stored.length ? stored : clone(defaultCampaigns)).map(normalizeCampaign);
  } catch {
    return clone(defaultCampaigns).map(normalizeCampaign);
  }
}

/** Aktif + tarihi gecmemis kampanyalari dondur */
export function getActiveCampaigns() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  return getCampaigns()
    .filter((c) => {
      if (!c.active) return false;
      if (c.startDate && c.startDate > todayStr) return false;
      if (c.endDate && c.endDate < todayStr) return false;
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function saveCampaigns(campaigns) {
  localStorage.setItem(storageKey, JSON.stringify(campaigns.map(normalizeCampaign)));
  window.dispatchEvent(new CustomEvent(eventName));
}

export const campaignRepository = {
  create(campaign) {
    saveCampaigns([...getCampaigns(), normalizeCampaign(campaign)]);
  },
  update(id, updates) {
    saveCampaigns(getCampaigns().map((c) => (c.id === id ? normalizeCampaign({ ...c, ...updates, id }) : c)));
  },
  remove(id) {
    saveCampaigns(getCampaigns().filter((c) => c.id !== id));
  },
  toggleActive(id) {
    saveCampaigns(getCampaigns().map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  },
};

export function subscribeToCampaigns(callback) {
  const update = () => callback(getCampaigns());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}

export const formatPrice = (price) =>
  `${new Intl.NumberFormat('tr-TR').format(Number(price))} TL`;
