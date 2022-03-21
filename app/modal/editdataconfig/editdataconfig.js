require("./editdataconfig.less")
class editdataconfig extends Interstellar.modalBase {
  constructor(app, value, api, addMode) {
    super(app, value, api, addMode)
    this.html = require("./tpl.html")
    this.name = "editdataconfig"
    this.data = {}
  }
  complete(value) {
    let that = this
    this.dom.find(".editdataconfig input").on("blur", function() {
      let dom = ES.selctorDoc(this)
      that.data[dom.attr("name")] = dom.val().trim()
    })
    this.render()
  }
  showerror(msg) {
    console.log(msg)
    for (let i = 0; i < msg.length; i++) {
      console.log(msg[i])
      this.dom.find("." + msg[i].name).html(msg[i].msg)
      this.dom.find("." + msg[i].name).removeClass("hide")
    }
  }
  render() {
    let that = this
    switch (this.initDate.type) {
      case "option":
        this.dom.find(".xxx").hide()
        this.dom.find(".zzz").hide()
        break
      case "code-need":
        this.dom.find(".zzz").hide()
        break
      case "drop":
        that.dom.find(".yyy span").html("机构名称")
        that.dom.find(".xxx span").html("机构编码")
        require.ensure("../../moduleslibs/dropdown1/drop", function() {
          let dropdown = require("../../moduleslibs/dropdown1/drop")
          let woptions = [
            { optionname: "医院", val: "医院", idx: "HOSPITAL" },
            { optionname: "企业", val: "企业", idx: "ENTERPRISE" }
          ]
          let firstSelect
          let guojihua = that.app.loadModule(
            dropdown,
            that.dom.find(".editdataconfig .jg"),
            {
              className: "xlk",
              firstSelect: firstSelect ? firstSelect : { idx: "", val: "" },
              data: woptions
            }
          )
          guojihua.event._addEvent("option.click", function(res) {
            that.data.type = res.idx
            if (!that.initDate.data) {
              console.log(that.initDate.data, "that.initDate.data")
              that.event._dispatch("editdataconfig.typechange", res.idx)
            }
          })
          guojihua.event._addEvent("dropDown.clear", function(res) {
            delete that.data.type
            // that.event._dispatch('editdataconfig.finish')
          })
          if (that.initDate.data) {
            that.dom
              .find(
                '.editdataconfig .jg .option[data-idx="' +
                  that.initDate.data.type +
                  '"]'
              )
              .click()
            guojihua.disable()
          }
        })
        break
    }
    console.log(this.initDate.data, "this.initDate.data")
    if (this.initDate.data) {
      this.data = JSON.parse(JSON.stringify(this.initDate.data))
      this.dom
        .find('.editdataconfig input[name="name"]')
        .val(this.initDate.data.name)
      this.dom
        .find('.editdataconfig input[name="code"]')
        .attr("readonly", "readonly")
      this.dom
        .find('.editdataconfig input[name="code"]')
        .css({ background: "#e8e8e8" })
      this.dom
        .find('.editdataconfig input[name="code"]')
        .val(this.initDate.data.code)
    }
    if (this.initDate.itemtitle) {
      for (let i in this.initDate.itemtitle) {
        this.dom.find("." + i + " span").html(this.initDate.itemtitle[i])
      }
    }
  }
  setmaxcode(value) {
    this.dom.find('input[name="code"]').val(value + 1)
    this.data.code = value + 1
  }
}
//原型链一定要有的
module.exports = editdataconfig
