require("./createcomponent.less");
import CreateSelect from './components/create-select'

class createcomponent extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name='createcomponent';
    }
    complete() {
        // 初始化Vue
        this.initVuePage()
        let that=this;
        this.flag=true;
        this.yymcdata=[{
            val:'医院1',
            idx: '1'
        }, {
            val: '医院2',
            idx: '2'
        }]
        console.log(this.api,'this.api')
        this.type = this.api.type
        this.componentId = this.api.componentid
        this.apiData={}
        this.nowcontrols=null;
        this.dom.find('.component').on('click',function () {
            if (ES.selctorDoc(this).hasClass('disabled')) return
            const itemType = ES.selctorDoc(this).attr('type')
            // 二级菜单
            if (itemType === 'child_select') {
              that.vuePage.showChildSelect(true)
              return
            }
            let textcontrol=require("../../modules/textcontrols/textcontrols");
            let selectcontrol=require("../../modules/selectcontrols/selectcontrols");
            let checkboxcontrol=require("../../modules/checkboxcontrols/checkboxcontrols");
            let obj={
                text:textcontrol,
                select:selectcontrol,
                radiobox:selectcontrol,
                checkbox:checkboxcontrol
            }
            that.nowcontrols=that.app.loadModule(obj[ES.selctorDoc(this).attr('type')],that.dom.find('.mainarea'),{type:that.type,controlType:ES.selctorDoc(this).attr('type')})
            if(that.type!=='view'){
                that.dom.find('.save').removeClass('hide')
            }
            that.nowcontrols.event._addEvent('controls.heightchange',function () {
                that.initscroll();
            })
            that.nowcontrols.event._addEvent('controls.createlabel',function (value) {
                that.event._dispatch('component.createlabel',{data:value})
            })
            that.nowcontrols.event._addEvent('controls.inputlabel',function (value) {
                setTimeout(function() {
                    that.event._dispatch('component.inputlabel',{data:value})
                }, 1000)

            })
            that.flag=false;
            that.dom.find('.component').addClass('hide');
            ES.selctorDoc(this).removeClass('hide');
            that.apiData={};
            that.apiData.type=ES.selctorDoc(this).attr('type')
            that.dom.find('.'+ES.selctorDoc(this).attr('type')+'area').removeClass('hide')
            that.dom.find('.component').addClass('disabled')
            that.initscroll();
        })
        that.dom.find('.mask').on('click',function () {
            that.nowcontrols.labelul('');
            that.dom.find('.mask').addClass('hide')
        })
        that.dom.find('.icon-guanbi').on('click',function () {
           that.close()
        })
        this.dom.find('.cancel').on('click',function () {
            that.dom.find('.mask').addClass('hide')
          that.dom.find('.component').removeClass('disabled')
          if(that.type=='edit'||that.type=='view'||that.type=='correct'){
                that.close();
            }else{
                if(that.nowcontrols!==null){
                    let data=that.getisinput()
                    for(let i in data){
                        console.log(data)
                        if(data[i]!==''&&data[i]!=undefined){
                            that.app.alert.show({
                                title: ' ',
                                msg: '内容有更新，返回将不做保存。',
                                close: true,
                                sure: function() {
                                    that.dom.find('.mainarea').html('')
                                    that.dom.find('.component').removeClass('hide')
                                    that.initscroll();
                                    that.nowcontrols=null;
                                    that.dom.find('.save').addClass('hide')
                                }
                            })
                            return false;
                        }else{
                           continue;
                        }
                    }
                    that.dom.find('.mainarea').html('')
                    that.dom.find('.component').removeClass('hide')
                    that.initscroll();
                    that.nowcontrols=null;
                    that.dom.find('.save').addClass('hide')
                }else{
                    that.close();
                }
            }

        })
        that.dom.find('.save').on('click',function () {
            that.apiData=that.nowcontrols.checkrequired();
            if(that.apiData){
                if(that.type=='new'){
                    that.event._dispatch('component.new',{data:that.apiData})
                }else{
                    console.log(that.apiData,'that.apiData',that.componentId)
                    that.apiData.id=that.componentId;
                    that.event._dispatch('component.edit', { data: that.apiData })
                }
            }
        })
        switch (this.type) {
            case 'edit':
                that.dom.find('.bigtitle').html('编辑标注字段')
                that.dom.find('.stitle').addClass('hide')
                that.setData(that.api.data);
                break;
            case 'view':
                that.dom.find('.bigtitle').html('查看标注字段')
                that.dom.find('.save').addClass('hide')
                that.dom.find('.cancel').html('关闭')
                that.dom.find('.stitle').addClass('hide')
                that.setData(that.api.data)
                break;
            case 'editlabel':
                that.dom.find('.bigtitle').html('编辑标签')
                that.dom.find('.stitle').addClass('hide')
                that.setData(that.api.data);
                break;
            case 'correct':
                that.dom.find('.bigtitle').html('修正标注')
                that.dom.find('.stitle').addClass('hide')
                that.setData(that.api.data);
                break;
        }
    }
    // Vue相关
    initVuePage() {
      const that = this
      this.vuePage = new Vue({
        el: '#createcomponent',
        components: {
          CreateSelect
        },
        data() {
          return {
            isShowChildSelect: false,
            actionType: '',
            selectData: {}
          }
        },
        methods: {
          setChildSelectData(data, actionType) {
            this.selectData = data
            this.actionType = actionType
          },
          showChildSelect(visible) {
            this.isShowChildSelect = visible
            if (visible) {
              that.dom.find('.createcomponent').addClass('hide')
              that.dom.find('.btnarea').addClass('hide')
            } else {
              that.dom.find('.createcomponent').removeClass('hide')
              that.dom.find('.btnarea').removeClass('hide')
            }
          },
          handleSaveSuccess() {
            this.showChildSelect(false)
            that.dom.find('.cancel').click() // 关闭主弹窗
            that.event._dispatch('component.saveSuccess')
          },
          handleCancel() {
            this.showChildSelect(false)
            // 编辑关闭主弹窗
            if (this.selectData.id) {
              that.dom.find('.cancel').click()
            }
          },
        }
      })
    }
    createlabel(res,value){
        let that=this;
        that.nowcontrols.setid(res.data.id,value.data.val)
    }
    showlabel(res){
        let that=this;
        if(res.data.list.length>0){
            that.nowcontrols.labelul(res.data.list);
            that.dom.find('.mask').removeClass('hide')
        }else{
            that.nowcontrols.labelul('');
            that.dom.find('.mask').addClass('hide')
        }
    }
    setData(value){
        let that=this;
        let json={
            id:parseInt(that.componentId)
        }
        that.dom.find('.component[type="' + value.type + '"]').click()
        // 二级菜单
        if (value.type === 'child_select') {
          that.vuePage.setChildSelectData(value, that.type)
        } else {
          that.nowcontrols.render(value);
        }
        that.dom.find('.component').off('click')
        switch (that.type) {
            case 'view':
                if(that.dom.find('.iconfont').dom){
                    that.dom.find('.mainarea .iconfont').addClass('hide')
                }
                that.dom.find('.labelitem span').css({'background':'#fff'})
                if(that.dom.find('.check-box').dom){
                    that.dom.find('.check-box').dom.forEach(function (val,idx) {
                        if(val.hasClass('choose')){
                            val.removeClass('choose');
                            that.dom.find('.check-box').off('click')
                            val.addClass('choose');
                        }else{
                            that.dom.find('.check-box').off('click')
                        }
                    })
                }
                that.dom.find('.isdefault').off('click')
                that.dom.find('input').attr('disabled','disabled')
                that.nowcontrols.drop.disable()
                break;
            case 'edit':
                break;
            case 'editlabel':
                that.dom.find('.inputLine').addClass('hide')
                that.dom.find('.remarkline').removeClass('hide')
                that.dom.find('.selectparam').addClass('hide')
                that.dom.find('.itemarea').addClass('hide')
                that.dom.find('.nullarea').addClass('hide')
                that.initscroll()
                break;
            case 'correct':
                if(that.dom.find('input[api="code"]').dom){
                    that.dom.find('input[api="code"]').attr('disabled','disabled')
                }
                that.dom.find('.icon-shanchu').addClass('hide')
                break;
        }
    }
    initscroll() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        ES.selctorDoc('.createcomponent').attr('id', rid)
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
    getisinput(){
        return this.nowcontrols.getisinput();
    }
}
module.exports = createcomponent;
