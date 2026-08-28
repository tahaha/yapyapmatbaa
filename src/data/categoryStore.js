/**
 * Kategori deposu (Category Store)
 *
 * Ayni localStorage + event deseni productStore ile ayni.
 */

import { slugify } from './productStore.js';

const storageKey = 'yapyapmatbaa_categories_v1';
const eventName = 'yapyapmatbaa-categories-changed';

const clone = (v) => JSON.parse(JSON.stringify(v));

export const defaultCategories = [
  { id: 'cat-kartvizit', name: 'Kartvizit', slug: 'kartvizit', description: 'Kartvizit cesitleri', active: true, sortOrder: 1 },
  { id: 'cat-brosur', name: 'Brosur & El Ilani', slug: 'brosur-el-ilani', description: 'Brosur ve el ilani cesitleri', active: true, sortOrder: 2 },
  { id: 'cat-afis', name: 'Afis', slug: 'afis', description: 'Afis baski cesitleri', active: true, sortOrder: 3 },
  { id: 'cat-sticker', name: 'Sticker & Etiket', slug: 'sticker-etiket', description: 'Cikartma ve etiket cesitleri', active: true, sortOrder: 4 },
  { id: 'cat-magnet', name: 'Magnet', slug: 'magnet', description: 'Promosyon magnet cesitleri', active: true, sortOrder: 5 },
  { id: 'cat-kurumsal', name: 'Kurumsal Baskilar', slug: 'kurumsal-baskilar', description: 'Kurumsal baski cesitleri', active: true, sortOrder: 6 },
];

function normalizeCategory(cat) {
  return {
    id: cat.id || `cat-${slugify(cat.name)}-${Date.now()}`,
    name: cat.name || '',
    slug: cat.slug || slugify(cat.name),
    description: cat.description || '',
    active: cat.active !== false,
    sortOrder: Number(cat.sortOrder) || 0,
  };
}

export function getCategories() {
  if (typeof window === 'undefined') return clone(defaultCategories).map(normalizeCategory);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (Array.isArray(stored) && stored.length ? stored : clone(defaultCategories)).map(normalizeCategory);
  } catch {
    return clone(defaultCategories).map(normalizeCategory);
  }
}

export function getActiveCategories() {
  return getCategories().filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

function saveCategories(categories) {
  localStorage.setItem(storageKey, JSON.stringify(categories.map(normalizeCategory)));
  window.dispatchEvent(new CustomEvent(eventName));
}

export const categoryRepository = {
  create(category) {
    saveCategories([...getCategories(), normalizeCategory(category)]);
  },
  update(id, updates) {
    saveCategories(getCategories().map((c) => (c.id === id ? normalizeCategory({ ...c, ...updates, id }) : c)));
  },
  remove(id) {
    saveCategories(getCategories().filter((c) => c.id !== id));
  },
  toggleActive(id) {
    saveCategories(getCategories().map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  },
};

export function subscribeToCategories(callback) {
  const update = () => callback(getCategories());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}
