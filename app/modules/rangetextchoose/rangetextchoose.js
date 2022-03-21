/*
入参
{name: "半径",type: "bradius",value: 5,max: 30,min:1}
name:代表在范围选择器前面的名字
type:代表是什么类型
value:代表当前值是多少
max:代表范围的最大值
min:代表范围的最小值

事件
rangetextchoose.errorMSG 错误信息事件
返回值为{msg:xxx}

rangetextchoose.change 当范围选择有变化的时候做的处理
返回值为{type:xxxx,value:123}
type为入参的时候给到的当前选择器所要的类型
value为当前选择器的值

数据
this.moveDis = 可以移动的距离
this.max = 允许选择的最大值
this.min = 允许选择的最小值
this.startPos = 拖动按钮的最小位置
this.nowPos=拖动按钮当前在的位置信息
*/
require("./rangetextchoose.less");
class ctlist extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.name = "rangetextchoose"
        this.html = require('./tpl.html')

    }
    complete() {
        this.moveDis = 94
        this.max = this.nowParam.max ? this.nowParam.max : 100
        this.min = (this.nowParam.min != null || this.nowParam.min != undefined) ? this.nowParam.min : 1
        this.startPos = -2
        this.dom.find('.range-text .name').html(this.nowParam.name + ':')
        this.nowPos = this.startPos + this.moveDis * (this.nowParam.value - this.min) / (this.max - this.min)
        this.setInputVal(this.nowParam.value)
        this.initAll()
    }

    //设置input框的值和拖动器的位置,
    /*
    value为number类型,作用为当前数值是多少，
    whoIn为boolean true的时候更新位置，false为更新输入框
    */
    setInputVal(value, whoIn) {
        if (whoIn) {
            this.nowPos = this.startPos + this.moveDis * (value - this.min) / (this.max - this.min)
            this.dom.find('.controlbar .controlR').css({
                'left': this.nowPos
            })
        }
        if (!whoIn) {
            this.dom.find('input[name=datava]').val(value)
        }
    }

    //input 和拖拽同时更新
    setAllData(value) {
        this.nowPos = this.startPos + this.moveDis * (value - this.min) / (this.max - this.min)
        this.dom.find('input[name=datava]').val(this.calReturnValue())
        this.dom.find('.controlbar .controlR').css({
            'left': this.nowPos
        })
    }

    //初始化整个模块
    initAll() {
        let st = false
        let that = this
        let max = this.nowParam.max
        let downpagex
        this.dom.find('.range-mask').on('click', function() {
            that.dom.find('.range-mask').hide()
            that.dom.find('.control-content').hide()
        })
        this.dom.find('.controlbar .barbg').on('click', (e) => {
            e.stopPropagation()
            that.nowPos = e.offsetX
            that.setInputVal(that.calReturnValue())
            that.changeEvent()
        })

        this.dom.find('input[name=datava]').change(() => {
            //this.setDragPos(this.dom.find('input[name=datava]').val())
            this.setInputVal(this.dom.find('input[name=datava]').val(), true)
            this.changeEvent()
        })
        this.dom.find('input[name=datava]').on('input', () => {
            //this.setDragPos(this.dom.find('input[name=datava]').val())
            this.setInputVal(this.dom.find('input[name=datava]').val(), true)
            this.changeEvent()
        })

        /*this.dom.find('input[name=datava]').blur(() => {
            this.setInputVal(this.dom.find('input[name=datava]').val())
            this.changeEvent()
        })*/
        this.dom.find('.controlbar .controlR').on('mousedown', function(e) {
            st = true
            downpagex = e.pageX
        })
        this.dom.on('mousemove', function(e) {
            if (st) {
                let chaju = e.pageX - downpagex
                that.nowPos = that.nowPos + chaju
                that.setInputVal(that.calReturnValue())
                that.changeEvent()
                downpagex = e.pageX
            }
        })

        /*this.dom.on('mouseup', function(e) {
            e.stopPropagation()
            st = false
                //  console.log(e)
        })*/
        this.dom.find('.controlbar').on('mouseup', function(e) {
            e.stopPropagation()
            st = false
        })
        this.dom.find('.controlbar').on('mouseleave', function(e) {
            e.stopPropagation()
            st = false
        })
    }

    //将位置值转换成数值
    calReturnValue() {
        this.nowPos = this.nowPos < this.startPos ? this.startPos : this.nowPos
        this.nowPos = this.nowPos > (this.moveDis + this.startPos) ? (this.moveDis + this.startPos) : this.nowPos
        let nowData = this.min + Math.round((this.nowPos - this.startPos) * (this.max - this.min) / this.moveDis)
        nowData = nowData > this.max ? this.max : nowData
        nowData = nowData < this.min ? this.min : nowData
        return nowData
    }
    changeEvent() {
        let type = this.nowParam.type
        if (this.dom.find('input[name=datava]').val() * 1 > this.max) {
            this.event._dispatch('rangetextchoose.errorMSG', {
                msg: "超过边界"
            })
            this.dom.find('input[name=datava]').val(this.max)
        }
        this.event._dispatch('rangetextchoose.change', {
            'type': type,
            'value': this.dom.find('input[name=datava]').val()
        })
    }
}
module.exports = ctlist;