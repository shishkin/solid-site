import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { VitePWA, Options as VitePWAOptions } from 'vite-plugin-pwa';
import manifest from './src/assets/manifest.json';

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  // DON'T add sitemap.xml yet:
  // - we should check if we can include it or not
  // - if you ping crawlers it should not be on sw precache
  // review images to include from public/img subdirectories: bios and blog
  includeAssets: [
    'robots.txt',
    'og.png',
    'img/icons/*.svg',
    'img/favicons/*.{png,ico}',
    'examples/*.json',
    'img/logo/**/logo.svg'
  ],
  manifest,
  workbox: {
    // be careful, DON'T add sw.js and workbox-xxxx.js
    globPatterns: ['*.html', 'manifest.webmanifest', 'assets/*', '*.{svg,png,jpg}'],
    // we need to increase the workbox size, all assets with size > 2MIB will
    // be excluded and then will not work on offline when used
    maximumFileSizeToCacheInBytes: 5000000,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/unpkg\.com\/\//i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'unpkg-com',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/cdn\.skypack\.dev\//i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cdn-skypack-dev',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  },
};

export default defineConfig({
  plugins: [solid(), VitePWA(pwaOptions)],
  assetsInclude: ['**/*.md'],
  optimizeDeps: {
    include: [
    ],
    exclude: ['@solid.js/docs'],
  },
  build: {
    polyfillDynamicImport: false,
    target: 'esnext',
    terserOptions: {
      compress: {
        unsafe: true,
        unsafe_arrows: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        passes: 3,
      },
    },
  },
});
