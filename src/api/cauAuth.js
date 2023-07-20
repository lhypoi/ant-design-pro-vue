import request from '@/utils/request'

const url = '/cauAuth'

export function getUserInfo (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getUserInfo',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}
