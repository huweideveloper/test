require("./taskuser.less")
// var html = require('./tpl.html')

class taskuser extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "taskuser"
    this.apidata = {}
    this.idlist = []
  }
  complete() {
    let that = this
    console.log(that.api, "that.api")
    if (that.api.data.data.list.length == 0) {
      that.dom
        .find(".modal-body")
        .html('<div class="nodata1">当前任务无标注医生认领</div>')
    } else {
      that.setTitle()
    }
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    that.dom.find(".add").on("click", function() {
      if (that.idlist.length > 0) {
        that.app.alert.show({
          title: " ",
          msg:
            "确认要释放此批用户？释放后，已提交的标注记录还在，进行中的序列返回任务池中",
          close: true,
          sure: function() {
            that.event._dispatch("taskuser.adddata", { data: that.idlist })
          }
        })
      } else {
        that.app.alert.show({
          title: " ",
          msg: "请选择需要释放的用户",
          close: false
        })
      }
    })
    if (that.api.config) {
      that.dom.find(".modal-title").html(that.api.config.title)
    }
  }
  setTitle() {
    let obj = {}
    let that = this
    obj["icon"] = {
      userName: {
        name: "<span>用户姓名</span>",
        type: "text",
        code: "checkid",
        w: "15%",
        ww: "15%",
        n: "40"
      },
      userPhone: {
        name: "<span>用户账号（手机）</span>",
        type: "text",
        code: "checkid",
        w: "25%",
        ww: "25%"
      },
      userSubmitSeriesTotalNum: {
        name: "<span>已提交序列</span>",
        type: "text",
        code: "pid",
        w: "25%",
        ww: "25%"
      },
      userInProgressNum: {
        name: "<span>进行中序列</span>",
        type: "text",
        code: "pname",
        w: "35%",
        ww: "35%"
      }
    }
    obj["type"] = "center"
    obj["chose"] = "all"
    obj["chosew"] = "30px"
    obj["initPagina"] = false
    obj["pagesizeSet"] = false
    obj["tablewidth"] = ES.selctorDoc(".tasktable").box().clientWidth - 60
    require.ensure("../../moduleslibs/table/table", function() {
      let cont_table = require("../../moduleslibs/table/table")
      that.table = that.app.loadModule(
        cont_table,
        that.dom.find(".tasktable"),
        {
          id: "tasktable",
          header: obj
        }
      )
      that.table.event._addEvent("table.check", function(value) {
        let temp = value
        if (temp.type == "add") {
          if (that.idlist.toString().lastIndexOf(temp.id) == -1) {
            that.idlist.push(temp.id)
          }
        }
        if (temp.type == "del") {
          console.log(that.datalist, that.idlist, temp)
          that.idlist = that.idlist.filter(item => {
            return parseInt(item) !== parseInt(temp.id)
          })
        }
      })
      that.table.event._addEvent("table.allcheck", function(value) {
        if (value.type == "add") {
          let temp = that.idlist.toString()
          value.id.forEach(function(val, idx) {
            if (temp.lastIndexOf(val) == -1) {
              that.idlist.push(val)
            }
          })
        }
        if (value.type == "del") {
          let temp = value.id.toString()
          that.idlist = that.idlist.filter(item => {
            return temp.lastIndexOf(item) == -1
          })
        }
      })
      that.dom.find(".list-content").removeClass("hide")
      that.setMain(that.api.data)
    })
  }

  setMain(value) {
    console.log(value, "cacc")
    let that = this
    let data2 = []
    let res = ""
    if (value) {
      res = value
    }
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(function(val, idx) {
          val.id = val.userId
        })
        that.table.setData(res.data.list)
      } else {
        that.table.noData()
      }
    }
    that.initscrollmenu()
  }
  initscrollmenu() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".tasktable").attr("id", rid)
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
module.exports = taskuser
