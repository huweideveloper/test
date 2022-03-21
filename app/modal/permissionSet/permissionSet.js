require("./permissionSet.less")
class roleModal extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "permissionSet"
    this.roleScroll = null
  }
  complete() {
    let that = this
    this.initView()
    if (that.api.type == "EDIT") {
      that.dom.find(".modal-title").html("修改权限")
    }
    this.dom.find(".roleList").on("click", e => {
      let dom = ES.selctorDoc(e.target)
      this.dom.find(".actionUl").remove()
      if (
        e.target.className.lastIndexOf("check-box") !== -1 &&
        e.target.className.lastIndexOf("allChoose") == -1
      ) {
        if (!dom.hasClass("choose")) {
          dom.addClass("choose")
          dom
            .parent()
            .parent()
            .parent()
            .find(".allChoose")
            .addClass("choose")
        } else {
          dom.removeClass("choose")
        }
        return
      }
      if (e.target.className.lastIndexOf("allChoose") !== -1) {
        if (!dom.hasClass("choose")) {
          dom
            .parent()
            .parent()
            .find(".check-box")
            .addClass("choose")
        } else {
          dom
            .parent()
            .parent()
            .find(".check-box")
            .removeClass("choose")
        }
      }
    })
    this.setData()
  }
  setData(value) {
    let that = this
    let tempHtml = ""
    this.api.data[0].forEach(v => {
      let str = '<div class="actionArea">'
      if (this.api.data[v.id]) {
        this.api.data[v.id].forEach((action, index) => {
          str +=
            '<p class="actionItem" did="' +
            action.id +
            '" title="' +
            action.name +
            '"><i class="check-box"></i><span>' +
            action.name +
            "</span></p>"
        })
      }
      str += "</div>"
      tempHtml +=
        '<li class="permissions" did="' +
        v.id +
        '"><p class="pageItem" title="' +
        v.name +
        '" did="' +
        v.id +
        '"><i class="check-box allChoose"></i><span class="perName">' +
        v.name +
        "</span></p> " +
        str +
        "</li>"
    })
    this.dom.find(".roleScroll").append(tempHtml)
    this.initscroll(this.roleScroll, "roleList")
  }
  initView() {
    let that = this
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".btn-cancel").on("click", function() {
      that.close()
    })
    this.dom.find(".inputBox").on("blur", function() {
      that.event._dispatch("roleModal.roleName", {
        name: ES.selctorDoc(this).val()
      })
    })
    this.dom.find(".btn-confirm").on("click", () => {
      that.dom.find(".inputLine").dom.forEach(function(val, idx) {
        val.find("." + val.attr("redlabel")).removeClass("redborder")
        val.find(".required").remove()
        if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
          val.find("." + val.attr("redlabel")).addClass("redborder")
          val
            .find("." + val.attr("redlabel"))
            .after(
              '<span class="required">' +
                Tool.checkForm(ES.selctorDoc(val).dom, "red") +
                "</span>"
            )
        }
      })
      if (that.dom.find(".redborder").dom) {
        return false
      } else {
        let apidata = {
          name: this.dom.find('.inputBox[api="name"]').val(),
          resourceIdList: []
        }
        if (this.dom.find(".roleList .choose").dom) {
          this.dom.find(".roleList .choose").dom.forEach(v => {
            apidata.resourceIdList.push(v.parent().attr("did") * 1)
          })
        }
        that.event._dispatch("roleModal.submit", apidata)
      }
    })
  }
  renderData(data) {
    data.pageResourceList.forEach(v => {
      this.dom
        .find('.roleList li p[did="' + v.id + '"] .check-box')
        .addClass("choose")
    })
    this.dom.find('.inputBox[api="name"]').val(data.name)
  }
  showError(msg) {
    this.dom
      .find(".inputBox")
      .after('<span class="required">' + msg + "</span>")
    this.dom.find(".inputBox").addClass("redborder")
  }
  initscroll(scroll, classname) {
    if (this.roleScroll) {
      this.roleScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find("." + classname).attr("id", rid)
    this.roleScroll = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      scrollX: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: "scale",
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    })
  }
}
//原型链一定要有的
module.exports = roleModal
