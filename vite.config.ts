import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, '.', '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0', // Agar bisa diakses dari HP via IP Address
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          
          // PENTING: Aktifkan PWA di mode development
          devOptions: {
            enabled: true
          },

          // Cache aset statis agar offline-ready
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'images/logo.png'],
          
          manifest: {
            name: 'SonicVault Music',
            short_name: 'SonicVault',
            description: 'Local-First Offline Music Player',
            theme_color: '#09090b',
            background_color: '#09090b',
            display: 'standalone',
            start_url: '/',
            orientation: 'portrait',
            icons: [
              {
                // Path ini mengarah ke public/images/logo.png
                src: '/images/logo.png', 
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: '/images/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
             // Cache aset app (JS/CSS) tapi abaikan media user
             maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
             globPatterns: ['**/*.{js,css,html,ico,png,svg}']
          } 
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});