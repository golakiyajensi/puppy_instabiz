import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Proxy API calls during development so the browser stays on the Vite origin.
// This defaults to the deployed API; set VITE_PROXY_TARGET to localhost:5000 for a local backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'https://puppy-instabiz.onrender.com',
          changeOrigin: true,
        },
      },
    },
  }
})
