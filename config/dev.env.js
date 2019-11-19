'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WS_API: '"ws://localhost:8000"',
  BASE_API: '"http://localhost:8000"'
  // BASE_API: '"https://api.auauz.net"'
})
