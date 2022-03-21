require("./times.less");
class time extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./times.html')
        this.name = "time"
        this.daypicker
    }
    complete() {
        let that = this
        that.dom.find('.iconfont').on('mouseenter', function() {
            if (that.dom.find('.Timers').html() !== '') {
                ES.selctorDoc(this).addClass('icon-shanchutishiicon');
                ES.selctorDoc(this).removeClass('icon-riliriqi');
                //that.dom.find('.icon-shanchu1').off('click')
            }
        })
        that.dom.find('.iconfont').on('click', function(e) {
            if (ES.selctorDoc(this).hasClass('icon-shanchutishiicon')) {
                e.stopPropagation();
                ES.selctorDoc(this).removeClass('icon-shanchutishiicon')
                ES.selctorDoc(this).addClass('icon-riliriqi')
                that.dom.find('.Timers').html('');
                that.event._dispatch('times.dele', '');
            }
        })
        that.dom.find('.iconfont').on('mouseleave', function() {
            if (ES.selctorDoc(this).hasClass('icon-shanchutishiicon')) {
                ES.selctorDoc(this).removeClass('icon-shanchutishiicon')
                ES.selctorDoc(this).addClass('icon-riliriqi')
            }
        })
        var titleShow = this.nowParam.titleShow != undefined ? this.nowParam.titleShow : false;
        if (titleShow) {
            that.dom.find('.timeTitle').removeClass('hide');
        } else {
            that.dom.find('.timeTitle').addClass('hide');
        }
        that.Timer();
    }
    Timer() {
        let that = this
        var time1 = require('../selectdate1/selectdate.js');
        that.dom.find('.day-picker-content').hide()
        // that.dom.find('#day-picker').hide();
        that.dom.find('.day-picker').hide();
        var nowEl
        var type = this.nowParam.type ? this.nowParam.type : 's'
        var st = this.nowParam.startTime != undefined ? this.nowParam.startTime : '';
        var et = this.nowParam.endTime != undefined ? this.nowParam.endTime : '';
        var min = this.nowParam.min ? this.nowParam.min : '';
        var max = this.nowParam.max ? this.nowParam.max : '';
        if (type == 's') {
            that.dom.find('.Timers').html(st);
            // nowEl = '#day-picker1'
            nowEl = '.day-picker1'
        } else {
            // nowEl = '#day-picker'
            nowEl = '.day-picker'
            that.dom.find('.Timers').html(st + '至' + et);
        }
        //if (native) {
        this.daypicker = this.app.loadModule(time1, this.dom.find(nowEl), {
            mode: this.nowParam.type,
            data: { startday: st, endday: et, max: max, min: min }
        });
        // } else {
        //     daypicker = this.app.loadModule(time, this.dom.find(nowEl), {
        //         mode: this.nowParam.type,
        //         data: { startday: st, endday: et, max: max, min: min }
        //     })
        // }
        this.daypicker.event._addEvent('selectdate.delete', function() {
            that.dom.find('.Timers').html('')
            //that.dom.find('.day_right .Timers').html('')
        })
        this.dom.find('.showData').on('click', function() {
            if (that.nowParam.type == 's') {
                var dd = that.dom.find('.Timers').html() != '' ? that.dom.find('.Timers').html() : Tool.GetDateStr(0);
                that.daypicker.showMouth(dd, 'left')
                // that.dom.find('#day-picker1').show()
                // that.dom.find('#daypicker').show()
                that.dom.find('.day-picker1').show()
                that.dom.find('.daypicker').show()
            } else {
                if (that.dom.find('.Timers').html() == '') {
                    that.daypicker.showMouth(Tool.GetDateStr(0), 'left')
                    that.daypicker.showMouth(Tool.GetDateStr(0), 'right')
                } else {
                    var dd = that.dom.find('.Timers').html().split('至');
                    var dd1 = dd[0].split('-')
                    var dd2 = dd[1].split('-')
                    var d1 = dd1[0] + '-' + dd1[1]
                    var d2 = dd2[0] + '-' + dd2[1]
                    that.daypicker.showMouth(d1, 'left')
                    that.daypicker.showMouth(d2, 'right')
                }
                // that.dom.find('#day-picker').show()
                that.dom.find('.day-picker').show()
            }
        })
        this.daypicker.event._addEvent('day.picker', function(value) {
            if (that.nowParam.type == 's') {
                that.dom.find('.Timers').html(value.st);
            } else {
                that.dom.find('.Timers').html(value.st + '至' + value.et);
            }
            that.event._dispatch('times.startend', value);
        });
        this.daypicker.event._addEvent('day.today', function(value) {
            that.dom.find('.Timers').html(value.st);
            // that.dom.find('#day-picker1').hide()
            that.dom.find('.day-picker1').hide()
            that.event._dispatch('times.startend', value);
        })
    }
    refreshData(value, type) {

        console.log('here')
        if (type == 'stet') {
            this.setStEt(value)
        } else if (type == 'maxmin') {
            this.setMaxmin(value);
        } else {
            this.setMaxmin(value);
            this.setStEt(value)
        }
    };
    //限制开始和结束
    setStEt(value) {
        if (this.nowParam.type == 's') {
            this.daypicker.showMouth(value.st, 'left')
            this.dom.find('.Timers').html(value.st);
        } else {
            this.daypicker.refresh({ st: value.st, et: value.et })
            this.dom.find('.Timers').html(value.st + '至' + value.et);
        }
    };
    setMaxmin(value) {
        this.daypicker.setMaxmin({ max: value.max ? value.max : '', min: value.min ? value.min : '' })
    };
    disable(){
        this.dom.find('.showData').off('click')
        this.dom.find('.icon-riliriqi').off('click')
        this.dom.find('.icon-riliriqi').off('mouseenter')
        this.dom.find('.icon-shanchutishiicon').off('click')
    }
    refresh(value){
        let that=this;
        console.log(value);
        that.daypicker.refresh(value)
    }
}




module.exports = time;