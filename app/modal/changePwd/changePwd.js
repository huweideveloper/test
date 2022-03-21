require("./changePwd.less");
class changePwd extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = "changePwd";
    }
    complete(value) {
        //this.reg = /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}$/;
        this.reg = /^[^\s]{6,16}$/;
        this.apidata = {};
        this.initView()
    }
    initView() {
        let that=this
        this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, this.name)
        let new1 = that.app.languageMode.getTranslate(that.app.language, 'changePwd', 'new')
        let old = that.app.languageMode.getTranslate(that.app.language, 'changePwd', 'old')
        let confirm = that.app.languageMode.getTranslate(that.app.language, 'changePwd', 'confirm')
        ES.selctorDoc('.oldPwd').attr('placeholder', old)
        ES.selctorDoc('.newPwd').attr('placeholder', new1)
        ES.selctorDoc('.verPwd').attr('placeholder', confirm)
        that.dom.find('input').on('focus', function() {
            ES.selctorDoc(this).attr('placeholder', '')
        })
        that.dom.find('.oldPwd').on('blur', function() {
            ES.selctorDoc(this).attr('placeholder', old)
        })
        that.dom.find('.newPwd').on('blur', function() {
            ES.selctorDoc(this).attr('placeholder', new1)
        })
        that.dom.find('.verPwd').on('blur', function() {
            ES.selctorDoc(this).attr('placeholder', confirm)
        })
        this.dom.find('.btn-confirm').on('click', function() {
            that.dom.find('.inputLine').dom.forEach(function(val, idx) {
                val.find('.'+val.attr('redlabel')).removeClass('redborder')
                val.find('.required').remove();
                console.log(Tool.checkForm(ES.selctorDoc(val).dom,'red'))
                if(Tool.checkForm(ES.selctorDoc(val).dom,'red')!==''){
                    val.find('.'+val.attr('redlabel')).addClass('redborder')
                    val.find('.'+val.attr('redlabel')).after('<span class="required">'+Tool.checkForm(ES.selctorDoc(val).dom,'red')+'</span>')
                }
            })
            if(that.dom.find('.redborder').dom){
                return false
            }else{
                if(that.dom.find('.newPwd').val().trim()!==that.dom.find('.verPwd').val().trim()){
                    that.dom.find('.verPwd').addClass('redborder')
                    that.dom.find('.verPwd').after('<span class="required">两次密码不一致</span>')
                    return false;
                }
                that.apidata.oldPassword = that.dom.find('.oldPwd').val().trim();
                that.apidata.newPassword = that.dom.find('.newPwd').val().trim();
                that.event._dispatch('changePwd.password', that.apidata)
            }
        })
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close()
        })
        // that.dom.find('.forget').on('click', function() {
        //     that.close()
        //     that.event._dispatch('changePwd.forget', {})
        // })
        that.dom.find('.inputLine .iconfont').on('click', function() {
            if(ES.selctorDoc(this).hasClass('icon-biyan')){
                ES.selctorDoc(this).parent().find('input').attr('type', 'text')
                ES.selctorDoc(this).removeClass('icon-biyan')
                ES.selctorDoc(this).addClass('icon-biyan1')
            }else{
                ES.selctorDoc(this).parent().find('input').attr('type', 'password')
                ES.selctorDoc(this).removeClass('icon-biyan1')
                ES.selctorDoc(this).addClass('icon-biyan')
            }
        })
    }
    showerr(value) {
        let that=this
        that.dom.find('.oldPwd').addClass('redborder')
        that.dom.find('.oldPwd').after('<span class="required">'+value+'</span>')
    }
}
//原型链一定要有的
module.exports = changePwd;