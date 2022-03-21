require('./seriesorigin.less')
// var html = require('./tpl.html')

class seriesorigin extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'seriesorigin'
    }
    complete() {
        let that = this
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close();
        })
        that.dom.find('.searchbtn').on('click', function() {
            that.refreshPage = true;
            that.apidata.page = 1;
            that.event._dispatch('search.change', that.apidata)
        })
        this.setTitle()
    }
    setTitle() {
        let obj = {}
        let that = this;
        obj['icon'] = {
            "tagId": { name: '<span>标记符</span>', type: 'text', code: 'checkid', w: '20%', ww: '20%', n: "40" },
            "vm": { name: '<span>值多样性</span>', type: 'text', code: 'checkid', w: '20%', ww: '20%' },
            "vr": { name: '<span>数据种类</span>', type: 'text', code: 'pid', w: '20%', ww: '20%', },
            "value": { name: '<span>值</span>', type: 'text', code: 'pname', w: '20%', ww: '20%' },
            "description": { name: '<span>描述</span>', type: 'text', code: 'pname', w: '20%', ww: '20%' },
        };
        obj['type'] = 'center';
        obj['initPagina'] = false;
        obj['pagesizeSet'] = false;
        obj['tablewidth'] = ES.selctorDoc('.seriesorigin').box().clientWidth - 40;
        require.ensure("../../moduleslibs/table/table", function() {
            let cont_table = require("../../moduleslibs/table/table")
            that.table = that.app.loadModule(cont_table, that.dom.find('.datatable'), {
                id: 'datatable',
                header: obj
            });
            that.table.event._addEvent('table.pagenumber', function(value) {
                that.dom.find('.list-header .check-box').removeClass('choose')
                that.apidata.page = parseInt(value);
                that.refreshPage = false;
                that.table.changenum(that.apidata.page);
                that.event._dispatch('search.change', that.apidata)
            });
            that.table.event._addEvent('table.pagesize', function(value) {
                that.apidata.pageSize = value.num;
                that.apidata.page = 1;
                that.refreshPage = true;
                that.event._dispatch('search.change', that.apidata)
            });
            that.dom.find('.list-content').removeClass('hide');
            console.log(that.api.data,'that.api.data')
            that.setMain(that.api.data)
        })
    }
    setMain(value) {
        let that = this;
        let res = '';
        if (value) {
            res = value
        }
        if (res.code == 0) {
            if (res.data.seriesTagList.length > 0) {
                res.data.seriesTagList.forEach(function(val, idx) {
                    for (let i in val) {
                        val[i] = val[i] == null ? '' : val[i]
                    }
                })
                that.table.setData(res.data.seriesTagList)
            } else {
                that.table.noData();
            }
        }
        that.initscrollmenu();
    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }

        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.datatable').attr('id', rid)
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
module.exports = seriesorigin;