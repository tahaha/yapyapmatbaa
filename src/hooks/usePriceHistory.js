import { useEffect, useState } from 'react';
import { getPriceHistory, subscribeToPriceHistory } from '../data/priceHistoryStore.js';

export function usePriceHistory() {
  const [history, setHistory] = useState(() => getPriceHistory());
  useEffect(() => subscribeToPriceHistory(setHistory), []);
  return history;
}
