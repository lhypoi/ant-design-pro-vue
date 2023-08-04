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

export default {
  uploadUrl,
  getCodeDict,
  sendSmsCode,
  teacherSignup
}
