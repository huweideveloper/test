
const urlDict = {
  queryTask: '/task/search',
  startTask: '/task/start',
  projectNameSearch: "/project/name/search",
  taskNameSearch: '/task/name/search',
  taskVendorNameSearch: '/vendor/query',
  task_clone: '/task/clone',
  task_end: '/task/end',
  userListSearch: '/user/task/user/list'
}
module.exports = {
  // 查询任务列表
  queryTask (data) {
    return this.HttpRequest.POST(urlDict.queryTask, data)
  },

  // 开始任务
  startTask (id) {
    return this.HttpRequest.POST(urlDict.startTask, {id})
  },

  //查询项目名称
  projectNameSearch (data) {
    return this.HttpRequest.POST(urlDict.projectNameSearch, data)
  },

  // 查询任务名称
  taskNameSearch (data) {
    return this.HttpRequest.POST(urlDict.taskNameSearch, data)
  },

  // 查询所属项目
  taskVendorNameSearch (data) {
    return this.HttpRequest.POST(urlDict.taskVendorNameSearch, data)
  },
  task_clone (data) {
    return this.HttpRequest.POST(urlDict.task_clone, data)
  },
  task_end (data) {
    return this.HttpRequest.POST(urlDict.task_end, data)
  },
  // 查询医生列表
  userListSearch (data) {
    return this.HttpRequest.POST(urlDict.userListSearch, data)
  },
}

