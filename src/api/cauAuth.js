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

export function getBucketFileList (parameter, { isAdmin } = {}) {
  return request({
    url: isAdmin ? '/downloadApiWithoutAuth' : url,
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

export function getFolderBucketFileList (parameter, { isAdmin } = {}) {
  return request({
    url: isAdmin ? '/downloadApiWithoutAuth' : url,
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

export function getDownloadUrl (parameter, { isAdmin } = {}) {
  return request({
    url: isAdmin ? '/downloadApiWithoutAuth' : url,
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

export function getBreedList (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getBreedList',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function querySNPData (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'querySNPData',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function searchMainData (parameter) {
  return request({
    url: '/mainSearch',
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'searchMainData',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}

export function getDownloadRecord (parameter) {
  return request({
    url,
    method: 'post',
    data: {
      body: parameter,
      header: {
        serviceCode: 'getDownloadRecord',
        reqTime: (new Date()).toISOString()
      }
    }
  })
}
