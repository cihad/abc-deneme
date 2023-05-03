import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true
  },
  vite: {
    server: {
      proxy: {
        "^/src/.+\.(jpg|jpeg|png|gif|webp).*": "https://a1xp8ym5wle2pctckmfw-src.halkinsesi.com",
        "^.+\.(jpg|jpeg|png|gif|webp).*": {
          target: "https://a1xp8ym5wle2pctckmfw-src.halkinsesi.com",
          changeOrigin: true,
          rewrite: (path) => "/public" + path
        }
      }
    }
  }
});