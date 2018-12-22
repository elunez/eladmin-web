import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/redis',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/redis/' + id,
    method: 'delete'
  })
}

export function delAll() {
  return request({
    url: 'api/redis/all',
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/redis',
    method: 'put',
    data
  })
}
