import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default {
  install(Vue) {
    Vue.prototype.checkPer = (value) => {
      if (value && value instanceof Array && value.length > 0) {
        const roles = store.getters && store.getters.roles
        const permissionRoles = value
        return roles.some(role => {
          return permissionRoles.includes(role)
        })
      } else {
        console.error(`need roles! Like v-permission="['admin','editor']"`)
        return false
      }
    }
  }
}
