import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'system/api/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'system/api/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'system/api/users',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'system/api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'system/api/users/updatePass/',
    method: 'post',
    data
  })
}

export function resetPwd(ids) {
  return request({
    url: 'system/api/users/resetPwd',
    method: 'put',
    data: ids
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'system/api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del, resetPwd }

