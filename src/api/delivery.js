import request from '@/utils/request'
const  BASE_SERVICE = 'api/delivery';

export function add(data) {
  return request({
    url: BASE_SERVICE,
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: BASE_SERVICE + '/delete' ,
    method: 'post',
    data:id
  })
}

export function edit(data) {
  return request({
    url: BASE_SERVICE,
    method: 'put',
    data
  })
}


export function batchUpdate(data) {
  return request({
    url: BASE_SERVICE+'/batchupdate',
    method: 'put',
    data
  })
}
export function downloadDelivery(params) {
  return request({
    url: BASE_SERVICE+'/download',
    method: 'post',
    data:params,
    responseType: 'blob'
  })
}

