require('./jpgresult.less')
// var html = require('./tpl.html')

class jpgresult extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'jpgresult'
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
        that.dom.find('.close').on('click',function () {
            that.close()
        })
        that.dom.find('.restart').on('click',function () {
            that.event._dispatch('jpgresult.restart')
        })
        that.dom.find('.restartall').on('click',function () {
            that.event._dispatch('jpgresult.restartall')
        })

    }
    render(value){
        this.erromsg='';
        let that = this
        if(value.totalCount==0){
            that.dom.find('.summarytop').html(`没有需要JPG化的文件`)
        }else if(value.totalCount==value.unSolvedCount){
            that.dom.find('.summarytop').html(`还未启动JPG化，请耐心等待`)
        }else{
            that.dom.find('.summarytop').html(`本次待JPG化共${value.totalCount}个文件，已处理成功${value.successCount}个，${value.failCount}个失败，待处理${value.unSolvedCount}条`)
            if(value.failCount>0){
                that.showlist(value,true)
                that.dom.find('.modal-footer').removeClass('hide')
            }
        }
    }
    showlist(value,bool){
        let that=this;
        if(value.errorList.length>0){
            let obj={}
            obj['icon'] = {
                "seriesInstanceUID": { name: '<span>序列号</span>', type: 'text',code:'checkid', w: '50%', ww: '50%',n:"40" },
                "code": { name: '<span>错误原因</span>', type: 'text',code:'pid', w: '50%', ww: '50%', },
            };
            obj['tablewidth']=ES.selctorDoc('.jpgresult').box().clientWidth-40;
            obj['type'] = 'center';
            obj['pagesizeSet']=false;
            require.ensure("../../moduleslibs/table/table", function() {
                that.myScroll = null;
                let cont_table = require("../../moduleslibs/table/table")
                that.table = that.app.loadModule(cont_table, that.dom.find('.srocll'), {
                    id: 'jpgresult',
                    header: obj
                });
                that.table.event._addEvent('table.pagenumber', function(value) {
                    that.erromsg=''
                    let page = parseInt(value);
                    that.event._dispatch('jpgresult.pagenumber',page)
                });
                that.setList(value,bool)
                that.initscrollmenu()
            })
        }
    }
    setList(value,bool){
        let that=this;
        value.errorList.forEach(function (val,idx) {
            that.erromsg+=val.seriesInstanceUID+'    '+val.code+'    '
        })
        that.table.setData(value.errorList)
        if(bool){
            that.table.getTotal(value.pages,2,value.failCount)
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
module.exports = jpgresult;
