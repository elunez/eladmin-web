import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/localStorage',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/localStorage/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/localStorage',
    method: 'put',
    data
  })
}
