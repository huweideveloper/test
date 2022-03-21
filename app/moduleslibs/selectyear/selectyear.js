require("./selectyear.less");
class selectyear extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "selectyear"
    }
    complete() {
        let that = this
        this.nowYear = this.nowParam.year || Number(new Date().getFullYear());
        this.maxYear = this.nowParam.max ? parseInt(this.nowParam.max.split('-')[0]) : '' || ''
        this.minYear = this.nowParam.min ? parseInt(this.nowParam.min.split('-')[0]) : '' || ''
        that.dom.find('.gri_Y').html(this.nowYear);
        for (var i = 0; i < 12; i++) {
            that.initYear(i, (2009 + i), i)
        }
        that.dom.find('.gri_nextY').on('click', function() {
            var lastYear = parseInt(that.dom.find('td').eq(10).html());
            //console.log('点击', lastYear)
            for (var i = 0; i < 12; i++) {
                that.initYear(i, lastYear + i, i)
            }
        })
        that.dom.find('.gri_preY').on('click', function() {
            var firstYear = parseInt(that.dom.find('td').eq(1).html());
            for (var i = 11; i > -1; i--) {
                that.initYear(i, firstYear - i, 11 - i)
            }
        });
        that.dom.find('.gri_yearPicker_table td').on('click', function() {
            if (!ES.selctorDoc(this).hasClass('close')) {
                that.dom.find('.gri_yearPicker_table td').removeClass('current')
                ES.selctorDoc(this).addClass('current')
                that.dom.find('.gri_Y').html(ES.selctorDoc(this).html())
                that.event._dispatch('selectyear', ES.selctorDoc(this).html())
            }
        })
        that.dom.find('.year-picker-mask').on('click', function() {
            that.event._dispatch('selectyear')
        })
    }
    initYear(i, htmlNum, eqNum) {
        let that = this
        var id = 'gri_year' + (htmlNum);
        var nowClass = '';
        //console.log('htmlNum', htmlNum)
        that.dom.find('.gri_yearPicker_table td').eq(eqNum).html((htmlNum));
        that.dom.find('.gri_yearPicker_table td').eq(eqNum).attr('id', id);
        if (that.minYear) {
            if ((htmlNum) < that.minYear) {
                nowClass = ' close'
            } else {
                nowClass = ' available'
            }
        } else {
            nowClass = ' available'
        }
        if (that.maxYear) {
            if ((htmlNum) > that.maxYear) {
                nowClass += ' close'
            } else {
                nowClass += ' available'
            }
        } else {
            nowClass += ' available'
        }
        if ((htmlNum) == that.nowYear) {
            nowClass += ' current'
        }
        if (i == 0 || i == 11) {
            nowClass += ' off'
        }
        //console.log('nowClass', that.qc(nowClass))
        that.dom.find('.gri_yearPicker_table td').eq(eqNum).attr('class', that.qc(nowClass))
    }
    qc(val) {
        var temp = ''
        if (val.indexOf('close') != -1) {
            temp = 'close'
        } else {
            var tt = val.split(' ');
        }
        return temp
    }
    setYear(val) {
        this.dom.find('.gri_Y').html(val);
        this.dom.find('.gri_yearPicker_table td').removeClass('current')
        this.dom.find('#gri_year' + val).addClass('current');
        this.nowYear = val;
    }

}

module.exports = selectyear;