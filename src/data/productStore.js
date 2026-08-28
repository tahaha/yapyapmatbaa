/**
 * Ürün deposu (Product Store)
 *
 * Kanonical veri kaynağı: src/data/products.js (deploy edilen site)
 * Admin çalışma kopyası: localStorage (yalnızca o tarayıcı/cihaz)
 *
 * Veri akışı:
 *   Yeni kullanıcı (boş localStorage) → defaultProducts görür
 *   Admin değişiklik yapar → localStorage'a kaydedilir (önizleme)
 *   Kalıcı yapma → Admin → Dışa Aktar → products.js'yi güncelle → deploy
 */

import { defaultProducts } from './products.js';
import { detectPriceChanges } from './priceHistoryStore.js';

const storageKey = 'yapyapmatbaa_products_v3';
const eventName = 'yapyapmatbaa-products-changed';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const slugify = (value) =>
  String(value || 'urun')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Varyantı normalize et — eksik alanları doldur, tipleri düzelt */
function normalizeVariant(variant, index) {
  return {
    id: variant.id || `v-${index + 1}`,
    model: variant.model || '',
    image: variant.image || '',
    size: variant.size || '',
    quantity: Number(variant.quantity) || 1,
    paper: variant.paper || '',
    printing: variant.printing || '',
    finish: variant.finish || '',
    cut: variant.cut || '',
    price: Number(variant.price) || 0,
    active: variant.active !== false,
  };
}

/** Ürünü normalize et — eksik alanları doldur, varyantları işle */
function normalizeProduct(product) {
  const rawVariants = Array.isArray(product.variants) && product.variants.length
    ? product.variants
    : [
        {
          id: 'standart',
          model: 'Standart',
          size: product.size || '',
          quantity: Number(product.quantity) || 1000,
          paper: '',
          printing: '',
          finish: '',
          cut: '',
          price: Number(product.price) || 0,
          active: true,
        },
      ];

  const variants = rawVariants.map(normalizeVariant);
  const activePrices = variants.filter((v) => v.active).map((v) => v.price);
  const minPrice = activePrices.length ? Math.min(...activePrices) : (variants[0]?.price ?? 0);

  return {
    id: String(product.id || `${slugify(product.name)}-${Date.now()}`),
    slug: product.slug || slugify(product.name),
    name: product.name || '',
    category: product.category || '',
    categoryId: product.categoryId || '',
    description: product.description || '',
    // Görsel yolu: boş string = görsel henüz eklenmedi (placeholder gösterilir)
    image: product.image || '',
    active: product.active !== false,
    featured: product.featured === true,
    bestSeller: product.bestSeller === true,
    deliveryTime: product.deliveryTime || '2-3 İş Günü',
    sortOrder: Number(product.sortOrder) || 0,
    createdAt: product.createdAt || new Date().toISOString(),
    features: Array.isArray(product.features) ? product.features : [],
    variants,
    // Müşteri tarafı için hesaplanan alanlar (varyantlardan türetilir)
    price: minPrice,
    quantity: variants[0]?.quantity ?? 1,
    size: variants[0]?.size ?? '',
  };
}

// ---------------------------------------------------------------------------
// Okuma
// ---------------------------------------------------------------------------

/** Tüm ürünleri döndür.
 *  localStorage'da admin çalışma kopyası varsa onu kullan,
 *  aksi hâlde defaultProducts'ı (bundled) kullan.
 */
export function getProducts() {
  if (typeof window === 'undefined') return clone(defaultProducts).map(normalizeProduct);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (Array.isArray(stored) && stored.length ? stored : clone(defaultProducts)).map(normalizeProduct);
  } catch {
    return clone(defaultProducts).map(normalizeProduct);
  }
}

/** Slug'a göre tek ürün döndür */
export function getProductBySlug(slug) {
  return getProducts().find((p) => p.slug === slug) || null;
}

// ---------------------------------------------------------------------------
// Yazma (Admin çalışma kopyası — yalnızca localStorage)
// ---------------------------------------------------------------------------

function saveProducts(products) {
  localStorage.setItem(storageKey, JSON.stringify(products.map(normalizeProduct)));
  window.dispatchEvent(new CustomEvent(eventName));
}

export const productRepository = {
  create(product) {
    const products = getProducts();
    saveProducts([...products, normalizeProduct(product)]);
  },
  update(id, updates) {
    const oldProducts = getProducts();
    const oldProduct = oldProducts.find((p) => p.id === id);
    const newProduct = normalizeProduct({ ...oldProduct, ...updates, id });
    // Fiyat degisikliklerini otomatik kaydet
    if (oldProduct) detectPriceChanges(oldProduct, newProduct);
    saveProducts(
      oldProducts.map((p) => (p.id === id ? newProduct : p)),
    );
  },
  remove(id) {
    saveProducts(getProducts().filter((p) => p.id !== id));
  },
  toggleActive(id) {
    saveProducts(
      getProducts().map((p) =>
        p.id === id ? { ...p, active: !p.active } : p,
      ),
    );
  },
  reset() {
    localStorage.removeItem(storageKey);
    window.dispatchEvent(new CustomEvent(eventName));
  },
};

// ---------------------------------------------------------------------------
// Abonelik (reaktif güncellemeler)
// ---------------------------------------------------------------------------

export function subscribeToProducts(callback) {
  const update = () => callback(getProducts());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}

// ---------------------------------------------------------------------------
// Dışa aktarma (kalıcı değişiklikler için)
// ---------------------------------------------------------------------------

/** Admin çalışma kopyasını products.js olarak indir */
export function downloadProductsJs() {
  const products = getProducts();
  const lines = JSON.stringify(products.map(normalizeProduct), null, 2)
    .replace(/"active": true/g, 'active: true')
    .replace(/"active": false/g, 'active: false');

  const content = [
    '/**',
    ' * YapyapMatbaa — Ürün Veritabanı',
    ` * Admin panelinden dışa aktarıldı: ${new Date().toLocaleString('tr-TR')}`,
    ' * Bu dosyayı src/data/products.js ile değiştirin ve projeyi yeniden deploy edin.',
    ' */',
    '',
    `export const defaultProducts = ${JSON.stringify(products.map(normalizeProduct), null, 2)};`,
    '',
  ].join('\n');

  const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

export const getStartingPrice = (product) => {
  const active = product.variants.filter((v) => v.active !== false);
  const source = active.length ? active : product.variants;
  return Math.min(...source.map((v) => Number(v.price)));
};

export const formatPrice = (price) =>
  `${new Intl.NumberFormat('tr-TR').format(Number(price))} TL`;

/** localStorage'da admin değişikliği var mı? */
export function hasLocalChanges() {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(storageKey));
}
