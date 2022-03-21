require("./biaozhulist.less")
// var html = require('./tpl.html')

class biaozhulist extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "biaozhulist"
    this.flag = true
    this.code = ""
    this.nowParam = value
    this.refreshPage = true
    this.apidata = {}
    this.apidata.page = 1
    this.apidata.pagesize = 10
  }
  complete() {
    let that = this
    that.datalist = that.api.chooseddata
      ? JSON.parse(JSON.stringify(that.api.chooseddata))
      : []
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".cancel").on("click", function() {
      that.close()
    })
    that.dom.find(".searchbtn").on("click", function() {
      that.refreshPage = true
      that.apidata.page = 1
      that.event._dispatch("search.change", that.apidata)
    })
    that.dom.find(".add").on("click", function() {
      that.datalist = that.datalist.filter(val => {
        return val.id !== null || val.action !== 3
      })
      //console.log(that.datalist)
      that.event._dispatch("biaozhulist.adddata", {
        data: that.idlist,
        list: that.datalist
      })
    })
    this.render()
  }
  render(value) {
    let that = this
    require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      that.type = that.app.loadModule(dropdown, that.dom.find(".kjlx"), {
        className: "xlk",
        firstSelect: {
          val: "控件类型选择",
          idx: ""
        },
        data: [
          {
            val: "文本框",
            idx: "text"
          },
          {
            val: "下拉框",
            idx: "select"
          },
          {
            val: "单选框",
            idx: "radiobox"
          },
          {
            val: "复选框",
            idx: "checkbox"
          },
          {
            val: '二级下拉菜单',
            idx: 'child_select'
          }
        ]
      })
      that.type.event._addEvent("option.click", function(value) {
        that.apidata.type = value.idx
      })
      that.type.event._addEvent("dropDown.clear", function(value) {
        that.apidata.type = ""
      })
    })
    that.dom.find(".filterarea input").on("change", function() {
      that.apidata[ES.selctorDoc(this).attr("class")] = ES.selctorDoc(
        this
      ).val()
    })
    that.setTitle()
  }
  setTitle() {
    let obj = {}
    let that = this
    obj["icon"] = {
      code: {
        name: '<span data-i18n="age" data-name="年龄">标注字段编码</span>',
        type: "text",
        code: "checkid",
        w: "25%",
        ww: "25%",
        n: "40"
      },
      name: {
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
        w: "25%",
        ww: "25%"
      },
      label: {
        name: '<span data-i18n="age" data-name="年龄">标签</span>',
        type: "text",
        code: "pname",
        w: "25%",
        ww: "25%"
      }
    }
    obj["type"] = "center"
    obj["chose"] = "all"
    obj["chosew"] = "30px"
    obj["tablewidth"] = ES.selctorDoc(".biaozhulist").box().clientWidth - 60
    // require.ensure("../../moduleslibs/table/table", function() {
    let cont_table = require("../../moduleslibs/table/table")
    that.table = that.app.loadModule(
      cont_table,
      that.dom.find(".biaozhutable"),
      {
        id: "biaozhutable",
        header: obj
      }
    )
    that.table.event._addEvent("table.check", function(value) {
      let temp = value
      let idsStr = "," + temp.id.toString() + ","
      that.datalist.map(function(item) {
        let idStr = "," + item.formComponentId + ","
        if (idsStr.lastIndexOf(idStr) != -1) {
          if (temp.type == "add") {
            item.action = item.id ? 2 : 1
          } else {
            item.action = 3
          }
          idsStr = idsStr.replace(idStr, ",")
        }
      })
      if (idsStr != ",") {
        if (temp.type == "add") {
          temp.data.id = null
          temp.data.action = 1
        }
        if (temp.type == "del") {
          temp.data.id = temp.data.id
          item.action = 3
        }
        temp.data.optional = false
        temp.data.formComponentId = temp.data.formComponentId
        temp.data.sequence = 1
        temp.data.alias = ""
        that.datalist.push(temp.data)
      }
    })
    that.table.event._addEvent("table.allcheck", function(value) {
      console.log(value, "value")
      let temp = value
      let idsStr = "," + temp.id.toString() + ","
      console.log(that.datalist, "before")
      that.datalist.map(function(item) {
        let idStr = "," + item.formComponentId + ","
        if (idsStr.lastIndexOf(idStr) != -1) {
          if (temp.type == "add") {
            item.action = item.id ? 2 : 1
          } else {
            item.action = 3
          }
          idsStr = idsStr.replace(idStr, ",")
        }
      })
      if (idsStr != "," && temp.type == "add") {
        temp.data.map(item => {
          if (idsStr.lastIndexOf("," + item.id + ",") != -1) {
            item.formComponentId = item.id
            item.id = null
            item.optional = false
            item.action = 1
            item.sequence = 1
            item.alias = ""
            that.datalist.push(item)
          }
        })
      } else if (temp.type == "del") {
        temp.data.map(item => {
          if (idsStr.lastIndexOf("," + item.id + ",") != -1) {
            item.formComponentId = item.id
            item.id = item.id
            item.optional = false
            item.action = 3
            item.sequence = 1
            item.alias = ""
            that.datalist.push(item)
          }
        })
      }
      console.log(that.datalist, "after")
    })
    that.table.event._addEvent("table.listlink", function(value) {
      that.event._dispatch("biaozhulist.showcomponent", { id: value.id })
    })
    that.table.event._addEvent("table.pagenumber", function(value) {
      that.dom.find(".list-header .check-box").removeClass("choose")
      that.apidata.page = parseInt(value)
      that.refreshPage = false
      that.table.changenum(that.apidata.page)
      that.event._dispatch("search.change", that.apidata)
    })
    that.table.event._addEvent("table.pagesize", function(value) {
      that.apidata.pageSize = value.num
      that.apidata.page = 1
      that.refreshPage = true
      that.event._dispatch("search.change", that.apidata)
    })
    that.dom.find(".list-content").removeClass("hide")
    // })
  }
  setMain(bool, value) {
    let that = this
    let data2 = []
    let res = ""
    if (value) {
      res = value
    }
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(function(val, idx) {
          if (
            that.datalist.some(item => {
              return item.formComponentId == val.id && item.action != 3
            })
          ) {
            val.choosed = true
          }
          val.formComponentId = val.id
          let obj = {}
          obj.id = val.id
          obj.formComponentId = val.id
          obj.operation = that.action
          data2.push(obj)
          val.label = ""
          val.tagList.forEach(function(value, index) {
            if (index < val.tagList.length - 1) {
              val.label += value.text + ","
            } else {
              val.label += value.text
            }
          })
          switch (val.type) {
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
        })
        that.table.setData(res.data.list, data2)
      } else {
        that.table.noData()
      }
    }
    if (that.refreshPage) {
      that.table.getTotal(res.data.pages, 2, res.data.total)
    }
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
module.exports = biaozhulist
