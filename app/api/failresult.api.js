const urlDict = {
  error_search: '/v1/ops/alg/error/search'
}
const transUrl = '/sys/transfer'
let temp = { service: 'DR' }
var api = {
  error_search: function (value) {
    temp.method = urlDict.error_search
    temp.params = JSON.stringify(value)
    return this.HttpRequest.POST(transUrl, temp)
  }
}
module.exports = api;
