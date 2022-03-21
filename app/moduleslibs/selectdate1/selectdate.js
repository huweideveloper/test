require("./selectdate.less")
// var monthCont = null;
// var yearCont = null;

class selectMouth extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.monthCont = null
    this.yearCont = null
    this.all_blone = "left"
    this.mouthName = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ]
  }

  // var nowYear = ''
  // var nowMouth = ''

  complete() {
    var datepick = require("./datepicker.js")

    var month = require("../selectmouth/selectmouth.js")
    var year = require("../selectyear/selectyear.js")
    let that = this
    this.dom.find(".today").on("click", function() {
      // var value;
      // value="";
      let maxArr = that.maxDay.split("-")
      maxArr.forEach(function(e, i) {
        maxArr[i] = parseInt(e)
      })
      let todayArr = Tool.GetDateStr(0).split("-")
      todayArr.forEach(function(e, i) {
        todayArr[i] = parseInt(e)
      })
      let flag = false
      if (maxArr[0] < todayArr[0]) {
        flag = true
      } else {
        if (maxArr[1] < todayArr[1]) {
          flag = true
        } else {
          if (maxArr[2] < todayArr[2]) {
            flag = true
          }
        }
      }
      if (flag) {
        that.alert("时间不在可选时间段内")
        return
      }
      that.event._dispatch("day.today", { st: Tool.GetDateStr(0) })
    })
    this.mode = this.nowParam.mode
    this.chooseStart =
      this.nowParam.data.startday != ""
        ? this.nowParam.data.startday
        : Tool.GetDateStr(0)
    this.chooseEnd =
      this.nowParam.data.endday != ""
        ? this.nowParam.data.endday
        : Tool.GetDateStr(0)
    this.maxDay = this.nowParam.data.max ? this.nowParam.data.max : ""
    this.minDay = this.nowParam.data.min ? this.nowParam.data.min : ""
    this.dataNow = new datepick({ model: "2", data: this.chooseStart })
    if (this.nowParam.mode == "s") {
      this.dom.css({ width: 220 })
      this.dom.find(".daterangepicker .left").show()
      // this.dom.find('.mon_left').show()
      // this.dom.find('.year_left').show()
      this.dom.find(".daterangepicker .right").addClass("hide")
      // this.dom.find('.mon_right').addClass('hide');
      // this.dom.find('.year_right').addClass('hide');
      this.showMouth(this.nowParam.data.endday, "left")
      that.dom.find(".del_left").show()
    } else {
      this.dom.css("width", 500)
      this.dom.find(".ranges").show()
      this.dom.find(".daterangepicker .calendar").show()
      this.showMouth(this.nowParam.data.startday, "left")
      this.showMouth(this.nowParam.data.endday, "right")
      that.dom.find(".del_left").hide()
    }
    that.monthCont = that.app.loadModule(
      month,
      that.dom.find(".monthpicker"),
      this.nowParam.data
    )
    that.monthCont.event._addEvent("month.click", function(val) {
      that.dom.find(".daypicker").hide()
      that.dom.find(".monthpicker").hide()
      that.dom.find(".yearpicker").show()
      that.yearCont.setYear(val)
    })
    that.monthCont.event._addEvent("mouth.change", function(val) {
      that.dom.find(".daypicker").show()
      that.dom.find(".monthpicker").hide()
      that.dom.find(".yearpicker").hide()
      if (val) {
        that.showMouth(val, that.all_blone)
      }
    })
    that.yearCont = that.app.loadModule(
      year,
      that.dom.find(".yearpicker"),
      this.nowParam.data
    )
    that.yearCont.event._addEvent("selectyear", function(val) {
      that.dom.find(".daypicker").hide()
      that.dom.find(".monthpicker").show()
      that.dom.find(".yearpicker").hide()
      if (val) {
        that.monthCont.setYear(val)
      }
    })
    this.dom.find(".calendar .prev").on("click", function() {
      var nowshowM = ES.selctorDoc(this)
        .parent()
        .find(".month")
        .attr("nowMoth")
        .split("-")
      var nowMouth = nowshowM[1] - 1 == 0 ? 12 : nowshowM[1] - 1
      var nowYear = nowshowM[1] - 1 == 0 ? nowshowM[0] - 1 : nowshowM[0]
      if (nowMouth < 10) {
        nowMouth = "0" + nowMouth
      }
      that.showMouth(
        nowYear + "-" + nowMouth,
        ES.selctorDoc(this).attr("blone")
      )
    })
    this.dom.find(".calendar .next").on("click", function() {
      var nowshowM = ES.selctorDoc(this)
        .parent()
        .find(".month")
        .attr("nowMoth")
        .split("-")
      var nowMouth = nowshowM[1] * 1 + 1 == 13 ? 1 : nowshowM[1] * 1 + 1
      var nowYear =
        nowshowM[1] * 1 + 1 == 13 ? nowshowM[0] * 1 + 1 : nowshowM[0]
      if (nowMouth < 10) {
        nowMouth = "0" + nowMouth
      }
      that.showMouth(
        nowYear + "-" + nowMouth,
        ES.selctorDoc(this).attr("blone")
      )
    })
    this.dom.find(".calendar .prevYear").on("click", function() {
      var nowshowM = ES.selctorDoc(this)
        .parent()
        .find(".month")
        .attr("nowMoth")
        .split("-")
      var nowYear = nowshowM[0] - 1 > 0 ? nowshowM[0] - 1 : nowshowM[0]
      var nowMouth = nowshowM[1]
      that.showMouth(
        nowYear + "-" + nowMouth,
        ES.selctorDoc(this).attr("blone")
      )
    })
    this.dom.find(".calendar .nextYear").on("click", function() {
      var nowshowM = ES.selctorDoc(this)
        .parent()
        .find(".month")
        .attr("nowMoth")
        .split("-")
      var nowYear = parseInt(nowshowM[0]) + 1
      var nowMouth = nowshowM[1]
      that.showMouth(
        nowYear + "-" + nowMouth,
        ES.selctorDoc(this).attr("blone")
      )
    })
    that.dom.find(".month").on("click", function() {
      that.all_blone = ES.selctorDoc(this).attr("blone")
      that.dom.find(".daypicker").hide()
      that.dom.find(".monthpicker").show()
      that.monthCont.resetDom(ES.selctorDoc(this).attr("nowmoth"))
    })
    this.dom.find(".ranges .btn-default").on("click", function() {
      that.dom.hide()
      that.event._dispatch("day.picker", {
        st: that.dealZero(that.chooseStart),
        et: that.dealZero(that.chooseEnd)
      })
    })
    this.dom.find(".day-picker-mask").on("click", function() {
      that.dom.hide()
      that.event._dispatch("day.close")
    })
    that.dom.find(".del_left").on("click", function() {
      that.resetTime(Tool.GetDateStr(0), Tool.GetDateStr(0), "left")
      that.dom.hide()
      that.event._dispatch("selectdate.delete")
    })
    that.dom.find(".del_all").on("click", function() {
      var arr = ["left", "right"]
      // ES.selctorDoc.each(arr, function(idx, val) {
      //     that.resetTime(Tool.GetDateStr(0), Tool.GetDateStr(0), val)
      // });
      that.dom.hide()
      that.event._dispatch("selectdate.delete")
    })
  }
  alert(msg) {
    let that = this
    that.app.alert.show({
      close: false,
      template: "<p>" + msg + "</p>",
      type: "tip",
      title: "提示",
      btn: '<a class="btn_modal btn-default">确定</a>'
    })
    that.app.alert.openUP()
  }
  refresh(value) {
    let that = this
    this.chooseStart = value.st ? value.st : this.chooseStart
    this.chooseEnd = value.et ? value.et : this.chooseEnd
    this.showMouth(this.chooseStart, "left")
    this.showMouth(this.chooseEnd, "right")
    that.event._dispatch("day.picker", {
      st: that.dealZero(that.chooseStart),
      et: that.dealZero(that.chooseEnd)
    })
  }
  setMaxmin(value) {
    let that = this
    if (value.max == "") this.maxDay = ""
    if (value.min == "") this.minDay = ""
    this.maxDay = value.max ? value.max : this.maxDay
    this.minDay = value.min ? value.min : this.minDay
    this.showMouth(this.chooseStart, "left")
  }
  attr(key, value) {
    let that = this
    if (!this[key]) {
      this[key] = value
    } else {
      if (value) {
        this[key] = value
      } else {
        return this[key]
      }
    }
  }
  initData(data, el) {
    let that = this
    var html = ""
    var nowMouth1 = this.dom
      .find("." + el + " .month")
      .attr("nowMoth")
      .split("-")
    for (var i = 0; i < data.length; i++) {
      var nowClass = "off"
      var day = ""
      if (data[i].row != undefined || data[i].row != null) {
        nowClass = ""
        day = nowMouth1[0] + "/" + nowMouth1[1] + "/" + data[i].day
      } else {
        if (i < 20) {
          var nowMouth = nowMouth1[1] * 1 - 1 == 0 ? 12 : nowMouth1[1] * 1 - 1
          var nowYear =
            nowMouth1[1] * 1 - 1 == 0 ? nowMouth1[0] * 1 - 1 : nowMouth1[0]
        } else {
          var nowMouth = nowMouth1[1] * 1 + 1 == 13 ? 1 : nowMouth1[1] * 1 + 1
          var nowYear =
            nowMouth1[1] * 1 + 1 == 13 ? nowMouth1[0] * 1 + 1 : nowMouth1[0]
        }
        day = nowYear + "/" + nowMouth + "/" + data[i].day
      }
      var act = ""
      if (this.maxDay) {
        if (
          new Date(day).getTime() -
            new Date(this.maxDay.replace(/-/g, "/")).getTime() >
          0
        ) {
          nowClass += " close"
        }
      }
      if (this.minDay) {
        if (
          new Date(day).getTime() -
            new Date(this.minDay.replace(/-/g, "/")).getTime() <
          0
        ) {
          nowClass += " close"
        }
      }
      if (data[i].nowDay == true) {
        act = "active"
      }
      switch (Math.floor(i % 7)) {
        case 0:
          html += "<tr>"
          html +=
            '<td blone="' +
            el +
            '" class="available ' +
            nowClass +
            " " +
            act +
            '">' +
            data[i].day +
            "</td>"
          break
        case 6:
          html +=
            '<td blone="' +
            el +
            '" class="available ' +
            nowClass +
            " " +
            act +
            '">' +
            data[i].day +
            "</td>"
          html += "</tr>"
          break
        default:
          html +=
            '<td blone="' +
            el +
            '" class="available ' +
            nowClass +
            " " +
            act +
            '">' +
            data[i].day +
            "</td>"
          break
      }
    }
    this.dom
      .find(".daterangepicker ." + el)
      .find("tbody")
      .html(html)
    this.dom.find(".daterangepicker ." + el + " td").on("click", function() {
      if (ES.selctorDoc(this).hasClass("close")) {
        if (that.nowParam.data.alert == "不显示") {
          var a = ES.selctorDoc(this)
            .parent()
            .parent()
            .siblings("thead")
            .find(".month")
            .attr("nowmoth")
          var d = ES.selctorDoc(this).html()
          if (parseInt(ES.selctorDoc(this).html()) < 10) {
            d = "0" + ES.selctorDoc(this).html()
          }
          var c = a + d
          var b = c.replace("-", "")
          if (parseInt(b) - 20161101 > 0) {
            if (parseInt(b) == 20161130 || parseInt(b) == 20161131) {
              return
            } else {
              that.alert("时间不在可选时间段内")
            }
          }
          return
        } else {
          that.alert("时间不在可选时间段内")
          return
        }
      }
      var day = that.dom
        .find("." + ES.selctorDoc(this).attr("blone") + " .month")
        .attr("nowmoth")
        .split("-")
      var socre = ""
      if (ES.selctorDoc(this).hasClass("off")) {
        if (ES.selctorDoc(this).html() * 1 > 15) {
          var nowMouth = day[1] * 1 - 1 == 0 ? 12 : day[1] * 1 - 1
          var nowYear = day[1] * 1 - 1 == 0 ? day[0] * 1 - 1 : day[0]
        }
        if (ES.selctorDoc(this).html() * 1 < 15) {
          var nowMouth = day[1] * 1 + 1 == 13 ? 1 : day[1] * 1 + 1
          var nowYear = day[1] * 1 + 1 == 13 ? day[0] * 1 + 1 : day[0]
        }
        if (nowMouth < 10) {
          nowMouth = "0" + nowMouth
        }
        socre = nowYear + "-" + nowMouth + "-" + ES.selctorDoc(this).html()
      } else {
        socre = day[0] + "-" + day[1] + "-" + ES.selctorDoc(this).html()
      }
      var pd = socre
      if (ES.selctorDoc(this).attr("blone") == "left") {
        if (that.mode != "s") {
          var chz =
            new Date(pd.replace(/-/g, "/")).getTime() -
            new Date(that.chooseEnd.replace(/-/g, "/")).getTime()
          if (chz > 0) {
            that.alert("开始时间不能晚于结束时间")
            return
          }
        }
        that.chooseStart = socre
      }

      if (ES.selctorDoc(this).attr("blone") == "right") {
        var aa = that.chooseStart
        var chz =
          new Date(pd.replace(/-/g, "/")).getTime() -
          new Date(aa.replace(/-/g, "/")).getTime()
        if (chz < 0) {
          that.alert("结束时间不能早于开始时间")
          return
        }
        that.chooseEnd = socre
      }
      that.showMouth(socre, ES.selctorDoc(this).attr("blone"))
      if (that.mode == "s") {
        that.dom.hide()
        that.event._dispatch("day.picker", {
          st: that.dealZero(that.chooseStart),
          et: that.dealZero(that.chooseEnd)
        })
        that.event._dispatch("day.close")
      } else {
      }
    })
  }
  showMouth(value, r) {
    let that = this
    let allD = []
    allD = value.split("-") || value.split("/")
    switch (r) {
      case "right":
        that.dom.find(".right .month").attr("nowMoth", allD[0] + "-" + allD[1])
        break
      case "left":
        that.dom.find(".month").attr("nowMoth", allD[0] + "-" + allD[1])
        break
    }
    that.dom.find(".month").html(allD[0] + "年" + allD[1] + "月")
    var which = ""
    if (r == "left") {
      which = this.chooseStart
    } else {
      which = this.chooseEnd
    }
    if (that.dealZero(which).lastIndexOf(value + "-") != -1) {
      this.dataNow.init(that.noZero(which))
    } else {
      this.dataNow.init(that.noZero(value))
    }
    that.initData(this.dataNow.getDatePicker().data, r)
  }
  resetTime(showDay, day, r) {
    let that = this
    this.chooseStart = day
    this.chooseEnd = showDay
    if (r == "left") {
      that.showMouth(day, r)
    } else {
      that.showMouth(showDay, r)
    }
  }
  dealZero(value) {
    let that = this
    var newDa = value.split("-")
    newDa =
      newDa[0] +
      "-" +
      ("0" + newDa[1].replace(/(^\s*)|(\s*$)/g, "")).slice(-2) +
      "-" +
      ("0" + newDa[2].replace(/(^\s*)|(\s*$)/g, "")).slice(-2)
    return newDa
  }
  //去掉0
  noZero(value) {
    let that = this
    var newDa = value.split("-")
    newDa = newDa[0] + "-" + newDa[1] * 1 + "-" + newDa[2] * 1
    return newDa
  }
}

//原型链一定要有的
module.exports = selectMouth
