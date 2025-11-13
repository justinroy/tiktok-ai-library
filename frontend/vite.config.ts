import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:8000';

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT || 5173),
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT || 4173)
    }
  };
});
