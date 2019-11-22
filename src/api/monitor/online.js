import request from '@/utils/request'

export function del(key) {
  return request({
    url: 'auth/online/' + key,
    method: 'delete'
  })
}

export function downloadOnline(params) {
  return request({
    url: 'auth/online/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
