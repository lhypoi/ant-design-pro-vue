import request from '@/utils/request'

const url = '/createBsp'

export function createBsp (formData) {
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
