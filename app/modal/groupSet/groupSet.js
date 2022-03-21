require("./groupSet.less")

class groupSet extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "groupSet"
    this.oldUser = ","
    this.oldRole = ","
  }
  complete() {
    let that = this
    this.initView()
    this.choosedObj = {}
    this.unchooseScroll = null
    this.choosedScroll = null
    this.roleScroll = null
    if (that.api.title) {
      that.dom.find(".modal-title").html(that.api.title)
    }
    if (this.api.type == "EDIT_GROUP") {
      that.dom.find(".modal-title").html("修改用户组")
    } else if (this.api.type == "CREATE") {
      this.unchoosedUser(this.api.allUser)
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
              let len = v.permissionList.length
              v.permissionList.forEach((item, index) => {
                temp += item.permissionName
                if (index !== len - 1) {
                  temp += ","
                }
              })
            }
          })
        }
        let html = '<div class="actionUl">' + temp + "</div>"
        dom.append(html)
      }
    })
    this.dom.find(".modal-body").on("click", e => {
      let dom = ES.selctorDoc(e.target)
      this.dom.find(".actionUl").remove()
      if (e.target.className.lastIndexOf("roleCheck") !== -1) {
        if (!dom.hasClass("choose")) {
          dom.addClass("choose")
        } else {
          dom.removeClass("choose")
        }
        return
      }
      if (e.target.className.lastIndexOf("userCheck") !== -1) {
        if (!dom.hasClass("choose")) {
          dom.addClass("choose")
          this.choosedObj[dom.parent().attr("did")] = {
            name: dom.parent().attr("title"),
            id: dom.parent().attr("did")
          }
        } else {
          dom.removeClass("choose")
          if (!this.choosedObj[dom.parent().attr("did")].choosed) {
            delete this.choosedObj[dom.parent().attr("did")]
          }
        }
        return
      }
      if (e.target.className.lastIndexOf("icon-shanchu") !== -1) {
        dom.parent().remove()
        delete this.choosedObj[dom.parent().attr("did")]
        let dom1 = this.dom.find(
          '.notchoosedScroll li[did="' + dom.parent().attr("did") + '"] .choose'
        )
        if (dom1.dom) {
          dom1.removeClass("choose")
        }
        return
      }
      if (e.target.className.lastIndexOf("move") !== -1) {
        let arr = []
        for (let i in this.choosedObj) {
          this.choosedObj[i].choosed = true
          arr.push(this.choosedObj[i])
        }
        this.choosedUser(arr)
      }
    })
    this.dom.find(".userSearch").on("keydown", function(e) {
      if (e.keyCode == 13) {
        that.event._dispatch("groupSet.search", {
          name: ES.selctorDoc(this).val()
        })
      }
    })
    this.setData()
  }

  setData(value) {
    let that = this
    let tempHtml = ""
    this.api.data.forEach(v => {
      tempHtml +=
        '<li class="permissions" did="' +
        v.id +
        '"><i class="check-box roleCheck"></i><span class="perName">' +
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
          userIdList: [],
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
          let temp = apidata.roleIdList.filter(v => {
            return v.action !== undefined
          })
          apidata.roleIdList = temp
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
        if (that.dom.find(".choosed li").dom) {
          that.dom.find(".choosed li").dom.forEach(v => {
            apidata.userIdList.push({ id: v.attr("did") * 1 })
          })
          apidata.userIdList.forEach(v => {
            if (that.oldUser.lastIndexOf("," + v.id + ",") == -1) {
              v.action = 1
            }
            that.oldUser = that.oldUser.replace("," + v.id + ",", ",")
          })
          let arr = that.oldUser.split(",")
          arr.pop()
          arr.shift()
          if (arr.length > 0) {
            arr.forEach(v => {
              apidata.userIdList.push({ id: v * 1, action: 3 })
            })
          }
          let temp = apidata.userIdList.filter(v => {
            return v.action !== undefined
          })
          apidata.userIdList = temp
        } else {
          let arr = that.oldUser.split(",")
          arr.pop()
          arr.shift()
          if (arr.length > 0) {
            arr.forEach(v => {
              apidata.userIdList.push({ id: v * 1, action: 3 })
            })
          }
        }
        that.event._dispatch("groupSet.submit", apidata)
      }
    })
  }

  renderData(data) {
    this.dom.find('.inputBox[api="name"]').val(data.name)
    this.oldRole = ","
    data.roleList.forEach(v => {
      this.oldRole += v.id + ","
      this.dom
        .find('.roleList li[did="' + v.id + '"] .check-box')
        .addClass("choose")
    })
    this.oldUser = ","
    data.userList.forEach(v => {
      this.choosedObj[v.id] = { id: v.id, name: v.name + "(" + v.mobile + ")" }
      this.oldUser += v.id + ","
      v.name = v.name + "(" + v.mobile + ")"
      // this.dom.find('.notchoosedScroll li[did="'+v.id+'"] .check-box').addClass('choose')
    })
    this.choosedUser(data.userList)
    this.unchoosedUser(this.api.allUser)
  }
  unchoosedUser(list) {
    this.dom.find(".notchoosedScroll").html("")
    let html = ""
    if (list.length > 0) {
      list.forEach(v => {
        if (this.choosedObj[v.id]) {
          html +=
            '<li title="' +
            v.name +
            "(" +
            v.mobile +
            ')" did="' +
            v.id +
            '"><i class="check-box userCheck choose"></i><span>' +
            v.name +
            "(" +
            v.mobile +
            ")</span></li>"
        } else {
          html +=
            '<li title="' +
            v.name +
            "(" +
            v.mobile +
            ')" did="' +
            v.id +
            '"><i class="check-box userCheck"></i><span>' +
            v.name +
            "(" +
            v.mobile +
            ")</span></li>"
        }
      })
    }
    this.dom.find(".notchoosedScroll").append(html)
    this.initscroll(this.unchooseScroll, "notChoosed")
  }
  choosedUser(list) {
    let html = ""
    this.dom.find(".choosedScroll").html("")
    if (list.length > 0) {
      list.forEach(v => {
        html +=
          '<li title="' +
          v.name +
          '" did="' +
          v.id +
          '"><span>' +
          v.name +
          '</span><i class="iconfont icon-shanchu"></i></li>'
      })
    }
    this.dom.find(".choosedScroll").append(html)
    this.initscroll(this.choosedScroll, "choosed")
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
module.exports = groupSet
