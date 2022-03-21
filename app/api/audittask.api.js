const urlDict = {
  audit_task_search: '/audit/task/search',
  audit_task_clone: '/audit/task/clone',
  audit_task_start: '/audit/task/start',
  audit_task_series_needaudit_count: "/audit/task/series/needaudit/count",
  result_export: '/audit/task/series/search/result/export',
  project_search: '/project/search',
  audit_project_name_search: '/audit/project/name/search',
  task_like_query: '/task/like/query'
}
var api = {
    audit_task_search: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_task_search, data)
    },
    audit_task_clone: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_task_clone, data)
    },
    audit_task_start: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_task_start, data)
    },
    audit_task_series_needaudit_count: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_task_series_needaudit_count, data)
    },
    result_export: function(data) {
      return  this.HttpRequest.POST(urlDict.result_export, data)
    },
    project_search: function(data) {
      return  this.HttpRequest.POST(urlDict.project_search, data)
    },
    audit_project_name_search: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_project_name_search, data)
    },
    task_like_query: function(data) {
      return  this.HttpRequest.POST(urlDict.task_like_query, data)
    }
}
module.exports = api;
