import request from '@/utils/request'

export function get() {
  return request({
    url: 'system/api/aliPay',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'system/api/aliPay',
    data,
    method: 'put'
  })
}

// 支付
export function toAliPay(url, data) {
  return request({
    url: 'system/api/' + url,
    data,
    method: 'post'
  })
}
