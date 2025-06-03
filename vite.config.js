import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/api': {
        target: 'http://47.113.194.28:8080',
        changeOrigin: true,
        rewrite: (path) => path, 
      },
    },
  },
});
