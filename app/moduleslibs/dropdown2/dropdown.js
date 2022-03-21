

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
        that.dom.find('.selected2 span').html(ES.selctorDoc('.select').html())
        that.dom.find('.selected2 span').attr('data-idx', ES.selctorDoc('.select').attr('data-idx'))
    }
    select(){
        var that = this
        this.dom.find('.selected2').on('click', function(e){
            e.stopPropagation();           
           
            ES.selctorDoc(this).find('.icon').addClass('drop')
            that.dom.find('._dropdown2').show()
               
                
        })
        this.dom.find('._dropdown2 .mask').on('click', function(){
            ES.selctorDoc(this).parent().hide()
            that.dom.find('.icon').removeClass('drop')            
        })
        this.dom.find('.option').on('click', function(){
            that.dom.find('.option').removeClass('select')
            ES.selctorDoc(this).addClass('select')
            that.dom.find('.selected2 .showname').html(ES.selctorDoc(this).attr('data-val')||ES.selctorDoc(this).html())
            that.dom.find('.selected2 .showname').attr('data-idx', ES.selctorDoc(this).attr('data-idx'))
            that.dom.find('._dropdown2').hide()
            that.dom.find('.icon').removeClass('drop')
            that.event._dispatch('option.click', { val: that.dom.find('.selected2 .showname').html(), idx: that.dom.find('.selected2 .showname').attr('data-idx')})
        })
    }
}

//原型链一定要有的
module.exports = index;