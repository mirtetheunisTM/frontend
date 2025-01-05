import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173, // Default Vite WebSocket port
    },
},
})
