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

export function delAll(ids) {
  return request({
    url: 'api/localStorage/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/localStorage',
    method: 'put',
    data
  })
}

export function downloadStorage(params) {
  return request({
    url: 'api/localStorage/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
