const urlDict = {
  createtask: '/task/create',
  updatetask: '/task/update',
  updateseries: '/task/series/update',
  searchresult_remove: '/task/series/searchresult/remove',
  projectdetail: '/project/basic/read',
  getproseries: '/project/series/search',
  querytaskseries: '/task/series/search',
  hospitalName: '/sys/transfer',
  task_search: '/task/search',
  task_like_query: '/task/like/query',
  task_series_count: '/task/series/count',
  task_series_statistics: '/task/series/statistics', // 随访配准的导入数据
  task_portionAnno: '/task/portionAnno',
  task_series_import_infoList: '/task/series/import/infoList',
  task_read: '/task/read',
}
var api = {
    createtask: function(value) {
      return this.HttpRequest.POST(urlDict.createtask, value)
    },
    updateseries: function(value) {
      return this.HttpRequest.POST(urlDict.updateseries, value)
    },
    searchresult_remove: function(value) {
      return this.HttpRequest.POST(urlDict.searchresult_remove, value)
    },
    projectdetail: function(value) {
      return this.HttpRequest.POST(urlDict.projectdetail, value)
    },
    getproseries: function(value) {
      return this.HttpRequest.POST(urlDict.getproseries, value)
    },
    querytaskseries: function(value) {
      return this.HttpRequest.POST(urlDict.querytaskseries, value)
    },
    hospitalName: function(value) {
      return this.HttpRequest.POST(urlDict.hospitalName, value )
    },
    task_search: function(value) {
      return this.HttpRequest.POST(urlDict.task_search, value)
    },
    task_like_query: function(value) {
      return this.HttpRequest.POST(urlDict.task_like_query, value)
    },
    task_series_count: function(value) {
      return this.HttpRequest.POST(urlDict.task_series_count, value)
    },
    task_series_statistics: function(value) {
      return this.HttpRequest.GET(urlDict.task_series_statistics, value)
    },
    task_portionAnno: function(value) {
      return this.HttpRequest.POST(urlDict.task_portionAnno, value)
    },
    task_series_import_infoList: function(value) {
      return this.HttpRequest.POST(urlDict.task_series_import_infoList, value)
    },
    task_read: function(value) {
      return this.HttpRequest.POST(urlDict.task_read, value)
    }
}
module.exports = api;
