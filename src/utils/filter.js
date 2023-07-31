import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('filesize', function (value) {
  if (value === null || value === undefined) {
    return '-'
  }
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  var i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return value.toFixed(2) + ' ' + units[i]
})
