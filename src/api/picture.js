import request from '@/utils/request'

export function uoload(data) {
  return request({
    url: 'api/pictures',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/pictures/' + id,
    method: 'delete'
  })
}
