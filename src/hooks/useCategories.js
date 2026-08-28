import { useEffect, useState } from 'react';
import { getCategories, subscribeToCategories } from '../data/categoryStore.js';

export function useCategories() {
  const [categories, setCategories] = useState(() => getCategories());
  useEffect(() => subscribeToCategories(setCategories), []);
  return categories;
}
