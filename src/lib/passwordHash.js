/**
 * Admin şifre hash yardımcıları (tarayıcı Web Crypto API).
 *
 * Yeni kayıtlar PBKDF2-SHA256 + rastgele salt ile oluşturulur. Hash, herkese açık
 * public/admin-config.json dosyasında durduğu için yavaş bir algoritma kullanmak
 * tahmin denemelerini (brute force) çok daha pahalı hale getirir.
 *
 * Eski düz SHA-256 kayıtları ({ algorithm: 'SHA-256', hash }) da doğrulanabilir.
 */

export const PBKDF2_ITERATIONS = 210000;

const encoder = new TextEncoder();

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
}

async function pbkdf2Hex(password, saltHex, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations },
    key,
    256,
  );
  return toHex(bits);
}

/** Sabit süreli karşılaştırma (zamanlama farkı sızdırmamak için). */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Yeni şifre için PBKDF2 kaydı oluşturur. */
export async function createPasswordRecord(password) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await pbkdf2Hex(password, salt, PBKDF2_ITERATIONS);
  return { algorithm: 'PBKDF2-SHA256', iterations: PBKDF2_ITERATIONS, salt, hash };
}

/** Girilen şifreyi kayıtla karşılaştırır. */
export async function verifyPasswordRecord(password, record) {
  if (!record?.hash) return false;
  const expected = String(record.hash).toLowerCase();
  if (record.algorithm === 'PBKDF2-SHA256') {
    return safeEqual(await pbkdf2Hex(password, record.salt, Number(record.iterations)), expected);
  }
  if (record.algorithm === 'SHA-256') {
    return safeEqual(await sha256Hex(password), expected);
  }
  return false;
}

/** Şifre kuralları — hata mesajı döner, sorun yoksa null. */
export function validateNewPassword(password) {
  if (password.length < 10) return 'Yeni sifre en az 10 karakter olmali.';
  if (!/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(password) || !/\d/.test(password)) {
    return 'Yeni sifre en az bir harf ve bir rakam icermeli.';
  }
  return null;
}
