import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const storageTokenKey = 'EL_ADMIN_COOKIE_TOKEN'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getStorageToken() {
  return localStorage.getItem(storageTokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setStorageToken(token) {
  return localStorage.setItem(storageTokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(storageTokenKey)
  return Cookies.remove(TokenKey)
}
