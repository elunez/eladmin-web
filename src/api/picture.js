import request from '@/utils/request'

export function del(id) {
  return request({
    url: 'api/pictures/' + id,
    method: 'delete'
  })
}
