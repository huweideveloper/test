require("./symcard.less")

//  参数： name: 病灶种类 inReport（是否显示数据报告）  exam: 检查所见   sug: 总结意见

class symcard extends Interstellar.moduleBase {
  constructor(app, dom, value, addMore) {
    super(app, dom, value, addMore)
    this.name = "symcard"
    this.html = require("./tpl.html")
    this.err = require("../../modal/errCorrection/err")
    this.copysuccess = require("../../modal/copysuccess/copysuccess")
  }
  complete() {
    let that = this
    that.app.languageMode.setTranslate(
      that.dom.find("[data-i18n]").dom,
      that.app.language,
      "symcard"
    )
    let error = that.app.languageMode.getTranslate(
      that.app.language,
      "symcard",
      "error"
    )
    let check = that.app.languageMode.getTranslate(
      that.app.language,
      "symcard",
      "check"
    )
    this.render()
    if (this.nowParam.readOnly) {
      return
    }
    this.dom.find(".exam_copy").on("click", function() {
      let text = that.dom
        .find("._examine")
        .html()
        .trim()
      text = text
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "")
        .replace(/<br>/g, "   ")
        .replace(/&nbsp;/g, " ")
        .replace(/<span.*?>/g, "")
        .replace(/<\/span>/g, "")
      that.copy(text)
    })
    this.dom.find(".sug_copy").on("click", function() {
      let text = that.dom
        .find("._suggestion")
        .html()
        .trim()
      text = text
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "")
        .replace(/<br>/g, "   ")
        .replace(/&nbsp;/g, " ")
        .replace(/<span.*?>/g, "")
        .replace(/<\/span>/g, "")
      that.copy(text)
    })
    this.dom.find("._examine").on("blur", function() {
      that.event._dispatch("symcard.blur")
    })
    this.dom.find("._suggestion").on("blur", function() {
      that.event._dispatch("symcard.blur")
    })
    this.dom.find("._examine").on("input", function() {
      that.event._dispatch("symcard.input")
    })
    this.dom.find("._suggestion").on("input", function() {
      that.event._dispatch("symcard.input")
    })
    this.dom.find("._wrong").on("click", function() {
      // console.log(that.nowParam.nidusType)
      if (ES.selctorDoc(this).attr("data-mark") == "1") {
        let xrayErr = that.app.loadModal(that.err, { adv: true })
        xrayErr.event._addEvent("err.remarks", function(value) {
          that.dom.find("._wrong").attr("data-mark", "0")
          // that.dom.find('._wrong').html('撤销纠错')
          that.dom.find("._wrong").html(error)
          that.dom.find("._shi").css({ width: 0 })
          value.nidusType = that.nowParam.nidusType
          value.mark = 1
          // console.log(11111, value)
          that.event._dispatch("symcard.err", value)
        })
      } else {
        that.dom.find("._wrong").attr("data-mark", "1")
        // that.dom.find('._wrong').html('纠错')
        that.dom.find("._wrong").html(check)
        that.dom.find("._shi").css({ width: that.width })
        let value = {
          nidusType: that.nowParam.nidusType,
          mark: 0
        }
        // console.log(11111, value)
        that.event._dispatch("symcard.err", value)
      }
    })
  }

  render() {
    let that = this
    let prob = this.nowParam.prob
    let num

    if (this.nowParam.readOnly) {
      this.dom.find("._copy").addClass("disabled")
      this.dom.find("._wrong").addClass("disabled")
      this.dom.find(".contentbox").attr("contenteditable", false)
    }

    if (prob < 10) {
      num = 0
    } else if (prob < 30) {
      num = 1
    } else if (prob < 50) {
      num = 2
    } else if (prob < 70) {
      num = 3
    } else if (prob < 90) {
      num = 4
    } else {
      num = 5
    }
    if (num != 0) {
      // if (this.nowParam.inReport) {
      that.dom.find(".info_box").show()
    } else {
      that.dom.find("._noData").show()
      that.dom.find("._copy").hide()
      that.dom.find("._wrong").hide()
    }

    // let num1 = parseInt(this.nowParam.prob / 20 )
    // let num2 = this.nowParam.prob % 20 / 20
    let width = 0
    if (!this.nowParam.mark) {
      width = num * 24
    }
    this.width = num * 24 //   用于撤销纠错

    this.dom.find("._shi").css({ width: width })
  }
  copy(text) {
    if (!text) {
      return
    }
    let that = this
    let oInput = document.createElement("input")
    oInput.value = text
    document.body.appendChild(oInput)
    oInput.select() // 选择对象
    document.execCommand("Copy") // 执行浏览器复制命令
    oInput.className = "oInput"
    oInput.style.display = "none"
    document.body.removeChild(oInput)

    //   复制成功toast
    let cw = ES.selctorDoc(window).box().clientWidth
    let ch = ES.selctorDoc(window).box().clientHeight
    let data = {
      cw: cw,
      ch: ch,
      // flag: true,
      page: "xray",
      msg: that.app.languageMode.getTranslate(
        that.app.language,
        "symcard",
        "success"
      )
    }
    that.app.loadModal(that.copysuccess, {
      adv: true,
      param: data
    })

    that.app.logcreate({
      obj: "XRAY_REPORT",
      action: "COPY",
      target: that.app.parpam.studyId,
      token: that.app.local.get("token")
    })

    //  that.app.alert.show({
    //     title: " ",
    //     close: true,
    //     footer: true,
    //     template: '<div style="padding-top: 30px;"><i class="iconfont icon-duihao" style="color: #599BA2; font-size: 20px;"></i>' +
    //         '<span style="font-size: 18px;margin-left:10px;">' + that.app.languageMode.getTranslate(that.app.language, 'symcard', 'success') + '</span></div>',
    //     sure: function () {
    //          that.app.alert.hide()
    //      }
    //  })
  }
  getData() {
    let exam = this.dom.find("._examine").html()
    let sug = this.dom.find("._suggestion").html()
    let nidusType = this.nowParam.nidusType
    return { see: exam, conclusion: sug, nidusType: nidusType }
  }
}

//原型链一定要有的
module.exports = symcard
