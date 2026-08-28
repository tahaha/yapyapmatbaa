import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

/**
 * Geliştirme sunucusu için SPA fallback middleware.
 * /urunler/[herhangi-slug]/ isteklerini index.html ile karşılar.
 * Bu sayede admin'den eklenen yeni ürünler geliştirme ortamında da önizlenebilir.
 */
const spaFallbackPlugin = {
  name: 'spa-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      // /urunler/[slug]/ formatındaki istekler için index.html sun
      // (sadece dosya uzantısı olmayanlar — JS, CSS, resim vs. hariç)
      if (/\/urunler\/[^./]+\/?(\?.*)?$/.test(req.url)) {
        req.url = '/index.html';
      }
      next();
    });
  },
};

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), spaFallbackPlugin],
  build: {
    rollupOptions: {
      input: {
        // Ana sayfa
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        // Admin paneli
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
        // Ürünler listesi
        products: fileURLToPath(new URL('./urunler/index.html', import.meta.url)),
        // Mevcut ürün detay sayfaları (geriye dönük uyumluluk)
        // Admin'den eklenen YENİ ürünler: 404.html fallback ile çalışır
        kartvizit: fileURLToPath(new URL('./urunler/kartvizit/index.html', import.meta.url)),
        brosur: fileURLToPath(new URL('./urunler/brosur/index.html', import.meta.url)),
        magnet: fileURLToPath(new URL('./urunler/magnet/index.html', import.meta.url)),
        sticker: fileURLToPath(new URL('./urunler/cikartma-etiket/index.html', import.meta.url)),
        flyer: fileURLToPath(new URL('./urunler/el-ilani/index.html', import.meta.url)),
        poster: fileURLToPath(new URL('./urunler/afis/index.html', import.meta.url)),
      },
    },
  },
});
