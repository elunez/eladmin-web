import request from '@/utils/request'

export function queryApps(data) {
  return request({
    url: 'api/app',
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/app',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/app/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/app',
    method: 'put',
    data
  })
}
