import request from '@/utils/request'

export function del(id) {
  return request({
    url: 'api/deployHistory/' + id,
    method: 'delete'
  })
}

/**
 * 版本回退
 * @param data 选中行
 */
export function reducte(data) {
  return request({
    url: 'api/deploy/serverReduction',
    method: 'post',
    data
  })
}
