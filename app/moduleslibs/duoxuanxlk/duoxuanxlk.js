require('./duoxuanxlk.less')
class duoxuanxlk extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
    }
    complete() {
        this.finaldata=[];
        this.maxshownum=this.nowParam.maxshownum==undefined?10:this.nowParam.maxshownum
        this.linehigh=this.nowParam.linehigh==undefined?40:this.nowParam.linehigh
        this.datatype=this.nowParam.datatype==undefined?'obj':this.nowParam.datatype
        this.input=this.nowParam.input==undefined?false:this.nowParam.input
        if(!this.input){
            this.dom.find('.showname').attr('disabled','disabled')
        }
        this.render()
    }
    render(){
        let that=this;
        let data=this.nowParam;
        that.dom.find('.showname').attr('placeholder',data.showname);
        that.renderHtml(data.data)
        if(data.data.length>that.maxshownum){
            that.dom.find('.scroll').css({height:that.linehigh*that.maxshownum})
            that.initscrollmenu();
        }
        that.dom.find('.showname').on('focus',function () {
            that.dom.find('.showname').attr('placeholder','');
        })
        that.dom.find('.showname').on('blur',function () {
            that.dom.find('.showname').attr('placeholder',data.showname)
        })
        that.dom.find('.showbox').on('click',function () {
            if(that.dom.find('.downbox').hasClass('hide')){
                that.dom.find('.downbox').removeClass('hide');
                that.dom.find('.mask').removeClass('hide');
                that.initscrollmenu();
            }else{
                that.dom.find('.downbox').addClass('hide');
                that.dom.find('.mask').addClass('hide');
            }
        })
        that.dom.find(".mask").on('click',function () {
            that.dom.find('.downbox').addClass('hide');
            that.dom.find('.mask').addClass('hide');
            that.dom.find('.loading_xlk').addClass('hide');
        })
        that.dom.find('.showbox').on('mouseover', function() {
            let dom = ES.selctorDoc(this)
            let data = dom.find('.showname').val()
            if (data) {
                that.dom.find('.icon-shanchutishiicon').show()
                that.dom.find('.icon-icon-test3').hide()
            }
        })
        this.dom.find('.showbox').on('mouseout', function() {
            that.dom.find('.icon-shanchutishiicon').hide()
            that.dom.find('.icon-icon-test3').show()
        })
        this.dom.find('.showbox .icon-shanchutishiicon').on('click', function(e) {
            e.stopPropagation();
            that.dom.find('.showbox input').attr('placeholder',data.showname)
            that.dom.find('.showbox input').attr('title','')
            that.dom.find('.showbox input').val('')
            that.dom.find('.choose').removeClass('choose');
            that.event._dispatch('duoxuanxlk.clear')
        })
        this.dom.find('.showname').on('input',function () {
            that.event._dispatch('duoxuan.input',{data:ES.selctorDoc(this).val(),classname:ES.selctorDoc(this).parent().parent().parent().attr('class')})
        })
    }
    renderHtml(value){
        let that=this;
        let data=this.nowParam;
        that.dom.find('.downbox ul').html('')
        if(that.datatype=='obj'){
            value.forEach(function (val,idx) {
                that.dom.find('.downbox ul').append('<li id='+val.idx+'>\n' +
                    '            <i class="check-box"></i>\n' +
                    '            <span class="itemcontent" title="'+val.val+'">'+val.val+'</span>\n' +
                    '        </li>')
            })
        }else{
            value.forEach(function (val,idx) {
                that.dom.find('.downbox ul').append('<li id='+val+'>\n' +
                    '            <i class="check-box"></i>\n' +
                    '            <span class="itemcontent" title="'+val+'">'+val+'</span>\n' +
                    '        </li>')
            })
        }
        if(value.length>that.maxshownum){
            that.dom.find('.scroll').css({height:that.linehigh*that.maxshownum})
            that.initscrollmenu();
        }
        that.bindevent()
    }
    bindevent(){
        let that=this;
        that.dom.find('.downbox li i').off('click');
        that.dom.find('.downbox li i').on('click', function() {
          const currentEl = ES.selctorDoc(this)
          if(currentEl.hasClass('disabled')) return false
          that.finaldata=[];
          if(currentEl.hasClass('choose')) {
            currentEl.removeClass('choose')
          } else {
            currentEl.addClass('choose')
          }
          let result=that.getResult();
        })
    }
    reset(){
        let that=this;
        that.dom.find('.showbox input').attr('placeholder',this.nowParam.showname)
        that.dom.find('.showbox input').attr('title','')
        that.dom.find('.showbox input').val('')
        that.dom.find('.choose').removeClass('choose');
    }
    chooseAll(){
        this.dom.find('.check-box').addClass('choose')
        this.getResult()
    }

    getResult(){
      let that = this;
      let choosedhtml='';
      let obj={}
      let strings=''
      if(that.dom.find('.downbox .choose').dom){
        that.dom.find('.downbox .choose').dom.forEach(function (val,idx) {
          choosedhtml+=val.parent().find('span').html()+' ';
          obj.val=val.parent().find('span').html();
          obj.idx=val.parent().find('span').parent().attr('id');
          that.finaldata.push(obj);
          if(idx==that.dom.find('.downbox .choose').dom.length-1){
            strings+=obj.idx
          }else{
            strings+=obj.idx+','
          }
        })
        this.dom.find('.showname').val(choosedhtml);
        this.dom.find('.showbox').attr('title',choosedhtml);
        this.event._dispatch('duoxuan.select',{data:this.finaldata,name:strings})
      }
      return {
        html:choosedhtml,
        value:strings
      }
    }

    setData(value){
        let that=this;
        let data=this.nowParam;
        that.dom.find('.downbox ul').html('')
        if(that.datatype=='obj'){
            value.forEach(function (val,idx) {
                that.dom.find('.downbox ul').append('<li id='+val.idx+'>\n' +
                    '            <i class="check-box"></i>\n' +
                    '            <span>'+val.val+'</span>\n' +
                    '        </li>')
            })
        }else{
            value.forEach(function (val,idx) {
                that.dom.find('.downbox ul').append('<li id='+val+'>\n' +
                    '            <i class="check-box"></i>\n' +
                    '            <span>'+val+'</span>\n' +
                    '        </li>')
            })
        }
        if(value.length>that.maxshownum){
            that.dom.find('.scroll').css({height:that.linehigh*that.maxshownum})
            that.initscrollmenu();
        }
        that.bindevent();
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
    resize() {
    }
    loading(bool){
        if(bool){
            this.dom.find('.downul').html('')
            this.dom.find('.scroll').css({height:'50px'})
            this.initscrollmenu();
            this.dom.find('.loading_xlk').removeClass('hide')
        }else{
            this.dom.find('.scroll').css({height:'unset'})
            this.dom.find('.loading_xlk').addClass('hide')
        }
    }
}
module.exports = duoxuanxlk;
