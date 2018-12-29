import request from '@/utils/request'

export function queryLoan() {
  return request({
    url: 'api/loan',
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/api/loan/' + id,
    method: 'get'
  })
}
export function getRepay(query) {
  return request({
    url: '/api/loan/queryLoanRepay',
    method: 'get',
    params: query
  })
}
export function updateLoanRepay(loanRepayList, excessAmount, isAdvance) {
  return request({
    url: '/api/loan/updateLoanRepay',
    method: 'post',
    params: { excessAmount: excessAmount, isAdvance: isAdvance, loanRepayList: JSON.stringify(loanRepayList) }
  })
}
export function queryFile(applyId) {
  return request({
    url: '/api/loan/queryHead/' + applyId,
    method: 'get'
  })
}
export function deleteFile(fileId) {
  return request({
    url: '/api/loan/deleteHead/' + fileId,
    method: 'get'
  })
}
