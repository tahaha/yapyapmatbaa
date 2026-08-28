/**
 * YapyapMatbaa — Ürün Veritabanı
 * Admin panelinden dışa aktarıldı: 28.08.2026 15:05:41
 * Bu dosyayı src/data/products.js ile değiştirin ve projeyi yeniden deploy edin.
 */

export const defaultProducts = [
  {
    "id": "kartvizit",
    "slug": "kartvizit",
    "name": "Kartvizit",
    "category": "Kartvizit",
    "description": "Markanızı profesyonelce temsil eden, farklı kesim ve yüzey seçeneklerine sahip kartvizitler.",
    "image": "images/products/kartvizit.webp",
    "active": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "features": [
      "Profesyonel baskı",
      "Ücretsiz tasarım desteği",
      "Kontrollü üretim"
    ],
    "variants": [
      {
        "id": "CYMLK",
        "model": "Standart Düz Kesim",
        "image": "",
        "size": "8,3 × 5,1 cm",
        "quantity": 1000,
        "paper": "350 gr Mat Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Mat Selefon ",
        "cut": "Düz Kesim",
        "price": 700,
        "active": true
      },
      {
        "id": "OÇÖK",
        "model": "Oval Kesim",
        "image": "",
        "size": "8,3 × 5,1 cm",
        "quantity": 1000,
        "paper": "350 gr Mat Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Mat Selefon + Kabartma Lak",
        "cut": "Oval Kesim",
        "price": 800,
        "active": true
      },
      {
        "id": "ABROV",
        "model": "700 gr Amerikan Bristol Oval",
        "image": "",
        "size": "8,3 × 5,1 cm",
        "quantity": 1000,
        "paper": "700 gr Amerikan Bristol",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Sıvama + Kabartma Lak",
        "cut": "Oval Kesim",
        "price": 1200,
        "active": true
      }
    ],
    "price": 700,
    "quantity": 1000,
    "size": "8,3 × 5,1 cm"
  },
  {
    "id": "brosur",
    "slug": "brosur",
    "name": "Broşür",
    "category": "Broşür",
    "description": "Kampanya ve hizmetlerinizi etkili biçimde anlatan, çift yönlü renkli broşür baskıları.",
    "image": "images/products/brosur.webp",
    "active": true,
    "createdAt": "2026-01-02T10:00:00.000Z",
    "features": [
      "Canlı renkler",
      "Çift yön baskı",
      "Farklı ebat seçenekleri"
    ],
    "variants": [
      {
        "id": "1151CA7",
        "model": "",
        "image": "",
        "size": "9,5 × 20 cm (A7)",
        "quantity": 1000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 1200,
        "active": true
      },
      {
        "id": "1152CA7",
        "model": "",
        "image": "",
        "size": "9,5 × 20 cm (A7)",
        "quantity": 2000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 1800,
        "active": true
      },
      {
        "id": "1151CA5",
        "model": "",
        "image": "",
        "size": "14 × 20 cm (A5)",
        "quantity": 1000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 1300,
        "active": true
      },
      {
        "id": "1152CA5",
        "model": "",
        "image": "",
        "size": "14 × 20 cm (A5)",
        "quantity": 2000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 2000,
        "active": true
      },
      {
        "id": "1155CA5",
        "model": "",
        "image": "",
        "size": "14 × 20 cm (A5)",
        "quantity": 5000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 4000,
        "active": true
      },
      {
        "id": "11510CA5",
        "model": "",
        "image": "",
        "size": "14 × 20 cm (A5)",
        "quantity": 10000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 7000,
        "active": true
      },
      {
        "id": "1151CA4",
        "model": "",
        "image": "",
        "size": "20 × 28 cm (A4)",
        "quantity": 1000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 2100,
        "active": true
      },
      {
        "id": "1152CA4",
        "model": "",
        "image": "",
        "size": "20 × 28 cm (A4)",
        "quantity": 2000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 2800,
        "active": true
      },
      {
        "id": "1155CA4",
        "model": "",
        "image": "",
        "size": "20 × 28 cm (A4)",
        "quantity": 5000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 5500,
        "active": true
      },
      {
        "id": "11510CA4",
        "model": "",
        "image": "",
        "size": "20 × 28 cm (A4)",
        "quantity": 10000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 9300,
        "active": true
      },
      {
        "id": "1151CA3",
        "model": "",
        "image": "",
        "size": "28 × 40 cm (A3)",
        "quantity": 1000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 3700,
        "active": true
      },
      {
        "id": "1152CA3",
        "model": "",
        "image": "",
        "size": "28 × 40 cm (A3)",
        "quantity": 2000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 6000,
        "active": true
      },
      {
        "id": "1155CA3",
        "model": "",
        "image": "",
        "size": "28 × 40 cm (A3)",
        "quantity": 5000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 10800,
        "active": true
      },
      {
        "id": "11510CA3",
        "model": "",
        "image": "",
        "size": "28 × 40 cm (A3)",
        "quantity": 10000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 18000,
        "active": true
      },
      {
        "id": "1151CA7x2",
        "model": "",
        "image": "",
        "size": "19 × 20 cm (A7x2)",
        "quantity": 1000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 2200,
        "active": true
      },
      {
        "id": "1152CA7x2",
        "model": "",
        "image": "",
        "size": "19 × 20 cm (A7x2)",
        "quantity": 2000,
        "paper": "115 gr Parlak Kuşe",
        "printing": "Ön 4 Renk / Arka 4 Renk",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 3500,
        "active": true
      }
    ],
    "price": 1200,
    "quantity": 1000,
    "size": "9,5 × 20 cm (A7)"
  },
  {
    "id": "magnet",
    "slug": "magnet",
    "name": "Magnet",
    "category": "Magnet",
    "description": "İşletmenizi sürekli görünür tutan, dayanıklı ve canlı renkli promosyon magnetleri.",
    "image": "images/products/magnet.webp",
    "active": true,
    "createdAt": "2026-01-03T10:00:00.000Z",
    "features": [
      "Dayanıklı yüzey",
      "Canlı baskı",
      "Oval kesim"
    ],
    "variants": [
      {
        "id": "OMAG",
        "model": "Oval Magnet",
        "image": "",
        "size": "6,7 × 4,6 cm",
        "quantity": 1000,
        "paper": "40 Mikron Magnet",
        "printing": "Ön 4 Renk",
        "finish": "Parlak Selefon",
        "cut": "Oval Kesim",
        "price": 1000,
        "active": true
      }
    ],
    "price": 1000,
    "quantity": 1000,
    "size": "6,7 × 4,6 cm"
  },
  {
    "id": "cikartma-etiket",
    "slug": "cikartma-etiket",
    "name": "Çıkartma Etiket",
    "category": "Çıkartma Etiket",
    "description": "Paket, ürün ve promosyonlar için net baskılı, kolay uygulanabilen çıkartma etiketler.",
    "image": "images/products/cikartma-etiket.webp",
    "active": true,
    "createdAt": "2026-01-04T10:00:00.000Z",
    "features": [
      "Kendinden yapışkanlı",
      "Net detaylar",
      "Kolay uygulama"
    ],
    "variants": [
      {
        "id": "ETKS",
        "model": "Standart Çıkartma",
        "image": "",
        "size": "8,3 × 5,1 cm",
        "quantity": 1000,
        "paper": "90 gr Kuşe Çıkartma",
        "printing": "Ön 4 Renk",
        "finish": "Parlak Selefon",
        "cut": "Düz Kesim",
        "price": 700,
        "active": true
      }
    ],
    "price": 700,
    "quantity": 1000,
    "size": "8,3 × 5,1 cm"
  },
  {
    "id": "el-ilani",
    "slug": "el-ilani",
    "name": "El İlanı",
    "category": "El İlanı",
    "description": "Duyuru ve kampanyalarınızı geniş kitlelere ulaştıran ekonomik el ilanı seçenekleri.",
    "image": "images/products/el-ilani.webp",
    "active": true,
    "createdAt": "2026-01-05T10:00:00.000Z",
    "features": [
      "Ekonomik üretim",
      "Hızlı dağıtıma uygun",
      "Canlı renkler"
    ],
    "variants": [
      {
        "id": "2IA5",
        "model": "A5 El İlanı",
        "image": "",
        "size": "13,5 × 19,5 cm",
        "quantity": 2000,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 1600,
        "active": true
      },
      {
        "id": "2IA4",
        "model": "A4 El İlanı",
        "image": "",
        "size": "19,5 × 27 cm",
        "quantity": 2000,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 2500,
        "active": true
      }
    ],
    "price": 1600,
    "quantity": 2000,
    "size": "13,5 × 19,5 cm"
  },
  {
    "id": "afis",
    "slug": "afis",
    "name": "Afiş",
    "category": "Afiş",
    "description": "Duyuru ve etkinliklerinizi uzaktan dahi görünür kılan yüksek etkili afiş baskıları.",
    "image": "images/products/afis.webp",
    "active": true,
    "createdAt": "2026-01-06T10:00:00.000Z",
    "features": [
      "Yüksek görünürlük",
      "Üç farklı ebat",
      "İç mekâna uygun"
    ],
    "variants": [
      {
        "id": "AF1",
        "model": "",
        "image": "",
        "size": "35 × 50 cm",
        "quantity": 250,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 2500,
        "active": true
      },
      {
        "id": "AF2",
        "model": "",
        "image": "",
        "size": "35 × 50 cm",
        "quantity": 500,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 3300,
        "active": true
      },
      {
        "id": "AF3",
        "model": "",
        "image": "",
        "size": "35 × 50 cm",
        "quantity": 1000,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 4000,
        "active": true
      },
      {
        "id": "AF4",
        "model": "",
        "image": "",
        "size": "50 × 70 cm",
        "quantity": 250,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 4000,
        "active": true
      },
      {
        "id": "AF5",
        "model": "",
        "image": "",
        "size": "50 × 70 cm",
        "quantity": 500,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 5000,
        "active": true
      },
      {
        "id": "AF6",
        "model": "",
        "image": "",
        "size": "50 × 70 cm",
        "quantity": 1000,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 6000,
        "active": true
      },
      {
        "id": "AF7",
        "model": "",
        "image": "",
        "size": "70 × 100 cm",
        "quantity": 250,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 7000,
        "active": true
      },
      {
        "id": "AF8",
        "model": "",
        "image": "",
        "size": "70 × 100 cm",
        "quantity": 500,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 9000,
        "active": true
      },
      {
        "id": "AF9",
        "model": "",
        "image": "",
        "size": "70 × 100 cm",
        "quantity": 1000,
        "paper": "105 gr Kuşe",
        "printing": "Ön 4 Renk / Arka Baskısız",
        "finish": "Selefonsuz",
        "cut": "Düz Kesim",
        "price": 13000,
        "active": true
      }
    ],
    "price": 2500,
    "quantity": 250,
    "size": "35 × 50 cm"
  }
];
