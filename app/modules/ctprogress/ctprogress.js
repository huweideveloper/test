/*
model为外面的数据同步

事件
1.CtProgress.borClick 进度条的上下按钮

*/

class CtProgress extends Interstellar.moduleBase {
    constructor(app, dom, value, addMore) {
        super(app, dom, value, addMore)
        require("./ctprogress.less");
        this.html = require("./tpl.html");
        this.name = "CtProgress"
        this.model = {}
        this.valH = 30
        this.topValue = 0
    }
    complete() {
        this.topValue = 0
        let dowpagex = null
        let st = false
        let that = this
        this.dom.find('.progress_val').on('mousedown', function(e) {
            st = true
            dowpagex = e.pageY
            that.event._dispatch('ctprogress.startDrag')

        })
        this.dom.find('.progress').on('click', function(e) {
            that.topValue = e.pageY - 125
            that.progressPos()
            that.event._dispatch('ctprogress.click')
            that.event._dispatch('ctprogress.stopDrag')
        })
        this.dom.on('mousemove', function(e) {
            if (st) {
                that.topValue += (e.pageY - dowpagex)
                dowpagex = e.pageY
                that.progressPos()
            } else {
                let numPos = (e.pageY - 125)
                that.dom.find('.layer-number').css({
                    "transform": "translate(0px, " + numPos + "px)"
                })
                that.dom.find('.layer-number').show()
                let num = Math.floor(numPos / (that.totalHeight - that.barHeight) * (that.totalImage - 1))
                num = num > (that.totalImage - 1) ? (that.totalImage - 1) : num
                that.dom.find('.layer-number').html(that.imageLists[num])
            }
            // console.log(e)
        })
        this.dom.on('mouseup', function(e) {
            e.stopPropagation()
            that.dom.find('.layer-number').hide()
            st = false
            that.event._dispatch('ctprogress.stopDrag')
        })
        this.dom.on('mouseleave', function(e) {
            e.stopPropagation()
            that.dom.find('.layer-number').hide()
            st = false
            that.event._dispatch('ctprogress.stopDrag')
                //  console.log(e)
        })
        this.dom.find('.progress').on('mouseleave', function() {
            that.dom.find('.layer-number').hide()
            st = false
            that.event._dispatch('ctprogress.stopDrag')
        })
    }

    //进度条位置
    progressPos() {
        if (this.topValue + this.barHeight > this.totalHeight) {
            this.topValue = this.totalHeight - this.barHeight
        }
        this.dom.find('.progress_val').css({
            "transform": "translate(0px, " + this.topValue + "px)"
        })
    }
    setPosBar(layerId) {
        if (this.totalImage == 1) {
            this.dom.find('.progress_val').css({
                "transform": "translate(0px, 0px)"
            })
            return
        }
        let pox = this.imageLists.lastIndexOf(layerId)
            //console.log(pox, 'setPosBarsetPosBarsetPosBar', layerId)
        this.topValue = pox == -1 ? 0 : Math.floor((pox / (this.totalImage - 1)) * (this.totalHeight - this.barHeight))
            //console.log(this.topValue)
        this.progressPos()
    }

    //设置bar的高度
    setBarHeight() {
        if (this.totalImage < 50) {
            this.valH = 1
        }
        let rate = (this.valH / this.totalImage)
        this.totalHeight = this.dom.find('.progress').box().offsetHeight
        this.barHeight = Math.floor((rate * this.totalHeight) / (1 + rate))
        this.dom.find('.progress_val').css({
            height: this.barHeight
        })
    }

    //设置总片长
    setImageData(value) {
       // console.log(value)
        this.imageLists = value
        this.totalImage = value.length

        this.setBarHeight()
    }

    //获取当前比例
    getRate() {
        let num = Math.floor(this.topValue / (this.totalHeight - this.barHeight) * (this.totalImage - 1))
        num = num > (this.totalImage - 1) ? (this.totalImage - 1) : num
        console.log(this.imageLists[num],num)
        return this.imageLists[num]
    }

    //清掉一些监听
    close() {
        this.dom.find('.progress_val').off('mousedown')
        this.dom.off('mousemove')
        this.dom.off('mouseup')
        this.dom.find('.progress').off('mousemove')
    }


    //重置
    resize(layerId) {
        this.setBarHeight()
        this.setPosBar(layerId)
            // console.log()
    }

}

//原型链一定要有的
module.exports = CtProgress;