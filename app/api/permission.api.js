const urlDict = {
  permission_query: '/base/permission/query',
  name_volidate: '/base/permission/name/volidate',
  permission_read: '/base/permission/read',
  permission_create: '/base/permission/create',
  permission_update: '/base/permission/update',
  permission_delete: '/base/permission/delete',
  resource_all: '/base/resource/all',
}
var api = {
  permission_query: function (value) {
    return this.HttpRequest.POST(urlDict.permission_query, value)
  },
  name_volidate: function (value) {
    return this.HttpRequest.POST(urlDict.name_volidate, value)
  },
  permission_read: function (value) {
    return this.HttpRequest.POST(urlDict.permission_read, value)
  },
  permission_create: function (value) {
    return this.HttpRequest.POST(urlDict.permission_create, value)
  },
  permission_update: function (value) {
    return this.HttpRequest.POST(urlDict.permission_update, value)
  },
  permission_delete: function (value) {
    return this.HttpRequest.POST(urlDict.permission_delete, value)
  },
  resource_all: function (value) {
    return this.HttpRequest.POST(urlDict.resource_all, value)
  }
}
module.exports = api;
