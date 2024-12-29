import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures the app runs at the root
  build: {
    outDir: 'dist',
  },
});
