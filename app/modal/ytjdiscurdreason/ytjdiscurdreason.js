require("./ytjdiscurdreason.less")
// var html = require('./tpl.html')

class ytjdiscurdreason extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "ytjdiscurdreason"
    this.flag = true
    this.code = ""
    this.nowParam = value
    this.refreshPage = true
    this.idlist = value.idlist
    this.apidata = {}
    this.apidata.page = 1
    this.apidata.pagesize = 10
  }
  complete() {
    let that = this
    that.action = {
      up: { dis: "inline", link: "noLink", content: "上移" },
      down: { dis: "inline", link: "noLink", content: "下移" },
      del: { dis: "inline", link: "noLink", content: "删除" }
    }
    that.action1 = {
      down: { dis: "inline", link: "noLink", content: "下移" },
      del: { dis: "inline", link: "noLink", content: "删除" }
    }
    that.action2 = {
      up: { dis: "inline", link: "noLink", content: "上移" },
      del: { dis: "inline", link: "noLink", content: "删除" }
    }
    that.action3 = {
      del: { dis: "inline", link: "noLink", content: "删除" }
    }
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".cancel").on("click", function() {
      that.close()
    })
    this.dom.find(".save").on("click", function() {
      that.returndata = that.returndata.filter(val => {
        return val.id !== null || val.action !== 3
      })
      console.log(that.returndata)
      that.event._dispatch("ytjbiaozhulist.datachange", {
        data: that.returndata
      })
    })
    if (that.api.type == "view" || that.api.status == 2) {
      that.dom.find(".save").addClass("hide")
      that.setTitle_view()
    } else {
      that.setTitle_edit()
    }
  }
  setTitle_edit() {
    let obj = {}
    let that = this
    obj["icon"] = {
      value: {
        name: '<span data-i18n="age" data-name="年龄">编码</span>',
        type: "text",
        code: "checkid",
        w: "30%",
        ww: "30%"
      },
      name: {
        name: '<span data-i18n="age" data-name="年龄">名称</span>',
        type: "text",
        code: "checkid",
        w: "40%",
        ww: "40%",
        n: "40"
      },
      operation: {
        name: '<span data-i18n="age" data-name="年龄">操作</span>',
        type: "action",
        code: "pname",
        w: "30%",
        ww: "30%"
      }
    }
    obj["type"] = "center"
    obj["tablewidth"] = ES.selctorDoc(".biaozhutable").box().clientWidth - 60
    that.render(obj)
  }
  setTitle_view() {
    let obj = {}
    let that = this
    obj["icon"] = {
      value: {
        name: '<span data-i18n="age" data-name="年龄">编码</span>',
        type: "text",
        code: "checkid",
        w: "50%",
        ww: "50%"
      },
      name: {
        name: '<span data-i18n="age" data-name="年龄">名称</span>',
        type: "text",
        code: "checkid",
        w: "50%",
        ww: "50%",
        n: "40"
      }
    }
    obj["type"] = "center"
    obj["tablewidth"] = ES.selctorDoc(".biaozhutable").box().clientWidth - 60
    that.render(obj)
  }
  render(obj) {
    let that = this
    require.ensure("../../moduleslibs/list/list", function() {
      let cont_table = require("../../moduleslibs/list/list")
      that.table = that.app.loadModule(
        cont_table,
        that.dom.find(".biaozhutable"),
        {
          icon: obj["icon"],
          type: "center",
          tablewidth: ES.selctorDoc(".biaozhutable").box().clientWidth - 60,
          minwidth: 100
        }
      )
      that.table.event._addEvent("list.action", function(value) {
        let temp = that.returndata[value.position * 1]
        let tempidlist = that.returndata[value.position * 1]
        switch (value.classname) {
          case "up":
            that.returndata.splice(value.position * 1, 1)
            that.returndata.splice(value.position * 1 - 1, 0, temp)
            break
          case "down":
            that.returndata.splice(value.position * 1, 1)
            that.returndata.splice(value.position * 1 + 1, 0, temp)
            break
          case "del":
            that.returndata.splice(value.position * 1, 1)
            console.log(that.returndata, "after")
            break
        }
        that.setMain(that.returndata)
      })
      that.dom.find(".list-content").removeClass("hide")
      that.setMain()
    })
  }

  setMain(value) {
    let that = this
    let data2 = []
    let res = ""
    if (!value) {
      value = that.api.data
    }
    console.log(value)
    that.returndata = value
    let count = 0
    value.forEach(function(val) {
      if (val.action !== 3) {
        count++
      }
    })
    let temp = JSON.parse(JSON.stringify(value))
    temp.forEach(function(val, idx) {
      if (value.length == 1) {
        val.operation = that.action3
      } else {
        if (idx == 0) {
          val.operation = that.action1
        } else if (idx == temp.length - 1) {
          val.operation = that.action2
        } else {
          val.operation = that.action
        }
      }
      data2.push(val)
    })
    that.table.setData(data2)
    that.initscrollmenu()
  }
  initscrollmenu() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".biaozhutable").attr("id", rid)
    this.myScroll = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
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
module.exports = ytjdiscurdreason
