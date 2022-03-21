class register extends Interstellar.pagesBase {
  complete() {
    let that = this
    this.keshi = ""
    this.zhicheng = ""
    ES.selctorDoc("#header").addClass("hide")
    ES.selctorDoc("#menu").addClass("hide")
    ES.selctorDoc("#content").css({
      marginLeft: "unset"
    })
    that.render()
    that.dom.find(".nextstep").on("click", function() {
      that.dom.find(".main1").addClass("hide")
      that.dom.find(".main2").removeClass("hide")
      that.dom.find(".steps span").removeClass("stepnow")
      that.dom
        .find(".steps")
        .eq(1)
        .find("span")
        .addClass("stepnow")
    })
    that.dom.find(".submit").on("click", function() {
      that.dom.find(".main2").addClass("hide")
      that.dom.find(".main3").removeClass("hide")
      that.dom.find(".steps span").removeClass("stepnow")
      that.dom
        .find(".steps")
        .eq(2)
        .find("span")
        .addClass("stepnow")
    })
    that.dom.find(".cancel").on("click", function() {
      that.app.changePage("login")
    })
    that.dom.find(".returnbtn").on("click", function() {
      that.app.changePage("login")
    })
    that.resize()
  }
  render() {
    let that = this
    require.ensure("../moduleslibs/dropdown1/drop.js", function() {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      that.zhicheng = that.app.loadModule(
        dropdown,
        that.dom.find(".zhicheng"),
        {
          className: "xlk",
          firstSelect: {
            val: "请选择",
            idx: ""
          },
          data: [
            {
              val: "sdf",
              idx: "M"
            },
            {
              val: "sef",
              idx: "F"
            }
          ]
        }
      )
    })
  }
  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".register").attr("id", rid)
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
  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight
    ES.selctorDoc(".register").css({ height: ch })
    this.initscroll()
  }
}
module.exports = register
