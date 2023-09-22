import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        "theme_color": "#feea89",
        "background_color": "#feea89",
        "display": "standalone",
        "scope": ".",
        "start_url": "/",
        "short_name": "Pampu!",
        "description": "clipboard - notes - bookmarks",
        "name": "Pampu!",
        "icons": [
          {
            "src": "/16.png",
            "sizes": "16x16",
            "type": "image/png"
          },
          {
            "src": "/32.png",
            "sizes": "32x32",
            "type": "image/png"
          },
          {
            "src": "/76.png",
            "sizes": "76x76",
            "type": "image/png"
          },
          {
            "src": "/180.png",
            "sizes": "180x180",
            "type": "image/png"
          },
          {
            "src": "/192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "/512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "/1024.png",
            "sizes": "1024x1024",
            "type": "image/png"
          },
          {
            "src": "/maskable_icon.png",
            "sizes": "512x512",
            "type": "maskable"
          }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api/]
      }
    })
  ],
})
