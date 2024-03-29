'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = require('../config/prod.env')
const { allowedNodeEnvironmentFlags } = require('process')
let envOptions = {}
if (process.env.BUILD_ENV === "production") {
  envOptions = {
    'PHP_CLASS_DETAIL': '"//192.168.199.161:10081/"', // 详情线上 url
    'BASEURL':'"//ns.huatu.com"',
    'CRM_URL': '"//crm-api.htexam.com"',
    'PHP_URL':'"//api.huatu.com/lumenapi"',
    'WEBPACK_BUILD_TARGET': '"production"',
    'SNJ_URL': '"//snj-api.huatu.com"',
    'jy_URL': '"//apixue.huatu.com"',
    'ZWK_URL':'"https://position.htexam.com/info"',
    'PANGU_URL':'"https://pangu-api.htexam.com"',
    'SCHEDULE_URL':'"https://schedule.htexam.com/schedule-api"',
    'PC_URL': '"//v.huatu.com/"',
    'CLEAR_CACHE':'"//preview.htexam.com/"'//清除轮播缓存
  }
} else {
  envOptions = {
    'PHP_CLASS_DETAIL': '"//192.168.199.202:10081/"', // 详情测试 url
    'BASEURL':'"//test-ns.htexam.com"',  // BASEURL:'"//123.103.86.52"',
    'CRM_URL': '"//test-ns.htexam.com"',
    'PHP_URL':'"//testapi.huatu.com/lumenapi"',
    'WEBPACK_BUILD_TARGET': '"development"',
    'SNJ_URL': '"//dev-snj.huatu.com"',
    'jy_URL': '"//apixue-alpha.huatu.com"',
    'ZWK_URL':'"https://api-test.emianku.com/info"',
    'PANGU_URL':'"https://devpangu-api.htexam.com"',
    'SCHEDULE_URL':'"https://ns-test.htexam.com/schedule-api"',
    'PC_URL': '"//test.htexam.net/"',
    'CLEAR_CACHE':'"//test.htexam.com/"'//清除轮播缓存
  }
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[hash:7].js'),
    chunkFilename: utils.assetsPath('js/[name].[hash:7].js')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
        },
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: 'async',
          name: 'async-vendors'
        }
      }
    },
    runtimeChunk: { name: 'runtime' }
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
       'process.env': env,
       ...envOptions,
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    // new ExtractTextPlugin({
    //   filename: utils.assetsPath('css/[name].[contenthash].css'),
    //   // Setting the following option to `false` will not extract CSS from codesplit chunks.
    //   // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
    //   // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
    //   // increasing file sze: https://github.com/vuejs-templates/webpack/issues/1110
    //   allChunks: true
    // }),
    new MiniCssExtractPlugin ({
          filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true,
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    // new webpack.optimize.SplitChunksPlugin({

    //   name: 'vendor',
    //   minChunks(module) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
    //     )
    //   }
    // }),
    // // extract webpack runtime and module manifest to its own file in order to
    // // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.SplitChunksPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),
    // // This instance extracts shared chunks from code splitted chunks and bundles them
    // // in a separate chunk, similar to the vendor chunk
    // // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // new webpack.optimize.SplitChunksPlugin({
    //   name: 'app',
    //   async: 'vendor-async',
    //   children: true,
    //   minChunks: 3
    // }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
