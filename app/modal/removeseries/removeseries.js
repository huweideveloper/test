require("./removeseries.less")
class progress extends Interstellar.modalBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.res = {}
    }
    complete() {
        let that = this
        this.render()
        this.dom.find('.radio-box').on('click', function(e) {
            that.dom.find('.radio-box').removeClass('choose')
            let dom = ES.selctorDoc(this)
            that.dom.find('.error-info').addClass('hide')
            dom.addClass('choose')
            that.res.type = dom.parent().find('.name-des').attr('code')
            if (that.res.type == '99') {
                that.dom.find('.reason').show()
                that.res.des = that.dom.find('.reason textarea').val()
            } else {
                that.dom.find('.reason').hide()
                that.dom.find('.reason textarea').val('')
                that.res.des = dom.parent().find('.name-des').html()
            }
            console.log(that.res.type ,'that.res.type that.res.type that.res.type that.res.type ')
        })
        this.dom.find('.reason textarea').on('blur', function() {
            console.log(that.dom.find('.reason textarea').val())
            that.res.des = that.dom.find('.reason textarea').val()
        })
    }
    render() {
        console.log(this.initDate.data)
        if (this.initDate.data) {
            let str = ''
            this.initDate.data.map((item) => {
                if (item.value * 1 != 98 && item.value * 1 != 99) {
                    str += '<li><span class="radio-box"></span><span class="name-des" code="' + item.value + '">' + item.name + '</span></li>'
                }
            })
            str += ` <li><span class="radio-box"></span><span class="name-des" code="98">序列加载异常</span></li>
        <li><span class="radio-box"></span><span class="name-des" code="99">其他</span></li>
        <li class="reason" style='display: none;clear:both;'><span >备注</span><textarea ></textarea></li>`
            this.dom.find('.removeseries ul').html(str)
        }
    }
    showError(code) {
        switch (code) {
            case 0:
                this.dom.find('.error-info').html('必须选择原因')
                break
            case 1:
                this.dom.find('.error-info').html('请填写备注信息')
                break
        }
        this.dom.find('.error-info').removeClass('hide')
    }
}
module.exports = progress;