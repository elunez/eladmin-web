import request from '@/utils/request'
const  BASE_SERVICE = 'api/custProduct';

export function add(data) {
  return request({
    url: BASE_SERVICE,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: BASE_SERVICE + '/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: BASE_SERVICE,
    method: 'put',
    data
  })
}

export function downloadCustProduct(data) {
  return request({
    url: BASE_SERVICE+'/download',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}
