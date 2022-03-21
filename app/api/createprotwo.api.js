const urlDict = {
  querycomponent: '/formComponent/search',
  getcomponentdetail: '/formComponent/read',
  editproject: '/project/edit',
  updateproject: '/project/basic/update',
  projectdetail: '/project/anno/read',
  getmodality: '/series/modality/all',
  isrepeat: '/project/findByName',
  project_basic_read: '/project/basic/read',
  dict_root_child: '/dict/child/query',
  series_count: '/project/series/count',
  field_query: '/sys/transfer',
  queryProjectGroupList: '/group/search'
}
var api = {
  querycomponent: function (value) {
    return this.HttpRequest.POST(urlDict.querycomponent, value)
  },
  getcomponentdetail: function (value) {
    return this.HttpRequest.POST(urlDict.getcomponentdetail, value)
  },
  editproject: function (value) {
    return this.HttpRequest.POST(urlDict.editproject, value)
  },
  projectdetail: function (value) {
    return this.HttpRequest.POST(urlDict.projectdetail, value)
  },
  getmodality: function (value) {
    return this.HttpRequest.POST(urlDict.getmodality, value)
  },
  isrepeat: function (value) {
    return this.HttpRequest.POST(urlDict.isrepeat, value)
  },
  project_basic_read: function (value) {
    return this.HttpRequest.POST(urlDict.project_basic_read, value)
  },
  dict_root_child: function (value) {
    return this.HttpRequest.POST(urlDict.dict_root_child, value)
  },
  series_count: function (value) {
    return this.HttpRequest.POST(urlDict.series_count, value)
  },
  field_query: function (value) {
    return this.HttpRequest.POST(urlDict.field_query, value)
  },
  queryProjectGroupList: function (value) {
    return this.HttpRequest.POST(urlDict.queryProjectGroupList, value)
  }
}
module.exports = api;
