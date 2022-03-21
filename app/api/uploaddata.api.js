const urlDict = {
  querylist: '/v1/task/search',
  uploadcategory: '/v1/task/image/import',
  readreport: '/v1/task/report/import',
  getdetail: '/v1/task/detail',
  hospitalCode: '/v1/hospital/search',
  modality: '/v1/series/modality/all',
  task_restart: '/v1/task/restart',
  task_stop: '/v1/task/stop',
  convert_detail: '/v1/series/image/convert/detail',
  image_convert: '/v1/task/image/convert',
  import_detail: '/v1/task/import/detail'
}
const transUrl = '/sys/transfer'
let temp={service:'DR'}
var api = {
  querylist: function (value) {
    temp.method = urlDict.querylist
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  uploadcategory: function (value) {
    temp.method = urlDict.uploadcategory
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  readreport: function (value) {
    temp.method = urlDict.readreport
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  getdetail: function (value) {
    temp.method = urlDict.getdetail
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  hospitalCode: function (value) {
    temp.method = urlDict.hospitalCode
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  modality: function (value) {
    temp.method = urlDict.modality
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  task_restart: function (value) {
    temp.method = urlDict.task_restart
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  task_stop: function (value) {
    temp.method = urlDict.task_stop
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  convert_detail: function (value) {
    temp.method = urlDict.convert_detail
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  image_convert: function (value) {
    temp.method = urlDict.image_convert
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  },
  import_detail: function (value) {
    temp.method = urlDict.import_detail
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp )
  }
}
module.exports = api;
