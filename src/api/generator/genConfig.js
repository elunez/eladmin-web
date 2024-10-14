import request from '@/utils/request'

export function get(tableName) {
  return request({
    url: 'system/api/genConfig/' + tableName,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'system/api/genConfig',
    data,
    method: 'put'
  })
}
