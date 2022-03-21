const urlDict = {
  get_data_backwash_result_list: '/alg/sar/get_data_backwash_result_list/search',
  data_backwash_complete: '/alg/sar/data_backwash_complete',
  alg_sar_list_tool: '/alg/sar/list_tool',
  taskDetail: '/task/read',
  user_searchAlgUser: '/user/searchAlgUser',
  updateseries: '/task/series/update',
  searchresult_remove: '/task/series/searchresult/remove',
  projectdetail: '/project/basic/read',
  getproseries: '/project/series/search',
  querytaskseries: '/task/series/search',
  hospitalName: '/sys/transfer',
  task_search: '/task/search',
  task_like_query: '/task/like/query',
  task_series_count: '/task/series/count',
  task_portionAnno: '/task/portionAnno',
  task_series_import_infoList: '/task/series/import/infoList',
  task_read: '/task/read',
}
var api = {
  get_data_backwash_result_list: function (value) {
    return this.HttpRequest.POST(urlDict.get_data_backwash_result_list, value)
  },
  data_backwash_complete: function (value) {
    return this.HttpRequest.POST(urlDict.data_backwash_complete, value)
  },
  alg_sar_list_tool: function (value) {
    return this.HttpRequest.POST(urlDict.alg_sar_list_tool, value)
  },
  taskDetail: function (value) {
    return this.HttpRequest.POST(urlDict.taskDetail, value)
  },
  user_searchAlgUser: function (value) {
    return this.HttpRequest.POST(urlDict.user_searchAlgUser, value)
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
    return this.HttpRequest.POST(urlDict.hospitalName, value)
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
