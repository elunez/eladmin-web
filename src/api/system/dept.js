import request from '@/utils/request'
import qs from 'qs'

export function getDepts(params) {
  return request({
    url: 'api/dept',
    method: 'get',
    params
  })
}

export function getDeptSuperior(ids) {
  const params = {
    ids: ids
  }
  return request({
    url: 'api/dept/superior?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/dept',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dept',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dept',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
