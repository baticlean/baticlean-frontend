// baticlean-frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import versionInjector from './version-injector-plugin.js';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // ✅ ON EXCLUT meta.json DU CACHE DU SERVICE WORKER
        // pour qu'il soit toujours cherché sur le réseau.
        globIgnores: ['**/meta.json'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'BATIClean',
        short_name: 'BATIClean',
        description: 'Services de nettoyage et de maintenance de bâtiments.',
        theme_color: '#8A2387',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
    versionInjector(),
  ],
});