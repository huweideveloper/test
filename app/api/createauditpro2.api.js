const urlDict = {
  matchrate_edit: '/audit/imgannotool/matchrate/edit',
  auditproject_read: '/audit/project/read'
}
var api = {

    matchrate_edit: function(value) {
      return this.HttpRequest.POST(urlDict.matchrate_edit, value)
    },

    auditproject_read: function(value) {
      return this.HttpRequest.POST(urlDict.auditproject_read, value)
    }
}
module.exports = api;
