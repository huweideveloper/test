require("./errorlist.less");
class errorlist extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = "errorlist";
    }
    complete() {
        let that=this;
       console.log(this.api)
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        this.dom.find('.upload').on('click',function () {
            that.event._dispatch('errorlist.sure')
        })
        this.dom.find('.cancel').on('click',function () {
            that.close()
            that.event._dispatch('errorlist.cancel')
        })
        this.dom.find('.modal-title').html(this.api.title)
        if(this.api.type=='keyvalue'){
            that.render()
        }
    }
    render(){
        let that=this;
        let rendercontent=''
        Object.keys(that.api.data).forEach(function (val) {
            rendercontent+='<p><span class="left">'+val+':</span><span class="right">'+that.api.data[val]+'</span></p>'
        })
        that.dom.find('.list').append(rendercontent)
        if(that.api.attachdata){
            that.dom.find('.list').before('<p>'+that.api.attachdata+'</p>')
        }
        that.initscroll()
    }
    initscroll() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.modal-content').attr('id', rid)
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
module.exports = errorlist;
