/**
 * Fiyat gecmisi deposu (Price History Store)
 *
 * Fiyat degisiklikleri admin panelinden kaydet yapildiginda otomatik kaydedilir.
 */

const storageKey = 'yapyapmatbaa_pricehistory_v1';
const eventName = 'yapyapmatbaa-pricehistory-changed';

function getPriceHistoryRaw() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function getPriceHistory() {
  return getPriceHistoryRaw().sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
}

export function addPriceChange(productId, variantId, productName, variantName, oldPrice, newPrice) {
  if (oldPrice === newPrice) return;
  const history = getPriceHistoryRaw();
  history.push({
    id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    productId,
    variantId,
    productName,
    variantName,
    oldPrice: Number(oldPrice),
    newPrice: Number(newPrice),
    changedAt: new Date().toISOString(),
  });
  localStorage.setItem(storageKey, JSON.stringify(history));
  window.dispatchEvent(new CustomEvent(eventName));
}

/**
 * Iki urun listesini karsilastirip fiyat degisikliklerini otomatik kaydet.
 * productRepository.update cagirildiginda kullanilir.
 */
export function detectPriceChanges(oldProduct, newProduct) {
  if (!oldProduct || !newProduct) return;
  const oldVariants = oldProduct.variants || [];
  const newVariants = newProduct.variants || [];

  for (const nv of newVariants) {
    const ov = oldVariants.find((v) => v.id === nv.id);
    if (ov && Number(ov.price) !== Number(nv.price)) {
      addPriceChange(
        newProduct.id,
        nv.id,
        newProduct.name,
        nv.model || nv.id,
        ov.price,
        nv.price,
      );
    }
  }
}

export function subscribeToPriceHistory(callback) {
  const update = () => callback(getPriceHistory());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}
