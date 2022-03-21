class selectMouth extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        require("./selectdate.less");
        this.html = require("./tpl.html");
        this.datepick = require('./datepicker.js')
        this.mouthName = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        this.nowYear = ''
        this.nowMouth = ''
    }
    complete() {
        var datepick = require('./datepicker.js')
        let that = this
        this.dom.hide();
        this.mode = this.nowParam.mode || 's';
        this.tempDate = this.nowParam.tempDate
        this.chooseStart = this.nowParam.data.startday
        this.chooseEnd = this.nowParam.data.endday
        this.maxDay = this.nowParam.data.max ? this.nowParam.data.max : ''
        this.minDay = this.nowParam.data.min ? this.nowParam.data.min : ''
        this.dataNow = new datepick({ model: '2', data: this.nowParam.data.startday })
        this.nowParam.opener.on('click', function() {
            var timeR = $(this).val().split('至')
            that.refresh({ st: timeR[0], et: timeR[1] })
            that.dom.show()
        });
        if (this.mode == 's') {
            this.dom.css('width', 220)
            this.dom.find('.daterangepicker .left').show()
            this.dom.find('.daterangepicker .right').addClass('hide');
            this.showMouth(this.chooseStart, 'left')
        } else {
            this.dom.css('width', 500)
            this.dom.find('.ranges').show()
            this.dom.find('.daterangepicker .calendar').show()
            this.showMouth(this.chooseEnd, 'right')
            this.showMouth(this.chooseStart, 'left')
        }
        this.dom.find('.calendar .prev').on('click', function() {
            var nowshowM = $(this).parent().find('.month').attr('nowMoth').split('-')
            var nowMouth = nowshowM[1] - 1 == 0 ? 12 : nowshowM[1] - 1
            var nowYear = nowshowM[1] - 1 == 0 ? nowshowM[0] - 1 : nowshowM[0]
            that.showMouth(nowYear + '-' + nowMouth, $(this).attr('blone'))
        })
        this.dom.find('.calendar .next').on('click', function() {
            var nowshowM = $(this).parent().find('.month').attr('nowMoth').split('-')
            var nowMouth = nowshowM[1] * 1 + 1 == 13 ? 1 : nowshowM[1] * 1 + 1
            var nowYear = nowshowM[1] * 1 + 1 == 13 ? nowshowM[0] * 1 + 1 : nowshowM[0]
            that.showMouth(nowYear + '-' + nowMouth, $(this).attr('blone'))
        })
        this.dom.find('.ranges .btn-success').on('click', function() {
            that.dom.hide()
            if (that.nowParam.opener) {
                that.nowParam.opener.val(that.dealZero(that.chooseStart) + '至' + that.dealZero(that.chooseEnd))
            }
            that.event._dispatch('day.picker', { st: that.dealZero(that.chooseStart), et: that.dealZero(that.chooseEnd), tempDate: that.tempDate, pid: that.nowParam.id })
        })
        this.dom.find('.day-picker-mask').on('click', function() {
            that.dom.hide()
            that.event._dispatch('day-mask.click')
        })
    }
    alert(msg) {
        this.app.alert.show({
            close: false,
            msg: msg
        })
        //that.app.alert.openUP()
    }
    refresh(value) {
        this.chooseStart = value.st ? value.st : this.chooseStart
        this.chooseEnd = value.et ? value.et : this.chooseEnd
        this.showMouth(this.chooseStart, 'left')
        this.showMouth(this.chooseEnd, 'right')
    }
    setMaxmin(value) {
        this.maxDay = value.max ? value.max : this.maxDay
        this.minDay = value.min ? value.min : this.minDay
    }
    attr(key, value) {
        if (!this[key]) {
            this[key] = value
        } else {
            if (value) {
                this[key] = value
            } else {
                return this[key]
            }
        }
    }
    initData(data, el) {
        let that = this
        var html = ''
        var nowMouth1 = this.dom.find('.' + el + ' .month').attr('nowMoth').split('-')
        for (var i = 0; i < data.length; i++) {
            var nowClass = "off"
            var day = ''
            if (data[i].row != undefined || data[i].row != null) {
                //console.log('ooo', data[i]);
                nowClass = ''
                day = nowMouth1[0] + '/' + nowMouth1[1] + '/' + data[i].day
            } else {
                if (i < 20) {
                    var nowMouth = nowMouth1[1] * 1 - 1 == 0 ? 12 : nowMouth1[1] * 1 - 1
                    var nowYear = nowMouth1[1] * 1 - 1 == 0 ? nowMouth1[0] * 1 - 1 : nowMouth1[0]
                } else {
                    var nowMouth = nowMouth1[1] * 1 + 1 == 13 ? 1 : nowMouth1[1] * 1 + 1
                    var nowYear = nowMouth1[1] * 1 + 1 == 13 ? nowMouth1[0] * 1 + 1 : nowMouth1[0]
                }
                day = nowYear + '/' + nowMouth + '/' + data[i].day
            }
            var act = ''
            if (this.maxDay) {
                if (new Date(day).getTime() - new Date(this.maxDay.replace(/-/g, '/')).getTime() > 0) {
                    nowClass += ' close'
                }
            }
            if (this.minDay) {
                if (new Date(day).getTime() - new Date(this.minDay.replace(/-/g, '/')).getTime() < 0) {
                    nowClass += ' close'
                }
            }
            if (data[i].nowDay == true) {
                act = 'active'
            }
            switch (Math.floor(i % 7)) {
                case 0:
                    html += '<tr>'
                    html += '<td blone="' + el + '" class="available ' + nowClass + ' ' + act + '">' + data[i].day + '</td>'
                    break
                case 6:
                    html += '<td blone="' + el + '" class="available ' + nowClass + ' ' + act + '">' + data[i].day + '</td>'
                    html += '</tr>'
                    break
                default:
                    html += '<td blone="' + el + '" class="available ' + nowClass + ' ' + act + '">' + data[i].day + '</td>'
                    break
            }
        }
        this.dom.find('.daterangepicker .' + el).find('tbody').html(html)
        this.dom.find('.daterangepicker .' + el + ' td').on('click', function() {
            if ($(this).hasClass('close')) {
                that.alert('时间不在可选时间段内');
                return
            }
            var day = that.dom.find('.' + $(this).attr('blone') + ' .month').attr('nowmoth').split('-')
            var socre = ''
            if ($(this).hasClass('off')) {
                if ($(this).html() * 1 > 15) {
                    var nowMouth = day[1] * 1 - 1 == 0 ? 12 : day[1] * 1 - 1
                    var nowYear = day[1] * 1 - 1 == 0 ? day[0] * 1 - 1 : day[0]
                }
                if ($(this).html() * 1 < 15) {
                    var nowMouth = day[1] * 1 + 1 == 13 ? 1 : day[1] * 1 + 1
                    var nowYear = day[1] * 1 + 1 == 13 ? day[0] * 1 + 1 : day[0]
                }
                socre = nowYear + '-' + nowMouth + '-' + $(this).html()
            } else {
                socre = day[0] + '-' + day[1] + '-' + $(this).html()
            }
            var pd = socre
            if ($(this).attr('blone') == 'left') {
                if (that.mode != 's') {
                    var chz = new Date(pd.replace(/-/g, '/')).getTime() - new Date(that.chooseEnd.replace(/-/g, '/')).getTime()
                    if (chz > 0) {
                        that.alert('开始时间不能晚于结束时间')
                        return
                    }
                }
                that.chooseStart = socre
            }

            if ($(this).attr('blone') == 'right') {
                var aa = that.chooseStart
                var chz = new Date(pd.replace(/-/g, '/')).getTime() - new Date(aa.replace(/-/g, '/')).getTime()
                if (chz < 0) {
                    that.alert('结束时间不能早于开始时间')
                    return
                }
                that.chooseEnd = socre
            }
            that.showMouth(socre, $(this).attr('blone'))
            if (that.mode == 's') {
                that.dom.hide()
                if (that.nowParam.opener) {
                    that.nowParam.opener.val(that.dealZero(that.chooseStart))
                }
                that.event._dispatch('day.picker', { st: that.dealZero(that.chooseStart), tempDate: that.tempDate, pid: that.nowParam.id })
                that.event._dispatch('day-mask.click')
            } else {

            }
        })
    }
    showMouth(value, r) {
        let that = this
        var allD = value.split('-')
        switch (r) {
            case 'right':
                this.dom.find('.right .month').attr('nowMoth', allD[0] + '-' + allD[1])
                break
            case 'left':
                this.dom.find('.left .month').attr('nowMoth', allD[0] + '-' + allD[1])
                break
        }
        this.dom.find('.' + r + ' .month').html(this.mouthName[allD[1] - 1] + " " + allD[0])
        var which = ''
        if (r == 'left') {
            which = this.chooseStart
        } else {
            which = this.chooseEnd
        }
        if (which.lastIndexOf(value + '-') != -1) {
            this.dataNow.init(which)
        } else {
            this.dataNow.init(value)
        }
        that.initData(this.dataNow.getDatePicker().data, r)
    }
    dealZero(value) {
        var newDa = value.split('-')
        newDa = newDa[0] + '-' + ('0' + newDa[1]).slice(-2) + '-' + ('0' + newDa[2]).slice(-2)
        return newDa
    }
}
//原型链一定要有的
module.exports = selectMouth;