const urlDict = {
  task_read: '/task/user/read',
  project_basic_read: '/project/basic/read',
  task_user_series_search: '/task/user/series/search',
  import_complete: '/alg/sar/import_complete',
  project_anno_read: '/project/anno/read'
}
var api = {
  task_read: function (value) {
    return this.HttpRequest.POST(urlDict.task_read, value)
  },
  project_basic_read: function (value) {
    return this.HttpRequest.POST(urlDict.project_basic_read, value)
  },
  task_user_series_search: function (value) {
    return this.HttpRequest.POST(urlDict.task_user_series_search, value)
  },
  import_complete: function (value) {
    return this.HttpRequest.POST(urlDict.import_complete, value)
  },
  project_anno_read: function (value) {
    return this.HttpRequest.POST(urlDict.project_anno_read, value)
  },
}
module.exports = api;
