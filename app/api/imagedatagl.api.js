const urlDict = {
  hospitalCode: '/v1/hospital/search',
  bodyPart: '/v1/series/bodyPartExamined/all',
  modality: '/v1/series/modality/all',
  getpaishu: '/v1/device/row/search/empty',
  updatepaishu: '/v1/device/row/update',
  queryseries: '/v1/series/search',
  download: '/v1/series/export'
}
const transUrl = '/sys/transfer'
let temp={service:'DR'}
var api = {
    hospitalCode: function(value) {
      temp.method = urlDict.hospitalCode
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    bodyPart: function(value) {
      temp.method = urlDict.bodyPart
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    modality: function(value) {
      temp.method = urlDict.modality
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    getpaishu: function(value) {
      temp.method = urlDict.getpaishu
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    updatepaishu: function(value) {
      temp.method = urlDict.updatepaishu
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    queryseries: function(value) {
      temp.method = urlDict.queryseries
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    download: function(value) {
      temp.method = urlDict.download
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    }
}
module.exports = api;
