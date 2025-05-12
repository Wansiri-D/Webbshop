import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Root directory
  build: {
    outDir: 'dist', // Output directory for build
  },
  server: {
    port: 5174, // Ensure Vite runs on port 5174
  },
});
