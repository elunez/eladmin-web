import request from '@/utils/request'

export function get() {
  return request({
    url: 'system/api/email',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'system/api/email',
    data,
    method: 'put'
  })
}

export function send(data) {
  return request({
    url: 'system/api/email',
    data,
    method: 'post'
  })
}
