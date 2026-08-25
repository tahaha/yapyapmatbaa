# Yapyapmatbaa — GitHub Pages Sürümü

Bu klasör bağımsız bir React + Vite + Tailwind CSS projesidir. Ana projeye veya OpenAI Sites altyapısına ihtiyaç duymaz.

## GitHub'a yükleme

1. GitHub'da boş bir repository oluşturun.
2. Bu klasörün **içindeki tüm dosya ve klasörleri** repository'nin kök dizinine yükleyin. `githubpublish` klasörünü üst klasör olarak yüklemeyin.
3. Varsayılan dalın adının `main` olduğundan emin olun.
4. Repository içinde **Settings → Pages** sayfasını açın.
5. **Build and deployment → Source** alanını **GitHub Actions** olarak seçin.
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

## İçerik düzenleme

- Sayfa metinleri, fiyatlar ve WhatsApp bağlantısı: `src/App.jsx`
- Renkler ve özel görsel efektler: `src/index.css`
- Sayfa başlığı ve sosyal medya meta etiketleri: `index.html`
- Sosyal paylaşım görseli: `public/og.png`

Repository adresiniz kesinleştikten sonra `index.html` içindeki `og:image` ve `twitter:image` adreslerini kendi GitHub Pages adresinizle değiştirebilirsiniz. Mevcut değer çalışan canlı görseli kullanır.
