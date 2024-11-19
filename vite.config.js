import { defineConfig } from 'vite'; // Asegúrate de incluir esta línea
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000, // Cambia el puerto si es necesario
  },
});
