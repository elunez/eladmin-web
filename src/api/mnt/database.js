import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/database',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/database/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/database',
    method: 'put',
    data
  })
}

export default { add, edit, del }
