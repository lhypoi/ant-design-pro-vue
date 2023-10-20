import request from '@/utils/request'

// const url = 'https://api.ukshuxi.com/nrl/api/v1'
const url = '/nrl/api/v1'
export const uploadUrl = url + '/file/upload'
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
    url: url + '/workOrder/update/' + id,
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

export function userRegister (parameter) {
  return request({
    url: url + '/user/register',
    method: 'post',
    data: parameter
  })
}

export function userUpdateById (id, parameter) {
  return request({
    url: url + '/user/update/' + id,
    method: 'post',
    data: parameter
  })
}

export function roleListAll (parameter) {
  return request({
    url: url + '/role/listAll',
    method: 'get',
    params: parameter
  })
}

export function userById (id, parameter) {
  return request({
    url: url + '/user/' + id,
    method: 'get',
    params: parameter
  })
}

export function userDeleteById (id, parameter) {
  return request({
    url: url + '/user/delete/' + id,
    method: 'post',
    data: parameter
  })
}

export function userLoginLog (parameter) {
  return request({
    // url: url + '/user/loginLog/lsit',
    url: url + '/user/loginLog/list',
    method: 'get',
    params: parameter
  })
}

export function roomCreate (parameter) {
  return request({
    url: url + '/room/create',
    method: 'post',
    data: parameter
  })
}

export function roomInfo (parameter) {
  return request({
    url: url + '/room/info',
    method: 'get',
    params: parameter
  })
}

export function pointUpdateById (id, parameter) {
  return request({
    url: url + '/point/update/' + id,
    method: 'post',
    data: parameter
  })
}

export function pointCreate (parameter) {
  return request({
    url: url + '/point/create',
    method: 'post',
    data: parameter
  })
}

export function pointDeleteById (id, parameter) {
  return request({
    url: url + '/point/delete/' + id,
    method: 'post',
    data: parameter
  })
}

export function roomDeleteById (id, parameter) {
  return request({
    url: url + '/room/delete/' + id,
    method: 'post',
    data: parameter
  })
}

export function workOrderListDone (parameter) {
  return request({
    url: url + '/workOrder/listDone',
    method: 'get',
    params: parameter
  })
}

export function workOrderDetail (parameter) {
  return request({
    url: url + '/workOrder/detail',
    method: 'get',
    params: parameter
  })
}

export function workOrderUpdateStartCheckById (id, parameter) {
  return request({
    url: url + '/workOrder/updateStartCheck/' + id,
    method: 'post',
    data: parameter
  })
}

export function workOrderUpdateStartAuditById (id, parameter) {
  return request({
    url: url + '/workOrder/updateStartAudit/' + id,
    method: 'post',
    data: parameter
  })
}

export function workOrderUpdateStartReAuditById (id, parameter) {
  return request({
    url: url + '/workOrder/updateStartReAudit/' + id,
    method: 'post',
    data: parameter
  })
}

export function workOrderBatchCheckPoint (parameter) {
  return request({
    url: url + '/workOrder/batchCheckPoint',
    method: 'post',
    data: parameter
  })
}

export function workOrderCheck (parameter) {
  return request({
    url: url + '/workOrder/check',
    method: 'post',
    data: parameter
  })
}

export function workOrderSubmit (parameter) {
  return request({
    url: url + '/workOrder/submit',
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
  workOrderDeleteById,
  userRegister,
  userUpdateById,
  roleListAll,
  userById,
  userDeleteById,
  userLoginLog,
  roomCreate,
  roomInfo,
  pointUpdateById,
  pointCreate,
  pointDeleteById,
  roomDeleteById,
  workOrderListDone,
  workOrderDetail,
  workOrderUpdateStartCheckById,
  workOrderUpdateStartAuditById,
  workOrderUpdateStartReAuditById,
  workOrderBatchCheckPoint,
  workOrderCheck,
  workOrderSubmit
}
