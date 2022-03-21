require("./setyz.less")
class progress extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = 'setyz'
    }
    complete() {
        console.log(this.initDate.data)
        if (this.initDate.data) {
            let ran = this.data = this.initDate.data ? JSON.parse(this.initDate.data) : { yzmin: "", yzmax: "" }
            this.dom.find('.setyz_content').html('请填写该影像标注的CT值，确认后进入影像标注的位置标注。<span class="yz">(预设值范围为' + ran.yzmin + '-' + ran.yzmax + ')</span>')
            this.dom.find('.setyz_set input[name="yzmin"]').val(ran.yzmin)
            this.dom.find('.setyz_set input[name="yzmax"]').val(ran.yzmax)
        } else {
            this.dom.find('.error-info').html('')
        }
        this.dom.find('.setyz_set input').on('focus', () => {
            this.dom.find('.error-info').addClass('hide')
        })
        this.dom.find('.setyz_set input').on('blur', () => {
            this.data = {
                yzmin: this.dom.find('.setyz_set input[name="yzmin"]').val(),
                yzmax: this.dom.find('.setyz_set input[name="yzmax"]').val()
            }
            this.dom.find('.error-info').addClass('hide')
        })
    }
    showError(msg) {
        this.dom.find('.error-info').html(msg)
        this.dom.find('.error-info').removeClass('hide')
    }

}
module.exports = progress;