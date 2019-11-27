import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/serverDeploy',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/serverDeploy/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/serverDeploy',
    method: 'put',
    data
  })
}

export function testConnect(data) {
  return request({
    url: 'api/serverDeploy/testConnect',
    method: 'post',
    data
  })
}

export default { add, edit, del }
