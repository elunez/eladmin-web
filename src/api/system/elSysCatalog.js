import request from '@/utils/request'

export function getCatalogTree(params) {
  return request({
    url: 'api/elSysCatalog/tree',
    method: 'get',
    params
  })
}

export function buildCatalog() {
  return request({
    url: 'api/elSysCatalog/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/elSysCatalog',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/elSysCatalog/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/elSysCatalog',
    method: 'put',
    data
  })
}

export default { add, edit, del, getCatalogTree }
