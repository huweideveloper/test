

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
        this.dom.find('.mask').css({ 'width': cw * 5, 'height': ch * 6, 'left': -cw * 2, 'top': -ch * 2 })
        this.select()
        //this.initscrollmenu();
    }
    reset(){
        var that=this;
        that.dom.find('.selected .showname').html(ES.selctorDoc('.default').html())
        that.dom.find('.selected .showname').attr('data-idx', ES.selctorDoc('.default').attr('data-idx'))
        that.dom.find('.option').removeClass('select')
        that.dom.find('.default').addClass('select')

    }
    select(){
        var that = this
        this.dom.find('.selected').on('click', function(e){
          
            e.stopPropagation();           
           
            ES.selctorDoc(this).addClass('selecting')
            ES.selctorDoc(this).find('.icon').addClass('drop')
            that.dom.find('._dropdown').show()
            that.initscrollmenu();
                
        })
        this.dom.find('._dropdown .mask').on('click', function(){
            ES.selctorDoc(this).parent().parent().hide()
            // ES.selctorDoc(this).parent().parent().find('.selected').removeClass('selecting')
            // ES.selctorDoc(this).parent().parent().find('.icon').removeClass('drop')
            that.dom.find('.selected').removeClass('selecting')
            // ES.selctorDoc(that).find('.icon').removeClass('drop')
            that.dom.find('.icon').removeClass('drop')            
        })
        this.dom.find('.option').on('click', function(){
            that.dom.find('.option').removeClass('select')
            ES.selctorDoc(this).addClass('select')
            that.dom.find('.selected .showname').html(ES.selctorDoc(this).attr('data-val')||ES.selctorDoc(this).html())
            that.dom.find('.selected .showname').attr('data-idx', ES.selctorDoc(this).attr('data-idx'))
            that.dom.find('._dropdown').hide()
            that.dom.find('.selected').removeClass('selecting')
            that.dom.find('.icon').removeClass('drop')
            that.event._dispatch('option.click', { val: that.dom.find('.selected .showname').html(), idx: that.dom.find('.selected .showname').attr('data-idx')})
        })

    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }

        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('._dropdown .scroll').attr('id', rid)
        this.myScroll = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            hideScrollbar: false,
            vScrollbar: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            disableMouse: true,
            disablePointer: true
        });
    }
}

//原型链一定要有的
module.exports = index;