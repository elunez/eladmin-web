import request from '@/utils/request'

export function getMenusTree(pid) {
  return request({
    url: 'api/menus/lazy?pid=' + pid,
    method: 'get'
  })
}

export function getMenus(params) {
  return request({
    url: 'api/menus',
    method: 'get',
    params
  })
}

export function getMenuSuperior(ids) {
  const data = Array.isArray(ids) || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/menus/superior',
    method: 'post',
    data
  })
}

export function getChild(id) {
  return request({
    url: 'api/menus/child?id=' + id,
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: 'api/menus/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/menus',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/menus',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/menus',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus, getChild }
