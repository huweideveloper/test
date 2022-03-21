require("./pagesizeset.less")
class pagesizeset extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
  }
  complete() {
    this.render()
  }
  static get dropConfig() {
    return [
      { val: "每页10条", idx: 10 },
      { val: "每页20条", idx: 20 },
      { val: "每页50条", idx: 50 },
      { val: "每页100条", idx: 100 }
    ]
  }
  config(value) {
    this.pagesize.render({
      firstSelect: value[0],
      data: value
    })
  }
  render() {
    let con = pagesizeset.dropConfig
    this.deferred = ES.Deferred()
    require.ensure("../../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      this.pagesize = this.app.loadModule(
        dropdown,
        this.dom.find(".pagesize"),
        {
          className: "xlk",
          firstSelect: con[0],
          data: con
        }
      )
      this.pagesize.event._addEvent("option.click", value => {
        this.event._dispatch("pagesizeset.change", { num: value.idx })
      })
      this.pagesize.event._addEvent("dropDown.clear", value => {
        this.event._dispatch("pagesizeset.change", { num: 10 })
      })
      this.deferred.resolve({})
    })
  }
  getTotal(value, value1) {
    this.dom.find(".nowpage").html(1)
    this.dom.find(".totalpage").html(value)
    this.dom.find(".totalnum").html(value1)
    // if(this.pagesize){
    //   this.pagesize.reset('fff')
    // } else {
    //   this.deferred.done(()=>{
    //     this.pagesize.reset('fff')
    //   })
    // }
  }
  setnowpage(value, pageSize) {
    this.dom.find(".nowpage").html(value)
    if (pageSize) {
      this.dom.find(".nowname").attr("placeholder", "每页" + pageSize + "条")
      this.dom.find(".pagesize .select").removeClass("select")
      this.dom
        .find('.pagesize .option[data-idx="' + pageSize + '"]')
        .addClass("select")
    }
  }
}

module.exports = pagesizeset
