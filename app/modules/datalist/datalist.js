require("./datalist.less")
// var html = require('./tpl.html')

class bztoollist extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "datalist"
    this.data = []
  }
  complete() {
    if (!this.nowParam.addnew) {
      this.dom.find(".icon-tianjia").remove()
    }
    require.ensure("../../modal/editdataconfig/editdataconfig.js", () => {
      this.editdataconfigClass = require("../../modal/editdataconfig/editdataconfig.js")
    })
    this.dom.find(".addBtn").on("click", () => {
      this.event._dispatch("datalist.addChoose")
    })
  }
  setData(value, type) {
    this.dom.find("ul").html("")
    if (value.length != 0) {
      for (var i = 0; i < value.length; i++) {
        this.addli(value[i], type)
      }
    }
    this.dom
      .find("ul .multili")
      .eq(0)
      .click()
  }

  addli(value, type) {
    let that = this
    let temp = "（"
    switch (value.type) {
      case "number":
        temp += "数字范围模式）"
        break
      case "radio":
        temp += "单选模式）"
        break
      case "time":
        temp += "时间模式）"
        break
      case "checkBox":
        temp += "复选模式）"
        break
    }
    let str =
      '<li bid="' +
      value.id +
      '" class="multili multili' +
      value.id +
      '" code="' +
      value.code +
      '" title="' +
      value.name +
      '"><span>' +
      value.name +
      temp +
      '</span><a class="delicon iconfont icon-shanchu hide" title=""></a></li>'
    this.dom.find("ul").append(str)
    this.dom
      .find("ul .multili" + value.id + " .delicon")
      .on("click", function() {
        console.log("shan")
      })
    this.dom.find("ul .multili" + value.id).on("click", function() {
      that.dom.find("ul .multili").removeClass("choose")
      let dom = ES.selctorDoc(this)
      dom.addClass("choose")
      that.chooseData = { bid: dom.attr("bid"), code: dom.attr("code") }
      that.event._dispatch("datalist.choose", that.chooseData)
    })
  }
}

//原型链一定要有的
module.exports = bztoollist
