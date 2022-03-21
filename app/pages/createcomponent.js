class createcomponent extends Interstellar.pagesBase {
  complete() {
    ES.selctorDoc("#menu").hide()
    ES.selctorDoc("#content").css({
      marginLeft: "unset"
    })
    ES.selctorDoc(".header").addClass("yisheng")
    ES.selctorDoc("#content").css({ width: "100%" })
    let that = this
    this.flag = true
    this.yymcdata = [
      {
        val: "医院1",
        idx: "1"
      },
      {
        val: "医院2",
        idx: "2"
      }
    ]
    this.type = this.app.parpam.type
    this.componentId = this.app.parpam.componentid
    this.apiData = {}
    this.nowcontrols = null
    this.resize()
    this.dom.find(".component").on("click", function() {
      let textcontrol = require("../modules/textcontrols/textcontrols")
      let selectcontrol = require("../modules/selectcontrols/selectcontrols")
      let checkboxcontrol = require("../modules/checkboxcontrols/checkboxcontrols")
      let obj = {
        text: textcontrol,
        select: selectcontrol,
        checkbox: checkboxcontrol
      }
      that.nowcontrols = that.app.loadModule(
        obj[ES.selctorDoc(this).attr("type")],
        that.dom.find(".mainarea"),
        {}
      )
      that.nowcontrols.event._addEvent("controls.heightchange", function() {
        that.initscroll()
      })
      that.nowcontrols.event._addEvent("controls.createlabel", function(value) {
        let json = {
          category: "component",
          text: value.val
        }
        that.api.createlabel(json).done(function(res) {
          if (res.code == 0) {
            that.nowcontrols.setid(res.data.id, value.val)
          }
        })
      })
      that.nowcontrols.event._addEvent("controls.inputlabel", function(value) {
        let json = {
          pageSize: 10,
          category: "component",
          text: value.val
        }
        setTimeout(function() {
          that.api.searchlabel(json).done(function(res) {
            if (res.code == 0) {
              if (res.data) {
                that.nowcontrols.labelul(res.data.list)
                that.dom.find(".mask").removeClass("hide")
              } else {
                that.nowcontrols.labelul("")
                that.dom.find(".mask").addClass("hide")
              }
            }
          })
        }, 1000)
      })
      that.flag = false
      that.dom.find(".component").addClass("hide")
      ES.selctorDoc(this).removeClass("hide")
      that.apiData = {}
      that.apiData.type = ES.selctorDoc(this).attr("type")
      that.dom
        .find("." + ES.selctorDoc(this).attr("type") + "area")
        .removeClass("hide")
      that.initscroll()
    })
    that.dom.find(".mask").on("click", function() {
      that.nowcontrols.labelul("")
      that.dom.find(".mask").addClass("hide")
    })
    this.dom.find(".cancel").on("click", function() {
      that.dom.find(".mask").addClass("hide")
      if (that.type == "edit" || that.type == "view") {
        that.app.changePage("componentmanage")
      } else {
        if (that.nowcontrols !== null) {
          that.dom.find(".mainarea").html("")
          that.dom.find(".component").removeClass("hide")
          that.initscroll()
          that.nowcontrols = null
        } else {
          that.app.changePage("componentmanage")
        }
      }
    })
    that.dom.find(".save").on("click", function() {
      that.apiData = that.nowcontrols.checkrequired()
      if (that.apiData) {
        if (that.type == "new") {
          that.api.create(that.apiData).done(function(res) {
            if (res.code == 0) {
              that.app.changePage("componentmanage")
            } else {
              alert("新增失败")
            }
          })
        } else {
          that.apiData.id = that.componentId
          that.api.update(that.apiData).done(function(res) {
            if (res.code == 0) {
              that.app.changePage("componentmanage")
            } else {
              alert("编辑失败")
            }
          })
        }
      }
    })
    if (this.type == "edit") {
      that.dom.find(".bigtitle").html("编辑标注字段")
      that.dom.find(".stitle").addClass("hide")
      that.setData()
      //that.bindevent();
    } else if (this.type == "view") {
      that.dom.find(".bigtitle").html("查看标注字段")
      that.dom.find(".save").addClass("hide")
      that.dom.find(".cancel").html("关闭")
      that.dom.find(".stitle").addClass("hide")
      that.setData()
    }
  }
  setData() {
    let that = this
    let json = {
      id: parseInt(that.componentId)
    }
    that.api.getdetails(json).done(function(res) {
      that.dom.find('.component[type="' + res.data.type + '"]').click()
      that.nowcontrols.render(res.data)
      if (that.type == "view") {
        that.dom
          .find(".mainarea .icon-guanbi")
          .parent()
          .addClass("hide")
        if (that.dom.find(".iconfont").dom) {
          that.dom.find(".mainarea .iconfont").addClass("hide")
        }
        if (that.dom.find(".check-box").dom) {
          that.dom.find(".check-box").dom.forEach(function(val, idx) {
            if (val.hasClass("choose")) {
              val.removeClass("choose")
              that.dom.find(".check-box").off("click")
              val.addClass("choose")
            } else {
              that.dom.find(".check-box").off("click")
            }
          })
        }
        that.dom.find(".isdefault").off("click")
        that.dom.find(".component").off("click")
        that.dom.find("input").attr("disabled", "disabled")
      }
    })
  }
  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    ES.selctorDoc(".createcomponent").css({ height: ch })
    ES.selctorDoc(".mainarea").css({ "min-height": ch - 250 })
  }
  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc(".createcomponent").attr("id", rid)
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
module.exports = createcomponent
