const urlDict = {
  login: '/user/login',
  user_resource: '/base/user/resource',
  verifycode: '/user/captcha/verify',
  forgetpwd: '/user/password/forget',
  query: '/dict/child/query'
}
var api = {
  login: function(value) {
    return this.HttpRequest.POST(urlDict.login, value)
  },
  user_resource: function(value) {
    return this.HttpRequest.POST(urlDict.user_resource, value)
  },
  verifycode: function(value) {
    return this.HttpRequest.POST(urlDict.verifycode, value)
  },
  forgetpwd: function(value) {
    return this.HttpRequest.POST(urlDict.forgetpwd, value)
  },
  getQuery: function(value) {
    return this.HttpRequest.POST(urlDict.query, value)
  }
}
module.exports = api;
