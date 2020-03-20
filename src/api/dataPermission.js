import request from '@/utils/request'
const  BASE_SERVICE = 'api/dataPermission';

export function getAllSet() {
  return request({
    url: BASE_SERVICE+"/allset",
    method: 'get'
  })
}

export function getDataPermission(params) {
  return request({
    url: BASE_SERVICE,
    method: 'get',
    params
  })
}


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

export function downloadDataPermission(data) {
  return request({
    url: BASE_SERVICE+'/download',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}
