require('./remaindata.less')
// var html = require('./tpl.html')

class remaindata extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'biaozhulist'
        this.flag = true;
        this.code=''
    }
    complete() {
        let that = this
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        this.render()
    }
    render(value){
        let that = this
        require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            that.app.loadModule(dropdown, that.dom.find('.rwmc'),{
                className:'xlk',
                firstSelect: {
                    val: '任务名称',
                    idx: ''
                },
                data: [{
                    val: '男',
                    idx: 'M'
                }, {
                    val: '女',
                    idx: 'F'
                }]
            })
        })
        that.setTitle();
    }
    setTitle() {
        let obj={}
        let that = this;
        obj['icon'] = {
            "examCode": { name: '<span data-i18n="age" data-name="年龄">文件名称</span>', type: 'list1',code:'checkid', w: '15%', ww: '20%',n:"40" },
            "patientId": { name: '<span data-i18n="age" data-name="年龄">序列号</span>', type: 'text',code:'pid', w: '15%', ww: '15%', },
            "patientName": { name: '<span data-i18n="age" data-name="年龄">所在任务ID</span>', type: 'text',code:'pname', w: '15%', ww: '15%' },
            "patientSex": { name: '<span data-i18n="age" data-name="年龄">任务类型</span>', type: 'text',code:'psex', w: '10%', ww: '10%' },
            "sfbb": { name: '<span data-i18n="age" data-name="年龄">算法结果版本</span>', type: 'text',code:'age', w: '15%', ww: '10%' },
            "rwmc": { name: '<span data-i18n="age" data-name="年龄">任务名称</span>', type: 'text',code:'age', w: '10%', ww: '10%' },
            "rwbz": { name: '<span data-i18n="age" data-name="年龄">任务备注</span>', type: 'text',code:'age', w: '20%', ww: '20%' },
        };
        obj['type'] = 'center';
        obj['chose'] = 'all';
        obj['chosew'] = '40px';
        obj['tablewidth']=ES.selctorDoc('.projecttable').box().clientWidth-60;
        require.ensure("../../moduleslibs/table/table", function() {
            let cont_table = require("../../moduleslibs/table/table")
            that.table = that.app.loadModule(cont_table, that.dom.find('.projecttable'), {
                id: 'biaozhutable',
                header: obj
            });
            that.table.event._addEvent('table.pagenumber', function(value) {
                that.apiData.currentPage = parseInt(value);
                that.setMain();
            });
            that.table.event._addEvent('table.paixu', function(value) {
                if (value.sort) {
                    that.apiData.order = value.order;
                    that.apiData.orderColumn = value.sort;
                }
                that.setMain();
            });
            that.table.event._addEvent('table.list1', function(value) {
                let url1 = window.location.href;
                let url;
                if (that.nowlistData[value].deviceName == "CT") {
                    //that.app.changePage('ct', { studyId: value })
                    url = url1.split('#')[0] + '#!/newct/' + value;
                    that.openWindow(url);
                } else {
                    url = url1.split('#')[0] + '#!/xray/' + value + '/' + that.nowlistData[value].deviceName;
                    that.openWindow(url);
                    //that.app.changePage('xray', { studyId: value,xtype:that.nowlistData[value].deviceName })
                }
            });
            that.table.event._addEvent('table.ul', function(value) {
                let url1 = window.location.href;
                let url;
                if (that.nowlistData[value].deviceName == "CT") {
                    //that.app.changePage('ct', { studyId: value })
                    url = url1.split('#')[0] + '#!/newct/' + value;
                    that.openWindow(url);
                } else {
                    url = url1.split('#')[0] + '#!/xray/' + value + '/' + that.nowlistData[value].deviceName;
                    that.openWindow(url);
                    //that.app.changePage('xray', { studyId: value,xtype:that.nowlistData[value].deviceName })
                }
            });
            that.dom.find('.list-content').removeClass('hide');
            that.setMain(true);
        })
    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }

        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.errorLine').attr('id', rid)
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
module.exports = remaindata;