require("./ytjbiaozhulist.less")
// var html = require('./tpl.html')

class ytjbiaozhulist extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "ytjbiaozhulist"
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
      formComponentId: {
        name: '<span data-i18n="age" data-name="年龄">标注字段编码</span>',
        type: "text",
        code: "checkid",
        w: "8%",
        ww: "8%"
      },
      componentName: {
        name: '<span data-i18n="age" data-name="年龄">标注字段名称</span>',
        type: "link",
        code: "checkid",
        w: "25%",
        ww: "25%",
        n: "40"
      },
      type: {
        name: '<span data-i18n="age" data-name="年龄">控件类型</span>',
        type: "text",
        code: "pid",
        w: "16%",
        ww: "16%"
      },
      label: {
        name: '<span data-i18n="age" data-name="年龄">标签</span>',
        type: "text",
        code: "pname",
        w: "16%",
        ww: "16%"
      },
      optional: {
        name: '<span data-i18n="age" data-name="年龄">是否必填</span>',
        type: "onoff",
        code: "pname",
        w: "20%",
        ww: "20%"
      },
      operation: {
        name: '<span data-i18n="age" data-name="年龄">操作</span>',
        type: "action",
        code: "pname",
        w: "20%",
        ww: "20%"
      }
    }
    obj["onofftype"] = { 0: "否", 1: "是" }
    obj["type"] = "center"
    obj["tablewidth"] = ES.selctorDoc(".ytjbiaozhulist").box().clientWidth - 60
    that.render(obj)
  }
  setTitle_view() {
    let obj = {}
    let that = this
    obj["icon"] = {
      formComponentId: {
        name: '<span data-i18n="age" data-name="年龄">标注字段编码</span>',
        type: "text",
        code: "checkid",
        w: "15%",
        ww: "15%",
        n: "40"
      },
      componentName: {
        name: '<span data-i18n="age" data-name="年龄">标注字段名称</span>',
        type: "link",
        code: "checkid",
        w: "20%",
        ww: "20%"
      },
      type: {
        name: '<span data-i18n="age" data-name="年龄">控件类型</span>',
        type: "text",
        code: "pid",
        w: "20%",
        ww: "20%"
      },
      label: {
        name: '<span data-i18n="age" data-name="年龄">标签</span>',
        type: "text",
        code: "pname",
        w: "25%",
        ww: "25%"
      },
      isrequired: {
        name: '<span data-i18n="age" data-name="年龄">是否必填</span>',
        type: "text",
        code: "pname",
        w: "20%",
        ww: "20%"
      }
    }
    obj["type"] = "center"
    obj["tablewidth"] = ES.selctorDoc(".ytjbiaozhulist").box().clientWidth - 60
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
          tablewidth: ES.selctorDoc(".ytjbiaozhulist").box().clientWidth - 60,
          minwidth: 100,
          mainId: "formComponentId",
          onofftype: { 0: "否", 1: "是" }
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
            console.log(that.returndata, "bef")
            that.returndata.splice(value.position * 1, 1)
            that.returndata.splice(value.position * 1 + 1, 0, temp)
            console.log(that.returndata, "af")
            break
          case "del":
            that.returndata.map(item => {
              if (item.formComponentId * 1 == parseInt(value.id)) {
                item.action = 3
              }
            })
            that.returndata.splice(value.position * 1, 1)
            console.log(that.returndata, "before")
            that.returndata.splice(that.returndata.length, 0, temp)
            console.log(that.returndata, "after")
            break
        }
        that.setMain(that.returndata)
      })
      that.table.event._addEvent("list.onoff", function(value) {
        that.returndata.map(item => {
          if (item.formComponentId * 1 == parseInt(value.id)) {
            item.optional = value.dom.hasClass("off") ? false : true
          }
        })
        that.setMain(that.returndata)
      })
      that.table.event._addEvent("list.listlink", function(value) {
        that.event._dispatch("biaozhulist.showcomponent", { id: value.id })
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
    temp = temp.filter(vs => {
      return vs.action !== 3
    })
    temp.forEach(function(val, idx) {
      val.isrequired = val.optional ? "是" : "否"
      val.componentName = val.componentName ? val.componentName : val.name
      val.componentType = val.componentType ? val.componentType : val.type
      val.formComponentId = val.formComponentId ? val.formComponentId : val.code
      console.log(val.componentType, "val.componentType")
      if (val.action != 3) {
        val.label = ""
        val.tagList.forEach(function(value, index) {
          if (index < val.tagList.length - 1) {
            val.label += value.text + ","
          } else {
            val.label += value.text
          }
        })
        switch (val.componentType) {
          case "text":
            val.type = "文本框"
            break
          case "select":
            val.type = "下拉框"
            break
          case "checkbox":
            val.type = "复选框"
            break
          case "radiobox":
            val.type = "单选框"
            break
          case 'child_select':
            val.type = '二级下拉菜单'
            break
        }
        if (count == 1) {
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
      }
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
module.exports = ytjbiaozhulist
