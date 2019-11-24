import request from '@/utils/request'

/**
 * 部署管理
 * @param data
 */
export function add(data) {
  return request({
    url: 'api/deployHistory',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/deployHistory/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/deployHistory',
    method: 'put',
    data
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
