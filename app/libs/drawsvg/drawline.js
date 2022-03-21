var drawLine = {
    drawLine: function(nowOption) {
        var newDate = []
        var sheqidepatch = ""
        if (nowOption.ctype == 'add') {
            $.each(nowOption.data, function(index, val) {
                newDate[index] = []
                if (index == 0) {
                    $.each(val, function(pos, value) {
                        newDate[index].push(value)
                    })
                } else {
                    $.each(val, function(can, value) {
                        newDate[index].push(value + newDate[index - 1][can])
                    })
                }
            })
        }
        var length = 1
        if (nowOption.ctype != 'normal') {
            length = nowOption.data.length
        }
        for (var i = 0; i < length; i++) {
            var temp = Tool.clone(nowOption)
            temp.lineColor = nowOption.lineColor[i]
            if (nowOption.ctype != 'add') {
                temp.data = (nowOption.ctype == 'more' ? nowOption.data[i] : nowOption.data)
            } else {
                temp.data = newDate[i]
                //console.log(newDate[i], sheqidepatch)
                //temp.qianzhi = i != 0[]
            }
            temp.fillColor = nowOption.fillColor[i]
            temp.fill = nowOption.fill[i]
            temp.circleShow = nowOption.circleShow[i]
            temp.modulus = nowOption.modulus[i]
            //console.log(temp.modulus,'temp.modulustemp.modulustemp.modulus')
            //temp.fill = nowOption.fill[i]
            //console.log(nowOption.modulusRate)
            temp.modulusRate = nowOption.modulusRate[i] ? nowOption.modulusRate[i] : 0.45
            if (nowOption.iconImages[i]) {
                temp.iconImages = nowOption.iconImages[i]
            }
            var xyq = (i == length - 1)
            if (nowOption.ctype != 'add') {
                drawSingleLine(temp, xyq, null, i)
            } else {

                sheqidepatch = drawSingleLine(temp, xyq, sheqidepatch, i)
            }
        }
        if (nowOption.avage != null) {
            $.each(nowOption.avage, function(index, val) {
                if (val > nowOption.maxY) {
                    nowy = -20
                } else {
                    nowy = Math.floor(nowOption.top + nowOption.showArr.h * (1 - (val - nowOption.minY) / (nowOption.maxY - nowOption.minY)))
                }
                var stp = 0
                switch (nowOption.xytext.x) {
                    case 'left':
                        stp = nowOption.showArr.st
                        px1 = nowOption.showArr.st + nowOption.showArr.w //- nowOption.showArr.w / (nowOption.x.length)
                        break
                    case 'middle':
                        //stp = nowOption.showArr.st + nowOption.showArr.w / (nowOption.x.length) / 2
                        stp = nowOption.showArr.st
                        px1 = nowOption.showArr.st + nowOption.showArr.w
                        //px1 = nowOption.showArr.st + nowOption.showArr.w - nowOption.showArr.w / (nowOption.x.length) / 2
                        break
                    case 'right':
                        break
                }
                var strMM = 'M' + stp + ',' + nowy + "L" + px1 + ',' + nowy
                nowOption.paper.path(strMM).attr({
                    stroke: nowOption.alinecolor

                })

                nowOption.paper.rect(nowOption.showArr.st, nowy, nowOption.width, 1).attr({
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


        // if (mouseEvent) {
        var rectA = []
        var lineSet = nowOption.paper.set()
        var lineArr = []
        var lineArrS = nowOption.paper.set()
        var stp
        var px1
        for (var w = 0; w < nowOption.x.length; w++) {
            switch (nowOption.xytext.x) {
                case 'left':
                    stp = nowOption.showArr.st + w * nowOption.showArr.w / (nowOption.x.length - 1)
                    px1 = nowOption.showArr.st + (w - 1) * nowOption.showArr.w / (nowOption.x.length - 1)
                    break
                case 'middle':
                    stp = nowOption.showArr.st + nowOption.showArr.w / (nowOption.x.length) / 2 + w * nowOption.showArr.w / (nowOption.x.length)
                    px1 = nowOption.showArr.st + nowOption.showArr.w / (nowOption.x.length) / 2 + (w - 1) * nowOption.showArr.w / (nowOption.x.length)
                    break
                case 'right':
                    break
            }
            var showLine = nowOption.paper.rect(stp, nowOption.top, 1, (nowOption.showArr.h)).attr({
                fill: nowOption.backLineColor,
                'stroke-width': 0,
                'fill-opacity': 0,
                'opacity': 0,
            }).hide()
            var jgessdsk = Math.floor(nowOption.showArr.w / nowOption.x.length)
            var linea = nowOption.paper.rect(stp - jgessdsk / 2, nowOption.top, jgessdsk, (nowOption.showArr.h)).attr({
                //var linea = nowOption.paper.rect(stp - 10, nowOption.top, 20, (nowOption.showArr.h)).attr({
                'fill': '#ccc',
                'stroke-width': 1,
                'fill-opacity': 0,
                'opacity': 0,
                'cursor': 'pointer'
            }).data({
                data: nowOption.x[w],
                index: w
            }).mouseover(function(e) {
                if (nowOption.circleMouseEvent) {
                    cricleArr[this.data('index')].show()
                }
                // lineArr[this.data('index')].show()
                var oxX = getOffset(e).x
                var oxY = getOffset(e).y
                //console.log(document.getElementById(nowOption.el).parentNode.offsetLeft, document.getElementById(nowOption.el).offsetTop)
                nowOption.mouseover({
                    'data': this.data('data'),
                    'pos': this.getBBox(),
                    'index': this.data('index'),
                    'mousepos': {
                        x: oxX,
                        y: oxY
                    }
                })
            }).mouseout(function(e) {
                if (nowOption.circleMouseEvent) {
                    cricleArr[this.data('index')].show()
                }
                //lineArr[this.data('index')].hide()
                nowOption.mouseout()
            }).click(function(e) {
                // linA[this.data('index')].hide()
                lineArrS.hide()
                //lineArr[this.data('index')].show()
                var dat = { index: this.data('index'), data: nowOption.data[this.data('index')] }
                nowOption.click(dat)
            })
            lineArrS.push(showLine)
            lineArr.push(showLine)
            lineSet.push(linea)
            rectA.push({ el: showLine, st: false })
        }
        nowOption.rectA = rectA
        // }
    },
    markRect: function(el, index, sh) {
        //console.log(sh, index)
        $.each(el, function(tmd, cao) {
            cao.el.hide()
        })
        if (sh) {
            el[index].el.show().attr({
                'fill-opacity': 1,
                'opacity': 1,
            })
        } else {
            el[index].el.hide().attr({
                'fill-opacity': 0,
                'opacity': 0,
            })
        }
        /*if (el[index].st) {
            el[index].st = false
            el[index].el.hide().attr({
                'fill-opacity': 0,
                'opacity': 0,
            })
        } else {
            el[index].st = true
            el[index].el.show().attr({
                'fill-opacity': 1,
                'opacity': 1,
            })
        }*/
    }
}
//nowOption为进入svg的全部配置，mouseEvent为是否有鼠标事件，cankao如果画色块区域的话参考线是谁,代表的是第几条线
function drawSingleLine(nowOption, mouseEvent, cankao, index) {
    var stp
    var px1
    var pathStr = 'M' + stp + ' ' + (nowOption.showArr.h + nowOption.top)
    var pathStr1 = ''

    var cricleArr = nowOption.paper.set()
    var jiade = ''
    for (var i = 0; i < nowOption.data.length; i++) {
        switch (nowOption.xytext.x) {
            case 'left':
                stp = nowOption.showArr.st + i * nowOption.showArr.w / (nowOption.x.length - 1)
                px1 = nowOption.showArr.st + (i - 1) * nowOption.showArr.w / (nowOption.x.length - 1)
                break
            case 'middle':
                stp = nowOption.showArr.st + nowOption.showArr.w / (nowOption.x.length) / 2 + i * nowOption.showArr.w / (nowOption.x.length)
                px1 = nowOption.showArr.st + nowOption.showArr.w / (nowOption.x.length) / 2 + (i - 1) * nowOption.showArr.w / (nowOption.x.length)
                break
            case 'right':
                break
        }
        var py
        var py1
        var py2
        switch (nowOption.xytext.y) {
            case "bottom":
                if (nowOption.data[i] || nowOption.data[i] == 0) {
                    var rateY = (nowOption.data[i] - nowOption.minY) / (nowOption.maxY - nowOption.minY)
                    if (rateY > 1) {
                        py = -100
                    } else {
                        py = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * rateY
                    }
                    //py = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * (((nowOption.data[i] - nowOption.minY) / (nowOption.maxY - nowOption.minY)) > 1 ? 1.3 : ((nowOption.data[i] - nowOption.minY) / (nowOption.maxY - nowOption.minY)))
                } else {
                    py = ""
                }
                if (nowOption.data[i - 1] || nowOption.data[i] == 0) {
                    py1 = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * (((nowOption.data[i - 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY)) > 1 ? 1 : ((nowOption.data[i - 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY)))
                }
                if (nowOption.data[i + 1] || nowOption.data[i] == 0) {
                    py2 = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * (((nowOption.data[i + 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY)) > 1 ? 1 : ((nowOption.data[i + 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY)))
                }
                break
            case 'middle':
                if (nowOption.data[i] || nowOption.data[i] == 0) {
                    py = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * ((nowOption.y.length - 1) / nowOption.y.length) * (((nowOption.data[i] - nowOption.minY) / (nowOption.maxY - nowOption.minY)) > 1 ? 1 : ((nowOption.data[i] - nowOption.minY) / (nowOption.maxY - nowOption.minY))) - 0.5 * nowOption.showArr.h / nowOption.y.length
                } else {
                    py = ""
                }
                if (nowOption.data[i - 1] || nowOption.data[i] == 0) {
                    py1 = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * ((nowOption.y.length - 1) / nowOption.y.length) * (((nowOption.data[i - 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY)) > 1 ? 1 : ((nowOption.data[i - 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY))) - 0.5 * nowOption.showArr.h / nowOption.y.length
                }
                if (nowOption.data[i + 1] || nowOption.data[i] == 0) {
                    py2 = (nowOption.showArr.h + nowOption.top) - nowOption.showArr.h * ((nowOption.y.length - 1) / nowOption.y.length) * (((nowOption.data[i + 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY)) > 1 ? 1 : ((nowOption.data[i + 1] - nowOption.minY) / (nowOption.maxY - nowOption.minY))) - 0.5 * nowOption.showArr.h / nowOption.y.length
                }
                break
        }
        /*if (nowOption.maxY == 0) {
            py1 = py = (nowOption.showArr.h + nowOption.top)
        }*/
        //console.log(py,i,(nowOption.showArr.h + nowOption.top),nowOption.maxY,'===',nowOption.data[i])
        var x1
        var y1
        var stryuan = ''
        var cnashu = nowOption.data.length > 120 ? Math.floor(5 * 120 / nowOption.data.length) : 5
        // stryuan = 'L' + stp + ',' + py
        /*if (py1 && py2&&py) {
            if (Math.floor(nowOption.showArr.w / nowOption.data.length) >= 8) {
                if (py < py1 && py < py2) {
                    stryuan = 'L' + (stp - cnashu) + ',' + (py + cnashu * (py1 - py) / (stp - px1)) + 'Q' + stp + ',' + (py) + ',' + (stp + cnashu) + ',' + (py + cnashu * (py2 - py) / (stp - px1))
                }
                if (py > py1 && py > py2) {
                    stryuan = 'L' + (stp - cnashu) + ',' + (py + cnashu * (py1 - py) / (stp - px1)) + 'Q' + stp + ',' + (py) + ',' + (stp + cnashu) + ',' + (py + cnashu * (py2 - py) / (stp - px1))
                }
                if (py >= py1 && py <= py2) {
                    //stryuan = 'L' + (stp - cnashu - cnashu * (stp - cnashu - px1) / (py-2 - py1)) + ',' + (py - cnashu) + 'Q' + (stp - cnashu) + ',' + (py-2) + ',' + stp + ',' + (py)
                    //stryuan += 'Q' + (stp + cnashu) + ',' + py + ',' + (stp + cnashu + cnashu * (stp - cnashu - px1) / (py2 - py)) + ',' + (py + cnashu)
                    stryuan = 'L' + stp + ',' + py
                }
                if (py <= py1 && py >= py2) {
                    //stryuan = 'L' + (stp - cnashu - cnashu * (stp - cnashu - px1) / (py1 - py)) + ',' + (py + cnashu) + 'Q' + (stp - cnashu) + ',' + (py) + ',' + stp + ',' + (py)
                    //stryuan += 'Q' + (stp + cnashu) + ',' + py + ',' + (stp + cnashu + cnashu * (stp - cnashu - px1) / (py - py2)) + ',' + (py - cnashu)
                    stryuan = 'L' + stp + ',' + py
                }
            } else {
                stryuan = 'L' + stp + ',' + py
            }
        }*/
        //console.log(py,nowOption.data[i])
        if (py) {
            stryuan = 'L' + stp + ',' + py
        }
        /* if(py==py1){
         stryuan='L'+stp+','+py
         }*/
        //console.log(stryuan)
        /*if (py > py1) {
         x1 = px1 + Math.floor(8 * (py - py1) / nowOption.maxY)
         y1 = py1 - Math.floor(8 * (py - py1) / nowOption.maxY)
         } else if (py < py1) {
         x1 = stp + Math.floor(8 * (py - py1) / nowOption.maxY)
         y1 = py + Math.floor(8 * (py - py1) / nowOption.maxY)
         } else if (py == py1) {
         x1 = stp
         y1 = py
         }*/

        if (nowOption.maxY == 0) {
            x1 = y1 = (nowOption.showArr.h + nowOption.top)
        }
        //onsole.log(nowOption.data[i])
        if (stryuan && !pathStr1) {
            pathStr1 = 'M' + stp + " " + py
            if (!cankao) {
                pathStr = 'M' + stp + ' ' + (nowOption.showArr.h + nowOption.top) + 'L' + stp + " " + py
            } else {
                pathStr = cankao.split('L')[0] + 'L' + stp + " " + py
            }
        }
        switch (i) {
            /*case 0:
                if (!cankao) {
                    pathStr = 'M' + stp + ' ' + (nowOption.showArr.h + nowOption.top) + 'L' + stp + " " + py
                } else {
                    pathStr = cankao.split('L')[0] + 'L' + stp + " " + py
                }
                pathStr1 = 'M' + stp + " " + py
                break*/
            case nowOption.data.length - 1:
                if (!cankao) {
                    if (py) {
                        pathStr = pathStr + 'L' + stp + ' ' + py + 'L' + stp + ' ' + (nowOption.showArr.h + nowOption.top)
                    } else {
                        pathStr = pathStr + 'L' + stp + ' ' + (nowOption.showArr.h + nowOption.top)
                    }
                } else {
                    if (py) {
                        pathStr = pathStr + 'L' + stp + ' ' + py
                        var pointS = cankao.replace("M", "L").split('L')
                        for (var m = pointS.length - 1; m > 0; m--) {
                            pathStr = pathStr + 'L' + pointS[m]
                        }
                    } else {
                        //pathStr = pathStr + 'L' + stp + ' ' + py
                        var pointS = cankao.replace("M", "L").split('L')
                        for (var m = pointS.length - 1; m > 0; m--) {
                            pathStr = pathStr + 'L' + pointS[m]
                        }
                    }
                }
                if (py) {
                    pathStr1 = pathStr1 + 'L' + stp + ' ' + py
                }
                break
            default:
                pathStr = pathStr + stryuan
                pathStr1 = pathStr1 + stryuan
                break
        }

        if (nowOption.circleShow) {
            var nowCicrle = true
            if (nowOption.x.length > nowOption.xSetInterval * 1.2) {
                var nowshowpos = Math.ceil(nowOption.x.length / nowOption.xSetInterval)
                if (i % nowshowpos != 0) {
                    nowCicrle = false
                }
            }
            if (!py) {
                nowCicrle = false
            }
            var circley = py
            if (py1 && py2) {
                if (py < py1 && py < py2) {
                    circley = (py + 0.4 * cnashu * (py1 - py) / (stp - px1))
                    //circlex=
                }
                if (py > py1 && py > py2) {
                    circley = (py + 0.4 * cnashu * (py1 - py) / (stp - px1))
                }
            }
            var circle = nowOption.paper.circle(stp, circley, 2).data({
                'data': nowOption.data[i],
                'index': i
            }).attr({
                'fill': nowOption.lineColor,
                'fill-opacity': 1,
                'stroke-width': 1,
                'stroke': nowOption.lineColor
            })
            if (!nowCicrle) {
                circle.hide()
            }
            if (nowOption.circleMouseEvent) {
                circle.hide()
            }

            cricleArr.push(circle)

        }
        if (nowOption.iconImages[i]) {

            if (nowOption.iconImages[i].length != 0) {
                for (var w = 0; w < nowOption.iconImages[i].length; w++) {
                    if (nowOption.iconImages[i][w]) {
                        nowOption.paper.image(nowOption.iconImages[i][w], stp - 5, py - 5, 10, 10)
                    }
                }
            }
        }
        if (nowOption.modulus) {
            // console.log(nowOption.modulusRate)
            var modulusy = (nowOption.modulusRate == -1 ? nowOption.top - 8 : py * nowOption.modulusRate)
            var judui = nowOption.paper.text(stp, modulusy, nowOption.format(nowOption.data[i], i, index)).attr({
                //var judui = nowOption.paper.text(stp, py * nowOption.modulusRate, nowOption.format(nowOption.data[i], i)).attr({
                font: nowOption.font,
                //fill: nowOption.lineColor,
                fill: nowOption.chaincolor[i] ? nowOption.chaincolor[i] : nowOption.lineColor,
                'text-anchor': 'middle'
            })
            var textC = true
            if (nowOption.x.length > nowOption.xSetInterval * 1.2) {
                var nowshowpos = Math.ceil(nowOption.x.length / nowOption.xSetInterval)
                if (i % nowshowpos != 0) {
                    textC = false
                }
            }
            if (!textC) {
                judui.hide()
            }

        }
        /*if (mouseEvent) {
            var showLine = nowOption.paper.rect(stp, nowOption.top, 1, (nowOption.showArr.h)).attr({
                fill: nowOption.backLineColor,
                'stroke-width': 0
            }).hide()
            var jgessdsk = Math.floor(nowOption.showArr.w / nowOption.data.length)
            var linea = nowOption.paper.rect(stp - jgessdsk / 2, nowOption.top, jgessdsk, (nowOption.showArr.h)).attr({
                //var linea = nowOption.paper.rect(stp - 10, nowOption.top, 20, (nowOption.showArr.h)).attr({
                'fill': '#ccc',
                'stroke-width': 1,
                'fill-opacity': 0,
                'opacity': 0
            }).data({
                data: nowOption.data[i],
                index: i
            }).mouseover(function(e) {
                if (nowOption.circleMouseEvent) {
                    cricleArr[this.data('index')].show()
                }
                // lineArr[this.data('index')].show()
                var oxX = getOffset(e).x
                var oxY = getOffset(e).y
                //console.log(document.getElementById(nowOption.el).parentNode.offsetLeft, document.getElementById(nowOption.el).offsetTop)
                nowOption.mouseover({
                    'data': this.data('data'),
                    'pos': this.getBBox(),
                    'index': this.data('index'),
                    'mousepos': {
                        x: oxX,
                        y: oxY
                    }
                })
            }).mouseout(function(e) {
                if (nowOption.circleMouseEvent) {
                    cricleArr[this.data('index')].show()
                }
                lineArr[this.data('index')].hide()
                nowOption.mouseout()
            }).click(function(e) {
                // linA[this.data('index')].hide()
                var dat = { index: this.data('index'), data: nowOption.data[this.data('index')] }
                nowOption.click(dat)
            })
            lineArrS.push(showLine)
            lineArr.push(showLine)
            lineSet.push(linea)
            rectA.push(linea)
            // nowOption.linea=
        }*/
    }
    //console.log(pathStr,'pathStrpathStrpathStrpathStr',nowOption)
    if (nowOption.fill) {
        nowOption.paper.path(pathStr).attr({
            'fill': nowOption.fillColor,
            'fill-opacity': 0.5,
            'stroke-width': 0,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        })
    }
    if (!nowOption.fill) {
        nowOption.paper.path(pathStr1).attr({
            'stroke': nowOption.lineColor,
            'stroke-width': 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        })
    }
    if (nowOption.circleShow) {
        cricleArr.toFront()
    }
    /*nowOption.paper.rect(nowOption.showArr.st, nowOption.top, nowOption.showArr.w, nowOption.showArr.h).attr({
            'fill': '#fff',
            'stroke-width': 0
        }).animate({
            width: 0,
            x: nowOption.showArr.st + nowOption.showArr.w
        }, 1000)*/
    //if(mouseEvent)
    //lineArrS.toFront()
    // lineSet.toFront()
    return pathStr1
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
module.exports = drawLine;