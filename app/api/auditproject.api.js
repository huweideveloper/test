const urlDict = {
  audit_project_search: '/audit/project/search',
  project_name_search: '/project/name/search',
  starttask: "/task/start",
  name: '/task/search',
  projectId: '/project/search',
  project_status_update: '/audit/project/status/update',
  audit_project_clone: '/audit/project/clone',
  audit_project_name_search: '/audit/project/name/search',
  queryProjectGroupList: '/group/search'
}
var api = {
    audit_project_search(data) {
      return  this.HttpRequest.POST(urlDict.audit_project_search, data)
    },
    project_name_search: function(data) {
      return  this.HttpRequest.POST(urlDict.project_name_search, data)
    },
    starttask: function(data) {
      return  this.HttpRequest.POST(urlDict.starttask, data)
    },
    name: function(data) {
      return  this.HttpRequest.POST(urlDict.name, data)
    },
    projectId: function(data) {
      return  this.HttpRequest.POST(urlDict.projectId, data)
    },
    project_status_update: function(data) {
      return  this.HttpRequest.POST(urlDict.project_status_update, data)
    },
    audit_project_clone: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_project_clone, data)
    },
    audit_project_name_search: function(data) {
      return  this.HttpRequest.POST(urlDict.audit_project_name_search, data)
    },
    queryProjectGroupList: function (value) {
      return this.HttpRequest.POST(urlDict.queryProjectGroupList, value)
    }  
}
module.exports = api;
