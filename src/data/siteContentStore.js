/**
 * Site İçerik Deposu (Site Content Store)
 *
 * Ana sayfadaki düzenlenebilir metinleri merkezi olarak yönetir.
 * Mevcut store pattern'ini (localStorage + CustomEvent) takip eder.
 *
 * Veri akışı:
 *   Varsayılan içerik → defaultSiteContent (bundled)
 *   Admin değişiklik yapar → localStorage'a kaydedilir
 *   İleride backend eklenirse → getSiteContent / saveSiteContent API'ye çevrilir
 */

const storageKey = 'yapyapmatbaa_site_content_v1';
const eventName = 'yapyapmatbaa-site-content-changed';

const clone = (v) => JSON.parse(JSON.stringify(v));

// ---------------------------------------------------------------------------
// Varsayılan içerik
// ---------------------------------------------------------------------------

export const defaultSiteContent = {
  hero: {
    badge: 'Tasarım Oluşturmak İçin Ücretsiz Tasarım Desteği!',
    title: 'Markanızı Yansıtan, Akılda Kalıcı Kartvizit ve Baskı Tasarımları',
    description: 'Siz hayal edin, biz tasarlayıp kapınıza kadar gönderelim.',
    ctaButton: "Hemen WhatsApp'tan Bilgi Al",
  },
  services: {
    badge: 'Ürünlerimiz',
    title: 'İhtiyacınıza uygun baskıyı seçin.',
    description:
      'Her ürünün ebat, adet ve üretim seçeneklerini inceleyin; fiyatı seçiminize göre görün.',
  },
  howItWorks: {
    badge: 'Süreç',
    title: 'Nasıl çalışıyoruz?',
    description: 'Fikirden teslimata, yalnızca üç kolay adım.',
    steps: [
      {
        title: 'Bize ulaşın',
        description: "WhatsApp'tan bize ulaşın ve bilgilerinizi gönderin.",
      },
      {
        title: 'Tasarımı onaylayın',
        description: 'Ücretsiz tasarım desteğimizle taslağınızı hazırlayıp onayınıza sunalım.',
      },
      {
        title: 'Kapınıza gelsin',
        description: 'Hızlıca baskıya alıp kargo ile size ulaştıralım.',
      },
    ],
  },
  cta: {
    badge: 'Tasarım desteği ücretsiz',
    title: 'Markanızı baskıda öne çıkarmaya hazır mısınız?',
    description: 'İhtiyacınızı anlatın, size en uygun ürün ve tasarım için hızlıca yardımcı olalım.',
    ctaButton: 'Teklif İste',
  },
  contact: {
    phone: '0543 110 9543',
    phoneHref: 'tel:+905431109543',
    whatsappNumber: '905431109543',
    productionLocation: 'İstanbul / Zeytinburnu',
    shippingInfo:
      'Diğer illere gönderimlerde her ürün için ortalama 100 TL kargo ücreti bulunmaktadır.',
  },
  footer: {
    copyright: '© 2026 Yapyapmatbaa. Tüm hakları saklıdır.',
  },
};

// ---------------------------------------------------------------------------
// Okuma
// ---------------------------------------------------------------------------

/** Birleştirilmiş site içeriğini döndür (varsayılan + admin değişiklikleri) */
export function getSiteContent() {
  if (typeof window === 'undefined') return clone(defaultSiteContent);
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && typeof stored === 'object') {
      return deepMerge(clone(defaultSiteContent), stored);
    }
    return clone(defaultSiteContent);
  } catch {
    return clone(defaultSiteContent);
  }
}

/** Belirli bir bölümü döndür */
export function getSiteContentSection(section) {
  return getSiteContent()[section];
}

// ---------------------------------------------------------------------------
// Yazma
// ---------------------------------------------------------------------------

function save(content) {
  localStorage.setItem(storageKey, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent(eventName));
}

/** Belirli bir bölümü güncelle */
export function saveSiteContentSection(section, data) {
  const current = getSiteContent();
  current[section] = { ...current[section], ...data };
  save(current);
}

/** Tüm içeriği sıfırla */
export function resetSiteContent() {
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new CustomEvent(eventName));
}

// ---------------------------------------------------------------------------
// Abonelik (reaktif güncellemeler)
// ---------------------------------------------------------------------------

export function subscribeToSiteContent(callback) {
  const update = () => callback(getSiteContent());
  window.addEventListener(eventName, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(eventName, update);
    window.removeEventListener('storage', update);
  };
}

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

/** Derin birleştirme — kaynaktaki alanlar hedef üzerine yazılır */
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
