import request from '@/utils/request'

const url = 'https://api.ukshuxi.com/lingke/api/v1'

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

export default {
  getCodeDict,
  sendSmsCode
}
