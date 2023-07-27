import request from '@/utils/request'

const url = '/exportDownload'

export function exportDownload (parameter) {
  return request({
    url,
    method: 'post',
    responseType: 'blob',
    data: parameter
  })
}
