require("./numinput.less");

class numinput extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'search'
        this.initVal = this.nowParam.initVal;
    }
    complete(){
        let that = this;
        that.dom.find('.numarea').val(this.initVal);
        that.dom.find('.up').on('click',function () {
            that.initVal++;
            that.dom.find('.numarea').val(that.initVal)
        })
        that.dom.find('.down').on('click',function () {
            that.initVal--;
            that.dom.find('.numarea').val(that.initVal)
        })
    }
}
//原型链一定要有的
module.exports = numinput;
