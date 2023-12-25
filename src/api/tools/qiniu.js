import request from '@/utils/request'

export function get() {
  return request({
    url: 'system/api/qiNiuContent/config',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'system/api/qiNiuContent/config',
    data,
    method: 'put'
  })
}

export function download(id) {
  return request({
    url: 'system/api/qiNiuContent/download/' + id,
    method: 'get'
  })
}

export function sync() {
  return request({
    url: 'system/api/qiNiuContent/synchronize',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'system/api/qiNiuContent',
    method: 'delete',
    data: ids
  })
}

export default { del, download, sync }
