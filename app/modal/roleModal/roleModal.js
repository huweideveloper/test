require("./roleModal.less")
class roleModal extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "roleModal"
    this.roleScroll = null
  }
  complete() {
    let that = this
    this.initView()
    if (that.api.type == "EDIT") {
      that.dom.find(".modal-title").html("修改角色")
    }
    this.dom.find(".roleList").on("mouseover", e => {
      let dom = ES.selctorDoc(e.target).parent()
      this.dom.find(".actionUl").remove()
      if (e.target.className.lastIndexOf("perName") !== -1) {
        let itemdata = this.api.data[dom.attr("did")].data
        let temp = ""
        itemdata[0].forEach(v => {
          temp += "<li>" + v.name
          if (itemdata[v.id]) {
            temp += "("
            let len = itemdata[v.id].length
            itemdata[v.id].forEach((item, index) => {
              temp += item.name
              if (index !== len - 1) {
                temp += ","
              }
            })
            temp += ")"
          }
          temp += "</li>"
        })
        let html = '<ul class="actionUl">' + temp + "</ul>"
        dom.append(html)
      }
    })
    this.dom.find(".roleList").on("click", e => {
      let dom = ES.selctorDoc(e.target)
      this.dom.find(".actionUl").remove()
      if (e.target.className.lastIndexOf("check-box") !== -1) {
        if (!dom.hasClass("choose")) {
          dom.addClass("choose")
        } else {
          dom.removeClass("choose")
        }
      }
    })
    this.setData()
  }
  setData(value) {
    let that = this
    let tempHtml = ""
    for (let i in this.api.data) {
      tempHtml +=
        '<li class="permissions" did="' +
        i +
        '"><i class="check-box"></i><span class="perName">' +
        this.api.data[i].name +
        "</span></li>"
    }
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
          permissionIdList: []
        }
        if (this.dom.find(".roleList .choose").dom) {
          this.dom.find(".roleList .choose").dom.forEach(v => {
            apidata.permissionIdList.push(v.parent().attr("did") * 1)
          })
        }
        that.event._dispatch("roleModal.submit", apidata)
      }
    })
  }
  renderData(data) {
    data.permissionList.forEach(v => {
      this.dom
        .find('.roleList li[did="' + v.permissionId + '"] .check-box')
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
    if (scroll) {
      scroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc("." + classname).attr("id", rid)
    scroll = new IScroll("#" + rid, {
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
