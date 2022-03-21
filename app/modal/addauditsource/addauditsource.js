require("./addauditsource.less")
// var html = require('./tpl.html')

class addauditsource extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "addauditsource"
    this.refreshPage = true
    this.apidata = {}
  }
  complete() {
    let that = this
    that.idlist = []
    that.api.chooseddata.forEach(function(val, idx) {
      if (val.id) val.taskId = val.id
    })
    that.datalist = that.api.chooseddata
      ? JSON.parse(JSON.stringify(that.api.chooseddata))
      : []
    if (that.api.chooseddata.length > 0) {
      that.api.chooseddata.forEach(function(val, idx) {
        that.idlist.push(val.taskId)
      })
    }
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".cancel").on("click", function() {
      that.close()
    })
    that.dom.find(".searchbtn").on("click", function() {
      that.event._dispatch("addauditsource.search", that.apidata)
    })
    that.dom.find(".add").on("click", function() {
      // that.datalist = that.datalist.filter((val) => {
      //   return val.taskId !== null || val._action !== 3
      // })
      that.event._dispatch("addauditsource.adddata", {
        data: that.idlist,
        list: that.datalist
      })
    })
    if (that.api.config) {
      that.dom.find(".modal-title").html(that.api.config.title)
    }
    this.render()
  }
  render(value) {
    let that = this
    require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      that.xmmc = that.app.loadModule(dropdown, that.dom.find(".xmmc"), {
        className: "xlk",
        firstSelect: {
          val: "请选择项目名称",
          idx: ""
        },
        data: that.api.projectList ? that.api.projectList : []
      })
      that.xmmc.event._addEvent("option.click", function(value) {
        that.apidata.projectId = value.idx
      })
      that.xmmc.event._addEvent("dropDown.clear", function(value) {
        that.apidata.projectId = ""
      })
    })
    that.dom.find(".filterarea input").on("change", function() {
      that.apidata[ES.selctorDoc(this).attr("class")] = ES.selctorDoc(
        this
      ).val()
    })
    that.setTitle()
  }
  setxlk(value) {
    let that = this
    that.xmmc.renderHtml(value)
  }
  setTitle() {
    let obj = {}
    let that = this
    obj["icon"] = {
      taskId: {
        name: "<span>任务ID</span>",
        type: "text",
        code: "checkid",
        w: "15%",
        ww: "15%",
        n: "40"
      },
      taskName: {
        name: "<span>任务名称</span>",
        type: "text",
        code: "checkid",
        w: "25%",
        ww: "25%"
      },
      type: {
        name: "<span>任务类型</span>",
        type: "text",
        code: "pid",
        w: "25%",
        ww: "25%"
      },
      projectName: {
        name: "<span>所属项目名称</span>",
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
          if (that.datalist.toString().lastIndexOf(temp.id) == -1) {
            that.datalist.push(temp.data)
            that.idlist.push(temp.id)
          }
        }
        if (temp.type == "del") {
          that.datalist = that.datalist.filter(item => {
            return parseInt(item.id) !== parseInt(temp.id)
          })
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
          value.data.forEach(function(val, idx) {
            if (temp.lastIndexOf(val.id) == -1) {
              that.datalist.push(val)
            }
          })
        }
        if (value.type == "del") {
          let temp = value.id.toString()
          that.idlist = that.idlist.filter(item => {
            return temp.lastIndexOf(item) == -1
          })
          that.datalist = that.datalist.filter(item => {
            return temp.lastIndexOf(item.id) == -1
          })
        }
      })
      that.dom.find(".list-content").removeClass("hide")
    })
  }

  setMain(value) {
    let that = this
    let data2 = []
    let res = ""
    if (value) {
      res = value
    }
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(function(val, idx) {
          val.id = val.taskId
          switch (val.taskType) {
            case 1:
              val.type = "人工标注任务"
              break
            case 2:
              val.type = "审核任务"
              break
            case 3:
              val.type = "回流任务"
              break
          }
          if (
            that.idlist.some(item => {
              return item == val.taskId
            })
          ) {
            val.choosed = true
          }
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
module.exports = addauditsource
