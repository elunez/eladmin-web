import request from '@/utils/request'

export function generator(data, tableCode,tableName) {
  return request({
    url: 'api/generator?tableCode=' + tableCode+"&tableName="+tableName,
    data,
    method: 'post'
  })
}
