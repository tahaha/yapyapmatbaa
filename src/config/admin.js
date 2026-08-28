/**
 * Admin Authentication Configuration
 *
 * Bu uygulama tamamen statik bir GitHub Pages sitesidir.
 * Kaynak kodda gerçek admin şifresi BULUNMAMAKTADIR.
 *
 * Doğrulama: Girilen şifrenin SHA-256 hash'i, .env dosyasındaki hash ile karşılaştırılır.
 * Bu yöntem yalnızca istemci tarafı bir kontroldür; gerçek bir backend yerine geçmez.
 *
 * Şifre değiştirmek için:
 *   1. Yeni şifrenizin SHA-256 hash'ini hesaplayın:
 *      Tarayıcı konsolunda çalıştırın:
 *      crypto.subtle.digest('SHA-256', new TextEncoder().encode('şifreniz'))
 *        .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
 *   2. .env dosyasındaki VITE_ADMIN_PASSWORD_HASH değerini güncelleyin.
 *   3. Projeyi yeniden deploy edin.
 */
export const adminUsername = 'admin';
export const adminSessionKey = 'yapyapmatbaa_admin_session_v2';

// Gerçek admin şifresi burada YOKTUR — yalnızca SHA-256 hash'i kullanılır.
// .env dosyasında VITE_ADMIN_PASSWORD_HASH ile yapılandırın.
const configuredHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || null;

/**
 * Girilen şifreyi SHA-256 hash ile doğrular.
 * @param {string} password - Kullanıcının girdiği şifre
 * @returns {Promise<boolean>}
 */
export async function verifyAdminPassword(password) {
  if (!configuredHash) {
    console.warn('[Admin] VITE_ADMIN_PASSWORD_HASH yapılandırılmamış. Admin girişi devre dışı.');
    return false;
  }
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hash === configuredHash.toLowerCase();
}

export const isAdminConfigured = Boolean(configuredHash);
