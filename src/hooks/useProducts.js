import { useEffect, useState } from 'react';
import { getProducts, subscribeToProducts } from '../data/productStore.js';

/**
 * Tüm ürünleri reaktif olarak döndürür.
 * localStorage'da admin çalışma kopyası varsa onu kullanır,
 * aksi hâlde src/data/products.js'yi (bundled) kullanır.
 */
export function useProducts() {
  const [products, setProducts] = useState(() => getProducts());
  useEffect(() => subscribeToProducts(setProducts), []);
  return products;
}
