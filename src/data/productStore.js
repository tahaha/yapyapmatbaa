import { defaultProducts } from './products.js';

const STORAGE_KEY = 'yapyapmatbaa_products_v1';
const CHANGE_EVENT = 'yapyapmatbaa-products-changed';

const cloneDefaults = () => defaultProducts.map((product) => ({
  ...product,
  printFeatures: [...product.printFeatures],
}));

const normalizeProduct = (product) => ({
  ...product,
  name: product.name || 'İsimsiz Ürün',
  category: product.category || 'Diğer',
  description: product.description || '',
  size: product.size || '',
  price: Number(product.price) || 0,
  quantity: Number(product.quantity) || 0,
  printFeatures: Array.isArray(product.printFeatures) ? product.printFeatures.filter(Boolean) : [],
  active: product.active !== false,
  createdAt: product.createdAt || new Date().toISOString(),
});

export function getProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initialProducts = cloneDefaults();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : cloneDefaults();
  } catch {
    return cloneDefaults();
  }
}

function saveProducts(products) {
  const normalizedProducts = products.map(normalizeProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedProducts));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  return normalizedProducts;
}

function createId(name) {
  const slug = name
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug || 'urun'}-${Date.now().toString(36)}`;
}

export const productRepository = {
  list: getProducts,
  create(product) {
    const products = getProducts();
    const newProduct = normalizeProduct({ ...product, id: createId(product.name), createdAt: new Date().toISOString() });
    saveProducts([newProduct, ...products]);
    return newProduct;
  },
  update(id, updates) {
    return saveProducts(getProducts().map((product) => (
      product.id === id ? normalizeProduct({ ...product, ...updates, id: product.id, createdAt: product.createdAt }) : product
    )));
  },
  remove(id) {
    return saveProducts(getProducts().filter((product) => product.id !== id));
  },
  toggleActive(id) {
    return saveProducts(getProducts().map((product) => (
      product.id === id ? { ...product, active: !product.active } : product
    )));
  },
};

export function subscribeToProducts(callback) {
  const handleChange = (event) => {
    if (!event.key || event.key === STORAGE_KEY) callback(getProducts());
  };
  const handleCustomChange = () => callback(getProducts());
  window.addEventListener('storage', handleChange);
  window.addEventListener(CHANGE_EVENT, handleCustomChange);
  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(CHANGE_EVENT, handleCustomChange);
  };
}

export const formatPrice = (price) => `${new Intl.NumberFormat('tr-TR').format(Number(price) || 0)} TL`;
