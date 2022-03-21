require("./breadcrumb.less")
class breadcrumb extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.list = []
  }
  complete() {
    this.render(this.nowParam)
  }
  render(value) {
    let that = this
    this.app.renderTemplate(this.html, value)
    this.dom.find(".breadcrumb a").on("click", function() {
      var index = Number($(this).attr("otherId"))
      var item = value.list[index]
      that.event._dispatch("breadcrumb.click", item)
    })
  }
}
module.exports = breadcrumb
