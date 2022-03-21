require('./auditaccount.less')
// var html = require('./tpl.html')

class auditaccount extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html');
        this.name = 'auditaccount';
        this.refusemodal = require("../../modal/refusereason/refusereason.js")
    }
    complete() {
        this.render()
    }
    render(){
        let that = this;
        if(that.nowParam.type==='wait'){
            that.dom.find('.agree').on('click',function () {

            })
            that.dom.find('.refuse').on('click',function () {
                console.log('hello')
                that.app.loadModal(that.refusemodal,{adv:true})
            })
        }else{
            that.dom.find('.biaozhubtn').removeClass('csshover');
        }
    }


}

//原型链一定要有的
module.exports = auditaccount;