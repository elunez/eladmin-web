import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'api/logs/error/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'api/logs/del/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'api/logs/del/info',
    method: 'delete'
  })
}
