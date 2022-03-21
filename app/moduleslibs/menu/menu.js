require("./menu.less")
import Menu from '../../components/menu/menu.vue';

class menu extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "menu"
  }
  complete() {
    new Vue({
      el: "#menu",
      components: {
        "menu-component": Menu
      }
    })

    return;

    let that = this
    //this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, this.name)
    that.refreshmenu()
  }
  refreshmenu() {
    let that = this
    let ttt = window.location.hash.split("/")
    that.dom.find(".seleted").removeClass("seleted")
    that.dom.parents("xiaoul").addClass("hide")
    ES.selctorDoc(".menu a").dom.forEach(function(val, idx) {
      if (val.attr("link") == ttt[1]) {
        that.dom.find(".twonav").removeClass("seletedtwo")
        let dom = ES.selctorDoc(val).dom
        if (dom.hasClass("twolink")) {
          dom.parents("xiaoul").removeClass("hide")
          dom
            .parent()
            .parent()
            .parent()
            .addClass("seleted")
          dom.parent(".twonav").addClass("seletedtwo")
        } else {
          dom.parent(".firstnav").addClass("seleted")
        }
      }
    })
  }
  bindEvent() {
    let that = this
    //this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, this.name)
    that.dom.find(".onelink").on("click", function(value) {
      let selfDom = ES.selctorDoc(this)
      if (selfDom.parent(".firstnav").hasClass("seleted")) {
        if (selfDom.parent(".firstnav").find(".icon-icon-test3")) {
          if (
            selfDom
              .parent(".firstnav")
              .find(".xiaoul")
              .hasClass("hide")
          ) {
            selfDom
              .parent(".firstnav")
              .find(".xiaoul")
              .removeClass("hide")
            selfDom
              .parent(".firstnav")
              .find(".icon-icon-test3")
              .addClass("xuanzhuan")
          } else {
            selfDom
              .parent(".firstnav")
              .find(".xiaoul")
              .addClass("hide")
            selfDom
              .parent(".firstnav")
              .find(".icon-icon-test3")
              .removeClass("xuanzhuan")
          }
        }
      } else {
        that.dom.find(".firstnav").removeClass("seleted")
        that.dom.find(".xiaoul").addClass("hide")
        that.dom.find(".icon-icon-test3").removeClass("xuanzhuan")
        if (selfDom.attr("link")) {
          that.dom.find(".seletedtwo").removeClass("seletedtwo")
          that.app.changePage(selfDom.attr("link"))
          selfDom.parent(".firstnav").addClass("seleted")
          if (selfDom.parent(".firstnav").find(".icon-icon-test3")) {
            selfDom
              .parent(".firstnav")
              .find(".xiaoul")
              .removeClass("hide")
            selfDom
              .parent(".firstnav")
              .find(".icon-icon-test3")
              .addClass("xuanzhuan")
          }
        } else {
          selfDom.parent(".firstnav").addClass("seleted")
          if (selfDom.parent(".firstnav").find(".icon-icon-test3")) {
            selfDom
              .parent(".firstnav")
              .find(".xiaoul")
              .removeClass("hide")
            selfDom
              .parent(".firstnav")
              .find(".icon-icon-test3")
              .addClass("xuanzhuan")
          }
        }
      }
    })
    that.dom.find(".twolink").on("click", function(value) {
      let selfDom = ES.selctorDoc(this)
      if (selfDom.parent(".firstnav").hasClass("seleted")) {
      } else {
        if (selfDom.attr("link")) {
          that.dom.find(".twonav").removeClass("seletedtwo")
          if (selfDom.attr("type")) {
            that.app.changePage(selfDom.attr("link"), {
              type: selfDom.attr("type")
            })
          } else {
            that.app.changePage(selfDom.attr("link"))
          }
          selfDom
            .parent()
            .parent()
            .parent()
            .find(".xiaoul")
            .removeClass("hide")
          selfDom
            .parent()
            .parent()
            .parent()
            .addClass("seleted")
          selfDom.parent(".twonav").addClass("seletedtwo")
        }
      }
    })
  }
  offEvent() {
    this.dom.find(".onelink").off("click")
    this.dom.find(".twolink").off("click")
  }
  renderHtml() {
    this.dom.find(".firstnav .xiaoul").html("")
    if (this.app.userResource[0]) {
      this.app.userResource[0].forEach(v => {
        let arr = v.type.indexOf("$$") > -1 ? v.type.split("$$") : v.type.split("&&");
        if (this.dom.find('.firstnav[module="' + arr[1] + '"] .xiaoul').dom) {
          this.dom
            .find('.firstnav[module="' + arr[1] + '"] .xiaoul')
            .append(
              '<li class="twonav" id="' +
                v.id +
                '">\n' +
                '                    <a link="' +
                arr[0] +
                '" class="twolink" type="fs">' +
                v.name +
                "</a>\n" +
                "                </li>"
            )
        }
      })
      this.offEvent()
      this.bindEvent()
    }
  }
}

module.exports = menu
