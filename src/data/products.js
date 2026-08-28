/**
 * Varsayılan ürün veritabanı.
 *
 * Bu dosya tüm cihazlara yayınlanan kanonical (resmi) ürün verisidir.
 * Admin panelindeki değişiklikler yalnızca o tarayıcıda geçici olarak saklanır.
 * Değişiklikleri kalıcı hale getirmek için Admin → "Dışa Aktar (products.js)" kullanın,
 * indirilen dosyayı bu dosyanın yerine koyun ve projeyi tekrar deploy edin.
 *
 * Varyant görsel alanı (image): İsteğe bağlı.
 * Yoksa ürünün genel image alanı kullanılır.
 * Görsel dosyalarını public/images/products/ klasörüne ekleyin.
 * Örnek yol: "images/products/kartvizit-standart.webp"
 */

const brochure = (id, size, quantity, price) => ({
  id, size, quantity,
  paper: '115 gr Parlak Kuşe',
  printing: 'Ön 4 Renk / Arka 4 Renk',
  finish: 'Selefonsuz',
  cut: 'Düz Kesim',
  price,
  active: true,
});

const poster = (id, size, quantity, price) => ({
  id, size, quantity,
  paper: '105 gr Kuşe',
  printing: 'Ön 4 Renk / Arka Baskısız',
  finish: 'Selefonsuz',
  cut: 'Düz Kesim',
  price,
  active: true,
});

