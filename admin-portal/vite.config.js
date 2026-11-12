import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
export default defineConfig({
  base: './',
  envDir: root,
  plugins: [react()],
  build: { rollupOptions: { output: { manualChunks(id) {
    if (!id.includes('node_modules')) return;
    if (id.includes('@supabase')) return 'supabase';
    if (/framer-motion|motion-dom|motion-utils/.test(id)) return 'motion';
    if (/[/\\](react|react-dom|react-router|react-router-dom|scheduler)[/\\]/.test(id)) return 'react';
  } } } },
  resolve: { dedupe: ['react','react-dom','react-router-dom'] },
  server: { port: 5180, fs: { allow: [root], deny: ['.env','.env.*','*.{crt,pem}','**/.git/**','**/data/orders.csv','**/data/legacy-private/**','**/otp_vault.json'] } }
});
