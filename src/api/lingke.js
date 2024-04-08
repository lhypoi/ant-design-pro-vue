import request from '@/utils/request'

const url = 'https://api.ukshuxi.com/lgk/api/v1'
// const url = '/lingke/api/v1'
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

export function adminLogin (parameter) {
  return request({
    url: url + '/admin/login',
    method: 'post',
    data: parameter
  })
}

export function getUserInfo () {
  return request({
    url: url + '/user/info',
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

export function orderUpdate (parameter) {
  return request({
    url: url + '/order/update',
    method: 'post',
    data: parameter
  })
}

export function teacherGetAccount (parameter) {
  return request({
    url: url + '/teacher/getAccount',
    method: 'post',
    data: parameter
  })
}

export function orderTotal (parameter) {
  return request({
    url: url + '/order/total',
    method: 'post',
    data: parameter
  })
}

export function withdrawalCreate (parameter) {
  return request({
    url: url + '/withdrawal/create',
    method: 'post',
    data: parameter
  })
}

export function withdrawalGetList (parameter) {
  return request({
    url: url + '/withdrawal/getList',
    method: 'post',
    data: parameter
  })
}

export function organizationSignup (parameter) {
  return request({
    url: url + '/organization/signup',
    method: 'post',
    data: parameter
  })
}

export function teacherGetList (parameter) {
  return request({
    url: url + '/teacher/getList',
    method: 'post',
    data: parameter
  })
}

export function teacherGetOptions (parameter) {
  return request({
    url: url + '/teacher/getOptions',
    method: 'post',
    data: parameter
  })
}

export function orderCreate (parameter) {
  return request({
    url: url + '/order/create',
    method: 'post',
    data: parameter
  })
}

export function orderOrganizationOrderList (parameter) {
  return request({
    url: url + '/order/organization/orderList',
    method: 'post',
    data: parameter
  })
}

export function orderTeacherOrderTotal (parameter) {
  return request({
    url: url + '/order/teacher/orderTotal',
    method: 'post',
    data: parameter
  })
}

export function orderTeacherOrderList (parameter) {
  return request({
    url: url + '/order/teacher/orderList',
    method: 'post',
    data: parameter
  })
}

export function orderOrganizationOrderTotal (parameter) {
  return request({
    url: url + '/order/organization/orderTotal',
    method: 'post',
    data: parameter
  })
}

export function organizationGetOne (parameter) {
  return request({
    url: url + '/organization/getOne',
    method: 'post',
    data: parameter
  })
}

export function organizationUpdate (parameter) {
  return request({
    url: url + '/organization/update',
    method: 'post',
    data: parameter
  })
}

export function organizationChangePasswd (parameter) {
  return request({
    url: url + '/organization/changePasswd',
    method: 'post',
    data: parameter
  })
}

export function teacherChangePasswd (parameter) {
  return request({
    url: url + '/teacher/changePasswd',
    method: 'post',
    data: parameter
  })
}

export function organizationGetList (parameter) {
  return request({
    url: url + '/organization/getList',
    method: 'post',
    data: parameter
  })
}

export function adminAuditOrganization (parameter) {
  return request({
    url: url + '/admin/auditOrganization',
    method: 'post',
    data: parameter
  })
}

export function teacherChangeEmail (parameter) {
  return request({
    url: url + '/teacher/changeEmail',
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
  orderUpdate,
  teacherGetAccount,
  orderTotal,
  withdrawalCreate,
  withdrawalGetList,
  organizationSignup,
  teacherGetList,
  teacherGetOptions,
  orderCreate,
  orderOrganizationOrderList,
  orderTeacherOrderTotal,
  orderTeacherOrderList,
  orderOrganizationOrderTotal,
  organizationGetOne,
  organizationUpdate,
  organizationChangePasswd,
  teacherChangePasswd,
  adminLogin,
  organizationGetList,
  adminAuditOrganization,
  teacherChangeEmail
}
