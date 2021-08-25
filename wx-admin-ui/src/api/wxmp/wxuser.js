/*
MIT License

Copyright (c) 2020 www.joolun.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/wxuser/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/wxuser',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/wxuser/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/wxuser/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/wxuser',
    method: 'put',
    data: obj
  })
}

export function synchroWxUser(obj) {
  return request({
    url: '/wxuser/synchron',
    method: 'post',
    data: obj
  })
}

export function updateRemark(obj) {
  return request({
    url: '/wxuser/remark',
    method: 'put',
    data: obj
  })
}

export function tagging(obj) {
  return request({
    url: '/wxuser/tagid-list',
    method: 'put',
    data: obj
  })
}
