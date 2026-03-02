import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Límite ajustado para chunks grandes que se cargan bajo demanda
    // export-libs (PDF/Excel) es ~1.3MB pero solo se carga al exportar
    chunkSizeWarningLimit: 1500,
    // Optimizaciones de minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting manual para separar vendors grandes
        manualChunks: {
          // React y relacionados
          'react-vendor': ['react', 'react-dom', 'react-router', 'react-router-dom'],
          
          // Librerías de gráficos (muy pesadas)
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Librerías de exportación (muy pesadas)
          'export-libs': ['jspdf', 'jspdf-autotable', 'exceljs', 'xlsx'],
          
          // Librerías de UI
          'ui-libs': [
            'framer-motion',
            'emoji-picker-react',
            'react-select',
            'react-sweetalert2',
            'react-signature-canvas',
            'react-slick',
            'slick-carousel',
          ],
          
          // Utilidades
          'utils': [
            'axios',
            'date-fns',
            'fuse.js',
            'zustand',
            'react-hook-form',
            'file-saver',
          ],
        },
        // Nombres de archivos con hash para mejor caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Optimizar sourcemaps (usar lightweight en producción)
    sourcemap: false,
  },
  // Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'axios',
    ],
  },
})
