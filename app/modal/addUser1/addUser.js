require("./addUser.less")

class addUser extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "addUser"
  }

  complete() {
    let that = this
    this.initView()
    if (that.api.title) {
      that.dom.find(".modal-title").html(that.api.title)
    }
    if (this.api.type == "EDIT") {
      that.dom.find(".modal-title").html("修改用户")
      this.dom
        .find(".top")
        .css({ "pointer-events": "none", cursor: "not-allowed" })
      this.dom.find(".modal-body").on("click", e => {
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
    } else if (this.api.type == "READ") {
      that.dom.find(".modal-title").html("查看用户")
      this.dom
        .find(".top")
        .css({ "pointer-events": "none", cursor: "not-allowed" })
    }
    this.dom.find(".roleList").on("mouseover", e => {
      let dom = ES.selctorDoc(e.target).parent()
      this.dom.find(".actionUl").remove()
      if (e.target.className.lastIndexOf("perName") !== -1) {
        let itemdata = this.api.data
        let temp = ""
        if (itemdata.length > 0) {
          itemdata.forEach(v => {
            if (v.id == dom.attr("did")) {
              v.permissionList.forEach((item, index) => {
                temp += "<li>" + item.permissionName
                if (item.resourceList.length > 0) {
                  temp += "("
                  item.resourceList.forEach(action => {
                    temp += action.resourceCode.toString()
                  })
                  temp += ")"
                }
                temp += "</li>"
              })
            }
          })
        }
        let html = '<ul class="actionUl">' + temp + "</ul>"
        dom.append(html)
      }
    })
    this.setData()
  }

  setData(value) {
    let that = this
    let tempHtml = ""
    this.api.data.forEach(v => {
      tempHtml +=
        '<li class="permission" did="' +
        v.id +
        '"><i class="check-box"></i><span class="perName">' +
        v.name +
        "</span></li>"
    })
    this.dom.find(".roleList").append(tempHtml)
  }

  initView() {
    let that = this
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".btn-cancel").on("click", function() {
      that.close()
    })
    this.dom.find(".btn-confirm").on("click", function() {
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
          name: that.dom.find('.inputBox[api="name"]').val(),
          roleIdList: []
        }
        if (that.dom.find(".roleList .choose").dom) {
          that.dom.find(".roleList .choose").dom.forEach(v => {
            apidata.roleIdList.push({ id: v.parent().attr("did") * 1 })
          })
          apidata.roleIdList.forEach(v => {
            if (that.oldRole.lastIndexOf("," + v.id + ",") == -1) {
              v.action = 1
            }
            that.oldRole = that.oldRole.replace("," + v.id + ",", ",")
          })
          let arr = that.oldRole.split(",")
          arr.pop()
          arr.shift()
          if (arr.length > 0) {
            arr.forEach(v => {
              apidata.roleIdList.push({ id: v * 1, action: 3 })
            })
          }
          apidata.roleIdList = apidata.roleIdList.filter(v => {
            return v.action !== undefined
          })
        } else {
          let arr = that.oldRole.split(",")
          arr.pop()
          arr.shift()
          if (arr.length > 0) {
            arr.forEach(v => {
              apidata.roleIdList.push({ id: v * 1, action: 3 })
            })
          }
        }
        that.event._dispatch("addUser.submit", apidata)
      }
    })
  }
  renderData(data) {
    this.dom.find('.inputBox[api="name"]').val(data.name)
    this.dom.find('.inputBox[api="mobile"]').val(data.mobile)
    if (data.isAudit) {
      this.dom.find(".isAudit .check-box").addClass("choose")
    }
    this.oldRole = ","
    data.rolePermissionList.forEach(v => {
      this.oldRole += v.id + ","
      this.dom
        .find('.roleList li[did="' + v.id + '"] .check-box')
        .addClass("choose")
    })
  }
}

//原型链一定要有的
module.exports = addUser
