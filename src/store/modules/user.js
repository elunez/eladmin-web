import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { parseTime } from '@/utils/index'

const user = {
  state: {
    token: getToken(),
    name: '',
    email: '',
    avatar: '',
    createTime: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CREATE_TIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          setToken(res.token, rememberMe)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          commit('SET_ROLES', res.roles)
          commit('SET_NAME', res.username)
          commit('SET_AVATAR', res.avatar)
          commit('SET_EMAIL', res.email)
          commit('SET_CREATE_TIME', parseTime(res.createTime))
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user
