module.exports = {
  lintOnSave: true,
  chainWebpack: config => {},
  productionSourceMap: false,
  devServer: {
    proxy: process.env.VUE_APP_BASE_API
  }
}
