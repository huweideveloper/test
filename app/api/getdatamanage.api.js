const urlDict = '/sys/transfer'
const transUrl = '/sys/transfer'
let temp={service:'DR'}
var api = {
    data_collection_search: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    data_collection_create: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    data_collection_read: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    data_collection_update: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    data_collection_finishAcquire: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    data_collection_finishUpload: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    data_collection_finishArchive: function(value) {
      return this.HttpRequest.POST(urlDict, value)
    },
    hospital_search: function(value) {
      temp.method = '/v1/hospital/search'
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    task_detail: function(value) {
      temp.method = '/v1/task/detail'
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    }
}
module.exports = api;
