import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Ensures the app runs at the root of the domain
  build: {
    outDir: 'dist', // Default output directory
  },
});
