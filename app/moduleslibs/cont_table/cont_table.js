require("./cont_table.less")
var html = require("./cont_table.html")
var table
var resolve = ES.Deferred()
var tableCont = null

class index extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./cont_table.html")
  }

  complete() {
    table = require("../table_group/table_group.js")
    var that = this
    this.html = html

    var id = that.nowParam.id
    var icon = that.nowParam.header.icon
    var chose = that.nowParam.header.chose
    var type = that.nowParam.header.type
    var iconArr = that.nowParam.iconArr
    var title = that.nowParam.title == undefined ? "" : that.nowParam.title
    var flag = that.nowParam.flag == undefined ? true : that.nowParam.flag
    if (title.length > 0) {
      this.dom.find(".title_c").removeClass("hide")
      this.initTitle(title)
    } else {
      that.dom.find(".title_c").addClass("hide")
    }
    this.dom.find(".actCont_table").addClass(id)
    var dom = this.dom.find("." + id)
    dom.find(".body_cont").attr("id", id)
    tableCont = that.app.loadModule(table, this.dom.find(".body_cont"), {
      icon: icon,
      chose: chose,
      type: type,
      flag: flag,
      iconArr: iconArr
    })
    tableCont.event._addEvent("table.pagenumber", function(value) {
      that.event._dispatch("cont_table.pagenumber", value)
    })
    tableCont.event._addEvent("table.paixu", function(value) {
      that.event._dispatch("cont_table.paixu", value)
    })
    tableCont.event._addEvent("table.open", function(value) {
      that.event._dispatch("cont_table.open", value)
    })
    tableCont.event._addEvent("table.log", function(value) {
      that.event._dispatch("cont_table.log", value)
    })
    tableCont.event._addEvent("table.report", function(value) {
      that.event._dispatch("cont_table.report", value)
    })
    tableCont.event._addEvent("table.view", function(value) {
      that.event._dispatch("cont_table.view", value)
    })
    tableCont.event._addEvent("table.change", function(value) {
      that.event._dispatch("cont_table.change", value)
    })
    tableCont.event._addEvent("table.config", function(value) {
      that.event._dispatch("cont_table.config", value)
    })
    tableCont.event._addEvent("table.ul", function(value) {
      that.event._dispatch("cont_table.ul", value)
    })
    tableCont.event._addEvent("table.done", function(value) {
      that.event._dispatch("cont_table.done", value)
    })
    tableCont.event._addEvent("table.recharge", function(value) {
      that.event._dispatch("cont_table.recharge", value)
    })
    tableCont.event._addEvent("table.shanchu", function(value) {
      that.event._dispatch("cont_table.shanchu", value)
    })
    tableCont.event._addEvent("table.down", function(value) {
      that.event._dispatch("cont_table.down", value)
    })
    tableCont.event._addEvent("table.xiugaimima", function(value) {
      that.event._dispatch("cont_table.xiugaimima", value)
    })
    tableCont.event._addEvent("table.onoff", function(value) {
      that.event._dispatch("cont_table.onoff", value)
    })
    tableCont.event._addEvent("table.edit", function(value) {
      that.event._dispatch("cont_table.edit", value)
    })
    tableCont.event._addEvent("table.check", function(value) {
      that.event._dispatch("cont_table.check", value)
    })
    tableCont.event._addEvent("table.list1", function(value) {
      that.event._dispatch("cont_table.list1", value)
    })
    tableCont.event._addEvent("table.apply", function(value) {
      that.event._dispatch("cont_table.apply", value)
    })
    tableCont.event._addEvent("table.urge", function(value) {
      that.event._dispatch("cont_table.urge", value)
    })
  }
  initTitle(value) {
    let that = this
    value.position.forEach(function(idx, val) {
      if (value.position[val].indexOf("left") !== -1) {
        that.dom.find(".left_cont").append("<div class=" + val + "></div>")
      } else {
        that.dom.find(".right_cont").append("<div class=" + val + "></div>")
      }
    })
    value.type.forEach(function(idx, val) {
      switch (value.type[val]) {
        case "text":
          that.dom.find("." + value.position[idx]).html(value.data[idx])
          break
        case "icon":
          that.dom
            .find("." + value.position[idx])
            .html(
              '<span class="out"><i class="contIcon"></i></span><span class="graph"><i class="contIcon"></i></span>'
            )
          break
      }
    })
    that.clickFun()
  }
  clickFun() {
    let that = this
    this.dom.find(".graph").on("click", function() {
      that.event._dispatch("cont_table.graph", "graph")
    })
    this.dom.find(".out").on("click", function() {
      that.event._dispatch("cont_table.out", "out")
    })
  }
  setData(value) {
    tableCont.setData(value)
  }
  resetAll() {
    tableCont.resetAll()
  }
  showDis() {
    tableCont.showDis()
  }
  getTotal(value, a) {
    tableCont.getTotal(value, a)
  }
  getChoose() {
    return tableCont.getChoose()
  }
  refreshHeader(value) {
    tableCont.refreshHeader(value)
  }
}
module.exports = index
