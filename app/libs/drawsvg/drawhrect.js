/*
横轴图，三个类型：normal，radd，more
normal为正常横轴图
radd为横轴叠加图
more横轴多柱图
*/
var drawRec = {
    drawRecX: function(nowOption) {
        var jg
        switch (nowOption.xytext.y) {
            case 'bottom':
                jg = nowOption.showArr.h / (nowOption.y.length - 1)
                break
            case 'middle':
                jg = nowOption.showArr.h / nowOption.y.length
                break
        }

        var xjg = nowOption.showArr.w / nowOption.x.length
        var rw = Math.floor(xjg * 0.8) > 8 ? xjg * 0.8 : 8
        //console.log(rw,'rwwwwww')

        switch (nowOption.xytext.x) {
            case 'left':
                st = nowOption.showArr.st
                break
            case 'middle':
                st = nowOption.showArr.st + xjg / 2
                break
        }
        var maxR = 0
        maxR = nowOption.maxX - nowOption.minX
        var lineS = nowOption.paper.set()
        var linA = []
        var rectA = []
        for (var i = 0; i < nowOption.data.length; i++) {
            var reset = drawRectOne(nowOption, { jg: jg, maxR: maxR, i: i, xjg: xjg, rw: rw, st: st })
            if (nowOption.mouseControler) {
                var rec1 = nowOption.paper.rect(nowOption.showArr.st, (nowOption.showArr.h + nowOption.top - jg * (i + 1)), nowOption.showArr.w, jg).attr({
                    fill: '#fff',
                    'stroke-width': 1,
                    'fill-opacity': 0,
                    'opacity': 0,
                    'cursor': 'pointer'
                }).data({ index: i, data: nowOption.data[i] }).mouseover(function(e) {
                    var oxX = getOffset(e).x
                    var oxY = getOffset(e).y
                    nowOption.mouseover({
                        'pos': this.getBBox(),
                        'index': this.data('index'),
                        'mousepos': {
                            x: oxX,
                            y: oxY
                        }
                    })
                }).mouseout(function() {
                    nowOption.mouseout()
                }).click(function() {
                    var dat = { index: this.data('index'), data: this.data('data') }
                    nowOption.click(dat)
                })
            }
            lineS.push(rec1)
            linA.push(reset)
            rectA.push({ el: reset, st: false })
        }
        nowOption.rectA = rectA
        //平均值
        //console.log(nowOption.avage,'avaasdddddddddddd')
        if (nowOption.avage != null) {
            $.each(nowOption.avage, function(index, val) {
                var avgx
                var avgy
                var avgw
                var avgh
                if (val > nowOption.maxX) {
                    avgx = nowOption.width + 100
                } else {
                    avgx = Math.floor(nowOption.showArr.st + nowOption.showArr.w * (val / nowOption.maxX))
                }
                avgy = nowOption.top
                avgw = 1
                avgh = nowOption.showArr.h
                nowOption.paper.rect(avgx, avgy, avgw, avgh).attr({
                    fill: nowOption.alinecolor,
                    'stroke-width': 0
                })
                nowOption.paper.rect(avgx, avgy, avgw, avgh).attr({
                    fill: '#000',
                    opacity: 0,
                    'fill-opacity': 0,
                    'stroke-width': 0,
                    'cursor': 'pointer'
                }).data({
                    data: val
                }).mouseover(function(e) {
                    var oxX = getOffset(e).x
                    var oxY = getOffset(e).y
                    nowOption.mouseoverA({
                        'pos': this.getBBox(),
                        'index': this.data('data'),
                        'mousepos': {
                            x: oxX,
                            y: oxY
                        }
                    })
                }).mouseout(function(e) {
                    nowOption.mouseout()
                })
            })
        }
    },
    markRect: function(el, index) {
        $.each(el, function(pos, val) {
            if (pos != index) {
                val.st = false
                val.el.attr("opacity", 0.5)
            }
        })
        if (sh) {
            el[index].el.attr("opacity", 1)
        } else {
            $.each(el, function(pos, val) {
                if (pos != index) {
                    val.st = false
                    val.el.attr("opacity", 1)
                }
            })
        }
        /*if (el[index].st) {
            el[index].st = false
            $.each(el, function(pos, val) {
                if (pos != index) {
                    val.st = false
                    val.el.attr("opacity", 1)
                }
            })
        } else {
            el[index].st = true
            $.each(el, function(pos, val) {
                if (pos != index) {
                    val.st = false
                    val.el.attr("opacity", 0.5)
                } else {
                    val.el.attr("opacity", 1)
                }
            })
        }*/
    }
}

