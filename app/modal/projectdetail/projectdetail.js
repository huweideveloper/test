require('./projectdetail.less')
// var html = require('./tpl.html')

class projectdata extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'projectdetail'
        this.flag = true;
        this.code=''
    }
    complete() {
        let that = this
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        that.initscrollmenu()
        this.render()
    }
    render(value){
        let that = this
        console.log(that.api,'apii')
        that.dom.find('.name').html(that.api.data.name);
        that.dom.find('.remark').html(JSON.parse('"'+that.api.data.remark+'"'));

        //that.api.data.remarkFileUrl='http://video-static.xdcdn.xiaodutv.com/browse_static/v3/common/widget/global/player/newPlayer_e2332cd1.swf'
        if(that.api.data.remarkFileUrl){
            let temparr=JSON.parse(that.api.data.remarkFileUrl)
            temparr.forEach(function (val,idx) {
                that.dom.find('.imgcontrol').append('<li imgurl="'+val+'" class="controls"></li>')
            })
        }
        that.dom.find('.controls').on('click',function () {
            let url=ES.selctorDoc(this).attr('imgurl')
            let temp=url.lastIndexOf('.')
            let imgtype=',jpg,png,gif,WMF,webp,'
            let videotype=',ogg,mp4,swf,'

            if(imgtype.lastIndexOf(url.substring(temp+1))!==-1){
                let aa=new Image()
                aa.onload=function(){
                    that.dom.find('.infoarea').html(this.outerHTML)
                    that.initscrollmenu()
                }
                aa.src=url
            }else if(videotype.lastIndexOf(url.substring(temp+1))!==-1){
                let html='<video width="600" height="350" controls>\n' +
                    '    <source src="'+url+'" type="video/mp4">\n' +
                    '    <source src="'+url+'" type="video/ogg">\n' +
                    '    您的浏览器不支持 video 标签。\n' +
                    '</video>'
                that.dom.find('.infoarea').html(html)
                that.initscrollmenu();
            }
        })
        that.dom.find('.controls').eq(0).click()
    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }

        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.scroll1').attr('id', rid)
        this.myScroll = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            scrollX:true,
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
module.exports = projectdata;