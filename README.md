# Yapyapmatbaa — GitHub Pages Sürümü

Bu klasör bağımsız bir React + Vite + Tailwind CSS projesidir. Ana projeye veya OpenAI Sites altyapısına ihtiyaç duymaz.

## GitHub'a yükleme

1. GitHub'da boş bir repository oluşturun.
2. Bu klasörün **içindeki tüm dosya ve klasörleri** repository'nin kök dizinine yükleyin. `githubpublish` klasörünü üst klasör olarak yüklemeyin.
3. Varsayılan dalın adının `main` olduğundan emin olun.
4. Repository içinde **Settings → Pages** sayfasını açın.
5. **Build and deployment → Source** alanını **GitHub Actions** olarak seçin. GitHub'ın hazır Jekyll veya "Deploy static content" şablonlarını oluşturmayın; projeyle birlikte gelen `.github/workflows/static.yml` kullanılmalıdır.
6. `main` dalına yapılan her gönderimden sonra site otomatik olarak derlenip yayınlanır.

Yayın tamamlandığında adresiniz genellikle şu biçimde olur:

`https://KULLANICI-ADINIZ.github.io/REPOSITORY-ADINIZ/`

## Bilgisayarda çalıştırma

Node.js 22 ve pnpm kurulu olmalıdır.

```bash
pnpm install
pnpm dev
```

Üretim derlemesi:

```bash
pnpm build
pnpm preview
```

## Ürün sayfaları

- Tüm ürünler: `/urunler/`
- Ürün detayları: `/urunler/kartvizit/`, `/urunler/brosur/`, `/urunler/magnet/`, `/urunler/cikartma-etiket/`, `/urunler/el-ilani/`, `/urunler/afis/`

Ürün kartları tek tek fiyat satırları yerine kategori olarak gösterilir. Ebat, adet, model ve diğer üretim seçenekleri detay sayfasında varyasyon olarak seçilir; fiyat ve WhatsApp sipariş mesajı otomatik güncellenir.

## İçerik düzenleme

- Ürünler, fiyatlar ve varyasyonlar: `src/data/products.js`
- WhatsApp numarası ve genel mesaj: `src/config/contact.js`
- Ana sayfa metinleri: `src/App.jsx`
- Renkler ve özel görsel efektler: `src/index.css`
- Sayfa başlığı ve sosyal medya meta etiketleri: `index.html`
- Sosyal paylaşım görseli: `public/og.png`

## Yönetim paneli

Yayınlanan sitenin `/admin/` adresinden yönetim paneline ulaşabilirsiniz.

- Kullanıcı adı: `admin`
- Şifre: `yapyap2026`

Ürün ekleme, düzenleme, silme ve aktif/pasif yapma işlemleri tarayıcının yerel depolama alanında saklanır. Bu geçici yapı backend gerektirmez ve aynı tarayıcıdaki ana sayfaya otomatik yansır. Farklı cihazlarda ortak yönetim ve güvenli giriş için ileride gerçek API, veritabanı ve sunucu tabanlı authentication eklenmelidir.

Başlangıç ürünleri `src/data/products.js`, veri işlemleri ise `src/data/productStore.js` üzerinden yönetilir. Ürün görsellerini değiştirmek için ilgili ürünün `image` alanına `public` klasöründeki yeni dosyanın adını yazın.

Repository adresiniz kesinleştikten sonra `index.html` içindeki `og:image` ve `twitter:image` adreslerini kendi GitHub Pages adresinizle değiştirebilirsiniz. Mevcut değer çalışan canlı görseli kullanır.
