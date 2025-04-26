import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/proxy/3000/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    cors: true,
    strictPort: true,
    allowedHosts: ['all', 'dv8xenfpe1yxw.cloudfront.net', 'dev']
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: ['all', 'dv8xenfpe1yxw.cloudfront.net', 'dev']
  }
})
