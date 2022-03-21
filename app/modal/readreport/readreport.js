require("./readreport.less")
// var html = require('./tpl.html')

class readreport extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "biaozhulist"
    this.flag = true
    this.code = ""
  }
  complete() {
    let that = this
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".cancel").on("click", function() {
      that.close()
    })
    this.dom.find(".download").on("click", function() {
      var a = document.createElement("a")
      var url = "/images/page/CC.csv"
      a.href = url
      a.download = "模板.csv"
      a.click()
    })
    this.dom.find(".upload").on("click", function() {
      that.app.loading.show()
      setTimeout(function() {
        that.app.loading.hide()
      }, 1000)
      that.dom.find(".catelogname").removeClass("redborder")
      that.dom.find(".required").remove()
      if (that.dom.find(".catelogname").val() == "") {
        that.dom.find(".catelogname").addClass("redborder")
        that.dom
          .find(".catelogname")
          .after('<span class="required">必填</span>')
      } else {
        let json = {
          localPath: that.dom.find(".catelogname").val()
        }
        that.event._dispatch("readreport.upload", { data: json })
      }
    })
    this.render()
  }
  render(value) {
    let that = this
    require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      that.yymc = that.app.loadModule(dropdown, that.dom.find(".ssyy"), {
        className: "xlk",
        firstSelect: {
          val: "请选择所属医院",
          idx: ""
        },
        data: [
          {
            val: "男",
            idx: "M"
          },
          {
            val: "女",
            idx: "F"
          }
        ]
      })
      that.bwxz = that.app.loadModule(dropdown, that.dom.find(".bwxz"), {
        className: "xlk",
        firstSelect: {
          val: "部位选择",
          idx: ""
        },
        data: [
          {
            val: "男",
            idx: "M"
          },
          {
            val: "女",
            idx: "F"
          }
        ]
      })
    })
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
module.exports = readreport
