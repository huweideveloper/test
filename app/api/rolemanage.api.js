const urlDict = {
  role_search: '/base/role/search',
  role_nameExit: '/base/role/nameExit',
  role_read: '/base/role/read',
  role_edit: '/base/role/edit',
  role_delete: '/base/role/delete',
  permission_search: '/base/permission/query',
}
var api = {
  role_search: function (value) {
    return this.HttpRequest.POST(urlDict.role_search, value)
  },
  role_nameExit: function (value) {
    return this.HttpRequest.POST(urlDict.role_nameExit, value)
  },
  role_read: function (value) {
    return this.HttpRequest.POST(urlDict.role_read, value)
  },
  role_edit: function (value) {
    return this.HttpRequest.POST(urlDict.role_edit, value)
  },
  role_delete: function (value) {
    return this.HttpRequest.POST(urlDict.role_delete, value)
  },
  permission_search: function (value) {
    return this.HttpRequest.POST(urlDict.permission_search, value)
  }
}
module.exports = api;
