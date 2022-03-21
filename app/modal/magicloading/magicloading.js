require("./magicloading.less")
class progress extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'magicloading'
    }
    complete(){
    	this.initDate.title=this.initDate.title?this.initDate.title:'正在努力运算中，请耐心等待'
    	this.dom.find('.p-name').html(this.initDate.title)
    }
   
}
module.exports = progress;