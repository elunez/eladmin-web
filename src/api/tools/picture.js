import request from '@/utils/request'

export function del(ids) {
  return request({
    url: 'api/pictures',
    method: 'delete',
    data: ids
  })
}

export default { del }
