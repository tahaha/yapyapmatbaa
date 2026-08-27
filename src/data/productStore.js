import { defaultProducts } from './products.js';

const storageKey = 'yapyapmatbaa_products_v2';
const eventName = 'yapyapmatbaa-products-changed';

const clone = (value) => JSON.parse(JSON.stringify(value));
const slugify = (value) => String(value || 'urun').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function normalizeProduct(product) {
  const variants = Array.isArray(product.variants) && product.variants.length
    ? product.variants
    : [{ id: 'standart', size: product.size || '-', quantity: Number(product.quantity) || 1000, paper: product.printFeatures?.[0] || '-', printing: product.printFeatures?.[1] || '-', finish: product.printFeatures?.[2] || 'Selefonsuz', cut: product.printFeatures?.[3] || 'Düz Kesim', price: Number(product.price) || 0 }];
  const normalizedVariants = variants.map((variant, index) => ({ ...variant, id: variant.id || `varyant-${index + 1}`, quantity: Number(variant.quantity) || 1, price: Number(variant.price) || 0 }));
  const first = normalizedVariants[0];
  return {
    ...product,
    id: String(product.id || `${slugify(product.name)}-${Date.now()}`),
    slug: product.slug || slugify(product.name),
    image: product.image || 'og.png',
    features: Array.isArray(product.features) ? product.features : (product.printFeatures || []),
    variants: normalizedVariants,
    price: Math.min(...normalizedVariants.map((variant) => variant.price)),
    quantity: first.quantity,
    size: first.size,
    printFeatures: [first.paper, first.printing, first.finish, first.cut].filter(Boolean),
    active: product.active !== false,
    createdAt: product.createdAt || new Date().toISOString(),
  };
}

export function getProducts() {
  if (typeof window === 'undefined') return clone(defaultProducts).map(normalizeProduct);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (Array.isArray(stored) ? stored : clone(defaultProducts)).map(normalizeProduct);
  } catch {
    return clone(defaultProducts).map(normalizeProduct);
  }
}

function saveProducts(products) {
  localStorage.setItem(storageKey, JSON.stringify(products.map(normalizeProduct)));
  window.dispatchEvent(new CustomEvent(eventName));
}

export function subscribeToProducts(callback) {
  const update = () => callback(getProducts());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => { window.removeEventListener(eventName, update); window.removeEventListener('storage', update); };
}

export const productRepository = {
  create(product) { const products = getProducts(); saveProducts([...products, normalizeProduct(product)]); },
  update(id, updates) { saveProducts(getProducts().map((product) => product.id === id ? normalizeProduct({ ...product, ...updates, id }) : product)); },
  remove(id) { saveProducts(getProducts().filter((product) => product.id !== id)); },
  toggleActive(id) { saveProducts(getProducts().map((product) => product.id === id ? { ...product, active: !product.active } : product)); },
  reset() { saveProducts(clone(defaultProducts)); },
};

export const getStartingPrice = (product) => Math.min(...product.variants.map((variant) => Number(variant.price)));
export const formatPrice = (price) => `${new Intl.NumberFormat('tr-TR').format(Number(price))} TL`;

