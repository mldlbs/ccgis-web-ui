// 配置文件使用commonjs规范
/*eslint no-unused-vars: */
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const path = require('path')

module.exports = {
  mode: 'production',
  // 入口，是一个对象
  entry: {
    'gis-core': './packages/common/index.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      ATV: JSON.stringify(require('./package.json').version),
      RELEASETIME: new Date().getTime()
    }),
    new WebpackObfuscator({
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: false,
      domainLock: [],
      domainLockRedirectUrl: 'about:blank',
      forceTransformStrings: [],
      identifierNamesCache: null,
      identifierNamesGenerator: 'hexadecimal',
      identifiersDictionary: [],
      identifiersPrefix: '',
      ignoreImports: false,
      inputFileName: '',
      log: false,
      numbersToExpressions: false,
      optionsPreset: 'default',
      renameGlobals: false,
      renameProperties: false,
      renamePropertiesMode: 'safe',
      reservedNames: [],
      reservedStrings: [],
      seed: 0,
      selfDefending: false,
      simplify: true,
      sourceMap: false,
      sourceMapBaseUrl: '',
      sourceMapFileName: '',
      sourceMapMode: 'separate',
      sourceMapSourcesMode: 'sources-content',
      splitStrings: false,
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.5,
      stringArrayEncoding: [],
      stringArrayIndexesType: [
        'hexadecimal-number'
      ],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      target: 'browser',
      transformObjectKeys: false,
      unicodeEscapeSequence: false
    })
  ],
  // 输出
  output: {
    // 带五位hash值的js
    filename: './[name].js',
    path: path.resolve(__dirname, 'build-lib/dist'), // path.resolve(__dirname, 'dist'),
    // library: {
    //   name: '[name]',
    //   type: 'umd'
    // },
    library: 'CCGis',
    libraryTarget: 'umd',
    libraryExport: 'CCGis',
    clean: {
      keep: 'package.json'
    }
  },
  // resolve: {
  //     root: [
  //         path.resolve(__dirname, './node_modules'),
  //         path.resolve(__dirname, './src')
  //     ]
  // },
  optimization: {
    minimize: true,
    minimizer: [
    ]
  },
  // 指定loader
  module: {
    // rules中的每一项是一个规则
    rules: [
      {
        test: /\.js$/, // 值一个正则，符合这些正则的资源会用一个loade来处理
        use: {
          loader: 'babel-loader', // 使用bable-loader来处理
          options: { // 指定参数
            presets: ['es2015', 'stage-0'],
            plugins: ['transform-class-properties']
          }
        },
        exclude: /node_modules/
      },
      // {
      //     test: /.vue$/,
      //     loader: 'vue-loader'
      // },
      {
        // 正则匹配 css 文件
        test: /\.css$/,
        use: [
          {
            // 引入 style 文件加载插件
            loader: 'style-loader'
          },
          {
            // 引入 css 文件加载插件
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        use: {
          loader: 'file-loader',
          options: {
            // esModule: false,
            name: '[name]-[hash:8].[ext]',
            outputPath: 'assets/images'
          }
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 9000
  }
}
