import { defineConfig } from 'vite';

// index.html ở thư mục gốc, kết quả build vào www/ để Capacitor đóng gói
export default defineConfig({
  base: './',
  build: { outDir: 'www', emptyOutDir: true, target: 'es2020' },
});
