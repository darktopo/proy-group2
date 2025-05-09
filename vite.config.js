import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.hs-service.api.crealape.com/api/v1', // URL de la API
        changeOrigin: true, // Cambia el origen para evitar el problema de CORS
        secure: true, // Si usas HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Reemplaza el prefijo /api por la URL real
        // Si tu servidor usa cookies de sesión o necesitas manejar credenciales
        withCredentials: true,
      },
    },
  },
})
