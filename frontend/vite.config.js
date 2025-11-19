import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'MyMediaTracker',
        short_name: 'MediaTracker',
        description: 'Kişisel medya takip ve puanlama uygulaması',
        theme_color: '#FFB800',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: '/MyMediaTracker/',
        scope: '/MyMediaTracker/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        // İlk yüklemede tüm statik dosyaları cache'le
        navigateFallback: '/MyMediaTracker/index.html',
        navigateFallbackDenylist: [/^\/api/],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          // Firebase Storage - resimler için
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 gün
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Firebase API - Firestore istekleri
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 gün
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Firebase Auth
          {
            urlPattern: /^https:\/\/(www\.)?googleapis\.com\/identitytoolkit\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-auth-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 // 1 saat
              }
            }
          },
          // Diğer external istekler
          {
            urlPattern: /^https?:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'external-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 gün
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  base: '/MyMediaTracker/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})
