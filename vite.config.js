import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('three')) return 'three'
          if (
            id.includes('gsap') ||
            id.includes('motion') ||
            id.includes('lenis')
          )
            return 'animation'
          if (id.includes('simple-icons') || id.includes('@lucide'))
            return 'icons'
          if (id.includes('@vueuse')) return 'vueuse'
          if (id.includes('vue') || id.includes('pinia')) return 'vue'

          return undefined
        },
      },
      onwarn(warning, warn) {
        if (
          warning.message.includes(
            'contains an annotation that Rollup cannot interpret',
          )
        ) {
          return
        }

        warn(warning)
      },
    },
  },
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
