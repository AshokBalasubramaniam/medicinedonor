import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// http://localhost:5173  -> dev server
// Proxy /api to backend at http://localhost:3000
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
