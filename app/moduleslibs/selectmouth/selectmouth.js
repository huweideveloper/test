require("./selectMouth.less");
class selectMouth extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "selectMouth"
    }
    complete() {
        let that=this
        this.nowYear = this.nowParam.year || Number(new Date().getFullYear());
        this.nowMonth = this.nowParam.month || (Number(new Date().getMonth()) + 1);
        this.maxYear = this.nowParam.max ? parseInt(this.nowParam.max.split('-')[0]) : '' || ''
        this.maxMonth = this.nowParam.max ? parseInt(this.nowParam.max.split('-')[1]) : '' || ''
        this.minYear = this.nowParam.min ? parseInt(this.nowParam.min.split('-')[0]) : '' || ''
        this.minMonth = this.nowParam.min ? parseInt(this.nowParam.min.split('-')[1]) : '' || ''
        that.initYear();
        that.dom.find('.gri_preYear').on('click', function() {
            that.nowYear--;
            that.initYear();
        });
        that.dom.find('.gri_nextYear').on('click', function() {
            that.nowYear++;
            that.initYear();
        });
        this.dom.find('.mouth-picker-mask').on('click', function() {
            //console.log('dsjkdj')
            that.event._dispatch('mouth.change')
        })
        that.dom.find('.gri_year').on('click', function() {
            //console.log(',l,ldokfosdk')
            that.event._dispatch('month.click', ES.selctorDoc(this).html());
        })
        that.dom.find('.gri_monthPicker_table td').on('click', function() {
            if (!ES.selctorDoc(this).hasClass('close')) {
                that.dom.find('.gri_monthPicker_table td').removeClass('current')
                ES.selctorDoc(this).addClass('current')
                // that.dom.find('.gri_monthPicker_wrapper').hide()
                // that.dom.find('.mouth-picker-mask').hide()
                var t1 = that.dom.find('.gri_year').html();
                var t2 = ES.selctorDoc(this).html().split('月')[0]
                if (parseInt(t2) < 10) {
                    t2 = '0' + t2
                }
                that.event._dispatch('mouth.change', (t1 + '-' + t2))
            }
        })
    }
    initYear() {
        let that=this
        that.dom.find('.gri_year').html(that.nowYear);
        that.dom.find('.gri_monthPicker_table td').removeClass('current')
        that.dom.find('.gri_month' + that.nowMonth).addClass('current')
        var nowClass = '';
        // console.log('oo000000000', that.nowYear, that.maxYear)
        if (that.maxYear) {
            if (that.nowYear > that.maxYear) {
                that.dom.find('.gri_monthPicker_table td').removeClass('current').addClass('close')
                return false
            } else {
                that.dom.find('.gri_monthPicker_table td').removeClass('close')
            }
        } else {
            that.dom.find('.gri_monthPicker_table td').removeClass('close')
        }
        if (that.minYear) {
            if (that.nowYear < that.minYear) {
                that.dom.find('.gri_monthPicker_table td').removeClass('current').addClass('close')
                return false
            } else {
                that.dom.find('.gri_monthPicker_table td').removeClass('close')
            }
        } else {
            that.dom.find('.gri_monthPicker_table td').removeClass('close')
        }
        if (that.nowYear == that.maxYear) {
            // if (that.maxMonth) {
            //     that.dom.find('.gri_month' + that.maxMonth).nextAll().removeClass('current').addClass('close')
            //     that.dom.find('.gri_month' + that.maxMonth).parent().nextAll().find('td').removeClass('current').addClass('close')
            // }
        }
        if (that.nowYear == that.minYear) {
            // if (that.minMonth) {
            //     that.dom.find('.gri_month' + that.minMonth).prevAll().removeClass('current').addClass('close')
            //     that.dom.find('.gri_month' + that.minMonth).parent().prevAll().find('td').removeClass('current').addClass('close')
            // }
        }
    }
    setYear(val) {
        this.nowYear = val
        // that.dom.find('.gri_year').html(val);
        this.initYear();
    }
    resetDom(val) {
        this.nowYear = val.split('-')[0] * 1
        this.nowMonth = val.split('-')[1] * 1
        this.initYear();
    }

}
//原型链一定要有的
module.exports = selectMouth;
