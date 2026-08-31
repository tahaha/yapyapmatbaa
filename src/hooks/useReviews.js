import { useEffect, useState } from 'react';
import { getActiveReviews, subscribeToReviews } from '../data/reviewStore.js';

/**
 * Aktif müşteri yorumlarını reaktif olarak döndürür.
 */
export function useReviews() {
  const [reviews, setReviews] = useState(() => getActiveReviews());
  useEffect(() => {
    const unsub = subscribeToReviews(() => setReviews(getActiveReviews()));
    return unsub;
  }, []);
  return reviews;
}
