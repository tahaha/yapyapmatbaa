# Beyaz Ekran Düzeltmesi

Canlı sayfada repository'nin ham `index.html` dosyası yayınlandığında React uygulaması derlenmediği için beyaz ekran oluşur.

## Yapılması gerekenler

1. Repository'deki `.github/workflows/static.yml` dosyasını bu paketteki aynı adlı dosyayla değiştirin.
2. Repository'deki `.github/workflows/jekyll-gh-pages.yml` dosyasını silin. Bu proje Jekyll kullanmıyor.
3. GitHub'da **Settings → Pages → Build and deployment → Source** alanının **GitHub Actions** olduğundan emin olun.
4. Değişiklikleri `main` dalına kaydedin.
5. **Actions** sekmesinde **Yapyapmatbaa GitHub Pages** işleminin yeşil onayla tamamlanmasını bekleyin.
6. `https://tahaha.github.io/yapyapmatbaa/` adresini `Ctrl + F5` ile yenileyin.

Doğru iş akışı önce `pnpm build` komutunu çalıştırır ve yalnızca oluşan `dist` klasörünü GitHub Pages'e gönderir.
