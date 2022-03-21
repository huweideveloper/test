const urlDict = {
  task_search: '/task/user/joinable/search'
}
var api = {
    task_search: function(value) {
      return  this.HttpRequest.POST(urlDict.task_search, value)
    }
}
module.exports = api;
