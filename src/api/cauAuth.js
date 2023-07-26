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

export function getBucketFileList (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getBucketFileList',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function getFolderBucketFileList (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getFolderBucketFileList',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function getDownloadUrl (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getDownloadUrl',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function getUserTaskList (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getUserTaskList',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function getUserBsp (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getUserBsp',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function getBspStatus (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getBspStatus',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}
