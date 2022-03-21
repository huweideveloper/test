const urlDict = {
  audit_task_search: '/audit/task/search',
  audit_task_start: '/audit/task/start',
  audit_task_series_needaudit_count: '/audit/task/series/needaudit/count',
  result_export: '/audit/task/series/search/result/export',
  project_search: '/project/search',
  audit_project_name_search: '/audit/project/name/search',
  task_like_query: '/task/like/query',
  queryProjectGroupList: '/group/search'
}
var api = {
    audit_task_search: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_search, value)
    },
    audit_task_start: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_start, value)
    },
    audit_task_series_needaudit_count: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_needaudit_count, value)
    },
    result_export: function(value) {
      return this.HttpRequest.POST(urlDict.result_export, value)
    },
    project_search: function(value) {
      return this.HttpRequest.POST(urlDict.project_search, value)
    },
    audit_project_name_search: function(value) {
      return this.HttpRequest.POST(urlDict.audit_project_name_search, value)
    },
    task_like_query: function(value) {
      return this.HttpRequest.POST(urlDict.task_like_query, value)
    },
    queryProjectGroupList: function (value) {
      return this.HttpRequest.POST(urlDict.queryProjectGroupList, value)
    }  
}
module.exports = api;
