import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue2 from '@vitejs/plugin-vue2'
// import path from 'path'
import dts from 'vite-plugin-dts'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

const name = 'gis-web-ui' // 标题

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/components/index.js'),
      name: 'GisWebUi',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => `${name}.${format}.js`
    },
    outDir: 'build/dist',
    minify: 'terser',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        assetFileNames: '[name][extname]',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'vue'
        }
      }
    },
    terserOptions: {
      ecma: 5,
      parse: {},
      compress: {},
      mangle: true, // Note `mangle.properties` is `false` by default.
      module: false,
      format: {
        beautify: false,
        ecma: 2015,
        // keep_numbers: true,
        keep_quoted_props: false,
        max_line_len: 1024,
        preamble: ''
      },
      toplevel: false,
      nameCache: null,
      ie8: false,
      keep_classnames: undefined,
      keep_fnames: false,
      safari10: false
    },
    cssMinify: true,
    copyPublicDir: false
  },
  plugins: [
    vue2(), dts(), dynamicImportVars({
      include: ['packages/components']
    }), createSvgIconsPlugin({
      // 指定要缓存的图标文件夹
      iconDirs: [resolve(__dirname, 'src/assets/icons')],
      // 执行icon name的格式
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@gis': resolve(__dirname, 'packages')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    modules: {
      outputFileName: '[name].css'
    },
    preprocessorOptions: {
      css: {},
      scss: {},
      less: {}
    }
  },
  server: {
    proxy: {
      '/api': {
        target: `http://www.crlkcloud.com/prod-api`,
        // 允许跨域
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    ATV: JSON.stringify(process.env.npm_package_version),
    RELEASETIME: new Date().getTime()
  }
})
