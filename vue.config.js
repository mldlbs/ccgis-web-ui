const path = require('path')
const { proxy } = require('./project.config.json')
const TerserPlugin = require('terser-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'GisWebUi' // 标题

const plugins = [
//   new MiniCssExtractPlugin({
//     filename: name + '.css'
//   })
]
const minimizer = []
if (process.env.NODE_ENV !== 'development') {
  minimizer.push(new TerserPlugin({
    minify: TerserPlugin.uglifyJsMinify,
    terserOptions: {
      compress: {
        drop_console: true
      },
      output: {
        comments: false
      }
    }
  }))
}

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: {
    port: 10201,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy
  },
  css: {
    extract: true, // 提取
    sourceMap: false,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      },
      scss: {}
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      },
      extensions: ['.js', 'css', 'scss', 'less', '.vue']
    },
    entry: {
      name: '@gis/components/index.js'
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: name,
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      libraryExport: name
    },
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 50000000,
      // 只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    optimization: {
      minimize: false,
      minimizer: minimizer
    },
    plugins: plugins
  },
  chainWebpack: (config) => {
    /** 删除懒加载模块的 prefetch preload，降低带宽压力(使用在移动端) */
    config.plugins.delete('prefetch').delete('preload')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    // // json5
    config.module
      .rule('json5')
      .test(/\.json5$/)
      .use('json5-loader')
      .loader('json5-loader')
      .end()

    // // set svg-sprite-loader
    config.plugin('define').tap((args) => {
      Object.assign(args[0], {
        ATV: JSON.stringify(require('./package.json').version),
        RELEASETIME: new Date().getTime()
      })
      return args
    })

    // config.optimization.runtimeChunk('single')

    config.resolve.alias
      .set('@', resolve('src'))
      .set('@gis', resolve('packages'))
  }
}
