const urlDict = {
  queryproject: '/project/search',
  queryprojectname: '/project/search',
  startproject: '/project/status/update',
  project_name_search: '/project/name/search',
  queryProjectGroupList: '/group/search',
  project_clone: '/project/clone',
}
var api = {
  queryproject: function (value) {
    return this.HttpRequest.POST(urlDict.queryproject, value)
  },
  queryprojectname: function (value) {
    return this.HttpRequest.POST(urlDict.queryprojectname, value)
  },
  startproject: function (value) {
    return this.HttpRequest.POST(urlDict.startproject, value)
  },
  project_name_search: function (value) {
    return this.HttpRequest.POST(urlDict.project_name_search, value)
  },
  queryProjectGroupList: function (value) {
    return this.HttpRequest.POST(urlDict.queryProjectGroupList, value)
  },
  project_clone: function (value) {
    return this.HttpRequest.POST(urlDict.project_clone, value)
  }
}
module.exports = api;
