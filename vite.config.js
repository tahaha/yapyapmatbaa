import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
        products: fileURLToPath(new URL('./urunler/index.html', import.meta.url)),
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
