import request from '@/utils/request'

const url = 'https://api.ukshuxi.com/nrl/api'
// const url = '/nrl/api'
export const uploadUrl = url + '/base/uploadFile'
export const downloadBaseUrl = url + '/base/download'
export const tempFileBaseUrl = url + '/temp'

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

export function orderGetOne (parameter) {
  return request({
    url: url + '/order/getOne',
    method: 'post',
    data: parameter
  })
}

export function teacherUpdate (parameter) {
  return request({
    url: url + '/teacher/update',
    method: 'post',
    data: parameter
  })
}

// new
export function userInfo () {
  return request({
    url: url + '/user/info',
    method: 'get'
  })
}

export function roomList (parameter) {
  return request({
    url: url + '/room/list',
    method: 'get',
    params: parameter
  })
}

export function roomUpdateById (id, parameter) {
  return request({
    url: url + '/room/update/' + id,
    method: 'post',
    data: parameter
  })
}

export function userList (parameter) {
  return request({
    url: url + '/user/list',
    method: 'get',
    params: parameter
  })
}

export function dictInfo (parameter) {
  return request({
    url: url + '/dict/info',
    method: 'get',
    params: parameter
  })
}

export function workOrderList (parameter) {
  return request({
    url: url + '/workOrder/list',
    method: 'get',
    params: parameter
  })
}

export function workOrderTotal (parameter) {
  return request({
    url: url + '/workOrder/total',
    method: 'get',
    params: parameter
  })
}

export function workOrderInfo (parameter) {
  return request({
    url: url + '/workOrder/info',
    method: 'get',
    params: parameter
  })
}

export function roomAll (parameter) {
  return request({
    url: url + '/room/all',
    method: 'get',
    params: parameter
  })
}

export function roomUserInfoById (id, parameter) {
  return request({
    url: url + '/room/userInfo/' + id,
    method: 'get',
    params: parameter
  })
}

export function workOrderUpdateInfoById (id, parameter) {
  return request({
    url: url + '/workOrder/update/updateInfo/' + id,
    method: 'post',
    data: parameter
  })
}

export function workOrderCreate (parameter) {
  return request({
    url: url + '/workOrder/create',
    method: 'post',
    data: parameter
  })
}

export function workOrderDeleteById (id, parameter) {
  return request({
    url: url + '/workOrder/delete/' + id,
    method: 'post',
    data: parameter
  })
}

export default {
  uploadUrl,
  downloadBaseUrl,
  tempFileBaseUrl,
  getCodeDict,
  sendSmsCode,
  teacherSignup,
  login,
  getUserInfo,
  orderGetList,
  teacherGetOne,
  orderGetOne,
  teacherUpdate,
  userInfo,
  roomList,
  roomUpdateById,
  userList,
  dictInfo,
  workOrderList,
  workOrderTotal,
  workOrderInfo,
  roomAll,
  roomUserInfoById,
  workOrderUpdateInfoById,
  workOrderCreate,
  workOrderDeleteById
}
