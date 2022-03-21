require("./seriessubmit.less");
class alert extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = 'seriessubmit';
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
        this.dom.find('.modal-close').on('click', function() {
            that.hide();
        });
        that.dom.find('.btn-cancel').on('click', function() {
            that.hide();
            that.closeSure()
        });
        that.dom.find('.btn-confirm').on('click', function() {
            that.hide()
            that.sure();
        })
    }
    resize(){
        let that=this;
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