import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { fs: { deny: ['.env','.env.*','*.{crt,pem}','**/.git/**','**/data/orders.csv','**/data/legacy-private/**','**/otp_vault.json'] } },
  build: { rollupOptions: { output: { manualChunks(id) {
    if (!id.includes('node_modules')) return;
    if (id.includes('@supabase')) return 'supabase';
    if (/framer-motion|motion-dom|motion-utils/.test(id)) return 'motion';
    if (/[/\\](react|react-dom|react-router|react-router-dom|scheduler)[/\\]/.test(id)) return 'react';
  } } } }
});
