import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/server',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/server/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/server',
    method: 'put',
    data
  })
}

export default { add, edit, del }
