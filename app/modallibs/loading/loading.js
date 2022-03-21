class loading extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        require("./loading.less");
        this.html = require('./tpl.html')
    }
    complete(value) {
        this.dom.css({ 'background': 'rgba(0,0,0,0)' })
    }
}



//原型链一定要有的
module.exports = loading;