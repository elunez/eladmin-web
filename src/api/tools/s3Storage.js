import request from '@/utils/request'

export function download(id) {
  return request({
    url: 'api/s3Storage/download/' + id,
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: 'api/s3Storage',
    method: 'delete',
    data: ids
  })
}

export default { del, download }
