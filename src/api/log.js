import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'api/logs/error/' + id,
    method: 'get'
  })
}

export function downloadLog(params) {
  return request({
    url: 'api/logs/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
