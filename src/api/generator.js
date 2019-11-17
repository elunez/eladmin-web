import request from '@/utils/request'

// export function getAllTable() {
//   return request({
//     url: 'api/generator?tableName=' + tableName,
//     data,
//     method: 'post'
//   })
// }

export function generator(data, tableName) {
  return request({
    url: 'api/generator?tableName=' + tableName,
    data,
    method: 'post'
  })
}

export function save(data) {
  return request({
    url: 'api/generator',
    data,
    method: 'put'
  })
}