function drawRectOne(nowOption, par) {
    var tempH = 0
    var totalH = nowOption.xytext.y == 'middle' ? (nowOption.showArr.h - par.jg / 2) : nowOption.showArr.h
    var other = nowOption.paper.set()
    switch (nowOption.ctype) {
        case 'normal':

            totalH = nowOption.xytext.x == 'middle' ? (nowOption.showArr.w - par.xjg / 2) : nowOption.showArr.w
            tempH = totalH * nowOption.data[par.i] / par.maxR
            if (nowOption.data[par.i] / par.maxR > 1) {
                tempH = totalH
            }

            var rw = Math.floor(par.jg * 0.8) < 1 ? 1 : Math.floor(par.jg * 0.8)
            var rrr = nowOption.paper.rect(Math.floor(nowOption.showArr.st), nowOption.showArr.h + nowOption.top - rw / 2 - par.jg / 2 - par.jg * par.i, tempH, rw).attr({
                'fill': nowOption.color[par.i],
                'stroke-width': 0
            })
            var textx = Math.floor(nowOption.showArr.st) + tempH + 10
            var alignText = "start"
            if (nowOption.modulus[par.i]) {
                nowOption.paper.text(textx, nowOption.showArr.h + nowOption.top - rw / 2 - 12 - par.jg * par.i, nowOption.format(nowOption.data[par.i], par.i, 0)).attr({
                    'fill': nowOption.color[par.i],
                    font: nowOption.font,
                    'text-anchor': alignText
                })
            }
            other.push(rrr)
            return other
            break
        case 'radd':
            var ytB = nowOption.showArr.st
            for (var j = 0; j < nowOption.data[par.i].length; j++) {
                tempH = totalH * nowOption.data[par.i][j] / par.maxR
                if (nowOption.data[par.i][j] / par.maxR > 1) {
                    tempH = totalH
                }
                tempH = nowOption.showArr.w * nowOption.data[par.i][j] / par.maxR
                var rw = Math.floor(par.jg * 0.8) < 1 ? 1 : Math.floor(par.jg * 0.8)
                var rrr = nowOption.paper.rect(ytB, nowOption.showArr.h + nowOption.top - rw / 2 - par.jg / 2 - par.jg * par.i, tempH, rw).attr({
                    'fill': nowOption.color[par.i][j],
                    'stroke-width': 0
                })
                if (nowOption.modulus[par.i][j]) {
                    var textx = ytB + tempH / 2
                    var texty = nowOption.showArr.h + nowOption.top - rw / 2 - par.jg / 2 - par.jg * par.i + rw / 2
                    nowOption.paper.text(textx, texty, nowOption.format(nowOption.data[par.i], par.i, j)).attr({
                        'fill': nowOption.color[par.i],
                        font: nowOption.font,
                        'text-anchor': 'middle'
                    })
                }
                ytB = ytB + tempH
                other.push(rrr)
            }

            return other
            break
        case 'more':
            // var totalK = nowOption.data[par.i].length * par.rw
            var rw = Math.floor(par.jg * 0.8)
            var zih = rw / nowOption.data[par.i].length
            /*if (nowOption.data[par.i].length > 1) {
                totalK = Math.floor(par.xjg * 0.8)
            }*/
            //console.log(nowOption.data[par.i])
            //console.log(nowOption.showArr.h,nowOption.top,par.jg,zih)
            for (var i = 0; i < nowOption.data[par.i].length; i++) {
                tempH = totalH * nowOption.data[par.i][i] / par.maxR
                if (nowOption.data[par.i][i] / par.maxR > 1) {
                    tempH = totalH
                }
                tempH = nowOption.showArr.w * nowOption.data[par.i][i] / par.maxR
                // var totalK = rw/nowOption.data[par.i].length * rw + (nowOption.data[par.i].length - 1) * 2


                // var zhixingk = i * rw + (i > 0 ? i * 2 : 0)
                //var py = nowOption.showArr.h + nowOption.top - par.jg / 2 - par.jg * par.i - totalK / 2 + zhixingk
                var py = nowOption.showArr.h + nowOption.top - par.jg * 0.1 - par.jg * par.i - zih * (i + 1)
                var rrr = nowOption.paper.rect(nowOption.showArr.st, py, tempH, zih).attr({
                    'fill': nowOption.color[par.i][i],
                    'stroke-width': 0
                })
                if (nowOption.modulus[par.i][i]) {
                    var textx = nowOption.showArr.st + tempH + 10
                    var texty = py + zih / 2
                    nowOption.paper.text(textx, texty, nowOption.format(nowOption.data[par.i][i], par.i, i)).attr({
                        'fill': nowOption.color[par.i][i],
                        font: nowOption.font,
                        'text-anchor': 'start'
                    })
                }
                other.push(rrr)
            }
            return other
            break
    }
}

function getOffset(e) {
    var offsetCoord = { x: e.offsetX, y: e.offsetY }
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        //return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        offsetCoord.x = e.layerX
        offsetCoord.y = e.layerY
        //return ;
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        //return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        //return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        //return "IE";
    }; //判断是否IE浏览器
    return offsetCoord;
}
module.exports = drawRec;