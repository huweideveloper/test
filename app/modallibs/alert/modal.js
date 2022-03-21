require("./modal.less");
class alert extends Interstellar.modalBase {
  constructor(app, value, api, addMode) {
    super(app, value, api, addMode)
    this.html = require('./tpl.html')
    this.name = 'alert';
    this.footer = false;
    this.body = '';
  }
  sure(value) {
    this.hide()
  }
  complete() {
    let that = this
    that.resize();
    that.body = that.dom.find('.modal-body');
    that.dom.find('.btn-cancel, .modal-close').on('click', function () {
      that.hide();
      that.closeSure()
    });
    that.dom.find('.btn-confirm').on('click', function () {
      that.hide()
      that.sure();
    })
  }
  resize() {
    let that = this;
    //that.dom.find('.modal-sm').css({'margin-left':-(that.dom.find('.modal-sm').box().clientWidth/2)+'px'})
  }
  show(value) {
    let that = this
    var code;
    var hint = '';
    if (value.msg) {
      hint = value.msg;
      that.dom.find('.modal-title').html(value.title ? value.title : '错误提示');
      that.dom.find('.modal-body').html('<p style="width:320px;text-align:left;margin:0 auto;">' + hint + '</p>');
    } else {
      that.dom.find('.modal-title').html(value.title || '');
      that.dom.find('.modal-body').html(value.template || '');
    }
    if (!value.close) {
      that.dom.find('.btn-cancel').hide()
      that.dom.find('.modal-close').hide()
      that.dom.find('.btn-confirm').css('margin-right', 0)
    } else {
      //that.dom.find('.btn-cancel').show()
      that.dom.find('.modal-close').show()
      that.dom.find('.btn-confirm').css('margin-right', 20)
    }
    if (value.footer) {
      that.dom.find('.modal-footer').hide();
      that.dom.find('.modal-body').css({ height: (ES.selctorDoc('.modal').box().clientHeight - 2 * ES.selctorDoc('.modal-header').box().clientHeight) / 2 })
    } else {
      that.dom.find('.modal-footer').show()
      that.dom.find('.modal-body').css({ height: 'unset' })
    }
    if (value.resetBtn) {
      that.dom.find('.btn').css({ 'width': value.resetBtn })
    }
    if (value.resize) {
      that.dom.find('.modal').css({ 'width': value.resize.width, 'height': value.resize.height, 'margin-left': -value.resize.width / 2 })
    } else {
      that.dom.find('.modal').css({ 'width': '480px', 'height': '262px', 'margin-left': '-240px' })
    }
    if (value.sure && value.sure instanceof Function) {
      this.sure = value.sure;
    } else {
      this.sure = function () {
        that.hide();
      }
    }
    if (value.closeSure && value.closeSure instanceof Function) {
      that.closeSure = value.closeSure
    } else {
      that.closeSure = function () { }
    }
    if (value.noshadow) {
      that.dom.find('.modal').addClass('noshadow')
    } else {
      that.dom.find('.modal').removeClass('noshadow')
    }
    if (value.resetbody) {
      that.dom.find('.showalert').css({ 'padding': value.resetbody.padding })
    }
    that.dom.show();
  }
  hide() {
    this.dom.hide();
  }
}
//原型链一定要有的
module.exports = alert;