/**
 * Müşteri Yorumları Deposu (Review Store)
 *
 * Mevcut store pattern'ini takip eder: localStorage + CustomEvent
 * İleride backend'e taşınabilir yapıda.
 */

const storageKey = 'yapyapmatbaa_reviews_v1';
const eventName = 'yapyapmatbaa-reviews-changed';

const clone = (v) => JSON.parse(JSON.stringify(v));

export const defaultReviews = [
  {
    id: 'review-1',
    name: 'Mehmet K.',
    company: 'İstanbul',
    text: 'Kartvizitler beklediğimden daha kaliteli geldi. Tasarım konusunda da çok yardımcı oldular.',
    rating: 5,
    avatar: '',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'review-2',
    name: 'Ayşe T.',
    company: 'Ankara',
    text: 'Etiket baskılarımız çok temiz çıktı, teslimat da hızlıydı.',
    rating: 5,
    avatar: '',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'review-3',
    name: 'Ali R.',
    company: 'Bursa',
    text: 'WhatsApp üzerinden hızlıca iletişim kurduk ve sipariş süreci sorunsuz ilerledi.',
    rating: 4,
    avatar: '',
    active: true,
    sortOrder: 3,
  },
];

function normalizeReview(review) {
  return {
    id: review.id || `review-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: review.name || '',
    company: review.company || '',
    text: review.text || '',
    rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    avatar: review.avatar || '',
    active: review.active !== false,
    sortOrder: Number(review.sortOrder) || 0,
  };
}

// ---------------------------------------------------------------------------
// Okuma
// ---------------------------------------------------------------------------

export function getReviews() {
  if (typeof window === 'undefined') return clone(defaultReviews).map(normalizeReview);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (Array.isArray(stored) && stored.length ? stored : clone(defaultReviews)).map(normalizeReview);
  } catch {
    return clone(defaultReviews).map(normalizeReview);
  }
}

export function getActiveReviews() {
  return getReviews()
    .filter((r) => r.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ---------------------------------------------------------------------------
// Yazma
// ---------------------------------------------------------------------------

function saveReviews(reviews) {
  localStorage.setItem(storageKey, JSON.stringify(reviews.map(normalizeReview)));
  window.dispatchEvent(new CustomEvent(eventName));
}

export const reviewRepository = {
  create(review) {
    saveReviews([...getReviews(), normalizeReview(review)]);
  },
  update(id, updates) {
    saveReviews(getReviews().map((r) => (r.id === id ? normalizeReview({ ...r, ...updates, id }) : r)));
  },
  remove(id) {
    saveReviews(getReviews().filter((r) => r.id !== id));
  },
  toggleActive(id) {
    saveReviews(getReviews().map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  },
};

// ---------------------------------------------------------------------------
// Abonelik
// ---------------------------------------------------------------------------

export function subscribeToReviews(callback) {
  const update = () => callback(getReviews());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}
