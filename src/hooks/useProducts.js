import { useEffect, useState } from 'react';
import { getProducts, subscribeToProducts } from '../data/productStore.js';

export function useProducts() {
  const [products, setProducts] = useState(() => getProducts());

  useEffect(() => subscribeToProducts(setProducts), []);

  return products;
}
