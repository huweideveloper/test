const urlDict = {
  permissionquery: '/base/permission/query',
  permissioncreate: '/base/permission/create',
    permissionread: '/base/permission/read',
    resourceall: '/base/resource/all',
    permissiondelete: '/base/permission/delete',
    volidatename: '/base/permission/name/volidate',
    update: '/base/permission/update',
}
var api = {
    query: function (value) {
    return this.HttpRequest.POST(urlDict.permissionquery, value)
  },
    permissioncreate: function (value) {
    return this.HttpRequest.POST(urlDict.permissioncreate, value)
  },
    permissionread: function (value) {
    return this.HttpRequest.POST(urlDict.permissionread, value)
  },
    resourceall: function (value) {
    return this.HttpRequest.POST(urlDict.resourceall, value)
  },
    permissiondelete: function (value) {
    return this.HttpRequest.POST(urlDict.permissiondelete, value)
  },
    volidatename: function (value) {
    return this.HttpRequest.POST(urlDict.volidatename, value)
  },
    permissionupdate: function (value) {
        return this.HttpRequest.POST(urlDict.update, value)
    }
}
module.exports = api;
