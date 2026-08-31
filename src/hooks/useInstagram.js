import { useEffect, useState } from 'react';
import {
  getActiveInstagramPosts,
  getInstagramSettings,
  subscribeToInstagram,
} from '../data/instagramStore.js';

/**
 * Aktif Instagram gönderilerini ve ayarları reaktif olarak döndürür.
 */
export function useInstagram() {
  const [posts, setPosts] = useState(() => getActiveInstagramPosts());
  const [settings, setSettings] = useState(() => getInstagramSettings());
  useEffect(() => {
    const unsub = subscribeToInstagram(({ posts: p, settings: s }) => {
      setPosts(getActiveInstagramPosts());
      setSettings(s);
    });
    return unsub;
  }, []);
  return { posts, settings };
}
