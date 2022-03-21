require('./showcomplist.less')
// var html = require('./tpl.html')

class showcomplist extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'showcomplist'
        this.apidata=[]
    }
    complete() {
        let that = this
        console.log(that.api)
        that.render();
        that.bindevent();
        if(that.api.type == 'audittask'){
          this.dom.find('.bottomArea').removeClass('hide')
          this.dom.find('.scroll').css({height:'290px'})
          this.dom.find('.scrollmenu').css({height:'290px'})
          if(this.api.remark){
              this.dom.find('.bottomArea .remark .check-box').addClass('choose')
          }
          this.dom.find('.bottomArea .remark .check-box').on('click',async function(){
            let dom = ES.selctorDoc(this)
            if(dom.hasClass('choose')){
              dom.removeClass('choose')
            }else{
              dom.addClass('choose')
            }
            that.event._dispatch('showcomplist.remark',{remark:dom.hasClass('choose')})
          })
        }
    }
    render(){
        let that=this;
        that.dom.find('.modal-title').html(that.api.config.title)
        console.log(that.api.config.menudata)
        if(that.api.config.data){
            let html=''
            that.api.config.data.forEach(function (val,idx) {
                if(that.api.config.check){
                    let cn=val.selected?"check-box choose":"check-box"
                    if(val.selected){
                        that.apidata.push(val.id)
                    }
                    html+='<li><i class="'+cn+'"></i> <span class="choosecomp" data-id="'+val.id+'" form-id="'+(val.formid?val.formid:val.id)+'">'+val.name+'</span></li>'
                }else{
                    html+='<li><span class="choosecomp" data-id="'+val.id+'" form-id="'+(val.formid?val.formid:val.id)+'">'+val.name+'</span></li>'
                }
            })
            console.log(html)
            that.dom.find('.componentlist').append(html)
            if(!that.api.config.disable){
                that.bindcheckchoose()
            }
            that.dom.find('.choosecomp').on('click',function () {
                that.event._dispatch('showcomplist.choosecomp',{id:ES.selctorDoc(this).attr('form-id')})
            })
            that.initscroll_right()
        }
        if(that.api.config.menudata){
            that.dom.find('.scrollmenu').removeClass('hide')
            let html=''
            for(let i in that.api.config.menudata){
                let cn=that.api.config.menudata[i].selected?"check-box choose":"check-box"
                if(that.api.config.type=='project'){
                    html += '<li class="choosetype" data-id="' + i + '"><span title="' + that.api.config.menudata[i].name + '"> ' + that.api.config.menudata[i].name + '</span></li>'
                }else{
                    if(that.api.config.check) {
                        html += '<li class="choosetype" data-id="' + i + '"><i class="' + cn + '"></i><span title="' + that.api.config.menudata[i].name + '"> ' + that.api.config.menudata[i].name + '</span></li>'
                    }else{
                        if(that.api.config.menudata[i].selected){
                            html += '<li class="choosetype" data-id="' + i + '"><span title="' + that.api.config.menudata[i].name + '"> ' + that.api.config.menudata[i].name + '</span></li>'
                        }
                    }
                }
                let obj={
                    imageAnnotationId:i,
                    annotationItemIdList:[],
                    selected:that.api.config.menudata[i].selected?that.api.config.menudata[i].selected:false
                }
                that.api.config.menudata[i].data.forEach(function (val,idx) {
                    if(val.selected){
                        obj.annotationItemIdList.push(val.id)
                    }
                })
                that.apidata.push(obj)
            }
            console.log(that.apidata,'that.apidata')
            that.dom.find('.menudata').append(html)
            that.initscroll_left()
            that.dom.find('.choosetype').on('click',function () {
                that.dom.find('.choosed').removeClass('choosed')
                let html1=''
                that.dom.find('.componentlist').html('')
                if(that.api.config.menudata[ES.selctorDoc(this).attr('data-id')].data.length>0){
                    that.api.config.menudata[ES.selctorDoc(this).attr('data-id')].data.forEach(function (val,idx) {
                        if(that.api.config.check){
                            let cn=val.selected?"check-box choose":"check-box"
                            html1+='<li><i class="'+cn+'"></i><span class="choosecomp" data-id="'+val.id+'" form-id="'+(val.formid?val.formid:val.id)+'">'+val.name+'</span></li>'
                        }else{
                            html1+='<li><span class="choosecomp" data-id="'+val.id+'" form-id="'+(val.formid?val.formid:val.id)+'">'+val.name+'</span></li>'
                        }
                    })
                }else{
                    html1+='<p style="height: 200px;line-height: 200px; text-align: center;font-size: 18px;">经过交集对比没有相同的影像征象</p>'
                }
                that.dom.find('.componentlist').append(html1)
                if(!that.api.config.disable){
                    that.bindcheckchoose()
                }
                that.dom.find('.choosecomp').on('click',function () {
                    that.event._dispatch('showcomplist.choosecomp',{id:ES.selctorDoc(this).attr('form-id')})
                })
                ES.selctorDoc(this).addClass('choosed')
                that.initscroll_right()
            })
            if(!that.api.config.disable){
                that.dom.find('.choosetype .check-box').on('click',function () {
                    let dom=ES.selctorDoc(this);
                    if(dom.hasClass('choose')){
                        console.log(that.apidata)
                        dom.removeClass('choose')
                        console.log(that.dom.find('.componentlist .choose'))
                        that.dom.find('.componentlist .choose').removeClass('choose')
                        that.apidata.forEach(function (val,idx) {
                            if(val.imageAnnotationId==dom.parent().attr('data-id')){
                                val.selected=false
                                val.annotationItemIdList=[]
                            }
                        })
                    }else{
                        dom.addClass('choose')
                        that.apidata.forEach(function (val,idx) {
                            if(val.imageAnnotationId==dom.parent().attr('data-id')){
                                val.selected=true
                            }
                        })
                    }
                    that.event._dispatch('showcomplist.datachange',that.apidata)
                })

            }
            that.dom.find('.choosetype').eq(0).click()
        }
    }
    bindcheckchoose(){
        let that=this
        that.dom.find('.componentlist .check-box').on('click',function () {
            let dom=ES.selctorDoc(this)
            if(dom.hasClass('choose')){
                dom.removeClass('choose')
                if(that.api.config.menudata){
                    that.apidata.forEach(function (val) {
                        that.apidata=that.apidata.filter((item)=>{
                            return item.imageAnnotationId!==that.dom.find('.menudata .choosed').attr('data-id')
                        })
                        let obj={
                            imageAnnotationId:that.dom.find('.menudata .choosed').attr('data-id'),
                            annotationItemIdList:[],
                            selected:true
                        }
                        console.log(that.api.config.menudata,'that.api.config.menudata')
                        that.api.config.menudata[that.dom.find('.menudata .choosed').attr('data-id')].data.forEach(function (va,dix) {
                            if(va.id==dom.parent().find('.choosecomp').attr('data-id')){
                                va.selected=false
                            }
                        })
                        if(that.dom.find('.componentlist li .choose').dom){
                            that.dom.find('.componentlist li .choose').dom.forEach(function (val,idx) {
                                obj.annotationItemIdList.push(val.parent().find('.choosecomp').attr('data-id'))
                            })
                        }
                        that.apidata.push(obj)
                    })
                }else{
                    that.apidata=that.apidata.filter((item)=>{
                        console.log(item,parseInt(dom.parent().find('.choosecomp').attr('data-id')))
                        return parseInt(item)!==parseInt(dom.parent().find('.choosecomp').attr('data-id'))
                    })
                }
            }else{
                dom.addClass('choose')
                if(that.api.config.menudata){
                    that.apidata=that.apidata.filter((item)=>{
                        return item.imageAnnotationId!==that.dom.find('.menudata .choosed').attr('data-id')
                    })
                    let obj={
                        imageAnnotationId:that.dom.find('.menudata .choosed').attr('data-id'),
                        annotationItemIdList:[],
                        selected:true
                    }
                    that.dom.find('.menudata .choosed .check-box').addClass('choose')
                    that.api.config.menudata[that.dom.find('.menudata .choosed').attr('data-id')].data.forEach(function (va,dix) {
                        if(va.id==dom.parent().find('.choosecomp').attr('data-id')){
                            va.selected=true
                        }
                    })
                    if(that.dom.find('.componentlist li .choose').dom){
                        that.dom.find('.componentlist li .choose').dom.forEach(function (val,idx) {
                            obj.annotationItemIdList.push(val.parent().find('.choosecomp').attr('data-id'))
                        })
                        that.apidata.push(obj)
                    }
                    console.log(that.apidata)
                }else{
                    if(that.apidata.toString().lastIndexOf(dom.parent().find('.choosecomp').attr('data-id')==-1)){
                        that.apidata.push(parseInt(dom.parent().find('.choosecomp').attr('data-id')))
                    }
                }
            }
            that.event._dispatch('showcomplist.datachange',that.apidata)
        })
    }
    bindevent(){
        let that=this;
        that.dom.find('.icon-guanbi').on('click',function () {
            that.close()
        })
    }
    initscroll_left() {
        if (this.myScroll1) {
            this.myScroll1.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.scrollmenu').attr('id', rid)
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
    // nodata(){
    //     this.dom.find('.nodata').removeClass('hide')
    // }
    showloading(){

    }
    initscroll_right() {
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
module.exports = showcomplist;
