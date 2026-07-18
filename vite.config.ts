import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const proxyTarget = env.VITE_API_PROXY_TARGET?.trim()
  const healthPath = env.VITE_API_HEALTH_PATH?.trim() || '/health_check'

  const proxy = proxyTarget
    ? {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        ...(healthPath.startsWith('/')
          ? {
              [healthPath]: {
                target: proxyTarget,
                changeOrigin: true,
                secure: false,
              },
            }
          : {}),
      }
    : undefined

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy,
    },
  }
})
