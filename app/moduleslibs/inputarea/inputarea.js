require('./inputarea.less')
class inputarea extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "inputarea"
    }
    complete() {
        this.bindevent();
        this.type=this.nowParam.type==undefined?0:this.nowParam.type//type为1时需要用户确认删除
        this.maxshownum=this.nowParam.maxshownum==undefined?10:this.nowParam.maxshownum
        this.linehigh=this.nowParam.linehigh==undefined?30:this.nowParam.linehigh
    }
    bindevent(){
        let that=this;
        that.dom.find('.contentinput').on('input',function () {
            that.event._dispatch('inputarea.input',ES.selctorDoc(this).val())
        })
        that.dom.find('.contentarea').on('click', function(e){
            e.stopPropagation()
            // that.dom.find('.labelsinput').focus();
            $('.contentinput').focus();
            that.event._dispatch('inputarea.focus')
        })
        that.dom.find('.mask').on('click', function(){
            that.dom.find('.contentul').html('')
            that.dom.find('.inputarea').blur()
            that.dom.find('.ularea').addClass('hide')
            that.dom.find('.mask').addClass('hide')
        })
        // that.dom.find('.contentinput').on('keydown', function(e) {
        //     let keyCode = e.keyCode
        //     if (event.keyCode === 13) {
        //         if (ES.selctorDoc(this).val() != '') {
        //             that.createlabel(ES.selctorDoc(this).val())
        //         }
        //     }
        // })
        // that.dom.find('.inputarea').on('blur', function() {
        //     if (ES.selctorDoc(this).val() != '') {
        //         that.createlabel(ES.selctorDoc(this).val())
        //     }
        // })
    }
    createlabel(value, value2,bool) {
        let that = this;
        that.dom.find('.mask').addClass('hide')
        that.dom.find('.ularea').addClass('hide')
        that.dom.find('.contentul').html('')
        if (that.dom.find('.chooseditem').dom && that.dom.find('.chooseditem').dom.length >= 10) {
            that.dom.find('.contentinput').val('');
            that.event._dispatch('inputarea.maxnum')
        } else {
            let label = '<span class="chooseditem" dataid="' + value2 + '">\n' +
                '                            <label>' + value + '</label>\n' +
                '                            <i class="iconfont icon-guanbi"></i>\n' +
                '                        </span>';
            that.dom.find('.contentinput').before(label)
            if (!value2) {
                that.event._dispatch('controls.createlabel', { val: that.dom.find('.contentinput').val() });
            }
            that.dom.find('.chooseditem .icon-guanbi').off('click');
            that.bindlabeldelete();
            that.dom.find('.contentinput').val('')
            if(!bool){
                that.event._dispatch('inputarea.createitem',value2);
            }

        }
    }
    bindlabeldelete() {
        let that = this;
        that.dom.find('.chooseditem .icon-guanbi').on('click', function(e) {
            e.stopPropagation()
            if(that.type==1){
                that.event._dispatch('inputarea.deleteitem',{id:ES.selctorDoc(this).parent().attr('dataid'),dom:ES.selctorDoc(this).parent()});
            }else{
                ES.selctorDoc(this).parent().remove();
                that.event._dispatch('inputarea.deleteitem',ES.selctorDoc(this).parent().attr('dataid'));
            }
        })
    }
    removedom(dom){
        dom.remove()
    }
    setlist(value){
        let that = this;
        let html = ''
        if (value) {
            value.forEach(function(val, idx) {
                html += '<li class="contentli" dataid="' + val.id + '">' + val.name + '</li>'
            })
            that.dom.find('.contentul').html(html)
            if(value.length>that.maxshownum){
                that.dom.find('.scroll').css({height:that.linehigh*that.maxshownum})
                that.initscrollmenu();
            }
            that.dom.find('.ularea').removeClass('hide')
            that.dom.find('.mask').removeClass('hide')
            that.dom.find('.contentli').on('click', function() {
                ES.selctorDoc(this).parent().html('')
                that.createlabel(ES.selctorDoc(this).html(), ES.selctorDoc(this).attr('dataid'))
            })
        } else {
            that.dom.find('.contentul').html('')
        }
    }
    render(value) {

    }
    disable(){
        this.dom.find('.contentinput').remove()
        this.dom.find('.contentarea .icon-guanbi').remove()
        this.dom.find('.contentarea').off('click')
    }
    loading(bool){
        if(bool){
            this.dom.find('.contentul').html('')
            this.dom.find('.scroll').css({height:'50px'})
            this.initscrollmenu();
            this.dom.find('.loading_xlk').removeClass('hide')
        }else{
            this.dom.find('.scroll').css({height:'unset'})
            this.dom.find('.loading_xlk').addClass('hide')
        }
    }
    initscrollmenu() {
        if (this.myScroll1) {
            this.myScroll1.refresh()
            return
        }

        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.scroll').attr('id', rid)
        this.myScroll1 = new IScroll('#' + rid, {
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
module.exports = inputarea;