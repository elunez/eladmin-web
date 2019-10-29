import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import permission from './components/Permission'
import dict from './components/Dict'
import store from './store'

import '@/icons' // icon
import './router/index' // permission control
import Router from 'vue-router'

Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
require('babel-polyfill')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
