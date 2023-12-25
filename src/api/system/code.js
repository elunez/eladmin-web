import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: 'system/api/code/resetEmail?email=' + data,
    method: 'post'
  })
}

export function updatePass(pass) {
  return request({
    url: 'system/api/users/updatePass/' + pass,
    method: 'get'
  })
}
