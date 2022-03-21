const urlDict = {
  task_user_read: '/task/user/read',
  project_basic_read: '/project/basic/read',
  task_join: '/user/task/join'
}
var api = {
    task_user_read: function(value) {
      return this.HttpRequest.POST(urlDict.task_user_read, value)
    },
    project_basic_read: function(value) {
      return this.HttpRequest.POST(urlDict.project_basic_read, value)
    },
    task_join: function(value) {
      return this.HttpRequest.POST(urlDict.task_join, value)
    }
}
module.exports = api;
