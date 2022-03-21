require("./checkList.less")

// var html = require('./tpl.html')

class checkList extends Interstellar.modalBase {
  constructor(app, value, api, addMode) {
    super(app, value, api, addMode)
    this.html = require("./tpl.html")
    this.name = "checkList"
  }
  complete() {
    let that = this
    if (that.api.type == "add") {
      this.changeTitle("创建权限")
    } else {
      this.changeTitle("编辑权限")
      this.dom.find(".inputBox").val(that.api.name)
    }
    that.apidata = {}
    that.resourceIdList = []
    that.processresourceIdList = this.processingData(that.api.list)
    this.setData()
  }
  btnEven() {
    let that = this
    let resourceId = ""
    this.dom.find(".jur_topcheck").on("click", function() {
      let edom = ES.selctorDoc(this)
      let parentdom = edom.parent().parent()
      let code = edom.attr("data-code")
      let childId = parentdom.find(".jur_check").attr("data-code")
      if (edom.hasClass("checked")) {
        edom.removeClass("checked")
        parentdom.find(".jur_check").removeClass("checked")
        that.resourceIdList = []
      } else {
        edom.addClass("checked")
        parentdom.find(".jur_check").addClass("checked")
        that.resourceIdList.push(code)
        that.resourceIdList.push(childId)
      }
    })
    this.dom.find(".jur_check").on("click", function() {
      let edom = ES.selctorDoc(this)
      let pardom = edom
        .parent()
        .parent()
        .parent()
        .find(".jur_topcheck")
      pardom.addClass("checked")
      let code = edom.attr("data-code")
      let parentId = edom.attr("parentId")
      if (edom.hasClass("checked")) {
        edom.removeClass("checked")
        that.resourceIdList = []
      } else {
        edom.addClass("checked")
        if (that.api.type == "add") {
          that.resourceIdList.push(code)
          that.resourceIdList.push(parentId)
        } else {
          that.resourceIdList.push(code)
          resourceId = Number(parentId)
        }
      }
    })
    this.dom.find(".icon-guanbi").on("click", function() {
      that.close()
    })
    this.dom.find(".btn-cancel").on("click", function() {
      that.close()
    })
    that.dom.find(".inputBox").on("change", function() {
      that.apidata[ES.selctorDoc(this).attr("api")] = ES.selctorDoc(this).val()
    })
    this.dom.find(".btn-confirm").on("click", function() {
      that.dom.find(".inputLine").dom.forEach(function(val, idx) {
        val.find("." + val.attr("redlabel")).removeClass("redborder")
        val.find(".required").remove()
        if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
          val.find("." + val.attr("redlabel")).addClass("redborder")
          val
            .find("." + val.attr("redlabel"))
            .after(
              '<span class="required">' +
                Tool.checkForm(ES.selctorDoc(val).dom, "red") +
                "</span>"
            )
        }
      })
      if (
        that.dom.find(".redborder").dom &&
        that.dom.find(".redborder").dom.some(val => {
          return !val.parents("inputLine").hasClass("hide")
        })
      ) {
        return false
      } else {
        if (that.dom.find(".check_con .checked").dom) {
          that.dom.find(".check_con .checked").dom.forEach(v => {
            that.resourceIdList.push(v.attr("data-code"))
          })
        }
        if (that.api.type == "add") {
          that.event._dispatch("checkList.info", {
            name: that.dom.find(".inputBox").val(),
            resourceIdList: that.resourceIdList
          })
        } else {
          if (that.dom.find(".inputBox").val() == that.api.name) {
            that.event._dispatch("checkList.edit", {
              name: "",
              resourceIdList: that.resourceIdList
            })
          } else {
            that.event._dispatch("checkList.edit", {
              name: that.dom.find(".inputBox").val(),
              resourceIdList: that.resourceIdList
            })
          }
        }
      }
    })
  }
  setData() {
    let that = this
    let html = ""
    that.processresourceIdList.forEach(item => {
      html +=
        '<li><div class="jur_tltie">\n' +
        '<span class="jur_topcheck" data-code="' +
        item.id +
        '" type="' +
        item.type +
        '" parentId="' +
        item.parentId +
        '" ></span>\n' +
        '     <span class="jur_word" data-code="' +
        item.id +
        '" type="' +
        item.type +
        '" title="' +
        item.name +
        '">' +
        item.name +
        "</span>\n" +
        "  </div>"
      html += '<div class="perssion_right">'
      item.child.forEach(info => {
        html +=
          '      <div class="jur_contion">\n' +
          '          <span class="jur_check" data-code="' +
          info.id +
          '" type="' +
          info.type +
          '" parentId="' +
          info.parentId +
          '" ></span>\n' +
          '          <div class="jur_con" title="' +
          info.name +
          '">' +
          info.name +
          "</div>\n" +
          "      </div>\n"
      })
      html += "</div>"
      html += "</li>"
    })
    this.dom.find(".check_con").append(html)
    that.resize(this.dom.find(".check_das").box().clientHeight)
    if (that.api.type == "edit") {
      that.editset()
    }
    this.btnEven()
  }

  //处理数据
  processingData(value) {
    let arr = []
    value.map(val => {
      if (val.parentId == "0") {
        arr.push(val)
        val.child = []
      } else {
        arr.map(it => {
          if (it.id == val.parentId) {
            it.child.push(val)
          }
        })
      }
    })
    return arr
  }
  editset() {
    let that = this
    let arrchild = []
    that.api.list1.forEach(info => {
      let paid = info.id
      if (info.parentId == "0") {
        that.dom
          .find('.jur_topcheck[data-code="' + paid + '"]')
          .addClass("checked")
      } else {
        that.dom
          .find('.jur_check[data-code="' + paid + '"]')
          .addClass("checked")
      }
    })
  }
  changeTitle(value) {
    let that = this
    that.dom.find(".modal-title").html(value)
  }
  resize(value) {
    let that = this
    this.dom.find(".srocllcheck").css({
      height: value
    })
    let sch = this.dom.find(".check_con").box().clientHeight
    if (sch > value) {
      that.initcheckscroll()
    }
  }
  initcheckscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc(".srocllcheck").attr("id", rid)
    this.myScroll = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      scrollX: true,
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

//原型链一定要有的
module.exports = checkList
