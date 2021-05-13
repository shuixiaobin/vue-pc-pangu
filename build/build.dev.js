'use strict'
process.env.NODE_ENV = 'production'
process.env.BUILD_ENV = 'development'
module.exports = require('./build')
