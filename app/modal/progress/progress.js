require("./progress.less")
class progress extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'progress'
    }
    makeprogress(value) {
        let pr = Number(value.rate).toFixed(2) + '%'
        this.dom.find('.blue').css({ width: 4 * value.rate })
        this.dom.find('.p-name').html(pr)
    }
    autoprogress() {
        if (this.timeSt) {
            return
        }
        let rate = 5
        this.timeSt = setInterval(() => {
            rate = rate + 1
            if (rate < 95) {
                this.makeprogress({ rate: rate })
            }
        }, 500)
    }
    stopAll() {
        //console.log(this.timeSt)
        if (this.timeSt) {
            clearInterval(this.timeSt)
        } else {
            return
        }
        //console.log('aaaaaaaaaaaaa')
        this.dom.find('.blue').css({ width: 400 })
        this.dom.find('.p-name').html('100%')
        setTimeout(() => {
            this.close()
        }, 200)
    }
}
module.exports = progress;