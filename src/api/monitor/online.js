import request from '@/utils/request'

export function del(keys) {
  return request({
    url: 'system/auth/online',
    method: 'delete',
    data: keys
  })
}
