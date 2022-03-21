require("./apialert.less");

class apitest extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = 'apitest';
        this.footer = false;
        this.body = '';

    }
    sure(value) {
        this.hide()
    }
    complete() {
        let that = this
        this.body = this.dom.find('.modal-body');
        this.dom.find('.btn-cancel, .modal-close').on('click', function() {
            that.hide();
            that.closeSure()
        });
        this.dom.find('.btn-confirm').on('click', function() {
            that.hide()
            that.sure();
        })
        //if(this.initDate.close)
    }
    show(value) {
        var code;
        let that = this
        var hint = '';
        if (value.msg) {
            hint = value.msg;
            that.dom.find('.modal-title').html(value.title ? value.title : '错误提示');
            that.dom.find('.modal-body').html('<p>' + hint + '</p>');
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
            that.dom.find('.modal').css({ 'width': value.resize.width, 'height': value.resize.height })
        } else {
            that.dom.find('.modal').css({ 'width': '480px', 'height': '262px' })
        }
        if (value.sure && value.sure instanceof Function) {
            this.sure = value.sure;
        } else {
            this.sure = function() {
                that.hide();
            }
        }
        if (value.closeSure && value.closeSure instanceof Function) {
            that.closeSure = value.closeSure
        } else {
            that.closeSure = function() {}
        }
        if (value.noshadow) {
            that.dom.find('.modal').addClass('noshadow')
        } else {
            that.dom.find('.modal').removeClass('noshadow')
        }
        that.dom.show();
    }
    hide() {
        this.dom.hide();
    }
}

//原型链一定要有的
module.exports = apitest;