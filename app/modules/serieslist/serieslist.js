require("./serieslist.less");

/**/
class SeriesList extends Interstellar.moduleBase {
    constructor(app, dom, value, addMore) {
        super(app, dom, value, addMore)
        this.html = require('./tpl.html')
        this.cornerstoneArray = {}
    }
    complete() {
        this.dom.find('.serieslist').html('')
        this.class_c = require("../../utils/cornerstone_class.js")
    }
    setData(value, type) {
        let that = this
        let data = this.listData = value // this.initDate.data
        this.dom.find('.serieslist').html('')
        let htmlStr = ""
        let num = 0

        for (let i in data) {
            //console.log(this.initsingle(data[i], type))
            data[i].index = num
            htmlStr = htmlStr + this.initsingle(data[i], type)
            num++
        }
        /*for (let i = 0; i < data.length; i++) {
            htmlStr = htmlStr + this.initsingle(data[i])
        }*/
        this.dom.find('.serieslist').append(htmlStr)
        this.dom.find('.serieslist').css({
            'width': num * 105
        })
        if (type == "DCM") {
            for (let i in data) {
                console.log(data[i].info.data.seriesInstanceUID)
                console.log(data[i].imgs[0])
                console.log('aaaaaaaaaa', this.dom.find('#img' + data[i].index).dom[0].dom)
                new this.class_c({
                    element: this.dom.find('#img' + data[i].index).dom[0].dom,
                    totalImage: 1,
                    imageAddress: [data[i].imgs[0]],
                    index: (Tool.changeToName(data[i].imgs[0]) || 1) - 1,
                    type: 'dcm'
                })
            }
        }
        this.dom.find('.serieslist .wk').on('click', function() {
            let dom = ES.selctorDoc(this)
            that.event._dispatch('serieslist.clcik', {
                sid: dom.attr('sid')
            })
        })
        this.initscrollgood()
    }


    initsingle(data, type) {
        let info = data.info.data
        if (!data.imgs[0]) {
            return `<li  title="" sid="` + info.seriesInstanceUID + `" class="wk" onmousemove="return false;" unselectable="on" onselectstart="return false;">
        <div class="imgContent" id="img` + data.index + `"></div><div class="head-name"><p><span>总张数：0</span></p></div></li>`
        }
        let imgInfo = data.imgs[0].replace('myImageLoader:', '')
        let htmlstr = `<li  title="` + info.seriesInstanceUID + `" sid="` + info.seriesInstanceUID + `" class="wk" onmousemove="return false;" unselectable="on" onselectstart="return false;">
        <div class="imgContent" id="img` + data.index + `">`
        htmlstr += type == "DCM" ? "" : `<img src=` + imgInfo + ` />`
        htmlstr += `</div>
        <div class="head-name"><p><span>总张数：` + data.imgsTotal + `</span></p></div>
        </li>`
        return htmlstr
    }
    resize() {
        this.initscrollgood()
    }
    initscrollgood() {
        if (this.myScrollgood) {
            this.myScrollgood.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.sequence-body').parent().attr('id', rid)
        this.myScrollgood = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            scrollX: true,
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
module.exports = SeriesList;