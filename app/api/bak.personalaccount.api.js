const urlDict = {
  task_completed: '/user/task/completed',
  task_current: '/user/task/current'
}
var api = {
    task_completed: function(value) {
      return this.HttpRequest.POST(urlDict.task_completed, value)
    },
    task_current: function(value) {
      return this.HttpRequest.POST(urlDict.task_current, value)
    }
}
module.exports = api;
