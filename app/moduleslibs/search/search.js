require("./search.less");

class search extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'search'
        this.keyword = ''
    }
    complete(){
        let that = this
        let placeholder = that.app.languageMode.getTranslate(that.app.language, this.name, 'search1')
        this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, this.name)
        this.dom.find('.searchCont').attr('placeholder', placeholder)
        this.dom.find('.searchbtn').on('click', function () {
            that.keyword = that.dom.find('.searchCont').val()
            that.event._dispatch('search.click', that.keyword)
        })

        this.dom.find('.searchCont').on('focus', function(){
            ES.selctorDoc(this).attr('placeholder', '')
        })
        this.dom.find('.searchCont').on('blur', function () {
            ES.selctorDoc(this).attr('placeholder', placeholder)
        })
        this.dom.find('.searchCont').on('keydown', function(e){
            let keyCode = e.keyCode
            if (event.keyCode === 13) {
                ES.selctorDoc(this).click();
            }
        })
    }
    reset(){
        this.keyword = ''
        this.dom.find('.searchCont').val('')
    }
}
//原型链一定要有的
module.exports = search;
