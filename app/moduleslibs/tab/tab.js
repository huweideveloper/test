require("./tab.less");
class tab extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
    }
    complete() {
        this.btn()
    }
    btn(value) {
        let that = this;
        this.dom.find('.tab .option').on('click', function() {
            that.dom.find('.tab .option').removeClass('selected')
            let dom = ES.selctorDoc(this)
            dom.addClass('selected')
            let sdata = { id: dom.attr('node_id'), name: dom.find('p').html(), pid: that.nowParam.id }
            that.event._dispatch('tab.change', sdata)
        })
    }
}


//原型链一定要有的
module.exports = tab;