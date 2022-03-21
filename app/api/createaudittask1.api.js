const urlDict = {
  audit_task_create: '/audit/task/create',
  audit_task_update: '/audit/task/update',
  audit_project_name_search: '/audit/project/name/venderId/search',
  audit_task_read: '/audit/task/read'
}
var api = {
    audit_task_create: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_create, value)
    },
    audit_task_update: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_update, value)
    },
    audit_project_name_search: function(value) {
      return this.HttpRequest.POST(urlDict.audit_project_name_search, value)
    },
    audit_task_read: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_read, value)
    }
}
module.exports = api;
