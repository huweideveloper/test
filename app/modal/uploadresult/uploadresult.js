require('./uploadresult.less')
// var html = require('./tpl.html')

class uploadresult extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'uploadresult'
        this.flag = true;
        this.code=''
        this.data=value.data;
        this.id=value.id
    }
    complete() {
        let that = this
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        this.render(this.data)
        that.dom.find('.copy').on('click',function () {
            if(!ES.selctorDoc(this).hasClass('disabled')){
                let oInput = document.createElement('input');
                oInput.value = that.erromsg;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display = 'none';
                document.body.removeChild(oInput)
                alert('复制成功！')
            }
        })
        that.dom.find('.export').on('click',function () {
            if(!ES.selctorDoc(this).hasClass('disabled')){
                var url = that.app.domain+'v1/task/error/export/'+that.id;
                that.api.HttpRequest.downLoadFile(url)
            }
        })
        that.dom.find('.close').on('click',function () {
            that.close()
        })
        that.dom.find('.restart').on('click',function () {
            that.event._dispatch('uploadresult.restart')
        })
        that.dom.find('.stop').on('click',function () {
            that.app.alert.show({
                title: ' ',
                msg: '确定要中止本次上传任务？',
                close: true,
                sure: function() {
                    that.event._dispatch('uploadresult.stop')
                }
            })

        })
    }
    render(value){
        this.erromsg='';
        let that = this
        // that.dom.find('.total').html(value.total)
        // that.dom.find('.errorLine .srocll').html('');
        if(value.detail!=null){
            that.dom.find('.summarytop').addClass('hide');
            let html='<div class="errordetail">'+value.detail+"</div>";
            that.dom.find('.errorLine .srocll').append(html);
            that.dom.find('.copy').addClass('disabled')
        }else{
            switch (value.status) {
                case 1:
                    that.dom.find('.summarytop').html('本次待处理共'+value.totalCount+'个文件，当前已处理'+value.processedCount+'个文件')
                    that.dom.find('._title span').html('查看当前进度')
                    that.dom.find('.onetype').addClass('hide')
                    that.dom.find('.stop').removeClass('hide')
                    break;
                case 2:
                    that.dom.find('.summarytop').html('本次待处理共'+value.totalCount+'个文件，处理成功'+value.successCount+'个，'+value.repeatedCount+'个重复')
                    that.dom.find('.onetype').addClass('hide')
                    that.dom.find('.close').removeClass('hide')
                    break;
                case 3:
                    that.dom.find('.summarytop').html('本次待处理共'+value.totalCount+'个文件，处理成功'+value.successCount+'个，'+value.repeatedCount+'个重复,'+value.errorCount+'个失败')
                    that.showlist(value,true);
                    break;
                case 4:
                    that.dom.find('.summarytop').html('本次待处理共'+value.totalCount+'个文件，处理成功'+value.successCount+'个，'+value.repeatedCount+'个重复,'+value.errorCount+'个失败,'+(value.totalCount-value.processedCount)+'个未处理')
                    that.showlist(value,true);
                    console.log(value.totalCount,value.processedCount,value.totalCount!==value.processedCount)
                    if(value.totalCount!==value.processedCount){
                        that.dom.find('.restart').removeClass('hide')
                    }
                    break
            }
            if(that.api.type=='getdata'){
                that.dom.find('.modal-footer .biaozhubtn').addClass('hide')
                if(value.errorCount>0){
                    that.dom.find('.modal-footer .copy').removeClass('hide')
                }
            }
        }

    }
    showlist(value,bool){
        let that=this;
        if(value.taskItemErrorMap.list.length>0){
            let obj={}
            obj['icon'] = {
                "workPath": { name: '<span data-i18n="age" data-name="年龄">目录</span>', type: 'text',code:'checkid', w: '50%', ww: '50%',n:"40" },
                "cause": { name: '<span data-i18n="age" data-name="年龄">错误原因</span>', type: 'text',code:'pid', w: '50%', ww: '50%', },
            };
            obj['tablewidth']=ES.selctorDoc('.uploadresult').box().clientWidth-40;
            obj['type'] = 'center';
            obj['pagesizeSet']=false;
            require.ensure("../../moduleslibs/table/table", function() {
                that.myScroll = null;
                let cont_table = require("../../moduleslibs/table/table")
                that.table = that.app.loadModule(cont_table, that.dom.find('.srocll'), {
                    id: 'uploadresult',
                    header: obj
                });
                that.table.event._addEvent('table.pagenumber', function(value) {
                    that.erromsg=''
                    let page = parseInt(value);
                    that.event._dispatch('uploadresult.pagenumber',page)
                });
                that.setList(value,bool)

                that.initscrollmenu()
            })
        }
        //that.dom.find('.summarytop .failnum').html(value.errorCount)
        if(value.errorCount==0){
            that.dom.find('.onetype').addClass('hide')
        }
    }
    setList(value,bool){
        let that=this;
        value.taskItemErrorMap.list.forEach(function (val,idx) {
            that.erromsg+=val.workPath+'    '+val.cause
        })
        that.table.setData(value.taskItemErrorMap.list)
        if(bool){
            that.table.getTotal(value.taskItemErrorMap.pages,2,value.taskItemErrorMap.total)
        }
    }
    getCode(value){
        this.code=value
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
module.exports = uploadresult;
