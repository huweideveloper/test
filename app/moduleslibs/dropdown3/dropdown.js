

require('./dropdown.less')
// var html = require('./tpl.html')

class index extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
    }
    complete() {
        // var that = this
        // this.html = html
        let cw = ES.selctorDoc(window).box().clientWidth
        let ch = ES.selctorDoc(window).box().clientHeight
        this.dom.find('.mask').css({ 'width': cw * 5, 'height': ch * 5, 'left': -cw * 2, 'top': -ch * 2 })
        this.select()
    }
    reset(){
        var that=this;
        that.dom.find('.selected3 .showname').html(ES.selctorDoc('.default').html())
        that.dom.find('.selected3 .showname').attr('data-idx', ES.selctorDoc('.default').attr('data-idx'))
    }
    getData(){
        return this.dom.find('.selected3 .showname').html()
    }
    select(){
        var that = this
        this.dom.find('.selected3').on('click', function(e){
            e.stopPropagation();           
           
            ES.selctorDoc(this).addClass('selecting')
            ES.selctorDoc(this).find('.icon').addClass('drop')
            that.dom.find('._dropdown').show()
               
                
        })
        this.dom.find('._dropdown .mask').on('click', function(){
            ES.selctorDoc(this).parent().hide()
            // ES.selctorDoc(this).parent().parent().find('.selected3').removeClass('selecting')
            // ES.selctorDoc(this).parent().parent().find('.icon').removeClass('drop')
            that.dom.find('.selected3').removeClass('selecting')
            // ES.selctorDoc(that).find('.icon').removeClass('drop')
            that.dom.find('.icon').removeClass('drop')            
        })
        this.dom.find('.option').on('click', function(){
            that.dom.find('.option').removeClass('select')
            ES.selctorDoc(this).addClass('select')
            that.dom.find('.selected3 .showname').html(ES.selctorDoc(this).attr('data-val')||ES.selctorDoc(this).html())
            that.dom.find('.selected3 .showname').attr('data-idx', ES.selctorDoc(this).attr('data-idx'))
            that.dom.find('._dropdown').hide()
            that.dom.find('.selected3').removeClass('selecting')
            that.dom.find('.icon').removeClass('drop')
            that.event._dispatch('option.click', { val: that.dom.find('.selected3 .showname').html(), idx: that.dom.find('.selected3 .showname').attr('data-idx'), studyDate: that.dom.find('.selected3 .showname').attr('data-studyDate')})
        })
    }
}

//原型链一定要有的
module.exports = index;