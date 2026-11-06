import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
  supabase: /[\\/]node_modules[\\/]@supabase[\\/]/,
  ui: /[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils|radix-ui|@radix-ui)[\\/]/,
};

const vendorChunk = (id: string) => Object.keys(VENDOR_CHUNKS).find((name) => VENDOR_CHUNKS[name].test(id));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 3002 },
  preview: { port: 3002 },
  build: {
    rollupOptions: {
      output: { manualChunks: vendorChunk },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
});
