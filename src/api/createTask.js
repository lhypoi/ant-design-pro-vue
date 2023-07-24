import request from '@/utils/request'

const url = '/createTask'

export function createTask (formData) {
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
