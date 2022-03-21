require("./crossline.less")
class crossline extends Interstellar.moduleBase {
    constructor(app, value, api, addMode) {
        super(app, value, api, addMode)
        this.html = require('./tpl.html')
        this.name = 'crossline'
    }
    complete() {
        let st = false
        this.dom.find('.yline').on('mousedown', (e) => {
            let xy = this.xyChange({ x: e.pageX, y: e.pageY })
            this.nowpos = xy
            //e.offsetY
            console.log(xy, e.pageX, e.pageY)
            this.dom.find('.xline').css({ transform: "translate(0px," + xy.y + "px)" })
            this.dom.find('.yline').css({ transform: "translate(" + xy.x + "px,0px)" })
            st = true
        })
        this.dom.find('.xline').on('mousedown', (e) => {
            let xy = this.xyChange({ x: e.pageX, y: e.pageY })
            this.nowpos = xy
            //e.offsetY
            this.dom.find('.xline').css({ transform: "translate(0px," + xy.y + "px)" })
            this.dom.find('.yline').css({ transform: "translate(" + xy.x + "px,0px)" })
            st = true
        })
        this.dom.parent().on('mousemove', (e) => {
            //console.log(e)
            if (st) {
                let xy = this.xyChange({ x: e.pageX, y: e.pageY })
                this.nowpos = xy
                //e.offsetY
                //console.log(xy)
                this.dom.find('.xline').css({ transform: "translate(0px," + xy.y + "px)" })
                this.dom.find('.yline').css({ transform: "translate(" + xy.x + "px,0px)" })
                this.event._dispatch('crossline.move')
            }
        })
        this.dom.parent().on('mouseup', (e) => {
            st = false
            this.event._dispatch('crossline.mouseup')
        })

        this.dom.find('.yline').on('mouseup', (e) => {
            st = false
            this.event._dispatch('crossline.mouseup')
            //this.dom.off('mousemove')
        })
        this.dom.find('.xline').on('mouseup', (e) => {
            st = false
            this.event._dispatch('crossline.mouseup')
            //this.dom.off('mousemove')
        })
    }
    setYHeight(h) {
        this.dom.find('.yline').css({ 'height': h })
    }
    setXYLinePos(data) {
        //this.xylinepos=data
        this.dom.find('.xline').css({ transform: "translate(0px," + data.y + "px)" })
        this.dom.find('.yline').css({ transform: "translate(" + data.x + "px,0px)" })
    }
    xyChange(point) {
        let cWidth = ES.selctorDoc(window).box().clientWidth - 180 - 290
        let cHeight = ES.selctorDoc(window).box().clientHeight - 60 - 64
        //console.log(this.type)
        let x = point.x - (this.type == "z" ? 180 : (180 + cWidth / 2))
        let y = point.y - (this.type != "x" ? 124 : (124 + cHeight / 2))
        return { x, y }
    }
    setPos(point, scaleT) {
        // console.log(this.dom.box())
        this.nowpos = point
        this.dom.find('.xline').css({ transform: "translate(0px," + point.y + "px)" })
        this.dom.find('.yline').css({ transform: "translate(" + point.x + "px,0px)" })
        //this.dom.find('xline')
        //this.dom.find('yline')
    }
    returnXY(dom) {
        let transform = dom.dom[0].dom.style.transform
        let x = transform.split(",")[0].split("(")[1].split("px")[0] * 1
        let y = transform.split(",")[1].split(")")[0].split("px")[0] * 1
        return { x, y }
    }
    close() {

    }
    setPostion() {

    }

}
module.exports = crossline;