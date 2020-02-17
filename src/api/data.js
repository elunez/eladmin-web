import request from '@/utils/request'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}


export function upload(url, form) {
  return request({
    url: url,
    method: 'post',
    form
  })
}
export function download(url,data) {
  return request({
    url: url+'/download',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}
