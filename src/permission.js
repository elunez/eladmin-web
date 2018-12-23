import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from './store/modules/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

// auth judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('ADMIN') >= 0) return true // admin auth passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          buildMenus().then(res => {
            const asyncRouter = filterAsyncRouter(res)
            asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
            store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
              router.addRoutes(asyncRouter) // 动态添加可访问路由表
              next({ ...to, replace: true })// hack方法 确保addRoutes已完成
            })
          })
        }).catch((err) => {
          store.dispatch('LogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
