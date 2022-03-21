require("./selectdate.less");
var html = require("./tpl.html");
var datepick = require('./datepicker.js')
var month = require('../selectmouth/selectmouth.js')
var year = require('../selectyear/selectyear.js')



function selectMouth() {
    this.html = html
    var that = this;
    // var nowYear = ''
    // var nowMouth = ''
    var monthCont = null;
    var yearCont = null;
    this.complete = function() {
            //this.mode = this.nowParam.mode
        this.chooseStart = this.nowParam.data.startday != '' ? this.nowParam.data.startday : Tool.GetDateStr(0)
        this.chooseEnd = this.nowParam.data.endday
        this.maxDay = this.nowParam.data.max ? this.nowParam.data.max : ''
        this.minDay = this.nowParam.data.min ? this.nowParam.data.min : '';
        this.dataNow = new datepick({ model: '2', data: this.chooseStart });
        this.blone = 'left'
        monthCont = that.app.loadModule(month, that.dom.find('.monthpicker'), this.nowParam.data);
        monthCont.event._addEvent('month.click', function(val) {
            that.dom.find('.daypicker').hide();
            that.dom.find('.monthpicker').hide();
            that.dom.find('.yearpicker').show();
            yearCont.setYear(val)
        })
        monthCont.event._addEvent('mouth.change', function(val) {
            that.dom.find('.daypicker').show();
            that.dom.find('.monthpicker').hide();
            that.dom.find('.yearpicker').hide();
            if (val) {
                that.showMouth(val, 'left')
            }
        })
        yearCont = that.app.loadModule(year, that.dom.find('.yearpicker'), this.nowParam.data);
        yearCont.event._addEvent('selectyear', function(val) {
            that.dom.find('.daypicker').hide();
            that.dom.find('.monthpicker').show();
            that.dom.find('.yearpicker').hide();
            if (val) {
                monthCont.setYear(val)
            }
        });
        this.dom.css('width', 220)
        this.dom.find('.daterangepicker .left').show()
        this.dom.find('.calendar .prevMonth').on('click', function() {
            var nowshowM = $(this).parent().find('.month').attr('nowMoth').split('-')
            var nowMouth = nowshowM[1] - 1 == 0 ? 12 : nowshowM[1] - 1
            var nowYear = nowshowM[1] - 1 == 0 ? nowshowM[0] - 1 : nowshowM[0]
            if (nowMouth < 10) {
                nowMouth = '0' + nowMouth
            }
            that.showMouth(nowYear + '-' + nowMouth)
        })
        this.dom.find('.calendar .nextMonth').on('click', function() {
            var nowshowM = $(this).parent().find('.month').attr('nowMoth').split('-')
            var nowMouth = nowshowM[1] * 1 + 1 == 13 ? 1 : nowshowM[1] * 1 + 1
            var nowYear = nowshowM[1] * 1 + 1 == 13 ? nowshowM[0] * 1 + 1 : nowshowM[0]
            if (nowMouth < 10) {
                nowMouth = '0' + nowMouth
            }
            that.showMouth(nowYear + '-' + nowMouth)
        })
        this.dom.find('.calendar .prevYear').on('click', function() {
            var nowshowM = $(this).parent().find('.month').attr('nowMoth').split('-')
            var nowYear = nowshowM[0] - 1 > 0 ? nowshowM[0] - 1 : nowshowM[0]
            var nowMouth = nowshowM[1]
            that.showMouth(nowYear + '-' + nowMouth)
        })
        this.dom.find('.calendar .nextYear').on('click', function() {
            var nowshowM = $(this).parent().find('.month').attr('nowMoth').split('-')
            var nowYear = parseInt(nowshowM[0]) + 1
            var nowMouth = nowshowM[1]
            that.showMouth(nowYear + '-' + nowMouth)
        })
        that.dom.find('.month').on('click', function() {
            that.dom.find('.daypicker').hide();
            that.dom.find('.monthpicker').show();
            monthCont.resetDom($(this).attr('nowmoth'))
        });
        this.dom.find('.day-picker-mask').on('click', function() {
            that.dom.hide()
            that.dom.find('.month_show').addClass('hide')
            that.dom.find('.year_show').addClass('hide')
            that.event._dispatch('day.close')
        });
        that.dom.find('.deleteIcon').on('click', function() {
            var arr = ['left', 'right'];
            $.each(arr, function(idx, val) {
                that.resetTime(Tool.GetDateStr(0), Tool.GetDateStr(0), val)
            })
            that.dom.hide()
            that.event._dispatch('selectdate.delete')
        })
        this.dom.find('.today').on('click', function() {
            // var value;
            // value="";
            let maxArr = that.maxDay.split('-')
            maxArr.forEach(function(e, i){
                maxArr[i] = parseInt(e)
            })
            let todayArr = Tool.GetDateStr(0).split('-')
            todayArr.forEach(function (e, i) {
                todayArr[i] = parseInt(e)
            })
            let flag = false
            if(maxArr[0] < todayArr[0]){
                flag = true
            }else {
                if (maxArr[1] < todayArr[1]) {
                    flag = true
                } else {
                    if (maxArr[2] < todayArr[2]) {
                        flag = true
                    }
                }
            }
            if(flag){
                that.alert('时间不在可选时间段内');
                return
            }
            if (that.blone == 'left') {
                var chz = new Date(Tool.GetDateStr(0).replace(/-/g, '/')).getTime() - new Date(that.chooseEnd.replace(/-/g, '/')).getTime()
                if (chz > 0) {
                    that.chooseEnd = that.chooseStart = Tool.GetDateStr(0)
                } else {
                    that.chooseStart = Tool.GetDateStr(0)
                }
            }
            if (that.blone == 'right') {
                var aa = that.chooseStart
                var chz = new Date(Tool.GetDateStr(0).replace(/-/g, '/')).getTime() - new Date(aa.replace(/-/g, '/')).getTime()
                if (chz < 0) {
                    that.chooseEnd = that.chooseStart = Tool.GetDateStr(0)
                } else {
                    that.chooseEnd = Tool.GetDateStr(0)
                }
            }
          //  that.event._dispatch('day.today', { st: Tool.GetDateStr(0),dom:ES.selctorDoc(this) });
            that.event._dispatch('day.picker', { st: dealZero(that.chooseStart), et: dealZero(that.chooseEnd), blone: that.blone })

        })

    }
    this.refresh = function(value) {
        this.chooseStart = value.st ? value.st : this.chooseStart
        this.chooseEnd = value.et ? value.et : this.chooseEnd
        this.showMouth(this.chooseStart, 'left')
        this.showMouth(this.chooseEnd, 'right')
    }
    this.setMaxmin = function(value) {
        this.maxDay = value.max ? value.max : this.maxDay
        this.minDay = value.min ? value.min : this.minDay
    }
    this.initData = function(data, el) {
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
            if (new Date(day).getTime() - new Date(this.chooseStart.replace(/-/g, '/')).getTime() > 0 && new Date(day).getTime() - new Date(this.chooseEnd.replace(/-/g, '/')).getTime() < 0) {
                nowClass += ' range'
            }
            if (new Date(day).getTime() - new Date(this.chooseStart.replace(/-/g, '/')).getTime() == 0 || new Date(day).getTime() - new Date(this.chooseEnd.replace(/-/g, '/')).getTime() == 0) {
                nowClass += ' headtail'
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
                if (nowMouth < 10) {
                    nowMouth = '0' + nowMouth
                }
                socre = nowYear + '-' + nowMouth + '-' + $(this).html()
            } else {
                socre = day[0] + '-' + day[1] + '-' + $(this).html()
            }
            var pd = socre
            if (that.blone == 'left') {
                var chz = new Date(pd.replace(/-/g, '/')).getTime() - new Date(that.chooseEnd.replace(/-/g, '/')).getTime()
                if (chz > 0) {
                    that.chooseEnd = that.chooseStart = socre
                } else {
                    that.chooseStart = socre
                }
            }
            if (that.blone == 'right') {
                var aa = that.chooseStart
                var chz = new Date(pd.replace(/-/g, '/')).getTime() - new Date(aa.replace(/-/g, '/')).getTime()
                if (chz < 0) {
                    that.chooseEnd = that.chooseStart = socre
                } else {
                    that.chooseEnd = socre
                }
            }
            that.showMouth(socre)
            that.dom.hide()
                //console.log('ppppppp', that.blone)
            that.event._dispatch('day.picker', { st: dealZero(that.chooseStart), et: dealZero(that.chooseEnd), blone: that.blone })
        })
    }
    this.showMouth = function(value) {
        var allD = value.split('-') || value.split('/')
        this.dom.find('.month').attr('nowMoth', allD[0] + '-' + allD[1])
        this.dom.find('.month').html(allD[0] + '年' + allD[1] + '月');
        var which = ''
            //console.log('ppppp', this.chooseStart, this.chooseEnd)
        if (this.blone == 'left') {
            which = this.chooseStart
        } else {
            which = this.chooseEnd
        }
        if (which.lastIndexOf(value + '-') != -1) {
            this.dataNow.init(which)
        } else {
            this.dataNow.init(value)
        }
        that.initData(this.dataNow.getDatePicker().data, 'left')
    }
    this.resetTime = function(showDay, day, r) {
        this.chooseStart = day;
        this.chooseEnd = showDay;
        this.blone = r;
        if (r == 'left') {
            that.showMouth(day)
        } else {
            that.showMouth(showDay)
        }
    }
}

function dealZero(value) {
    var newDa = value.split('-')
        //console.log(newDa, ('0' + newDa[1].replace(/(^\s*)|(\s*$)/g, "")).slice(-2), ('0' + newDa[2].replace(/(^\s*)|(\s*$)/g, "")).slice(-2))
    newDa = newDa[0] + '-' + ('0' + newDa[1].replace(/(^\s*)|(\s*$)/g, "")).slice(-2) + '-' + ('0' + newDa[2].replace(/(^\s*)|(\s*$)/g, "")).slice(-2)
    return newDa
}
//原型链一定要有的
module.exports = selectMouth;