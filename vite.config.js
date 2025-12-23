// baticlean/baticlean-frontend/baticlean-frontend-6de3eed10c580ff6c1f7931b4a6e09bd7c93a2e9/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import versionInjector from './version-injector-plugin';

export default defineConfig({
  plugins: [
    react(),
    versionInjector(),
    VitePWA({
      registerType: 'prompt', // Indispensable pour garder le contrôle du modal
      injectRegister: 'auto',
      workbox: {
        // ✅ ON EXCLUT version.json DU PRECACHE
        globIgnores: ['**/version.json'], 
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /version\.json/,
            handler: 'NetworkOnly', // Toujours chercher sur le réseau
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst', // Les images restent en cache pour charger instantanément
          }
        ]
      },
      manifest: {
        name: 'BATIClean',
        short_name: 'BATIClean',
        theme_color: '#3f51b5',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});