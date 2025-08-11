// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import versionInjector from './version-injector-plugin.js'; // ✅ On importe notre plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BATIClean',
        short_name: 'BATIClean',
        description: 'Services de nettoyage et de maintenance de bâtiments.',
        theme_color: '#8A2387',
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
          }
        ]
      }
    }),
    versionInjector(), // ✅ On ajoute notre plugin à la fin de la liste
  ],
})