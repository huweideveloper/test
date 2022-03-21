const urlDict = {
  audit_task_read: '/audit/task/read',
  audit_task_user_list: '/audit/task/user/list',
  audit_task_user_series_search: '/audit/task/user/series/search',
  series_result_task_join: '/audit/project/series/result/task/join'
}
var api = {
    audit_task_read: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_read, value)
    },
    audit_task_user_list: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_user_list, value)
    },
    audit_task_user_series_search: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_user_series_search, value)
    },
    series_result_task_join: function(value) {
      return this.HttpRequest.POST(urlDict.series_result_task_join, value)
    }
}
module.exports = api;
