import request from '@/utils/request'
const  BASE_SERVICE = 'api/functionInfo';

export function all() {
  return request({
    url: BASE_SERVICE+'/all',
    method: 'get'
  })
}
export function scriptName(params) {
  return request({
    url: BASE_SERVICE+'/scriptName',
    method: 'post',
    data:params
  })
}
export function add(data) {
  return request({
    url: BASE_SERVICE,
    method: 'post',
    data
  })
}
export function queryFunctList(data) {
  return request({
    url: BASE_SERVICE+'/funcList',
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

export function downloadFunctionInfo(data) {
  return request({
    url: BASE_SERVICE+'/download',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}
