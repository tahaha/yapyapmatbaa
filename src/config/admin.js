/**
 * Admin Authentication Configuration
 *
 * Bu uygulama tamamen statik bir GitHub Pages sitesidir. Admin şifresinin hash'i
 * public/admin-config.json dosyasında tutulur ve sayfa açılırken okunur.
 * Şifre, admin panelindeki "Ayarlar" sayfasından değiştirilebilir: panel yeni
 * hash'i GitHub API ile bu dosyaya yazar, GitHub Actions siteyi yeniden yayınlar.
 *
 * Bu yöntem yalnızca istemci tarafı bir kontroldür; gerçek bir backend yerine geçmez.
 */
import { assetHref } from '../routing/sitePaths.js';
import { verifyPasswordRecord } from '../lib/passwordHash.js';

export const adminConfigPath = 'public/admin-config.json';
export const adminSessionKey = 'yapyapmatbaa_admin_session_v2';
export const defaultAdminUsername = 'admin';

// Eski kurulumlar için yedek: .env içindeki düz SHA-256 hash (artık zorunlu değil).
const legacyEnvHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || null;

let configPromise = null;

/** admin-config.json dosyasını okur (önbelleği atlayarak). */
export function loadAdminConfig({ force = false } = {}) {
  if (!configPromise || force) {
    configPromise = fetch(`${assetHref('admin-config.json')}?t=${Date.now()}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((config) => {
        if (config?.password?.hash) {
          return { username: config.username || defaultAdminUsername, password: config.password, source: 'file' };
        }
        if (legacyEnvHash) {
          return { username: defaultAdminUsername, password: { algorithm: 'SHA-256', hash: legacyEnvHash }, source: 'env' };
        }
        return null;
      });
  }
  return configPromise;
}

/** Kullanıcı adı ve şifreyi doğrular. */
export async function verifyAdminCredentials(username, password) {
  const config = await loadAdminConfig({ force: true });
  if (!config) return false;
  return username === config.username && verifyPasswordRecord(password, config.password);
}