export const defaultProducts = [
  {
    id: 'kartvizit',
    slug: 'kartvizit',
    name: 'Kartvizit',
    category: 'Kartvizit',
    description: 'Markanızı profesyonelce temsil eden, farklı kesim ve yüzey seçeneklerine sahip kartvizitler.',
    // Görseli buraya ekleyin: public/images/products/kartvizit.webp
    image: 'images/products/kartvizit.webp',
    active: true,
    createdAt: '2026-01-01T10:00:00.000Z',
    features: ['Profesyonel baskı', 'Ücretsiz tasarım desteği', 'Kontrollü üretim'],
    variants: [
      { id: 'CYMLK',  model: 'Standart Düz Kesim',              image: '', size: '8,3 × 5,1 cm', quantity: 1000, paper: '350 gr Mat Kuşe', printing: 'Ön 4 Renk / Arka 4 Renk', finish: 'Mat Selefon + Kabartma Lak', cut: 'Düz Kesim',   price: 345, active: true },
      { id: 'OÇÖK',  model: 'Oval Kesim',                       image: '', size: '8,3 × 5,1 cm', quantity: 1000, paper: '350 gr Mat Kuşe', printing: 'Ön 4 Renk / Arka 4 Renk', finish: 'Mat Selefon + Kabartma Lak', cut: 'Oval Kesim',  price: 345, active: true },
      { id: 'ÇÖKES', model: 'Özel Kesim',                       image: '', size: '8,3 × 5,1 cm', quantity: 1000, paper: '350 gr Mat Kuşe', printing: 'Ön 4 Renk / Arka 4 Renk', finish: 'Mat Selefon + Kabartma Lak', cut: 'Özel Kesim', price: 400, active: true },
      { id: 'ABROV', model: '700 gr Amerikan Bristol Oval',      image: '', size: '8,3 × 5,1 cm', quantity: 1000, paper: '700 gr Amerikan Bristol', printing: 'Ön 4 Renk / Arka 4 Renk', finish: 'Sıvama + Kabartma Lak', cut: 'Oval Kesim',  price: 515, active: true },
      { id: 'ABROZ', model: '700 gr Amerikan Bristol Özel Kesim',image: '', size: '8,3 × 5,1 cm', quantity: 1000, paper: '700 gr Amerikan Bristol', printing: 'Ön 4 Renk / Arka 4 Renk', finish: 'Sıvama + Kabartma Lak', cut: 'Özel Kesim', price: 595, active: true },
    ],
  },
  {
    id: 'brosur',
    slug: 'brosur',
    name: 'Broşür',
    category: 'Broşür',
    description: 'Kampanya ve hizmetlerinizi etkili biçimde anlatan, çift yönlü renkli broşür baskıları.',
    image: 'images/products/brosur.webp',
    active: true,
    createdAt: '2026-01-02T10:00:00.000Z',
    features: ['Canlı renkler', 'Çift yön baskı', 'Farklı ebat seçenekleri'],
    variants: [
      brochure('1151CA7',    '9,5 × 20 cm (A7)',   1000,  630),
      brochure('1152CA7',    '9,5 × 20 cm (A7)',   2000,  865),
      brochure('1151CA5',    '14 × 20 cm (A5)',    1000,  715),
      brochure('1152CA5',    '14 × 20 cm (A5)',    2000,  990),
      brochure('1155CA5',    '14 × 20 cm (A5)',    5000,  1815),
      brochure('11510CA5',   '14 × 20 cm (A5)',   10000,  3450),
      brochure('1151CA4',    '20 × 28 cm (A4)',    1000,  1265),
      brochure('1152CA4',    '20 × 28 cm (A4)',    2000,  1740),
      brochure('1155CA4',    '20 × 28 cm (A4)',    5000,  3165),
      brochure('11510CA4',   '20 × 28 cm (A4)',   10000,  6015),
      brochure('1151CA3',    '28 × 40 cm (A3)',    1000,  2455),
      brochure('1152CA3',    '28 × 40 cm (A3)',    2000,  3405),
      brochure('1155CA3',    '28 × 40 cm (A3)',    5000,  6175),
      brochure('11510CA3',   '28 × 40 cm (A3)',   10000, 11780),
      brochure('1151CA7x2',  '19 × 20 cm (A7x2)',  1000,  1255),
      brochure('1152CA7x2',  '19 × 20 cm (A7x2)',  2000,  1730),
    ],
  },
  {
    id: 'magnet',
    slug: 'magnet',
    name: 'Magnet',
    category: 'Magnet',
    description: 'İşletmenizi sürekli görünür tutan, dayanıklı ve canlı renkli promosyon magnetleri.',
    image: 'images/products/magnet.webp',
    active: true,
    createdAt: '2026-01-03T10:00:00.000Z',
    features: ['Dayanıklı yüzey', 'Canlı baskı', 'Oval kesim'],
    variants: [
      { id: 'OMAG', model: 'Oval Magnet', image: '', size: '6,7 × 4,6 cm', quantity: 1000, paper: '40 Mikron Magnet', printing: 'Ön 4 Renk', finish: 'Parlak Selefon', cut: 'Oval Kesim', price: 550, active: true },
    ],
  },
  {
    id: 'cikartma-etiket',
    slug: 'cikartma-etiket',
    name: 'Çıkartma Etiket',
    category: 'Çıkartma Etiket',
    description: 'Paket, ürün ve promosyonlar için net baskılı, kolay uygulanabilen çıkartma etiketler.',
    image: 'images/products/cikartma-etiket.webp',
    active: true,
    createdAt: '2026-01-04T10:00:00.000Z',
    features: ['Kendinden yapışkanlı', 'Net detaylar', 'Kolay uygulama'],
    variants: [
      { id: 'ETKS', model: 'Standart Çıkartma', image: '', size: '8,3 × 5,1 cm', quantity: 1000, paper: '90 gr Kuşe Çıkartma', printing: 'Ön 4 Renk', finish: 'Parlak Selefon', cut: 'Düz Kesim', price: 265, active: true },
    ],
  },
  {
    id: 'el-ilani',
    slug: 'el-ilani',
    name: 'El İlanı',
    category: 'El İlanı',
    description: 'Duyuru ve kampanyalarınızı geniş kitlelere ulaştıran ekonomik el ilanı seçenekleri.',
    image: 'images/products/el-ilani.webp',
    active: true,
    createdAt: '2026-01-05T10:00:00.000Z',
    features: ['Ekonomik üretim', 'Hızlı dağıtıma uygun', 'Canlı renkler'],
    variants: [
      { id: '2IA5', model: 'A5 El İlanı', image: '', size: '13,5 × 19,5 cm', quantity: 2000, paper: '105 gr Kuşe', printing: 'Ön 4 Renk / Arka Baskısız', finish: 'Selefonsuz', cut: 'Düz Kesim', price: 745,  active: true },
      { id: '2IA4', model: 'A4 El İlanı', image: '', size: '19,5 × 27 cm',   quantity: 2000, paper: '105 gr Kuşe', printing: 'Ön 4 Renk / Arka Baskısız', finish: 'Selefonsuz', cut: 'Düz Kesim', price: 1310, active: true },
    ],
  },
  {
    id: 'afis',
    slug: 'afis',
    name: 'Afiş',
    category: 'Afiş',
    description: 'Duyuru ve etkinliklerinizi uzaktan dahi görünür kılan yüksek etkili afiş baskıları.',
    image: 'images/products/afis.webp',
    active: true,
    createdAt: '2026-01-06T10:00:00.000Z',
    features: ['Yüksek görünürlük', 'Üç farklı ebat', 'İç mekâna uygun'],
    variants: [
      poster('AF1', '35 × 50 cm',  250,  1590),
      poster('AF2', '35 × 50 cm',  500,  2030),
      poster('AF3', '35 × 50 cm', 1000,  2570),
      poster('AF4', '50 × 70 cm',  250,  2590),
      poster('AF5', '50 × 70 cm',  500,  2925),
      poster('AF6', '50 × 70 cm', 1000,  3955),
      poster('AF7', '70 × 100 cm', 250,  5265),
      poster('AF8', '70 × 100 cm', 500,  6010),
      poster('AF9', '70 × 100 cm',1000,  8205),
    ],
  },
];
