import { useEffect, useState } from 'react';
import { getSiteContent, subscribeToSiteContent } from '../data/siteContentStore.js';

/**
 * Site içeriğini reaktif olarak döndürür.
 * Admin panelinden yapılan değişiklikler anında yansır.
 */
export function useSiteContent() {
  const [content, setContent] = useState(() => getSiteContent());
  useEffect(() => subscribeToSiteContent(setContent), []);
  return content;
}
