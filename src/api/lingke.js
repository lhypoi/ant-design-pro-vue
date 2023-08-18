import request from '@/utils/request'

const url = 'https://api.ukshuxi.com/lingke/api/v1'
export const uploadUrl = url + '/base/uploadFile'

export function getCodeDict () {
  return request({
    url: url + '/base/getCodeDict',
    method: 'get'
  })
}

export function sendSmsCode (parameter) {
  return request({
    url: url + '/base/sendSmsCode',
    method: 'post',
    data: parameter
  })
}

export function teacherSignup (parameter) {
  return request({
    url: url + '/teacher/signup',
    method: 'post',
    data: parameter
  })
}

export function login (parameter) {
  return request({
    url: url + '/user/login',
    method: 'post',
    data: parameter
  })
}

export function getUserInfo () {
  return request({
    url: url + '/base/getUserInfo',
    method: 'get'
  })
}

export function orderGetList (parameter) {
  return request({
    url: url + '/order/getList',
    method: 'post',
    data: parameter
  })
}

export function teacherGetOne (parameter) {
  return request({
    url: url + '/teacher/getOne',
    method: 'post',
    data: parameter
  })
}

export default {
  uploadUrl,
  getCodeDict,
  sendSmsCode,
  teacherSignup,
  login,
  getUserInfo,
  orderGetList,
  teacherGetOne
}
