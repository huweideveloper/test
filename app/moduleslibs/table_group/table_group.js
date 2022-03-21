require("./table-group.less")
class index extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./table.html")
    this.scrollXWidth = this.getScrollWidth()
  }
  complete() {
    let list = require("../list/list.js")
    let pagination = require("../pagination_new/pagination.js")
    let pageset = require("../pagesizeset/pagesizeset")
    var that = this
    this.icon = ""
    this.chose = ""
    var id = that.nowParam.id
    this.icon = that.nowParam.header.icon
    this.actionicon = that.nowParam.header.actionicon
    this.chose = that.nowParam.header.chose
    this.chosew = that.nowParam.header.chosew
    this.type = that.nowParam.header.type
    this.tablewidth = that.nowParam.header.tablewidth
    this.actionulwidth = that.nowParam.header.actionulwidth || 100
    this.minwidth =
      that.nowParam.header.minwidth == undefined
        ? this.tablewidth
        : this.nowParam.header.minwidth
    this.initPagina =
      that.nowParam.header.initPagina == undefined
        ? true
        : this.nowParam.initPagina
    this.pagesizeSet =
      that.nowParam.header.pagesizeSet == undefined
        ? true
        : this.nowParam.pagesizeSet
    this.onofftype = that.nowParam.header.onofftype
    this.iconArr = that.nowParam.iconArr
    var title = that.nowParam.title == undefined ? "" : that.nowParam.title
    this.flag = this.nowParam.flag == undefined ? true : this.nowParam.flag
    let tableList = this.app.loadModule(
      list,
      that.dom.find(".maintable .list"),
      {
        icon: that.icon,
        chose: that.chose,
        type: that.type,
        iconArr: that.iconArr,
        chosew: that.chosew,
        tablewidth: that.tablewidth,
        minwidth: that.minwidth,
        onofftype: that.onofftype
      }
    )
    let actionList = this.app.loadModule(
      list,
      that.dom.find(".actiontable .list"),
      {
        icon: that.actionicon,
        chose: that.chose,
        type: that.type,
        iconArr: that.iconArr,
        chosew: that.chosew,
        tablewidth: that.actionulwidth,
        minwidth: that.actionulwidth,
        onofftype: that.onofftype
      }
    )

    this.tableList = tableList
    this.actionList = actionList
    this.resize()
    if (this.initPagina == true) {
      let pagina = that.app.loadModule(
        pagination,
        that.dom.find(".pagination"),
        {
          total: 1,
          flag: that.flag
        }
      )
      this.pagina = pagina
      pagina.event._addEvent("pagination.changePage", function(value) {
        that.event._dispatch("table.pagenumber", parseInt(value))
      })
    }
    if (this.pagesizeSet == true) {
      let pages = this.app.loadModule(pageset, that.dom.find(".pageset"), {})
      this.pageset = pages
      that.pageset.event._addEvent("pagesizeset.change", function(value) {
        that.event._dispatch("table.pagesize", { num: value.num })
      })
    }
    tableList.event._addEvent("list.edit", function(value) {
      that.event._dispatch("table.edit", value)
    })
    actionList.event._addEvent("list.edit", function(value) {
      that.event._dispatch("table.edit", value)
    })
    actionList.event._addEvent("list.view", function(value) {
      that.event._dispatch("table.view", value)
    })
    actionList.event._addEvent("list.action", function(value) {
      that.event._dispatch("table.action", value)
    })
    tableList.event._addEvent("list.paixu", function(value) {
      that.event._dispatch("table.paixu", value)
    })
    tableList.event._addEvent("list.open", function(value) {
      that.event._dispatch("table.open", value)
    })
    tableList.event._addEvent("list.log", function(value) {
      that.event._dispatch("table.log", value)
    })
    tableList.event._addEvent("list.report", function(value) {
      that.event._dispatch("table.report", value)
    })
    tableList.event._addEvent("list.change", function(value) {
      that.event._dispatch("table.change", value)
    })
    tableList.event._addEvent("list.config", function(value) {
      that.event._dispatch("table.config", value)
    })

    tableList.event._addEvent("list.ul", function(value) {
      that.event._dispatch("table.ul", value)
    })
    tableList.event._addEvent("list.done", function(value) {
      that.event._dispatch("table.done", value)
    })
    tableList.event._addEvent("list.check", function(value) {
      that.event._dispatch("table.check", value)
    })
    tableList.event._addEvent("list.apply", function(value) {
      that.event._dispatch("table.apply", value)
    })
    tableList.event._addEvent("list.urge", function(value) {
      that.event._dispatch("table.urge", value)
    })
    tableList.event._addEvent("list.shanchu", function(value) {
      that.event._dispatch("table.shanchu", value)
    })
    tableList.event._addEvent("list.bianji", function(value) {
      that.event._dispatch("table.bianji", value)
    })
    tableList.event._addEvent("list.view", function(value) {
      that.event._dispatch("table.view", value)
    })
    tableList.event._addEvent("list.xiugaimima", function(value) {
      that.event._dispatch("table.xiugaimima", value)
    })
    tableList.event._addEvent("list.onoff", function(value) {
      that.event._dispatch("table.onoff", value)
    })
    tableList.event._addEvent("list.recharge", function(value) {
      that.event._dispatch("table.recharge", value)
    })
    tableList.event._addEvent("list.down", function(value) {
      that.event._dispatch("table.down", value)
    })
    tableList.event._addEvent("list.ul", function(value) {
      that.event._dispatch("table.ul", value)
    })
    tableList.event._addEvent("list.listlink", function(value) {
      that.event._dispatch("table.listlink", value)
    })
  }
  getScrollWidth() {
    let noScroll,
      scroll,
      tempDiv = document.createElement("div")
    tempDiv.style.cssText = "width: 100px;height: 100px;visibility: hidden"
    noScroll = document.body.appendChild(tempDiv).clientHeight
    tempDiv.style.overflowX = "scroll"
    scroll = tempDiv.clientHeight
    document.body.removeChild(tempDiv)
    return noScroll - scroll
  }
  setData(value, value2) {
    let that = this
    that.dom.find(".nodata").removeClass("hide")
    that.dom.find(".scrolltable").removeClass("hide")
    that.dom.find(".dataNone").addClass("hide")
    this.tableList.setData(value)
    this.actionList.setData(value2)
  }
  insertLine(value) {
    this.tableList.insertLine(value)
    this.actionList.insertLine(value)
  }
  noData(value) {
    // this.tableList.noData();
    // this.actionList.noData('empty');
    // this.dom.find('.pageset').hide();
    // this.dom.find('.pagination').hide();
    this.dom.find(".nodata").addClass("hide")
    this.dom.find(".scrolltable").addClass("hide")
    this.dom.find(".dataNone").removeClass("hide")
    if (value) {
      this.dom.find(".dataNone").html(value)
    }
  }
  showDis() {
    this.pagina.showDis()
  }
  resetAll() {
    this.pagina.resetAll()
  }
  getTotal(value, a, totalnum) {
    this.pagina.getTotal(value, a)
    this.pageset.getTotal(value, totalnum)
  }
  changenum(value, pageSize) {
    this.pageset.setnowpage(value, pageSize)
    this.pagina.changePage(value)
  }
  getChoose() {
    return this.tableList.getChoose()
  }
  resetAll1() {
    this.pagina.resetAll1()
  }
  refreshHeader(value) {
    this.tableList.refreshHeader(value)
  }
  showloading(value) {
    this.tableList.showloading(value)
  }
  resize(value) {
    const maintable = ES.selctorDoc(".maintable")
    maintable.css({ width: this.tablewidth + 40 })
    maintable.parent().css({ width: this.tablewidth + this.actionulwidth + 40 })
    const locationHash = window.location.hash
    if (
      locationHash.indexOf("taskmanage") === -1 &&
      locationHash.indexOf("backflowtask") === -1 &&
      locationHash.indexOf("releasetask") === -1
    )
      return
    maintable.css({ "overflow-x": "auto" })
    ES.selctorDoc(".actiontable").css({ top: -this.scrollXWidth }) // 标注任务列表中展示字段过多，有横向滚动条，滚动条的高度导致操作列和前面列上下不对齐
  }
}

module.exports = index
