import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/custUser',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/custUser/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/custUser',
    method: 'put',
    data
  })
}

export function downloadCustUser(params) {
  return request({
    url: 'api/custUser/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
