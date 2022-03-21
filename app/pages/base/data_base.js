//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class DataBase extends Interstellar.pagesBase {
  constructor(app, api, dom, model) {
    super(app, api, dom, model)
    this.apiData = {}
  }
  complete() {}
  addli(value) {
    let tablist = require("../../moduleslibs/tab/tab")
    let tabListControl = this.app.loadModule(
      tablist,
      this.dom.find(".topchoose"),
      { data: this.model.tablist, default: this.app.parpam["type"] }
    )
    tabListControl.event._addEvent("tab.change", value => {
      this.toggletab(value)
      //this.app.changePage('imagedatagl1', { type: value.id })
    })
    this.changeAll(
      value ? value : this.model.condition[this.app.parpam["type"]]
    )
  }
  loadlist(type, data) {
    let that = this
    this.tablecont = null
    require.ensure(
      [
        "../../moduleslibs/table_group/table_group",
        "../../moduleslibs/table/table.js"
      ],
      function() {
        that.table_group = require("../../moduleslibs/table_group/table_group.js")
        that.table_single = require("../../moduleslibs/table/table.js")
        switch (type) {
          case "group":
            that.tablecont = that.app.loadModule(
              that.table_group,
              that.dom.find(".tablearea"),
              {
                id: "tasktable",
                header: data ? data : that.model.tableconfig
              }
            )
            break
          case "single":
            that.tablecont = that.app.loadModule(
              that.table_single,
              that.dom.find(".tablearea"),
              {
                id: "tasktable",
                header: data ? data : that.model.tableconfig
              }
            )
        }
        that.tablecont.event._addEvent("table.pagenumber", function(value) {
          that.model.apiData.page = parseInt(value)
          that.tablecont.changenum(that.model.apiData.page)
          that.search()
        })
        that.tablecont.event._addEvent("table.pagesize", function(value) {
          that.model.apiData.pageSize = value.num
          that.model.apiData.page = 1
          that.search(true)
        })
        that.tablecont.event._addEvent("table.action", function(value) {
          that.listaction(value)
        })
        that.tablecont.event._addEvent("table.onoff", function(value) {
          that.listOnOff(value)
        })
        that.tablecont.event._addEvent("table.listlink", function(value) {
          that.listlink(value)
        })
        that.search(true)
      }
    )
  }
  loadproissonlist(type, data, val) {
    let that = this
    this.tablecont = null
    require.ensure(
      [
        "../../moduleslibs/table_group/table_group",
        "../../moduleslibs/table/table.js"
      ],
      function() {
        that.table_group = require("../../moduleslibs/table_group/table_group.js")
        that.table_single = require("../../moduleslibs/table/table.js")
        switch (type) {
          case "group":
            that.tablecont = that.app.loadModule(
              that.table_group,
              that.dom.find(".tablearea"),
              {
                id: "tasktable",
                header: data ? data : that.model.tableconfig
              }
            )
            break
          case "single":
            that.tablecont = that.app.loadModule(
              that.table_single,
              that.dom.find(".tablearea"),
              {
                id: "tasktable",
                header: data ? data : that.model.tableconfig
              }
            )
        }
        that.tablecont.event._addEvent("table.pagenumber", function(value) {
          that.model.apiData.page = parseInt(value)
          that.tablecont.changenum(that.model.apiData.page)
          that.search()
        })
        that.tablecont.event._addEvent("table.pagesize", function(value) {
          that.model.apiData.pageSize = value.num
          that.model.apiData.page = 1
          that.search(true)
        })
        that.tablecont.event._addEvent("table.action", function(value) {
          that.listaction(value)
        })
        that.tablecont.event._addEvent("table.onoff", function(value) {
          that.listOnOff(value)
        })
        that.tablecont.event._addEvent("table.listlink", function(value) {
          that.listlink(value)
        })
        that.search(val)
      }
    )
  }
  changeAll(value) {
    let that = this
    let datacondition = require("../../modules/datacondition/datacondition")
    this.chooseData = this.app.loadModule(
      datacondition,
      this.dom.find(".filterarea"),
      { data: value }
    )
    this.chooseData.event._addEvent("datacondition.moduledone", function() {
      that.conditionconfig()
      that.getapidata()
    })
    this.chooseData.event._addEvent("datacondition.dropinput", function(value) {
      that.getapidata(value)
    })
  }
  getapidata() {}
  conditionconfig() {}
  getfiltercondition() {
    return this.chooseData.data
  }
}

window.DataBase = window.DataBase || DataBase
module.exports = DataBase
