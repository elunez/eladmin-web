import request from '@/utils/request'
const  BASE_SERVICE = 'api/funIdAccount';

export function add(data) {
  return request({
    url: BASE_SERVICE,
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: BASE_SERVICE + '/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: BASE_SERVICE,
    method: 'put',
    data
  })
}

export function downloadFunIdAccount(data) {
  return request({
    url: BASE_SERVICE+'/download',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}
export function getFunctionNo(params) {
  return request({
    url: BASE_SERVICE+'/getfuncno',
    method: 'get',
    params
  })
}
