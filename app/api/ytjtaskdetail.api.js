const urlDict = {
  gettask: '/task/user/list',
  getuserseries: '/task/user/series/search',
  task_read: '/task/read'

}
var api = {
  gettask: function (value) {
    return this.HttpRequest.POST(urlDict.gettask, value)
  },
  getuserseries: function (value) {
    return this.HttpRequest.POST(urlDict.getuserseries, value)
  },
  task_read: function (value) {
    return this.HttpRequest.POST(urlDict.task_read, value)
  }
}
module.exports = api;
