import request from '@/utils/request'

export function del(key) {
  return request({
    url: 'auth/online/' + key,
    method: 'delete'
  })
}
