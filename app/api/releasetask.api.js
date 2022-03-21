const urlDict = {
  querytask: '/task/search',
  task_release: '/ops/task/release',
  project_name_search: '/project/name/search',
  task_name_search: '/task/name/search',
  task_belongsUserList: '/task/belongsUserList',
  task_vendorName_search: '/vendor/query'
}
var api = {
    querytask: function(value) {
      return this.HttpRequest.POST(urlDict.querytask, value)
    },
    task_release: function(value) {
      return this.HttpRequest.POST(urlDict.task_release, value)
    },
    project_name_search: function(value) {
      return this.HttpRequest.POST(urlDict.project_name_search, value)
    },
    task_name_search: function(value) {
      return this.HttpRequest.POST(urlDict.task_name_search, value)
    },
    task_belongsUserList: function(value) {
      return this.HttpRequest.POST(urlDict.task_belongsUserList, value)
    },
    task_vendorName_search: function(value) {
      return this.HttpRequest.POST(urlDict.task_vendorName_search, value)
    }
}
module.exports = api;
