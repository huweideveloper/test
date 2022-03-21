require('./auditseries.less')
// var html = require('./tpl.html')

class auditseries extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'auditseries'
        this.flag = true;
        this.code=''
    }
    complete() {
        let that = this

        that.finalquery={}
        this.bodypart=Tool.configxlkformat(that.app.constmap['BODY_PART'])
        that.totalnum=0;
        if(that.api.type==='view'){
            that.apidata={
                page:1,
                pageSize:10
            }
            that.dom.find('.btnarea').addClass('hide');
            that.dom.find('.filter_view').removeClass('hide');
            that.dom.find('.filterarea').addClass('hide');
            that.dom.find('.title').html('已引入序列')
            that.setTitle('view');
            if(that.api.candel==true){
                that.dom.find('.viewdelete').removeClass('hide')
                if(that.api.disabled){
                    that.dom.find('.deleteall').addClass('hide')
                }
            }
            this.dom.find('.deleteall').on('click',function () {
                that.app.alert.show({
                    title: ' ',
                    msg: '确认要删除所有序列？',
                    close: true,
                    sure:function () {
                        that.event._dispatch('auditseries.delall',{condition:that.finalquery})
                        that.close()
                    }
                })

            })
            this.dom.find('.exportres').on('click',function () {
                that.event._dispatch('auditseries.exportres',{condition:that.finalquery})
            })
        }else if(that.api.type==='add'){
            that.apidata={
                page:1,
                pageSize:10,
                taskIdList:[]
            }
            that.setTitle('add');
            that.dom.find('.btnarea').html(that.api.html);
            let html=''
            that.api.config.forEach(function (val,idx) {
                html+='<span>'+val.name+'</span>'
            })
            that.dom.find('.diabletask .usedtask').html(html)
            that.dom.find('.addall').on('click',function () {
                that.event._dispatch('auditseries.addall',{condition:that.finalquery,currentSearchReqId:that.currentSearchReqId})
            })
            this.dom.find('.addpartbtn').on('click',function () {
                let addpart=require("../../modal/addpart/addpart");
                that.addpart1=that.app.loadModal(addpart,{adv:true},{total:that.totalnum})
                that.addpart1.event._addEvent('addpart.submit',function (value) {
                    that.addpart1.close();
                    that.event._dispatch('auditseries.addall',{condition:that.finalquery,total:that.totalnum,randomAddNum:value.number,currentSearchReqId:that.currentSearchReqId})
                })
            })
            that.dom.find('.addcustom').on('click',function () {
                that.dom.find('.file').click();
            })
            that.dom.find('.downmodel').on('click',function () {
                var a = document.createElement("a");
                var url = '/images/page/任务添加项目序列模板.xlsx';
                a.href = url;
                a.download = '模板.xlsx';
                a.click();
            })
            that.dom.find('.usecondition .icon-tianjia').on('click',function () {
                that.event._dispatch('auditseries.addtask')
            })
        }
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
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
                    url: '/aaa/v1/audit/task/series/import', // that.app.domain+'/ccc/user/import',
                    secureuri: false,
                    dataType: "JSON",
                    async: false,
                    data: {
                        taskId:that.api.id,
                        accessToken:window.localStorage.accessToken
                    },
                    type:'post',
                    fileElementId: 'file',
                    beforeSend: function(xhr, data) {
                        xhr.setRequestHeader('accessToken', window.localStorage.accessToken);
                    },
                    success: function(data, status, e) {
                        that.app.loading.hide()
                        let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
                        if (jsonArr.code == 0) {
                            console.log('success')
                            that.app.alert.show({
                                title: '',
                                template: '<span style="font-size: 18px;margin-left:20px;">成功导入'+jsonArr.data.successCount+'条，'+jsonArr.data.errorCount+'条不在此项目影像数据中或未被识别或重复</span>',
                                sure: false,
                                close: true,
                                footer: true
                            })
                            that.event._dispatch('auditseries.datachange')
                        } else{
                            that.app.alert.show({
                                title: '',
                                template: '<span style="font-size: 18px;margin-left:20px;">上传失败</span>',
                                sure: false,
                                close: true,
                                footer: true
                            })
                        }
                        that.close()
                        that.dom.find('.file').remove();
                        that.dom.find('.btnarea').append('<input class="file" type="file" id="file" name="file"/>')
                        // that.bindchangefile();
                    }
                });
            }
        })
        this.dom.find('.searchbtn').on('click',function () {
            console.log(that.apidata,'that.apidata')
            that.dom.find('.usedtask .contentarea').css({border:'1px solid #e8e8e8'})
            that.dom.find('.exist .kxlk').css({border:'1px solid #e8e8e8'})
            if(that.apidata.exist!==undefined&&that.apidata.exist!==''){
                if(that.apidata.taskIdList.length==0){
                    that.dom.find('.usedtask .contentarea').css({border:'1px solid red'})
                    return;
                }
            }else{
                if(that.apidata.taskIdList){
                    if(that.apidata.taskIdList.length>0){
                        that.dom.find('.exist .kxlk').css({border:'1px solid red'})
                        return;
                    }
                }
            }
            that.apidata.page=1;
            that.event._dispatch('auditseries.search',{data:that.apidata})
        })
        this.render(that.api.type)
    }
    render(value){
        let that = this
        switch (value) {
            case 'add':
                require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
                    let dropdown = require("../../moduleslibs/dropdown1/drop.js")
                    that.exist = that.app.loadModule(dropdown, that.dom.find('.activetask .exist'), {
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
                require.ensure('../../moduleslibs/inputarea/inputarea.js',function() {
                    let inputarea1 = require('../../moduleslibs/inputarea/inputarea.js')
                    that.inputarea = that.app.loadModule(inputarea1, that.dom.find('.activetask .usedtask'), {})
                    that.inputarea.event._addEvent('inputarea.deleteitem',function (value) {
                        that.apidata.taskIdList=that.apidata.taskIdList.filter((item)=>{
                            return item!==parseInt(value)
                        })
                        that.event._dispatch('auditseries.deletetask',value)
                    })
                })
                break;
            case 'view':
                require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
                    let dropdown = require("../../moduleslibs/dropdown1/drop.js")
                    that.exist = that.app.loadModule(dropdown, that.dom.find('.isaudited'), {
                        className:'kxlk',
                        firstSelect:{val:'',idx:''},
                        data:[{val:'是',idx:'1'},{val:'否',idx:'0'}]
                    })
                    that.exist.event._addEvent('option.click', function(value) {
                        that.apidata['auditTag'] = value.idx==1?true:false
                    })
                    that.exist.event._addEvent('dropDown.clear', function(value) {
                        that.apidata['auditTag'] = null
                    })
                })
                break;
        }

    }
    tasklist(value){
        let that=this;
        console.log(value,'valuehh')
        that.dom.find('.chooseditem').remove()
        value.forEach(function (val,idx) {
            that.inputarea.createlabel(val.taskName,val.taskId)
            that.apidata.taskIdList.push(val.taskId)
        })
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
        that.obj={}
        switch (type) {
            case 'add':
                that.obj['icon'] = {
                    "hospitalCode": { name: '<span>医院名称</span>', type: 'text',code:'checkid', w: '12%', ww: '12%',n:"40" },
                    "bodyPart": { name: '<span>部位</span>', type: 'text',code:'pid', w: '6%', ww: '6%', },
                    "modality": { name: '<span>检查机型</span>', type: 'text',code:'pname', w: '6%', ww: '6%' },
                    "studyDate": { name: '<span>检查时间</span>', type: 'text',code:'psex', w: '10%', ww: '10%' },
                    "studyInstanceUID": { name: '<span>检查号</span>', type: 'text',code:'age', w: '15%', ww: '15%' },
                    "seriesInstanceUID": { name: '<span>序列号</span>', type: 'text',code:'age', w: '15%', ww: '15%' },
                    "keyword": { name: '<span>关键字</span>', type: 'text',code:'age', w: '13%', ww: '13%' },
                    "finding": { name: '<span>检查所见</span>', type: 'text',code:'age', w: '13%', ww: '13%' },
                    "conclusion": { name: '<span>诊断</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
                };
                break;
            case 'view':
                that.obj['icon'] = {
                    "hospitalCode": { name: '<span>医院名称</span>', type: 'text',code:'checkid', w: '12%', ww: '12%',n:"40" },
                    "bodyPart": { name: '<span>部位</span>', type: 'text',code:'pid', w: '6%', ww: '6%', },
                    "modality": { name: '<span>检查机型</span>', type: 'text',code:'pname', w: '6%', ww: '6%' },
                    "studyDate": { name: '<span>检查时间</span>', type: 'text',code:'psex', w: '10%', ww: '10%' },
                    "studyInstanceUID": { name: '<span>检查号</span>', type: 'text',code:'age', w: '12%', ww: '12%' },
                    "seriesInstanceUID": { name: '<span>序列号</span>', type: 'text',code:'age', w: '12%', ww: '12%' },
                    "auditTag": { name: '<span>是否已审核</span>', type: 'text',code:'age', w: '8%', ww: '8%' },
                    "keyword": { name: '<span>关键字</span>', type: 'text',code:'age', w: '12%', ww: '12%' },
                    "finding": { name: '<span>检查所见</span>', type: 'text',code:'age', w: '11%', ww: '11%' },
                    "conclusion": { name: '<span>诊断</span>', type: 'text',code:'age', w: '11%', ww: '11%' },
                };
                break;
        }
        that.obj['type'] = 'center';
        that.obj['minwidth']=1900;
        that.obj['tablewidth']=ES.selctorDoc('.datatable').box().clientWidth-60;
        require.ensure("../../moduleslibs/table/table", function() {
            let cont_table = require("../../moduleslibs/table/table")
            that.table = that.app.loadModule(cont_table, that.dom.find('.datatable'), {
                id: 'datatable',
                header: that.obj
            });
            that.table.event._addEvent('table.pagenumber', function(value) {
                that.apidata.page = parseInt(value);
                that.table.changenum(that.apidata.page);
                that.event._dispatch('auditseries.pagenumber',{data:that.apidata})
            });
            that.table.event._addEvent('table.pagesize', function(value) {
                that.apidata.pageSize=value.num;
                that.apidata.page=1;
                that.event._dispatch('auditseries.pagesize',{data:that.apidata})
            });
            that.initscrollmenu();
        })
    }
    setMain(value,bool){
        let that=this;
        console.log(value,'value')
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
              Tool.configxlkformat(that.app.constmap['MODALITY']).forEach(function (a, b) {
                if (a.idx == val.modality) {
                  val.modality = a.val;
                }
              })
                if(val.assigned==true){
                    val.tasksubmit=''
                    if(val.seriesAnnoStatusHistory){
                        val.seriesAnnoStatusHistory.forEach(function (val1,idx) {
                            val.tasksubmit+=(val1.taskName+'('+(val1.submitCount+val1.discardCount)+':'+val1.discardCount+')<br>')
                            prosub+=val1.submitCount+val1.discardCount;
                            prodiscurd+=val1.discardCount;
                        })
                    }
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
                val.assigned=val.assigned==false?'否':'是'
                val.auditTag=val.auditTag==false?'否':'是'
                val.id=val.taskId;
              if(val.createDate) val.createDate = Tool.time(val.createDate, 'yyyy-mm-dd')
              if(val.importDate) val.importDate = Tool.time(val.importDate, 'yyyy-mm-dd')
              if(val.studyDate) val.studyDate = Tool.time(val.studyDate, 'yyyy-mm-dd')
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
    close(){
        this.dom.remove();
        this.event._dispatch('auditseries.close')
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
        this.dom.find('.auditseries').attr('id', rid)
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
module.exports = auditseries;
