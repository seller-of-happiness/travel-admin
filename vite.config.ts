import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        scss: { implementation: require('sass') },
      },
      postcss: {
        plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
      },
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      proxy: {
        // Убираем двойное /api при проксировании
        '/api': {
          target: env.VITE_API_URL, // в .env: VITE_API_URL=https://travel.cattemp-dev.ru
          changeOrigin: true,
          secure: false,
          // без переписывания пути
          // rewrite: (p) => p
        },
      },
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  }
})
