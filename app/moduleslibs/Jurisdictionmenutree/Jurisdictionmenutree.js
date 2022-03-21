require("./Jurisdictionmenutree.less")
class Jurisdictionmenutree extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "Jurisdictionmenutree"
  }
  complete() {
    let _Object = this
    _Object.listdata = []
    _Object.dom.find(".addteam").on("click", function() {
      _Object.event._dispatch("menutree.creat", { type: "creat" })
    })
  }
  changeMenu(value, type) {
    let _Object = this
    let menudata
    let html1 = ""
    menudata = value
    _Object.dom.find(".treeArea").html("")
    if (type == "single") {
      menudata.forEach(function(val, i) {
        let tempdata = ""
        _Object.nowParam.forEach(function(v, idx) {
          tempdata += val[v] + ","
        })
        html1 +=
          '<li class="navFirst" did="' +
          val.id +
          '" config="' +
          tempdata +
          '">\n' +
          '<i class="iconfont icon-yonghu"></i>\n' +
          '                <span  title="' +
          val.name +
          '">' +
          val.name +
          "</span></li>"
      })
    } else {
      let level2 = []
      let html2 = ""
      let root = { root: [] }
      menudata.root.forEach(function(val, i) {
        let temp = menudata.root[i].id
        html1 +=
          '<li class="navFirst" did="' +
          val.pid +
          '" data-name="' +
          val.name +
          '">\n' +
          '<span  title="' +
          val.name +
          '">' +
          val.name +
          "</span>\n" +
          '<i class="iconfont icon-caozuo"></i>\n' +
          " </li>"
      })
    }
    _Object.dom.find(".treeArea").html(html1)
    _Object.addBtn()
    _Object.dom
      .find(".navFirst")
      .eq(0)
      .click()
  }
  edicperssion(data) {
    return (this.listdata = data)
  }
  addBtn() {
    let _Object = this
    // this.dom.find('.searchCont').on('focus', function() {
    //   ES.selctorDoc(this).attr('placeholder', '')
    // })
    // this.dom.find('.searchCont').on('blur', function() {
    //   ES.selctorDoc(this).attr('placeholder', '搜索')
    //   let value = ES.selctorDoc(this).val();
    //   // _Object.event._dispatch('menutree.search', { name: value})
    // })
    _Object.dom.find(".navFirst i").on("click", function() {
      let edit = "编辑"
      let delete1 = "删除"
      let did = ES.selctorDoc(this)
        .parent()
        .attr("did")
      let html =
        '<div class="groupaction top">\n' +
        '<span class="edit">' +
        edit +
        "</span>\n" +
        '<span class="delete">' +
        delete1 +
        "</span>\n" +
        "</div>"
      let dom = ES.selctorDoc(this).parent()
      if (dom.find(".groupaction").dom == undefined) {
        if (_Object.dom.find(".groupaction").dom) {
          _Object.dom.find(".groupaction").remove()
        }
        dom.append(html)
        _Object.dom.find(".groupaction .edit").on("click", function(e) {
          e.stopPropagation()
          let id = ES.selctorDoc(this)
            .parent()
            .parent()
            .attr("did")
          let name = ES.selctorDoc(this)
            .parent()
            .parent()
            .attr("data-name")
          _Object.event._dispatch("menutree.edit", {
            id: Number(id),
            name: name
          })
        })
        _Object.dom.find(".groupaction .delete").on("click", function(e) {
          e.stopPropagation()
          let id = ES.selctorDoc(this)
            .parent()
            .parent()
            .attr("did")
          _Object.app.alert.show({
            title: "",
            template:
              '<span style="font-size: 18px;margin-left:20px;color: #333333;font-family: "MicrosoftYaHei">确定删除吗？</span>',
            close: true,
            resetBtn: "90px",
            sure: function() {
              _Object.event._dispatch("menutree.confirm", id)
            }
          })
          _Object.dom.find(".groupaction").remove()
        })
      } else {
        dom.find(".groupaction").remove()
      }
    })
    _Object.dom.find(".navFirst").on("click", function() {
      _Object.dom.find(".navFirst").removeClass("choosedks")
      if (!ES.selctorDoc(this).hasClass("choosedsk")) {
        ES.selctorDoc(this).addClass("choosedks")
        _Object.event._dispatch("navFirst.choosed", {
          id: ES.selctorDoc(this).attr("did"),
          name: ES.selctorDoc(this).attr("data-name")
        })
      }
    })
  }
  addchecklistClose() {
    let _Object = this
    _Object.checklist1.close()
  }
}

//原型链一定要有的
module.exports = Jurisdictionmenutree
