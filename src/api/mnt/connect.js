import request from '@/utils/request'

export function testDbConnect(data) {
  return request({
    url: 'api/database/testConnect',
    method: 'post',
    data
  })
}

export function testServerConnect(data) {
  return request({
    url: 'api/serverDeploy/testConnect',
    method: 'post',
    data
  })
}
