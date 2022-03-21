require('./refusereason.less')
// var html = require('./tpl.html')

class refusereason extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'refusereason'
        this.flag = true;
        this.code=''
    }
    complete() {
        this.render()

    }
    render(){
        let that = this
        this.dom.find('._newpwd .iconfont').on('click', function () {

        })
    }

}

//原型链一定要有的
module.exports = refusereason;