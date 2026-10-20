import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { firebaseMessagingWorker } from './plugins/firebase-messaging-worker';
import { themeScript } from './plugins/theme-script';

const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
  supabase: /[\\/]node_modules[\\/]@supabase[\\/]/,
};

const vendorChunk = (id: string) => Object.keys(VENDOR_CHUNKS).find((name) => VENDOR_CHUNKS[name].test(id));

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd()), ...process.env };

  return {
    plugins: [react(), tailwindcss(), themeScript(), firebaseMessagingWorker(env)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { port: 3000 },
    preview: { port: 3000 },
    build: {
      rollupOptions: {
        output: { manualChunks: vendorChunk },
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        },
      },
    },
  };
});
