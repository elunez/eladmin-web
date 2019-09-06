const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.module.rules.delete('svg')
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end()
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
  },
  productionSourceMap: false,
  devServer: {
    proxy: process.env.VUE_APP_BASE_API
  }
}
