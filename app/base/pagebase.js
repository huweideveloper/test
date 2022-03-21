function pagesBase() {
  var that = this
  this.app = null
  this.dom = ES.selctorDoc("#content #right-content")
  this.init = function(app, api, dom) {
    that.app = app
    that.api = api || null
    that.dom = dom || ES.selctorDoc("#content #right-content")
    that.complete()
  }
  this.complete = function() {}

  //获取昨天今天明天数据
  this.GetDateStr = function(AddDayCount) {
    var dd = new Date()
    dd.setDate(dd.getDate() + AddDayCount) //获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1 //获取当前月份的日期
    var d = dd.getDate()
    return y + "/" + m + "/" + d
  }

  //6-20个匹配中文 数字和小数点
  this.isNum = function(str) {
    var reg = /^\d+(\.\d+)?$/
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  }

  //6-20个匹配中文 数字 字母 下划线
  this.isName = function(str) {
    var reg = /^[\w\u4e00-\u9fa5]+$/gi
    var len = str.replace(/[^x00-xFF]/g, "**").length
    if (reg.test(str) && len <= 20 && len >= 6) {
      return true
    } else {
      return false
    }
  }
  this.dispose = function() {}
  this.resize = function() {}
}

module.exports = pagesBase
