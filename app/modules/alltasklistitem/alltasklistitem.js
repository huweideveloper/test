require('./alltasklistitem.less')
// var html = require('./tpl.html')

class alltasklistitem extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "alltasklistitem"
    }
    complete() {
     
        
    }
  

}

//原型链一定要有的
module.exports = alltasklistitem;