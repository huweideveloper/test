const urlDict = {
  audit_project_edit:'/audit/project/edit',
  auditproject_read:'/audit/project/read',
  queryProjectGroupList: '/group/search'
}
var api = {
    audit_project_edit: function(value) {
      return this.HttpRequest.POST(urlDict.audit_project_edit, value)
    },
    auditproject_read: function(value) {
      return this.HttpRequest.POST(urlDict.auditproject_read, value)
    },
    queryProjectGroupList: function (value) {
      return this.HttpRequest.POST(urlDict.queryProjectGroupList, value)
    }  
}
module.exports = api;
