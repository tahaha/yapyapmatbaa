/**
 * Instagram / Galeri Deposu (Instagram Store)
 *
 * Mevcut store pattern'ini takip eder: localStorage + CustomEvent
 * İleride backend'e taşınabilir yapıda.
 */

const storageKey = 'yapyapmatbaa_instagram_v1';
const eventName = 'yapyapmatbaa-instagram-changed';

const clone = (v) => JSON.parse(JSON.stringify(v));

export const defaultInstagramPosts = [
  {
    id: 'ig-1',
    image: 'images/gallery/kartvizit-ornegi.webp',
    caption: 'Özel kesim kartvizit tasarımı',
    link: '',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'ig-2',
    image: 'images/gallery/etiket-ornegi.webp',
    caption: 'Ürün etiket baskısı',
    link: '',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'ig-3',
    image: 'images/gallery/brosur-ornegi.webp',
    caption: 'A5 broşür çalışması',
    link: '',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'ig-4',
    image: 'images/gallery/baski-ornegi.webp',
    caption: 'Kurumsal kartvizit seti',
    link: '',
    active: true,
    sortOrder: 4,
  },
];

/** Instagram hesap URL'i — admin panelinden değiştirilebilir */
export const defaultInstagramSettings = {
  profileUrl: 'https://instagram.com/yapyapmatbaa',
  sectionTitle: "Instagram'da YapyapMatbaa",
  sectionBadge: 'Galeri',
  followButtonText: "Instagram'da Bizi Takip Edin",
};

const settingsStorageKey = 'yapyapmatbaa_instagram_settings_v1';

function normalizePost(post) {
  return {
    id: post.id || `ig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    image: post.image || '',
    caption: post.caption || '',
    link: post.link || '',
    active: post.active !== false,
    sortOrder: Number(post.sortOrder) || 0,
  };
}

// ---------------------------------------------------------------------------
// Okuma
// ---------------------------------------------------------------------------

export function getInstagramPosts() {
  if (typeof window === 'undefined') return clone(defaultInstagramPosts).map(normalizePost);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (Array.isArray(stored) && stored.length ? stored : clone(defaultInstagramPosts)).map(normalizePost);
  } catch {
    return clone(defaultInstagramPosts).map(normalizePost);
  }
}

export function getActiveInstagramPosts() {
  return getInstagramPosts()
    .filter((p) => p.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getInstagramSettings() {
  if (typeof window === 'undefined') return clone(defaultInstagramSettings);
  try {
    const stored = JSON.parse(localStorage.getItem(settingsStorageKey));
    return stored && typeof stored === 'object'
      ? { ...clone(defaultInstagramSettings), ...stored }
      : clone(defaultInstagramSettings);
  } catch {
    return clone(defaultInstagramSettings);
  }
}

// ---------------------------------------------------------------------------
// Yazma
// ---------------------------------------------------------------------------

function savePosts(posts) {
  localStorage.setItem(storageKey, JSON.stringify(posts.map(normalizePost)));
  window.dispatchEvent(new CustomEvent(eventName));
}

export function saveInstagramSettings(settings) {
  localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(eventName));
}

export const instagramRepository = {
  create(post) {
    savePosts([...getInstagramPosts(), normalizePost(post)]);
  },
  update(id, updates) {
    savePosts(getInstagramPosts().map((p) => (p.id === id ? normalizePost({ ...p, ...updates, id }) : p)));
  },
  remove(id) {
    savePosts(getInstagramPosts().filter((p) => p.id !== id));
  },
  toggleActive(id) {
    savePosts(getInstagramPosts().map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  },
};

// ---------------------------------------------------------------------------
// Abonelik
// ---------------------------------------------------------------------------

export function subscribeToInstagram(callback) {
  const update = () => callback({ posts: getInstagramPosts(), settings: getInstagramSettings() });
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}
