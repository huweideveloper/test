require("./rangechoose.less")
class ctlist extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.name = "rangechoose"
    this.html = require("./tpl.html")
  }
  complete() {
    let cw = ES.selctorDoc(window).box().clientWidth
    let ch = ES.selctorDoc(window).box().clientHeight
    // this.dom.find('.range-mask').css({ 'left': 360 - cw, 'width': cw })
    this.dom
      .find(".range-mask")
      .css({ left: -cw * 2, width: cw * 5, height: ch * 5, top: -ch * 2 })
    this.initAll()
  }
  initAll() {
    this.lineWidth = 85
    this.setdom()
    let dowpagex
    let st = false
    let that = this
    this.dom.find(".range").on("mousedown", function(e) {
      st = true
      dowpagex = e.pageX
      // that.lineWidth = e.pageX - ES.selctorDoc('.info_area').box().offsetLeft - ES.selctorDoc('.rot').box().offsetLeft + 33 - 5 - 8
      that.lineWidth =
        e.pageX -
        ES.selctorDoc(".info_area").box().offsetLeft -
        ES.selctorDoc(".rot").box().offsetLeft +
        21 //  + 35 - 5 - 9
      that.setdom()
    })
    this.dom.find(".range-text").on("click", function(e) {
      e.stopPropagation()
      that.dom.find(".range-mask").show()
      that.dom.find(".control-content").show()
      ES.selctorDoc(this).addClass("select")
      that.dom.find("img").attr("src", "")
    })
    this.dom.find(".range-mask").on("click", function() {
      that.dom.find(".range-mask").hide()
      that.dom.find(".control-content").hide()
      that.dom.find(".range-text").removeClass("select")
      that.dom.find("img").attr("src", "/images/icon/color_arrow_down1.png")
    })
    this.dom.on("mousemove", function(e) {
      if (st) {
        that.lineWidth += e.pageX - dowpagex
        dowpagex = e.pageX
        that.setdom()
      }
      // console.log(e)
    })
    this.dom.on("mouseup", function(e) {
      e.stopPropagation()
      st = false
      //  console.log(e)
    })
    this.dom.find(".control-content").on("mouseleave", function() {
      st = false
    })
    this.dom.find(".range_sure_btn").on("click", function() {
      that.dom.find(".range-mask").hide()
      that.dom.find(".control-content").hide()
      that.dom.find(".range-text").removeClass("select")
      that.dom.find("img").attr("src", "/images/icon/color_arrow_down1.png")
      that.event._dispatch("rangechoose.confim", { data: that.lineWidth })
    })
  }
  setdom() {
    this.lineWidth = this.lineWidth < 0 ? 0 : this.lineWidth
    this.lineWidth = this.lineWidth > 100 ? 100 : this.lineWidth
    // this.dom.find('.range .rnage-line').css({ "height": this.lineheight })
    this.dom.find(".range .rnage-line").css({ width: 100 - this.lineWidth })
    this.dom
      .find(".range .range-background")
      .css({ width: 100 - this.lineWidth })
    // this.dom.find('.range .range-round').css({ "bottom": ((this.lineheight - 4 < 0) ? 0 : (this.lineheight - 4)) })
    this.dom.find(".range .range-round").css({ left: this.lineWidth - 3 })
    // this.dom.find('.range-now').html(this.lineheight)
    this.dom.find(".range-now").html(this.lineWidth)
    // this.dom.find('.range-now').css({ top: 80 - 60*this.lineheight/100 })
    this.dom.find(".range-now").css({ left: 15 + this.lineWidth * 0.9 })
    this.dom.find(".range-now").show()
    // if (this.lineheight == 0 || this.lineheight == 100) {
    //     this.dom.find('.range-now').hide()
    // }
  }
  reset() {
    this.lineWidth = 85
    this.setdom()
  }
}
module.exports = ctlist
