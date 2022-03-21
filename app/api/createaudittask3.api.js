const urlDict = {
  audit_task_read: '/audit/task/read',
  audit_task_update: '/audit/task/update',
  vendor_audit_query: '/vendor/query',
  user_count: '/user/annoable/count',
  user_list: '/vendor/user/list',

}
var api = {
    audit_task_read: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_read, value)
    },
    audit_task_update: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_update, value)
    },
    vendor_audit_query: function(value) {
      return this.HttpRequest.POST(urlDict.vendor_audit_query, value)
    },
  user_count: function(value) {
    return this.HttpRequest.POST(urlDict.user_count, value)
  },
  user_list: function(value) {
      return this.HttpRequest.POST(urlDict.user_list, value)
    }
}
module.exports = api;
