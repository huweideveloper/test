const urlDict = {
  dict_create: '/dict/create',
  dict_update: '/dict/update',
  dict_search: '/dict/search'
}
var api = {
    dict_create: function (value) {
      return this.HttpRequest.POST(urlDict.dict_create, value,api.app.domain3)
    },
    dict_update: function (value) {
      return this.HttpRequest.POST(urlDict.dict_update, value,api.app.domain3)
    },
    dict_search: function (value) {
      return this.HttpRequest.POST(urlDict.dict_search, value,api.app.domain3)
    }
}
module.exports = api;
