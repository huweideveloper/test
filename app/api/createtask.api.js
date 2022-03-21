
const urlDict = {
  queryCompany: '/vendor/query',
  queryHospitalName: '/hospital/search',
  queryProject: '/project/venderId/search',
  taskDetail: '/task/read',
  projectDetail: '/project/basic/read',
  updaTetask: '/task/update',
  createTask: '/task/create',
  userCount: '/user/annoable/count',
  user_list: '/vendor/user/list',
}
module.exports = {
  // 查询公司
  queryCompany (value) {
    return this.HttpRequest.POST(urlDict.queryCompany, value)
  },

  // 查询医院
  queryHospitalName (name) {
    return this.HttpRequest.POST(urlDict.queryHospitalName, {name})
  },

  // 查询项目
  queryProject (page, pageSize, name,type,taskId) {
    return this.HttpRequest.POST(urlDict.queryProject, {page, pageSize, name,type,taskId})
  },

  // 任务详情
  taskDetail (id) {
    return this.HttpRequest.POST(urlDict.taskDetail, {id})
  },

  // 项目详情 HttpRequest
  projectDetail (id) {
    return this.HttpRequest.POST(urlDict.projectDetail, {id})
  },

  // 更新任务
  updaTetask (value) {
    return this.HttpRequest.POST(urlDict.updaTetask, value)
  },

  // 创建任务
  createTask (value) {
    return this.HttpRequest.POST(urlDict.createTask, value)
  },

  // 查询人数
  userCount (value) {
    return this.HttpRequest.POST(urlDict.userCount, value)
  },
  user_list (value) {
    return this.HttpRequest.POST(urlDict.user_list, value)
  }
}

