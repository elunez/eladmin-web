import request from '@/utils/request'

export function queryServerAccount(data) {
  return request({
    url: 'api/serverAccount',
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/serverAccount',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/serverAccount/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/serverAccount',
    method: 'put',
    data
  })
}
