import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/myTest',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/myTest/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/myTest',
    method: 'put',
    data
  })
}
