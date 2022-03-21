require("./menutree.less")
class menutree extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "menutree"
  }
  complete() {
    this.configHtml = ""
    if (this.nowParam.bottom) {
      this.dom.find(".bottom").removeClass("hide")
      this.dom.find(".bottom").html(this.nowParam.bottom.name)
      this.dom.find(".bottom").on("click", e => {
        this.event._dispatch("menutree.itemAction", { type: "CREATE" })
      })
    }
    if (this.nowParam.itemconfig) {
      let html = ""
      this.nowParam.itemconfig.forEach(v => {
        html +=
          '<li class="itemAction" action="' + v.code + '">' + v.name + "</li>"
      })
      this.configHtml = '<ul class="actionUl">' + html + "</ul>"
    }
    this.dom.find(".treeArea").on("click", e => {
      let dom = ES.selctorDoc(e.target)
      if (e.target.className.lastIndexOf("icon-caozuo") !== -1) {
        this.dom.find(".actionUl").remove()
        dom.parent().append(this.configHtml)
      } else if (e.target.className.lastIndexOf("itemAction") !== -1) {
        this.event._dispatch("menutree.itemAction", {
          type: dom.attr("action"),
          id: dom
            .parent()
            .parent()
            .attr("did")
        })
        this.dom.find(".actionUl").remove()
      } else if (
        e.target.className.lastIndexOf("navFirst") !== -1 ||
        e.target.className.lastIndexOf("navName") !== -1
      ) {
        this.dom.find(".actionUl").remove()
        this.dom.find(".navFirst").removeClass("choosedks")
        this.dom.find(".navSecond").removeClass("choosed")
        this.dom.find(".erji").addClass("hide")
        if (this.dom.find(".groupaction").dom) {
          this.dom.find(".groupaction").remove()
        }
        if (e.target.className.lastIndexOf("navFirst") !== -1) {
          if (!dom.hasClass("choosedsk")) {
            dom.addClass("choosedks")
            this.event._dispatch("navFirst.choosed", {
              name: dom.firstchildren("span").html(),
              id: dom.attr("did"),
              config: dom.attr("config")
            })
          }
        } else {
          if (!dom.parent().hasClass("choosedsk")) {
            dom.parent().addClass("choosedks")
            this.event._dispatch("navFirst.choosed", {
              name: dom
                .parent()
                .firstchildren("span")
                .html(),
              id: dom.parent().attr("did"),
              config: dom.parent().attr("config")
            })
          }
        }
      }
    })
  }
  changeMenu(value, type) {
    let _Object = this
    let menudata
    let html1 = ""
    menudata = value
    _Object.dom.find(".treeArea").html("")
    if (type == "single") {
      menudata.forEach(function(val, i) {
        let tempdata = ""
        _Object.nowParam.config.forEach(function(v, idx) {
          tempdata += val[v] + ","
        })
        html1 +=
          '<li class="navFirst" did="' +
          val.id +
          '" config="' +
          tempdata +
          '">\n' +
          '<i class="iconfont ' +
          _Object.nowParam.icon +
          '"></i>\n' +
          '                <span class="navName" title="' +
          val.name +
          '">' +
          val.name +
          "</span>" +
          '<i class="iconfont ' +
          (_Object.nowParam.itemconfig ? "icon-caozuo" : "") +
          '"></i></li>'
      })
    } else {
      let level2 = []
      let html2 = ""
      let root = { root: [] }
      menudata.root.forEach(function(val, i) {
        let temp = menudata.root[i].id
        if (menudata[temp]) {
          html1 +=
            '<li class="navFirst" did="' +
            val.id +
            '">\n' +
            '<i class="iconfont icon-keshi"></i>\n' +
            '                <span title="' +
            val.name +
            '">' +
            val.name +
            "</span>\n" +
            '                <i class="xiala"></i>\n' +
            '                <ul class="erji hide">'
        } else {
          html1 +=
            '<li class="navFirst" did="' +
            val.id +
            '">\n' +
            '<i class="iconfont icon-keshi"></i>\n' +
            '                <span  title="' +
            val.name +
            '">' +
            val.name +
            "</span>\n" +
            '                <ul class="erji hide">'
        }

        if (menudata[temp]) {
          menudata[temp].forEach(function(value, idx) {
            html1 +=
              '<li class="navSecond" did="' +
              value.id +
              '">\n' +
              '                        <span  title="' +
              value.name +
              '">' +
              value.name +
              "</span>\n" +
              '                        <i class="iconfont icon-caozuo"></i>\n' +
              "                    </li>"
          })
        }
        html1 += "</ul></li>"
      })
    }
    _Object.dom.find(".treeArea").html(html1)
  }
}

//原型链一定要有的
module.exports = menutree
