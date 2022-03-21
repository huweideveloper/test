require("./discurdreason.less")
// var html = require('./tpl.html')

class discurdreason extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "discurdreason"
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
      value: {
        name: '<span data-i18n="age" data-name="年龄">编码</span>',
        type: "text",
        code: "checkid",
        w: "50%",
        ww: "50%",
        n: "40"
      },
      name: {
        name: '<span data-i18n="age" data-name="年龄">名称</span>',
        type: "text",
        code: "checkid",
        w: "50%",
        ww: "50%"
      }
    }
    obj["type"] = "center"
    obj["chose"] = "all"
    obj["chosew"] = "30px"
    obj["tablewidth"] = ES.selctorDoc(".discurdtable").box().clientWidth - 60
    require.ensure("../../moduleslibs/list/list", function() {
      let cont_table = require("../../moduleslibs/list/list")
      that.table = that.app.loadModule(
        cont_table,
        that.dom.find(".discurdtable"),
        {
          icon: obj["icon"],
          type: "center",
          chose: "all",
          chosew: "30px",
          tablewidth: ES.selctorDoc(".discurdtable").box().clientWidth - 60,
          minwidth: 100
        }
      )
      that.table.event._addEvent("list.check", function(value) {
        let temp = value
        let idsStr = "," + temp.id.toString() + ","
        if (temp.type == "del") {
          that.datalist = that.datalist.filter(function(item) {
            return item.id != temp.id
          })
        } else {
          that.datalist.push(temp.data)
        }
      })
      that.table.event._addEvent("list.allcheck", function(value) {
        console.log(value, "value")
        let temp = value
        let idsStr = "," + temp.id.toString() + ","
        console.log(that.datalist, "before", idsStr)
        if (temp.type == "add") {
          temp.data.map(item => {
            if (idsStr.lastIndexOf("," + item.id + ",") != -1) {
              that.datalist.push(item)
            }
          })
        } else if (temp.type == "del") {
          // temp.data=temp.data.filter((item) => {
          //     return idsStr.lastIndexOf(',' + item.id + ',') == -1
          // })
          that.datalist = that.datalist.filter(item => {
            return idsStr.lastIndexOf("," + item.id + ",") == -1
          })
        }
        console.log(that.datalist, "after")
      })
      that.dom.find(".list-content").removeClass("hide")
    })
  }
  setMain(bool, value) {
    console.log(value, "valuelallalala")
    let that = this
    let data2 = []
    let res = ""
    if (value) {
      res = value
    }
    if (res.length > 0) {
      res.forEach(function(val, idx) {
        if (
          that.datalist.some(item => {
            return item.id == val.id
          })
        ) {
          val.choosed = true
        }
        let obj = {}
        obj.id = val.id
        obj.operation = that.action
        data2.push(obj)
      })
      that.table.setData(res, data2)
    } else {
      that.table.noData()
    }
    that.initscrollmenu()
  }
  initscrollmenu() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }

    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".discurdtable").attr("id", rid)
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
module.exports = discurdreason
