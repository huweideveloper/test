require("./movegroup.less");
class movegroup extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = 'adddepartment';
    }
    complete() {
        let dropdown = require("../../moduleslibs/dropdown/dropdown.js")
        console.log(this.api, 'move')
        let data = [];
        this.api.forEach(function(val, idx) {
            let obj = {};
            obj.val = val.name;
            obj.idx = val.id;
            data.push(obj);
        })
        let group = that.app.loadModule(dropdown, that.dom.find('.groupchoice'), {
            firstSelect: { val: '全部', idx: '' },
            data: data
        })
        this.initView()
    }
    initView() {
        let that = this;
        that.dom.find('.btn-confirm').on('click', function() {
            that.event._dispatch('movegroup.move', that.dom.find('.showname').attr('data-idx'))
        })
        that.dom.find('.btn-cancel').on('click', function() {
            that.close()
        })
        that.dom.find('.icon-guanbi').on('click', function() {
            that.close()
        })
    }
}
//原型链一定要有的
module.exports = movegroup;