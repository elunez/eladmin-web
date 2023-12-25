import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'system/api/logs/error/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'system/api/logs/del/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'system/api/logs/del/info',
    method: 'delete'
  })
}
