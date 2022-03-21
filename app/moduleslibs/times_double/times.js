require("./times.less")

class times_double extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./times.html")
    this.name = "time"
    this.num = 0
  }
  complete() {
    let that = this
    var time = require("../selectdate_double/selectdate.js")
    var title =
      this.nowParam.titleShow != undefined ? this.nowParam.titleShow : true
    var st = this.nowParam.startTime != undefined ? this.nowParam.startTime : ""
    var et = this.nowParam.endTime != undefined ? this.nowParam.endTime : ""
    this.dw =
      this.nowParam.defaultword != undefined ? this.nowParam.defaultword : ""
    var min = this.nowParam.min ? this.nowParam.min : ""
    var max = this.nowParam.max ? this.nowParam.max : ""
    if (!title) {
      that.dom.find(".timeTitle").html("")
    }
    that.dom.find(".day_left .Timers").html(st)
    that.dom.find(".day_right .Timers").html(et)
    this.daypicker = this.app.loadModule(time, this.dom.find("#day-double"), {
      mode: "s",
      data: { startday: st, endday: et, max: max, min: min }
    })
    that.dom.find(".day_left").on("click", function() {
      that.clickLeft()
    })
    that.dom.find(".day_right").on("click", function() {
      that.clcikRight()
    })
    if (that.dw) {
      that.dom.find(".showData span").html(that.dw)
    }
    this.daypicker.event._addEvent("day.picker", function(val) {
      if (val.blone == "left") {
        that.dom.find(".day_left .Timers").html(val.st)
      }
      if (val.blone == "right") {
        that.dom.find(".day_right .Timers").html(val.et)
      }
      that.dom.find("#day-double").hide()
      let st =
        that.dom.find(".day_left .Timers").html() == that.dw
          ? ""
          : that.dom.find(".day_left .Timers").html()
      let et =
        that.dom.find(".day_right .Timers").html() == that.dw
          ? ""
          : that.dom.find(".day_right .Timers").html()
      that.event._dispatch("times1.day", { st: st, et: et })
    })
    this.daypicker.event._addEvent("selectdate.delete", function() {
      that.dom.find(".day_left .Timers").html(that.dw)
      that.dom.find(".day_right .Timers").html(that.dw)
    })
    that.dom.find(".iconfont").on("mouseenter", function() {
      if (that.dom.find(".Timers").html() !== "") {
        ES.selctorDoc(this).addClass("icon-shanchutishiicon")
        ES.selctorDoc(this).removeClass("icon-riliriqi")
        //that.dom.find('.icon-shanchu1').off('click')
      }
    })
    that.dom.find(".iconfont").on("click", function(e) {
      if (ES.selctorDoc(this).hasClass("icon-shanchutishiicon")) {
        e.stopPropagation()
        ES.selctorDoc(this).removeClass("icon-shanchutishiicon")
        ES.selctorDoc(this).addClass("icon-riliriqi")
        ES.selctorDoc(this)
          .parent()
          .find(".Timers")
          .html(that.dw)
        if (
          ES.selctorDoc(this)
            .parent()
            .hasClass("day_left")
        ) {
          that.daypicker.refresh({ st: "", blone: "left" })
        } else {
          that.daypicker.refresh({ et: "", blone: "right" })
        }

        that.event._dispatch("times.dele", {
          dom: ES.selctorDoc(this).parent()
        })
      }
    })
    that.dom.find(".iconfont").on("mouseleave", function() {
      if (ES.selctorDoc(this).hasClass("icon-shanchutishiicon")) {
        ES.selctorDoc(this).removeClass("icon-shanchutishiicon")
        ES.selctorDoc(this).addClass("icon-riliriqi")
      }
    })
  }
  clickLeft() {
    let that = this
    that.dom.find(".day-picker-content").css({ left: "40px" })
    that.dom.find("#day-double").show()
    var st,
      et = ""
    if (
      that.dom.find(".day_left .Timers").html() == "" ||
      that.dom.find(".day_left .Timers").html() == that.dw
    ) {
      et =
        that.dom.find(".day_right .Timers").html() != "" &&
        that.dom.find(".day_right .Timers").html() != that.dw
          ? that.dom.find(".day_right .Timers").html()
          : Tool.GetDateStr(0)
      st = et
    } else if (
      that.dom.find(".day_right .Timers").html() == "" ||
      that.dom.find(".day_right .Timers").html() == that.dw
    ) {
      st = that.dom.find(".day_left .Timers").html()
      et = st
    } else {
      st = that.dom.find(".day_left .Timers").html()
      et = that.dom.find(".day_right .Timers").html()
    }
    //第一个为要显示的日期
    that.daypicker.resetTime(st, et, "left")
  }
  clcikRight() {
    let that = this
    let left1 = ES.selctorDoc(".day_left").box().clientWidth + 56
    that.dom.find(".day-picker-content").css({ left: left1 })
    that.dom.find("#day-double").show()
    var st,
      et = ""
    if (
      that.dom.find(".day_left .Timers").html() == "" ||
      that.dom.find(".day_left .Timers").html() == that.dw
    ) {
      et =
        that.dom.find(".day_right .Timers").html() != "" &&
        that.dom.find(".day_right .Timers").html() != that.dw
          ? that.dom.find(".day_right .Timers").html()
          : Tool.GetDateStr(0)
      st = et
    } else if (
      that.dom.find(".day_right .Timers").html() == "" ||
      that.dom.find(".day_right .Timers").html() == that.dw
    ) {
      st = that.dom.find(".day_left .Timers").html()
      et = st
    } else {
      st = that.dom.find(".day_left .Timers").html()
      et = that.dom.find(".day_right .Timers").html()
    }
    //第一个为要显示的日期
    that.daypicker.resetTime(st, et, "right")
  }
  refreshData(value, type) {
    if (type == "stet") {
      this.setStEt(value)
    } else if (type == "maxmin") {
      this.setMaxmin(value)
    } else {
      this.setMaxmin(value)
      this.setStEt(value)
    }
  }
  //限制开始和结束
  setStEt(value) {
    this.daypicker.refresh({ st: value.st, et: value.et })
    this.dom.find(".day_left .Timers").html(value.st)
    this.dom.find(".day_right .Timers").html(value.et)
  }
  setMaxmin(value) {
    this.daypicker.setMaxmin({
      max: value.max ? value.max : "",
      min: value.min ? value.min : ""
    })
  }
  disable() {
    this.dom.find(".showData").off("click")
    this.dom.find(".icon-riliriqi").off("click")
    this.dom.find(".icon-riliriqi").off("mouseenter")
    this.dom.find(".icon-shanchutishiicon").off("click")
  }
}

module.exports = times_double
