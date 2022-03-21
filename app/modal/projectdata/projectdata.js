require('./projectdata.less')
// var html = require('./tpl.html')
//type:custom   createprothree页面查看序列列表弹窗
//type:add      createtask2页面添加序列弹窗
//type:view     createtask2页面查看序列弹窗
class projectdata extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'biaozhulist'
        this.flag = true;
        this.code=''
    }
    complete() {
        let that = this
        that.apidata={
            hospitalCode:'',
            studyDateBegin:'',
            studyDateEnd:'',
            assigned:'',
            taskIdList:[],
            page:1,
            pageSize:10
        }
        that.finalquery={}
        //this.bodypart=[{idx:'LUNG',val:'肺部'},{idx:'RIB',val:'肋骨'},{idx:'KNEE_JOINT',val:'膝关节'},{idx:'COXA_JOINT',val:'髋关节'},{idx:'HAND',val:'手'},{idx:'FOOT',val:'足'},{idx:'SKULL_BRAIN',val:'颅脑'},{idx:'HEART',val:'心脏'},{val:'眼底',idx:'EYEGROUND'}]
        this.bodypart=Tool.configxlkformat(that.app.constmap['BODY_PART'])
        that.totalnum = 0;

        const { seriesImgFileType } = this.api
        // 如果是15:C端病理大图，则"序列"改为"切片"
        if (seriesImgFileType === 15) {
          const doms = this.dom.find('.sequence-item').dom
          doms && doms.forEach((dom) => dom.html(dom.html().replace('序列', '切片')))
        }

        switch (that.api.type) {
          case 'view':
                that.dom.find('.isselected').addClass('hide');
                that.dom.find('.usecondition').addClass('hide');
                that.dom.find('.btnarea').addClass('hide');
                that.dom.find('.modelArea').addClass('hide');
                that.dom.find('.title').html(`已引入项目${seriesImgFileType === 15 ? '切片' : '序列'}池`)
                that.setTitle('view');
                that.dom.find('.viewdelete').removeClass('hide')
                if(that.api.candel==true){
                    that.dom.find('.deleteresult').removeClass('hide')
                }
                that.dom.find('.deleteresult').on('click',function () {
                    that.app.alert.show({
                        title: ' ',
                        msg: `确认要删除${seriesImgFileType === 15 ? '切片' : '序列'}？`,
                        close: true,
                        sure:function () {
                            that.event._dispatch('projectdata.deleteresult',{data:that.apidata,total:that.totalnum,currentSearchReqId:that.currentSearchReqId})
                            that.close()
                        }
                    })
                })
                this.dom.find('.exportresult').on('click',function () {
                    that.event._dispatch('projectdata.exportresult',{data:that.apidata,total:that.totalnum,currentSearchReqId:that.currentSearchReqId})
                })
                break;
            case 'add':
                that.firstSelect={val:'否',idx:'0'}
                that.apidata['assigned'] = false
                that.setTitle('add');
                break;
            case 'custom':
                that.setTitle('custom');
                that.dom.find('.btnarea').html(that.api.html);
              that.dom.find('.modelArea').addClass('hide');
              if(that.api.del=='view'){
                    that.dom.find('.deleteres').addClass('hide')
                }
                that.dom.find('.deleteres').on('click',function () {
                    that.event._dispatch('projectdata.deleteres',{condition:that.finalquery,currentSearchReqId:that.currentSearchReqId})
                })
                that.dom.find('.exportname').on('click',function () {
                    that.event._dispatch('projectdata.export',{condition:that.finalquery,currentSearchReqId:that.currentSearchReqId})
                })
                break;
        }
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        this.dom.find('.addcustom').on('click',function () {
            that.exportData={
              url:'/aaa/v1/task/series/import',
              data:{
                taskId:that.api.id,
                accessToken:window.localStorage.accessToken
              }
            }
            that.dom.find('.file').click();
        })
        this.dom.find('.addImageID').on('click',function () {
            that.exportData={
              url:'/aaa/v1/task/series/import/seriesImageID',
              data:{
                taskId:that.api.id,
                accessToken:window.localStorage.accessToken
              }
            }
            that.dom.find('.file').click();
        })
        this.dom.find('.inputBox').on('change',function () {
            that.apidata['seriSubmitCount']=ES.selctorDoc(this).val()
        })
        this.dom.find('.downmodel').on('click',function () {
            that.app.loading.show()
            setTimeout(function () {
                that.app.loading.hide()
            },1000)
            var a = document.createElement("a");
            // var url = '/images/page/任务添加项目序列模板.xlsx';
            let url = ES.selctorDoc(this).attr('url')
            a.href = url;
            a.download = '模板.xlsx';
            a.click();
        })
        that.dom.find('.file').on('change', function() {
            console.log(that.api.id,'that.api.id')
            let filePath = ES.selctorDoc("#file").val();
            let fileType = that.getFileType(filePath);
            if ("xls" != fileType && "xlsx" != fileType) {
                ES.selctorDoc("#filechoose").val("");
                that.app.alert.show({
                    title: '',
                    template: '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
                    close: false,
                    sure: function() {
                        that.app.alert.hide();
                    }
                })
            }else{
                that.app.loading.show()
                $.ajaxFileUpload({
                    url: that.exportData.url, // that.app.domain+'/ccc/user/import',
                    secureuri: false,
                    dataType: "JSON",
                    async: false,
                    data: that.exportData.data,
                    type:'post',
                    fileElementId: 'file',
                    success: function(data, status, e) {
                        that.app.loading.hide()
                        let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
                        if (jsonArr.code == 0) {
                            console.log('success')
                              that.app.alert.show({
                                title: '',
                                template: '<span style="font-size: 18px;margin-left:20px;">成功导入' + jsonArr.data.successCount + '条，' + jsonArr.data.errorCount + '条不在此项目影像数据中或未被识别或重复</span>',
                                sure: false,
                                close: true,
                                footer: true
                              })
                              that.event._dispatch('projectdata.datachange')
                        } else {
                          Tool.errorshow(jsonArr.msg,that.app)
                        }
                        that.close()
                        that.dom.find('.file').remove();
                        that.dom.find('.btnarea').append('<input class="file" type="file" id="file" name="file"/>')
                       // that.bindchangefile();
                    }
                });
            }
        })
        this.dom.find('.addall').on('click',function () {
            that.event._dispatch('projectdata.addall',{query:that.finalquery,total:that.totalnum,currentSearchReqId:that.currentSearchReqId})
        })
        this.dom.find('.addpartbtn').on('click',function () {
            let addpart=require("../../modal/addpart/addpart");
            that.addpart1=that.app.loadModal(addpart,{adv:true},{total:that.totalnum})
            that.addpart1.event._addEvent('addpart.submit',function (value) {
                that.addpart1.close();
                that.event._dispatch('projectdata.addall',{query:that.finalquery,total:that.totalnum,randomAddNum:value.number,currentSearchReqId:that.currentSearchReqId})
            })
        })

        this.dom.find('.searchbtn').on('click',function () {
            console.log(that.apidata,'that.apidata')
            if(that.apidata.seriSubmitCount!=0){
                if(that.apidata.compareSymbol&&!that.apidata.seriSubmitCount){
                    that.dom.find('.seriSubmitCount').css({border:'1px solid red'})
                    that.dom.find('.seriSubmitCount').after('<span class="required">请输入大于等于0的整数</span>')
                    return
                }else if(!(/^[0-9]\d*$/).test(that.apidata.seriSubmitCount)&&that.apidata.seriSubmitCount){
                    that.dom.find('.seriSubmitCount').css({border:'1px solid red'})
                    that.dom.find('.seriSubmitCount').after('<span class="required">请输入大于等于0的整数</span>')
                    return
                }
            }
            that.dom.find('.seriSubmitCount').css({border:'1px solid #e8e8e8'})
            that.dom.find('.required').remove()
            that.apidata.page=1;
            if(that.apidata.seriSubmitCount!=0){
                that.apidata.seriSubmitCount=that.apidata.seriSubmitCount?parseInt(that.apidata.seriSubmitCount):'';
            }else{
                that.apidata.seriSubmitCount=0
            }
            that.event._dispatch('projectdata.search',{data:that.apidata})
        })
        this.render()
    }
    render(){
        let that = this
        require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            that.yymc = that.app.loadModule(dropdown, that.dom.find('.yymc'), {
                className:'xlk',
                firstSelect: {
                    val: '医院名称',
                    idx: ''
                },
                data:[],
                input:true
            })
            that.yymc.event._addEvent('option.click', function(value) {
                that.apidata['hospitalCode'] = value.idx
                console.log(that.apidata, 'apidata')
            })
            that.yymc.event._addEvent('drop.input', function(value) {
                setTimeout(function() {
                    that.event._dispatch('hospital.input',value.data)
                }, 1500)
            })
            that.yymc.event._addEvent('dropDown.clear', function(value) {
                that.apidata['hospitalCode'] = ''
                that.event._dispatch('hospital.input','')
            })
            that.rwxq = that.app.loadModule(dropdown, that.dom.find('.rwxq'), {
                className:'xlk',
                firstSelect:{val:'',idx:''},
                data:[{val:'是',idx:'1'},{val:'否',idx:'0'}]
            })
            that.rwxq.event._addEvent('option.click', function(value) {
                that.apidata['assigned'] = value.idx==1?true:false
            })
            that.rwxq.event._addEvent('dropDown.clear', function(value) {
                that.apidata['assigned'] = ''
            })
            if(that.api.type==='add'){
                that.dom.find('.rwxq .option[data-idx="0"]').click()
            }
            that.compareSymbol = that.app.loadModule(dropdown, that.dom.find('.times'), {
                className:'kxlk',
                firstSelect:{val:'',idx:''},
                data:[{val:'大于',idx:'2'},{val:'小于',idx:'3'},{val:'等于',idx:'1'}]
            })
            that.compareSymbol.event._addEvent('option.click', function(value) {
                that.apidata['compareSymbol'] = parseInt(value.idx)
            })
            that.compareSymbol.event._addEvent('dropDown.clear', function(value) {
                that.apidata['compareSymbol'] = ''
                that.apidata['seriSubmitCount']=''
                that.dom.find(".seriSubmitCount").val('')
            })
            that.exist = that.app.loadModule(dropdown, that.dom.find('.exist'), {
                className:'kxlk',
                firstSelect:{val:'',idx:''},
                data:[{val:'存在',idx:'1'},{val:'不存在',idx:'0'}]
            })
            that.exist.event._addEvent('option.click', function(value) {
                that.apidata['exist'] = value.idx==1?true:false
            })
            that.exist.event._addEvent('dropDown.clear', function(value) {
                that.apidata['exist'] = ''
            })
        })
        require.ensure('../../moduleslibs/times_double/times.js',function(){
            let calendar = require('../../moduleslibs/times_double/times.js')
            that.startTime = that.app.loadModule(calendar, that.dom.find('.timefilter'), {titleShow: false,defaultword:'查询检查时间段'})
            that.startTime.event._addEvent('times1.day', function(value) {
                if(value.st) that.apidata.studyDateBegin = value.st+" 00:00:00"
                if(value.et) that.apidata.studyDateEnd = value.et+" 23:59:59"
                console.log(that.apidata)
            })
            that.startTime.event._addEvent('times.dele', function(value){
                if(value.dom.hasClass('day_left')){
                    that.apidata.studyDateBegin = ''
                }else{
                    that.apidata.studyDateEnd = '';
                }
                console.log(that.apidata)
            })
        })
        require.ensure('../../moduleslibs/inputarea/inputarea.js',function() {
            let inputarea1 = require('../../moduleslibs/inputarea/inputarea.js')
            that.inputarea = that.app.loadModule(inputarea1, that.dom.find('.usedtask'), {})
            that.inputarea.event._addEvent('inputarea.input',function (value) {
                that.event._dispatch('projectdata.taskinput',value)
            })
            that.inputarea.event._addEvent('inputarea.createitem',function (value) {
                that.apidata.taskIdList.push(parseInt(value))
            })
            that.inputarea.event._addEvent('inputarea.deleteitem',function (value) {
                that.apidata.taskIdList=that.apidata.taskIdList.filter((item)=>{
                    return item!==parseInt(value)
                })
            })
        })
    }
    tasklist(value){
        let that=this;
        value.forEach(function (val,idx) {
            val.id=val.taskId;
            val.name=val.taskName
        })
        that.inputarea.setlist(value)
    }
    resetxlk(value){
        let that=this;
        that.yymc.renderHtml(value)
    }
    //判断文件类型
    getFileType(filePath) {
        var startIndex = filePath.lastIndexOf(".");
        if (startIndex != -1)
            return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
        else return "";
    }
    setTitle(type) {
        let obj={}
        let that = this;
        that.obj = {}
        const { seriesImgFileType } = this.api
        switch (type) {
            case 'add':
                that.obj['icon'] = {
                    "hospitalCode": { name: '<span>医院名称</span>', type: 'text',code:'checkid', w: '12%', ww: '12%',n:"40" },
                    "bodyPart": { name: '<span>部位</span>', type: 'text',code:'pid', w: '3%', ww: '3%', },
                    "modality": { name: '<span>检查机型</span>', type: 'text',code:'pname', w: '3%', ww: '3%' },
                    "studyDate": { name: '<span>检查时间</span>', type: 'text',code:'psex', w: '6%', ww: '6%' },
                    "studyInstanceUID": { name: '<span>检查号</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "seriesInstanceUID": { name: `<span>${seriesImgFileType === 15 ? '切片' : '序列'}号</span>`, type: 'text',code:'age', w: '8%', ww: '8%' },
                    "assigned": { name: '<span>是否曾被任务选取</span>', type: 'text',code:'age', w: '6%', ww: '6%' },
                    "tasksubmit": { name: '<span style="line-height: 20px;">&nbsp;曾存在任务<br>（已提交次数：废片次数）</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "prosubmit": { name: '<span style="line-height: 20px;">项目下被提交次<br>数：废片次数</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "keyword": { name: '<span>关键字</span>', type: 'text',code:'age', w: '12%', ww: '12%' },
                    "finding": { name: '<span>检查所见</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "conclusion": { name: '<span>诊断</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                };
                break;
            case 'custom':
                that.obj['icon'] = {
                    "hospitalCode": { name: '<span>医院名称</span>', type: 'text',code:'checkid', w: '8%', ww: '8%',n:"40" },
                    "bodyPart": { name: '<span>部位</span>', type: 'text',code:'pid', w: '4%', ww: '4%', },
                    "modality": { name: '<span>检查机型</span>', type: 'text',code:'pname', w: '5%', ww: '5%' },
                    "studyDate": { name: '<span>检查时间</span>', type: 'text',code:'psex', w: '6%', ww: '6%' },
                    "studyInstanceUID": { name: '<span>检查号</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "seriesInstanceUID": { name: `<span>${seriesImgFileType === 15 ? '切片' : '序列'}号</span>`, type: 'text',code:'age', w: '8%', ww: '8%' },
                    "patientAge": { name: '<span data-i18n="handler" data-name="状态">年龄</span>', type: 'text', code: 'handler', w: '3%', ww: '3%', },
                    "patientSex": { name: '<span data-i18n="action" data-name="操作">性别</span>', type: 'text', code: 'action', w: '3%', ww: '3%' },
                    "importDate": { name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '6%', ww: '6%' },
                    "tasksubmit": { name: '<span style="line-height: 20px;">&nbsp;曾存在任务<br>（已提交次数：废片次数）</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "prosubmit": { name: '<span style="line-height: 20px;">项目下被提交次<br>数：废片次数</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "assigned": { name: '<span>是否曾被任务选取</span>', type: 'text',code:'age', w: '7%', ww: '7%' },
                    "keyword": { name: '<span>关键字</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "finding": { name: '<span>检查所见</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "conclusion": { name: '<span>诊断</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                };
                break;
            case 'view':
                that.obj['icon'] = {
                    "hospitalCode": { name: '<span>医院名称</span>', type: 'text',code:'checkid', w: '12%', ww: '12%',n:"40" },
                    "bodyPart": { name: '<span>部位</span>', type: 'text',code:'pid', w: '7%', ww: '7%', },
                    "modality": { name: '<span>检查机型</span>', type: 'text',code:'pname', w: '7%', ww: '7%' },
                    "studyDate": { name: '<span>检查时间</span>', type: 'text',code:'psex', w: '8%', ww: '8%' },
                    "studyInstanceUID": { name: '<span>检查号</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "seriesInstanceUID": { name: `<span>${seriesImgFileType === 15 ? '切片' : '序列'}号</span>`, type: 'text',code:'age', w: '10%', ww: '10%' },
                    "imageIdStr": { name: '<span>层数</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "prosubmit": { name: '<span style="line-height: 20px;">项目下被提交次<br>数：废片次数</span>', type: 'text',code:'age', w: '6%', ww: '6%' },
                    "keyword": { name: '<span>关键字</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "finding": { name: '<span>检查所见</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                    "conclusion": { name: '<span>诊断</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                };
                break;
        }
        that.obj['type'] = 'center';
        that.obj['minwidth']=1900;
        that.obj['tablewidth']=ES.selctorDoc('.projectdata').box().clientWidth-60;
        // require.ensure("../../moduleslibs/table/table", function() {
            let cont_table = require("../../moduleslibs/table/table")
            that.table = that.app.loadModule(cont_table, that.dom.find('.projecttable'), {
                id: 'biaozhutable',
                header: that.obj
            });
            that.table.event._addEvent('table.pagenumber', function(value) {
                that.apidata.page = parseInt(value);
                that.table.changenum(that.apidata.page);
                that.event._dispatch('prodata.pagenumber',{data:that.apidata})
            });
            that.table.event._addEvent('table.pagesize', function(value) {
                that.apidata.pageSize=value.num;
                that.apidata.page=1;
                that.event._dispatch('prodata.pagesize',{data:that.apidata})
            });
            that.initscrollmenu();
        // })
    }
    setMain(value,bool){
        let that=this;
        that.finalquery=that.apidata;
        that.currentSearchReqId=value.data.currentSearchReqId
        let data2=[]
        if(value.data.list&&value.data.list.length>0){
            that.totalnum=value.data.total;
            value.data.list.forEach(function (val,idx) {
                for(let i in val){
                    val[i]=val[i]==null?'':val[i]
                }
                for(let i in that.obj.icon){
                    val[i]=val[i]?val[i]:''
                }
                let prosub=0
                let prodiscurd=0
                that.bodypart.forEach(function (a,b) {
                    if(a.idx==val.bodyPart){
                        val.bodyPart=a.val;
                    }
                })
                Tool.configxlkformat(that.app.constmap['MODALITY']).forEach(function (a,b) {
                    if(a.idx==val.modality){
                        val.modality=a.val;
                    }
                })
                if(val.seriesAnnoStatusHistory){
                    val.tasksubmit=''
                    val.seriesAnnoStatusHistory.forEach(function (val1,idx) {
                        val.tasksubmit+=(val1.taskName+'('+(val1.submitCount+val1.discardCount)+':'+val1.discardCount+')<br>')
                        prosub+=val1.submitCount+val1.discardCount;
                        prodiscurd+=val1.discardCount;
                    })
                    val.prosubmit=prosub+':'+prodiscurd
                }
                switch (val.patientSex){
                    case 'M':
                        val.patientSex='男';
                        break;
                    case 'F':
                        val.patientSex='女'
                        break;
                    default:
                        val.patientSex=''
                }
              if(val.createDate) val.createDate = Tool.time(val.createDate, 'yyyy-mm-dd')
              if(val.importDate) val.importDate = Tool.time(val.importDate, 'yyyy-mm-dd')
              if(val.studyDate) val.studyDate = Tool.time(val.studyDate, 'yyyy-mm-dd')
              if(val.patientAge) val.patientAge = Math.floor(val.patientAge/12)
              val.assigned=val.assigned==false?'否':'是'
                val.id=val.taskId;
            })
            that.table.setData(value.data.list)
            that.dom.find('.addall').removeClass('hide')
            that.dom.find('.addpartbtn').removeClass('hide')
        }else{
            that.totalnum=0;
            that.table.noData();
            that.dom.find('.addall').addClass('hide')
            that.dom.find('.addpartbtn').addClass('hide')
        }
        if(bool){
            that.table.getTotal(value.data.pages,2,value.data.total)
        }
        that.initscroll_vertical();
    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.maintable').attr('id', rid)
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
    initscroll_vertical() {
        if (this.myScroll1) {
            this.myScroll1.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.projectdata').attr('id', rid)
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
module.exports = projectdata;
