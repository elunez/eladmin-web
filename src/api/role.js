import request from '@/utils/request'

// 获取所有的Role
export function getRoleTree() {
  return request({
    url: 'api/roles/tree',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/roles',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/roles/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/roles',
    method: 'put',
    data
  })
}
