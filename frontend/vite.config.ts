import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Generates a self-signed cert so camera works on mobile over HTTPS
  ],
  server: {
    port: 3000,
    host: true, // Expose on all network interfaces (0.0.0.0) for mobile access
    https: true, // Required for camera access on mobile browsers
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
