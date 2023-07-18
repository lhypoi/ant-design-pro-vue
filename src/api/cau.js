import request from '@/utils/request'

const url = '/cau'

export function sendMailCode (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'sendMailCode',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}
