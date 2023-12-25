import request from '@/utils/request'

export function login(username, password, code, uuid) {
  return request({
    url: 'system/auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: 'system/auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'system/auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'system/auth/logout',
    method: 'delete'
  })
}
