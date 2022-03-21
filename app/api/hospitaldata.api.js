const urlDict = {
  hospital_search: '/hospital/search',
  hospital_create: '/hospital/create',
  hospital_update: '/hospital/update',
  code_max: '/hospital/code/max'
}
var api = {
    hospital_search: function(value) {
      return this.HttpRequest.POST(urlDict.hospital_search, value ,api.app.domain)
    },
    hospital_create: function(value) {
      return this.HttpRequest.POST(urlDict.hospital_create, value ,api.app.domain)
    },
    hospital_update: function(value) {
      return this.HttpRequest.POST(urlDict.hospital_update, value ,api.app.domain)
    },
    code_max: function(value) {
      return this.HttpRequest.POST(urlDict.code_max, value ,api.app.domain)
    }
}
module.exports = api;
