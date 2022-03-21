const urlDict = {
  data_request_search: '/sys/transfer',
  data_request_create: '/sys/transfer',
  data_request_read: '/sys/transfer',
  data_request_update: '/sys/transfer',
  data_collection_create: '/sys/transfer',
  hospital_search: '/v1/hospital/search',
}
const transUrl = '/sys/transfer'
let temp={service:'DR'}
var api = {
    data_request_search (value) {
      return this.HttpRequest.POST(urlDict.data_request_search, value)
    },
    data_request_create(value) {
      return this.HttpRequest.POST(urlDict.data_request_create, value)
    },
    data_request_read(value) {
      return this.HttpRequest.POST(urlDict.data_request_read, value)
    },
    data_request_update: function(value) {
      return this.HttpRequest.POST(urlDict.data_request_update, value)
    },
    data_collection_create: function(value) {
      return this.HttpRequest.POST(urlDict.data_collection_create, value)
    },
    hospital_search: function(value) {
      temp.method = urlDict.hospital_search
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    }
}
module.exports = api;
