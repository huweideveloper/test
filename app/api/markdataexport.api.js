const urlDict = {
  getlist: '/task/search',
  queryproject: '/project/basic/read',
  project_name_search: '/project/name/search',
  task_name_search: '/task/name/search',
  queryProjectGroupList: '/group/search'
}
var api = {
    getlist: function(value) {
      return this.HttpRequest.POST(urlDict.getlist, value)
    },
    queryproject: function(value) {
      return this.HttpRequest.POST(urlDict.queryproject, value)
    },
    project_name_search: function(value) {
      return this.HttpRequest.POST(urlDict.project_name_search, value)
    },
    task_name_search: function(value) {
      return this.HttpRequest.POST(urlDict.task_name_search, value)
    },
    queryProjectGroupList: function (value) {
      return this.HttpRequest.POST(urlDict.queryProjectGroupList, value)
    }  
}
module.exports = api;
