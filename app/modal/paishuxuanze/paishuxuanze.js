require("./paishuxuanze.less")
// var html = require('./tpl.html')

class paishuxuanze extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "biaozhulist"
    this.flag = true
    this.code = ""
    this.action = {
      bcps: { dis: "inline", link: "noLink", content: "补充排数" }
    }
    this.data = value
  }
  complete() {
    let that = this
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.render()
  }
  render(value) {
    let that = this
    require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      let droparr = []
    })
    that.setTitle()
  }
  setTitle() {
    let obj = {}
    let that = this
    obj["icon"] = {
      model: {
        name: '<span data-i18n="age" data-name="年龄">机器型号</span>',
        type: "text",
        code: "checkid",
        w: "33%",
        ww: "33%",
        n: "40"
      },
      patientId: {
        name: '<span data-i18n="age" data-name="年龄">排数</span>',
        type: "select",
        selectitem: [16, 32, 64, 128, 256],
        code: "pid",
        w: "33%",
        ww: "33%"
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
    obj["tablewidth"] = ES.selctorDoc(".paishuxuanze").box().clientWidth - 40
    require.ensure("../../moduleslibs/table/table", function() {
      let cont_table = require("../../moduleslibs/table/table")
      that.table = that.app.loadModule(
        cont_table,
        that.dom.find(".xinghaotable"),
        {
          id: "xinghaotable",
          header: obj
        }
      )
      that.table.event._addEvent("table.pagenumber", function(value) {
        that.event._dispatch("paishuxuanze.pagenumber", { page: value })
      })
      that.table.event._addEvent("table.pagesize", function(value) {
        that.event._dispatch("paishuxuanze.pagesize", { pagesize: value.num })
      })
      that.table.event._addEvent("table.action", function(value) {
        if (value.classname == "bcps") {
          console.log(value.dom, "calssname", value.dom.find(".lbxlk"))
          value.dom.find(".lbxlk").removeClass("hide")
          value.dom.find(".content").html("保存")
          value.dom.find(".content").attr("classname", "bc")
          value.dom.find(".content").removeClass("bcps")
          value.dom.find(".content").addClass("bc")
        } else if (value.classname == "bc") {
          that.event._dispatch("paishuxuanze.save", {
            id: value.id,
            val: value.dom.find(".nowname").attr("data-idx")
          })
          value.dom.find(".lbxlk").addClass("hide")
          value.dom.find(".content").html("补充排数")
          value.dom.find(".content").attr("classname", "bcps")
          value.dom.find(".content").removeClass("bc")
          value.dom.find(".content").addClass("bcps")
        }
      })
      that.dom.find(".list-content").removeClass("hide")
      that.setMain(true)
    })
  }
  setMain(bool, value) {
    let that = this
    if (value) {
      that.data = value
    }
    that.data.list.forEach(function(val, idx) {
      val.id = val.model
      val.patientId = [16, 32, 64, 128, 256]
      val.operation = that.action
    })
    that.table.setData(that.data.list)
    if (that.data.list.length > 5) {
      that.dom.find(".maintable").css({ height: "300px" })
      that.initscrollmenu()
    }
    if (bool) {
      that.table.getTotal(that.data.pages, 2, that.data.total)
    }
  }

  initscrollmenu() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }

    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".paishuxuanze .maintable").attr("id", rid)
    this.myScroll = new IScroll("#" + rid, {
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
module.exports = paishuxuanze
