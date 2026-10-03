import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_SITE_BASE || '/';
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('VITE_SITE_BASE must end with / and contain only directory segments.');
  return {
    base, plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { host: '127.0.0.1', proxy: { [base + 'api']: { target: `http://127.0.0.1:${env.API_PORT || 3001}` } } },
  };
});
