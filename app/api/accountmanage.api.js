const urlDict = {
  user_search: '/base/user/search',
  user_update: '/base/user/update',
  user_read: '/base/user/read',
  user_enable: '/base/user/enable',
  group_search: '/base/user/group/search',
  group_create: '/base/user/group/create',
  group_read: '/base/user/group/read',
  group_update: '/base/user/group/update',
  group_delete: '/base/user/group/delete',
  group_user_edit: '/base/user/group/user/edit',
  base_role_search: '/base/role/search',
}
var api = {
  user_search: function (value) {
    return this.HttpRequest.POST(urlDict.user_search, value)
  },
  user_update1: function (value) {
    return this.HttpRequest.POST(urlDict.user_update, value)
  },
  user_read: function (value) {
    return this.HttpRequest.POST(urlDict.user_read, value)
  },
  user_enable: function (value) {
    return this.HttpRequest.POST(urlDict.user_enable, value)
  },
  group_search: function (value) {
    return this.HttpRequest.POST(urlDict.group_search, value)
  },
  group_create: function (value) {
    return this.HttpRequest.POST(urlDict.group_create, value)
  },
  group_read: function (value) {
    return this.HttpRequest.POST(urlDict.group_read, value)
  },
  group_update: function (value) {
    return this.HttpRequest.POST(urlDict.group_update, value)
  },
  group_delete: function (value) {
    return this.HttpRequest.POST(urlDict.group_delete, value)
  },
  group_user_edit: function (value) {
    return this.HttpRequest.POST(urlDict.group_user_edit, value)
  },
  base_role_search: function (value) {
    return this.HttpRequest.POST(urlDict.base_role_search, value)
  }
}
module.exports = api;
