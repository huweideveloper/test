class pagesBase {
  constructor(app, api, dom, model, cash) {
    this.app = app
    this.api = api || null
    this.dom = dom || ES.selctorDoc("#content #right-content")
    this.model = model || null
    this.cash = cash || false
    this.styleModel(0)
    this.complete()
  }
  complete() {}
  dispose() {}
  resize() {}
  styleModel(type) {
    //设置样式
    ES.selctorDoc("#header")
      .find(".header")
      .removeClass("yisheng")
    switch (type) {
      case 0:
        ES.selctorDoc("#menu").show()
        ES.selctorDoc("#bottom").show()
        ES.selctorDoc("#content").css({
          marginLeft: 200
        })
        break
      case 1:
        // 在这种情况下把 做测量菜单隐藏
        ES.selctorDoc("#menu").hide()
        ES.selctorDoc("#header")
          .find(".header")
          .addClass("yisheng")
        ES.selctorDoc("#content").css({
          marginLeft: "unset"
        })
        break
    }
  }
  /**
   * 在某个模块内判断是否有目标权限
   * @param {string} moduleType 在哪个模块内
   * @param {string} targetPermissions 目标权限
   * @returns {boolean} 是否有权限
  */
  checkPermission(moduleType, targetPermissions) {
    if ('string' === typeof moduleType && 'string' === typeof targetPermissions) {
      const moduleTypeId = ES.selctorDoc(`.menu .twolink[link="${moduleType}"]`).parent().attr("id")
      // console.log(`moduleTypeId`, moduleTypeId)
      const modulePermissionArr = this.app.userResource[moduleTypeId]
      // console.log(`modulePermissionArr`, modulePermissionArr)
      if (!modulePermissionArr) return false
      const hasPermission = modulePermissionArr.some(({ type }) => targetPermissions.trim().includes(type))
      return hasPermission
    } else {
      return false
    }
  }
}

window.Interstellar = window.Interstellar || {}
window.Interstellar.pagesBase = window.Interstellar.pagesBase || pagesBase


window.debounce = function(fn, wait){
  let timer;
  return function(){
    let _this = this, args = arguments;
    if( timer ) clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(_this, args);
      clearTimeout(timer);
    }, wait || 300)
  }
}

module.exports = pagesBase
