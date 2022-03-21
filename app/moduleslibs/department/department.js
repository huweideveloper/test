require("./department.less");
class department extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
    }
    complete() {
        var pagination = require('../pagination/pagination.js')
        var deferred = $.Deferred()
        var list
        require.ensure(['../list/list.js'], function() {
            list = require('../list/list.js')
            deferred.resolve()
        })
        this.part = null
        this.listC = null
        var that = this
        this.part = this.app.loadModule(pagination, this.dom.find('.department .pagination'), {
            total: 1
        })
        this.part.event._addEvent('pagination.changePage', function(value) {
            that.event._dispatch('department.changePage', value)
        })
        deferred.done(() => {
            //console.log(list)
            this.listC = that.app.loadModule(list, that.dom.find('.department .list'), {
                icon: that.nowParam.icon,
                chose: that.nowParam.chose
            })
            this.listC.event._addEvent('list.choose', function(value) {
                that.event._dispatch('department.listClick', value)
            })
            this.listC.event._addEvent('list.check.click', function(value) {
                that.event._dispatch('department.checkClick', value)
            })

            this.listC.event._addEvent('list.delete', function(value) {
                that.event._dispatch('department.delete', value)
            })
        })
    }
    getNowPage() {
        return this.part.pageId
    }
    getChoose() {
        return this.listC.getChoose()
    }
    refreshData(value) {
        if (this.listC) {
            this.listC.setData(value.list)
        } else {
            deferred.done(() => {
                this.listC.setData(value.list)
            })
        }
        this.part.resetAll(value.total)
    }
    pushData(value) {
        this.listC.setData(value.list)
    }
}
//原型链一定要有的
module.exports = department;