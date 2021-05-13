'use strict'
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  // loaders: utils.cssLoaders({
  //   sourceMap: sourceMapEnabled,
  //   extract: isProduction
  // }),
  // cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformAssetUrls: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
