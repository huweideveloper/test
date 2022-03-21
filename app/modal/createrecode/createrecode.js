require("./createrecode.less");
class createrecode extends Interstellar.modalBase {

    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name='createrecode';
        this.apidata={}
    }

    //var endData = []
    complete() {
        let that=this;
        this.initView()
        if(that.api.title){
            that.dom.find('.modal-title').html(that.api.title)
        }
        if(that.api.data){
            that.setData(that.api.data)
        }
        switch (that.api.type) {
            case 'apply':
                that.dom.find('.applyshow').removeClass('hide')
                that.dom.find('.applyno').addClass('hide')
                Tool.configxlkformat(that.app.constmap['BODY_PART']).forEach(function (a,b) {
                    if(a.idx==that.api.applydata.bodyPart){
                        that.api.applydata.bodyPartCN=a.val;
                    }
                })
                for(let i in that.api.applydata){
                    that.dom.find('.applyshow label[api="'+i+'"]').html(that.api.applydata[i])
                }
                break;
        }
        let config=[
            {
                type:'checkbox',
                name: 'hospitalCode',
                showname: '请选择医院',
                datatype:'obj',
                input:true,
                data: that.api.xlk?that.api.xlk:[],
                key:'name'
            }, {
                type:'checkbox',
                name: 'modality',
                showname: '请选择检查设备',
                datatype:'obj',
                data: Tool.configxlkformat(that.app.constmap.MODALITY)
            }, {
                type: 'checkbox',
                name: 'bodyPart',
                showname: '请选择部位',
                datatype: 'obj',
                data: Tool.configxlkformat(that.app.constmap['BODY_PART'])
            }, {
                type: 'checkbox',
                name: 'fileType',
                showname: '请选择文件类型',
                datatype: 'obj',
                data: [{val:'影像文件',idx:0},{val:'报告数据',idx:1}]
            }
        ]
        that.singleobj={}
        require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            config.forEach(function (val, idx) {
                that.singleobj[val.name] = that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
                    className: 'xlk',
                    firstSelect: {val: val.showname, idx: ''},
                    data: val.data,
                    input:val.input,
                    maxshownum:5
                })
                that.singleobj[val.name].event._addEvent('option.click', function (value) {
                    that.apidata[val.name] = value.idx
                })
                that.singleobj[val.name].event._addEvent('dropDown.clear', function (value) {
                    that.apidata[val.name] = ''
                    that.event._dispatch('createrecode.dropclear')
                })

                that.singleobj[val.name].event._addEvent('drop.input', function (value) {
                    that.event._dispatch('createrecode.dropinput',{data:value,name:val.name})
                })

            })
            if(that.api.data){
                for(let i in that.singleobj){
                    if(that.dom.find('.'+i+' .option[data-idx="'+that.api.data[i]+'"]').dom){
                        that.dom.find('.'+i+' .option[data-idx="'+that.api.data[i]+'"]').click()
                    }
                }
                if(that.api.type=='view'){
                    for (let i in that.singleobj){
                        that.singleobj[i].disable()
                        that.dom.find('.drop_disabled').addClass('keepwhite')
                    }
                }
            }
        })
        require.ensure('../../moduleslibs/times/times.js', function() {
            let calendar = require('../../moduleslibs/times/times.js')
            that.copyTime = that.app.loadModule(calendar, that.dom.find('.timefilter'), { type: 's', dateShow: true })
            that.copyTime.event._addEvent('times.startend', function (value) {
                that.apidata.copyTime= value.st
                that.app.session.set('ischanged',true)
                that.copyTime.refreshData({min:value.st},'maxmin')
            })
            that.copyTime.event._addEvent('times.dele', function(){
                that.apidata.copyTime = ''
                that.copyTime.refreshData({min:''},'maxmin')
            })
            if(that.api.data){
                that.dom.find('.timefilter .Timers').html(that.api.data.copyTime.slice(0,10))
                if(that.api.type=='view'){
                    // that.dom.find('.showData').off('click')
                    that.copyTime.disable()
                }
            }
        })
        require.ensure('../../moduleslibs/times_double/times.js', function() {
            let calendar = require('../../moduleslibs/times_double/times.js')
            that.startTime = that.app.loadModule(calendar, that.dom.find('.startmonth'), {titleShow: false,defaultword:'请选择时间'})
            that.startTime.event._addEvent('times1.day', function(value) {
                that.apidata.beginTime = value.st?value.st+" 00:00:00":''
                that.apidata.endTime = value.et?value.et+" 23:59:59":''
                console.log(that.apidata)
            })
            that.startTime.event._addEvent('times.dele', function(value){
                if(value.dom.hasClass('day_left')){
                    that.apidata.beginTime = ''
                }else{
                    that.apidata.endTime = '';
                }
            })
            if(that.api.data){
                if(that.api.data.beginTime){
                    that.dom.find('.startmonth .day_left .Timers').html(that.api.data.beginTime.slice(0,10))
                }
                if(that.api.data.endTime){
                    that.dom.find('.startmonth .day_right .Timers').html(that.api.data.endTime.slice(0,10))
                }

            }
            if(that.api.type=='view'){
                that.startTime.disable()
            }
        })
        that.initscroll()
    }
    setData(value){
        let that=this;
        for(let i in value){
            for(let i in value){
                if(that.dom.find('.inputBox[api="'+i+'"]').dom){
                    that.dom.find('.inputBox[api="'+i+'"]').val(value[i])
                }
            }
            if(value.requestId){
                that.dom.find('.inputBox[api="projectName"]').attr('readonly','readonly')
                that.dom.find('.inputBox[api="projectName"]').css({'background':'#e8e8e8'})
            }
            that.apidata=value
            if(that.api.type=='view'){
                that.dom.find('.inputBox').attr('readonly','readonly')
                that.dom.find('.btn-confirm').remove()
                that.dom.find('.serverpath').removeClass('hide')
                that.dom.find('.serverpath .route').html(value.serverPath)
            }
            that.initscroll()
        }
    }
    initView () {
        let that=this;
        that.dom.find('.inputBox').on('change',function () {
            that.apidata[ES.selctorDoc(this).attr('api')]=ES.selctorDoc(this).val()
        })
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-cancel').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-confirm').on('click', function() {
            that.dom.find('.inputLine').dom.forEach(function(val, idx) {
                val.find('.'+val.attr('redlabel')).removeClass('redborder')
                val.find('.required').remove();
                if(Tool.checkForm(ES.selctorDoc(val).dom,'red')!==''){
                    val.find('.'+val.attr('redlabel')).addClass('redborder')
                    val.find('.'+val.attr('redlabel')).after('<span class="required">'+Tool.checkForm(ES.selctorDoc(val).dom,'red')+'</span>')
                }
            })
            console.log(that.dom.find('.redborder').dom,'that.dom.find(\'.redborder\').dom')
            if (that.dom.find('.redborder').dom&&that.dom.find('.redborder').dom.some((val)=>{
                return !val.parents('inputLine').hasClass('hide')
            })) {
                return false
            }else{
                console.log(that.apidata)
                that.event._dispatch('createrecode.submit',that.apidata)
            }
        })
    }
    sethospitalxlk(value){
        this.singleobj['hospitalCode'].loading(false)
        this.singleobj['hospitalCode'].renderHtml(value)
    }
    showloading(){
        this.singleobj['hospitalCode'].loading(true)
    }
    initscroll() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.modal-body').attr('id', rid)
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
module.exports = createrecode;
