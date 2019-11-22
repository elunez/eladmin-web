import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/jobs',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/jobs/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/jobs',
    method: 'put',
    data
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/jobs/' + id,
    method: 'put'
  })
}

export function execution(id) {
  return request({
    url: 'api/jobs/exec/' + id,
    method: 'put'
  })
}

export function downloadJobs(params) {
  return request({
    url: 'api/jobs/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function downloadLogs(params) {
  return request({
    url: 'api/jobs/download/log',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
