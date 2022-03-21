var DrawRadar = {
    //雷达图
    drawRadar: function(nowOption) {
        //console.log(nowOption)
        //var nowOption = optionMatch(BaseOption, option)
        var r = nowOption.width > nowOption.height ? nowOption.height : nowOption.width
        var pathStr = ''
        var yuandian = nowOption.paper.set()
        //svgBG.drawR(svgLib, nowOption)
        nowOption.max = nowOption.max ? nowOption.max : 1
        for (var j = 0; j < nowOption.x.length; j++) {
            var angle = -90 + j * (360 / nowOption.x.length)
            //console.log(angle,nowOption.data[j])
            var dataValue = nowOption.data[j] ? nowOption.data[j] : 0
            var dataR = Math.floor(r * 0.4 * dataValue / nowOption.max)
            nowOption.paper.rect(nowOption.width / 2, nowOption.height / 2, dataR, 1).attr({
                'fill': nowOption.color[0],
                'stroke-width': 0
            }).rotate(angle, nowOption.width / 2, nowOption.height / 2)
            var px = Math.floor(nowOption.width / 2 + dataR * Math.cos(Math.PI * angle / 180))
            var py = Math.floor(nowOption.height / 2 + dataR * Math.sin(Math.PI * angle / 180))
            var xiaodian = nowOption.paper.circle(px, py, 4).attr({
                'fill': "#fff",
                "stroke": nowOption.color[0],
                'cursor': 'pointer'
            }).data({
                "data": dataValue,
                "index": j
            }).mouseover(function(e) {
                nowOption.mouseover({
                    'data': this.data('data'),
                    'pos': this.getBBox(),
                    'index': this.data('index'),
                    'mousepos': {
                        x: e.offsetX || e.screenX,
                        y: e.offsetY || e.offsetY
                    }
                })
            }).mouseout(function() {
                nowOption.mouseout()
            })
            if (pathStr) {
                pathStr = pathStr + "L" + px + "," + py
            } else {
                pathStr = "M" + px + "," + py
            }
            yuandian.push(xiaodian)
        }
        nowOption.paper.path(pathStr).attr({
            'fill': nowOption.color[0],
            'opacity': 0.5,
            "stroke-width": 0
        })
        yuandian.toFront()
    },
    //饼图
    drawCicle: function(nowOption) {
        var lr = nowOption.width > nowOption.height ? (nowOption.height - 80) / 2 : (nowOption.width - 80) / 2
        var nr = lr * 0.85
        var yuanxin = { x: nowOption.width / 2, y: nowOption.height / 2 }
        var st = 90
        var rectA = []
        // nowOption.paper.circle(yuanxin.x,yuanxin.y,lr)
        var sum = 0
        if (!nowOption.percentage) {
            sum = eval(nowOption.data.join('+'));
            if (sum == 0) {
                return
            }
        } else {
            sum = 100
        }
        var textS = nowOption.paper.set()
        var ci1
        for (var i = 0; i < nowOption.data.length; i++) {
            var pre = (360 * nowOption.data[i] / sum)
            //console.log(pre, nowOption.color[i], sum, nowOption.data[i])
            if (nowOption.data[i] == sum) {
                ci1 = nowOption.paper.circle(yuanxin.x, yuanxin.y, lr).attr({ fill: nowOption.color[i], 'stroke': '#fff', 'cursor': 'pointer' }).data({
                    data: Math.floor(100 * pre / 360),
                    index: i
                }).mouseover(function(e) {
                    nowOption.mouseover({
                        'data': this.data('data'),
                        'pos': this.getBBox(),
                        'index': this.data('index'),
                        'mousepos': {
                            x: e.offsetX || e.screenX,
                            y: e.offsetY || e.offsetY
                        }
                    })
                }).mouseout(function(e) {
                    //lineArr[this.data('index')].hide()
                    nowOption.mouseout()
                }).click(function() {
                    nowOption.click({
                        'data': this.data('data'),
                        'pos': this.getBBox(),
                        'index': this.data('index'),
                        'mousepos': {
                            x: e.offsetX || e.screenX,
                            y: e.offsetY || e.offsetY
                        }
                    })
                })
            } else {
                var patch = 'M' + (yuanxin.x - lr) + ',' + yuanxin.y + 'A' + lr + ',' + lr + ' 0 ' + ((pre > 180) ? 1 : 0) + ",1 " + (yuanxin.x - lr * Math.cos(Math.PI * pre / 180)) + ',' + (yuanxin.y - lr * Math.sin(Math.PI * pre / 180))
                patch += "L" + yuanxin.x + ',' + yuanxin.y + ' z'
                //console.log(st+pre/2)

                ci1 = nowOption.paper.path(patch).attr({ fill: nowOption.color[i], 'stroke': nowOption.color[i], 'cursor': 'pointer' }).rotate(st, yuanxin.x, yuanxin.y).data({
                    data: Math.floor(100 * pre / 360),
                    index: i
                }).mouseover(function(e) {
                    nowOption.mouseover({
                        'data': this.data('data'),
                        'pos': this.getBBox(),
                        'index': this.data('index'),
                        'mousepos': {
                            x: e.offsetX || e.screenX,
                            y: e.offsetY || e.offsetY
                        }
                    })
                }).mouseout(function(e) {
                    //lineArr[this.data('index')].hide()
                    nowOption.mouseout()
                }).click(function(e) {
                    nowOption.click({
                        'data': this.data('data'),
                        'pos': this.getBBox(),
                        'index': this.data('index'),
                        'mousepos': {
                            x: e.offsetX || e.screenX,
                            y: e.offsetY || e.offsetY
                        }
                    })
                })
            }
            if (!nowOption.textlist) {
                var sddddt = { x: (yuanxin.x - lr * Math.cos(Math.PI * (st + pre / 2) / 180)), y: (yuanxin.y - lr * Math.sin(Math.PI * (st + pre / 2) / 180)) }
                var teshux = 'M' + sddddt.x + "," + sddddt.y
                var nowHUd = st + pre / 2
                var ysnshen = 60
                var txtx = {}
                var aldsajd = ''
                if (nowHUd <= 90) {
                    txtx = { x: sddddt.x - (ysnshen + 20) / 2, y: sddddt.y - 32, al: 'end' }
                    teshux += "L" + (sddddt.x - 20) + ',' + (sddddt.y - 20) + "L" + (sddddt.x - ysnshen) + ',' + (sddddt.y - 20)
                    aldsajd = 'start'
                }
                if (nowHUd <= 180 && nowHUd > 90) {
                    txtx = { x: sddddt.x + (ysnshen + 20) / 2, y: sddddt.y - 32, al: 'start' }
                    teshux += "L" + (sddddt.x + 20) + ',' + (sddddt.y - 20) + "L" + (sddddt.x + ysnshen) + ',' + (sddddt.y - 20)
                    aldsajd = 'end'
                }
                if (nowHUd <= 270 && nowHUd > 180) {
                    txtx = { x: sddddt.x + (ysnshen + 20) / 2, y: sddddt.y + 30, al: 'start' }
                    teshux += "L" + (sddddt.x + 20) + ',' + (sddddt.y + 20) + "L" + (sddddt.x + ysnshen) + ',' + (sddddt.y + 20)
                    aldsajd = 'end'
                }
                if (nowHUd > 270) {
                    txtx = { x: sddddt.x - (ysnshen + 20) / 2, y: sddddt.y + 30, al: 'end' }
                    teshux += "L" + (sddddt.x - 20) + ',' + (sddddt.y + 20) + "L" + (sddddt.x - ysnshen) + ',' + (sddddt.y + 20)
                    aldsajd = 'start'
                }
                nowOption.paper.path(teshux).attr({ 'stroke-width': 1, 'stroke': nowOption.color[i] })
                nowOption.paper.text(txtx.x, txtx.y, nowOption.formatKdX(nowOption.x[i])).attr({
                    font: nowOption.font,
                    fill: nowOption.color[i],
                    'text-anchor': 'middle'
                });
            } else {
                if (nowOption.weidu) {
                    nowOption.paper.rect(nowOption.width * 0.75, (i + 1) * 25, 15, 15).attr({ 'stroke-width': 0, 'fill': nowOption.color[i] })

                    nowOption.paper.text(nowOption.width * 0.75 + 30, (i + 1) * 25 + 7, nowOption.formatKdX(nowOption.x[i])).attr({
                        font: nowOption.font,
                        fill: nowOption.color[i],
                        'text-anchor': 'start'
                    });

                }
            }
            //console.log(nowOption.fontColor[i])
            var text = nowOption.paper.text((yuanxin.x - nr * (nowOption.disWhite ? 0.60 : 0.8) * Math.cos(Math.PI * (st + pre / 2) / 180)), (yuanxin.y - nr * (nowOption.disWhite ? 0.60 : 0.8) * Math.sin(Math.PI * (st + pre / 2) / 180)), nowOption.format(nowOption.data[i], i)).attr({
                font: nowOption.font,
                fill: !nowOption.disWhite ? '#fff' : nowOption.color[i],
                'text-anchor': 'middle'
            });
            textS.push(text)
            rectA.push({ el: ci1, st: false })
            st += pre
            var textC = true
            //console.log(nowOption.xSetInterval,'xSetIntervalxSetIntervalxSetIntervalxSetInterval',nowOption.data.length)
            if (nowOption.data.length > nowOption.xSetInterval * 1.2) {
                var nowshowpos = Math.ceil(nowOption.data.length / nowOption.xSetInterval)
                if (i % nowshowpos != 0) {
                    textC = false
                }
            }
            //console.log(textC,i)
            if (!textC) {
                text.hide()
            }
        }
        nowOption.rectA = rectA
        if (nowOption.disWhite) {
            nowOption.paper.circle(yuanxin.x, yuanxin.y, nr).attr({ fill: nowOption.innerColor, 'stroke-width': 0 })
        }
        textS.toFront()
    },
    markRect: function(el, index, duan, sh) {
        $.each(el, function(pos, val) {
            var arr = val.el.attr('transform')
            if (arr.length > 1) {
                if (arr[arr.length - 1][1] > 1) {
                    val.el.scale(1 / 1.1, 1 / 1.1, duan.x, duan.y)
                }
            }
            console.log(val.el.attr('transform'))

        })
       // console.log(el[index].el.matrix)
        if (sh) {
            el[index].el.scale(1.1, 1.1, duan.x, duan.y)
        } /*else {
            el[index].el.scale(1 / 1.1, 1 / 1.1, duan.x, duan.y)
        }*/
        /*if (el[index].st) {
            el[index].st = false
            el[index].el.scale(1 / 1.1, 1 / 1.1, duan.x, duan.y)
        } else {
            el[index].st = true
            el[index].el.scale(1.1, 1.1, duan.x, duan.y)
            //el[index].el.attr('stroke', '#000')
        }
        $.each(el, function(pos, val) {
            console.log(val.st, index, pos)
            if (pos != index) {
                if (val.st) {
                    el[pos].el.scale(1 / 1.1, 1 / 1.1, duan.x, duan.y)
                }
                val.st = false
            }
        })*/
    },
    //仪表盘
    drawDashboard: function(nowOption) {
        var lr = nowOption.width > nowOption.height ? (nowOption.height - 40) / 2 : (nowOption.width - 40) / 2
        var nr = lr * 0.75
        var yuanxin = { x: nowOption.width / 2, y: nowOption.height / 2 }
        var st = -30
        var teshu=false
        // nowOption.paper.circle(yuanxin.x,yuanxin.y,lr)
        var sum = 0
        if (!nowOption.max) {
            sum = nowOption.data[0]
        } else {
            sum = nowOption.max
        }
        //if(nowOption.data[0])
        if (sum * 1 == 0 && nowOption.data[0] * 1 == 0) {
            sum = nowOption.data[0] = 1
            teshu=true
        }
        var textS = nowOption.paper.set()
        var pre = 240
        var patch = 'M' + (yuanxin.x - lr) + ',' + yuanxin.y + 'A' + lr + ',' + lr + ' 0 ' + ((pre > 180) ? 1 : 0) + ",1 " + (yuanxin.x - lr * Math.cos(Math.PI * pre / 180)) + ',' + (yuanxin.y - lr * Math.sin(Math.PI * pre / 180))
        patch += "L" + yuanxin.x + ',' + yuanxin.y + ' z'
        //console.log(st+pre/2)
        var data = (240 * nowOption.data[0] / sum)
        //console.log(nowOption.data, sum)
        if (nowOption.data[0] > sum * 1) {
            data = 240
        }
        var patch1 = 'M' + (yuanxin.x - lr) + ',' + yuanxin.y + 'A' + lr + ',' + lr + ' 0 ' + ((data > 180) ? 1 : 0) + ",1 " + (yuanxin.x - lr * Math.cos(Math.PI * data / 180)) + ',' + (yuanxin.y - lr * Math.sin(Math.PI * data / 180))
        patch1 += "L" + yuanxin.x + ',' + yuanxin.y + ' z'

        nowOption.paper.path(patch).attr({ fill: '#ccc', 'stroke': '#fff', 'stroke-width': 0 }).rotate(st, yuanxin.x, yuanxin.y)
        nowOption.paper.path(patch1).attr({ fill: nowOption.color, 'stroke': '#fff', 'stroke-width': 0, 'cursor': 'pointer' }).rotate(st, yuanxin.x, yuanxin.y).data({
            data: (teshu?[0]:nowOption.data)
        }).mouseover(function(e) {
            nowOption.mouseover({
                'data': this.data('data'),
                'pos': this.getBBox(),
                'mousepos': {
                    x: e.offsetX || e.screenX,
                    y: e.offsetY || e.offsetY
                }
            })
        }).mouseout(function(e) {
            //lineArr[this.data('index')].hide()
            nowOption.mouseout()
        }).click(function(e) {
            nowOption.click({
                'data': this.data('data'),
                'pos': this.getBBox(),
                'mousepos': {
                    x: e.offsetX || e.screenX,
                    y: e.offsetY || e.offsetY
                }
            })
        })
        nowOption.paper.circle(yuanxin.x, yuanxin.y, nr).attr({ fill: '#fff', 'stroke-width': 0 })
        var angel = (240 * nowOption.data[0] / sum) - 30
        if (nowOption.data[0] > sum * 1) {
            angel = 218
        }
        var point1 = { x: yuanxin.x - (nr * 0.8) * Math.cos(Math.PI * angel / 180), y: yuanxin.y - (nr * 0.8) * Math.sin(Math.PI * angel / 180) }
        var point2 = { x: yuanxin.x - (nr * 0.2) * Math.cos(Math.PI * (angel + 90) / 180), y: yuanxin.y - (nr * 0.2) * Math.sin(Math.PI * (angel + 90) / 180) }
        var point3 = { x: yuanxin.x - (nr * 0.2) * Math.cos(Math.PI * (angel - 90) / 180), y: yuanxin.y - (nr * 0.2) * Math.sin(Math.PI * (angel - 90) / 180) }
        var sanpath = 'M' + point1.x + ',' + point1.y + 'L' + point2.x + ',' + point2.y + 'L' + point3.x + ',' + point3.y + 'L' + point1.x + ',' + point1.y + ' z'
        //console.log(sanpath, 'sanpathsanpathsanpath')
        nowOption.paper.path(sanpath).attr({ fill: nowOption.color, 'stroke': '#fff', 'stroke-width': 0 })

        nowOption.paper.circle(yuanxin.x, yuanxin.y, nr / 2).attr({ fill: '#fff', 'stroke-width': 0 }).glow({ color: '#ccc' })
        var per = ((nowOption.data[0] / sum) * 100).toFixed(2) + '%'
        if(sum==0||nowOption.data[0]==null){
            per='--'
        }
        nowOption.paper.text(yuanxin.x, yuanxin.y, per).attr({
            font: nowOption.font,
            fill: nowOption.color,
            'text-anchor': textA
        });
        for (var i = 0; i < 5; i++) {
            var angle = Math.PI * (-30 + i * 60) / 180
            var tempx = yuanxin.x - (lr + 12) * Math.cos(angle)
            var tempy = yuanxin.y - (lr + 12) * Math.sin(angle)
            var textA = i < 2 ? 'end' : 'start'
            if (i == 2) {
                textA = "middle"
            }
            nowOption.paper.text(tempx, tempy, (i * 25 + '%')).attr({
                font: nowOption.font,
                fill: nowOption.color,
                'text-anchor': textA
            });
        }

    },
    //气泡图
    drawBubble: function(nowOption) {
        var jg
        switch (nowOption.xytext.y) {
            case 'bottom':
                jg = Math.floor(nowOption.showArr.h / (nowOption.y.length - 1))
                break
            case 'middle':
                jg = Math.floor(nowOption.showArr.h / nowOption.y.length)
                break
        }

        switch (nowOption.ctype) {
            case 'normal':
                var newInfo = {}
                var datasum
                if (nowOption.yr) {
                    datasum = eval(nowOption.data[j].join('+'))
                }
                newInfo.jg = jg
                newInfo.datasum = datasum
                drawCircleOne(nowOption, newInfo, true)
                break
            case 'more':
                // var jgg = Math.floor(nowOption.showArr.w / nowOption.x.length)
                //var yid = Math.floor(Math.floor(jgg * 0.2) / nowOption.data.length - 1)
                // yid = yid < 1 ? 1 : yid
                for (var k = 0; k < nowOption.data.length; k++) {
                    //var temp = nowOption.clone()
                    var temp = {}
                    temp = Tool.clone(nowOption)
                    temp.data = nowOption.data[k]
                    temp.color = nowOption.color[k]
                    //console.log(up)
                    var newInfo = {}
                    var datasum = 0
                    if (nowOption.yr) {
                        for (var j = 0; j < temp.y.length + 1; j++) {
                            if (temp.data[j]) {
                                datasum += nowOption.data[j] * 1
                            }
                        }
                    }
                    newInfo.jg = jg
                    newInfo.datasum = datasum
                    var xyq = (k == nowOption.data.length - 1)
                    drawCircleOne(temp, newInfo, xyq)
                }
                break

        }
        if (nowOption.avage) {
            //console.log('djdsk')
            if (nowOption.avage > nowOption.maxY) {
                nowy = Math.floor(nowOption.top - jg * 0.9)
            } else {
                nowy = Math.floor(nowOption.top - nowOption.showArr.h * (1 - nowOption.avage / nowOption.maxY))
            }
            nowOption.paper.rect(nowOption.showArr.st, nowy, nowOption.width, 1).attr({
                fill: nowOption.alinecolor,
                'stroke-width': 0
            })
            nowOption.paper.rect(nowOption.showArr.st, nowy, nowOption.width, 1).attr({
                fill: nowOption.aline,
                opacity: 0,
                'fill-opacity': 0,
                'stroke-width': 0
            }).data({
                data: nowOption.avage
            }).mouseover(function(e) {
                nowOption.mouseoverA({
                    'pos': this.getBBox(),
                    'index': this.data('data'),
                    'mousepos': {
                        x: e.offsetX || e.screenX,
                        y: e.offsetY || e.offsetY
                    }
                })
            }).mouseout(function(e) {
                nowOption.mouseout()
            })
        }
    },
    //画半弧图
    drawBn: function(nowOption) {
        var lr = nowOption.width > nowOption.height ? (nowOption.height - 20) / 2 : (nowOption.width - 20) / 2
        console.log(lr / nowOption.data.length)
        var wi_g = Math.floor(0.6 * lr / nowOption.data.length) > 5 ? 5 : Math.floor(0.6 * lr / nowOption.data.length)
        var wi_l = Math.floor(0.4 * lr / nowOption.data.length) > 5 ? 5 : Math.floor(0.6 * lr / nowOption.data.length)
        var yuanxin = { x: nowOption.width / 2, y: nowOption.height / 2 }
        var datasum = eval(nowOption.data.join('+'))
        for (var i = 0; i < nowOption.data.length; i++) {

            var pre = Math.floor((nowOption.data[i] / datasum) * 360)
            var bs = pre > 180 ? 1 : 0
            pre = (90 - pre)
            var patch = 'M' + yuanxin.x + ',' + (yuanxin.y - lr) + 'A' + lr + ',' + lr + ' 0 ' + bs + ',1 ' + (yuanxin.x + lr * Math.cos(Math.PI * pre / 180)) + ',' + (yuanxin.y - lr * Math.sin(Math.PI * pre / 180))
            var hundu = nowOption.paper.path(patch).attr({
                'stroke': nowOption.color[i],
                'stroke-width': wi_g
            }).scale(-1, 1, yuanxin.x, yuanxin.y).data({ index: i })
            switch (nowOption.angle) {
                case 0:
                    hundu.rotate(0)
                    nowOption.paper.rect(yuanxin.x + wi_g, yuanxin.y - lr - wi_g / 2, wi_g, wi_g).attr({ fill: nowOption.color[i], 'stroke-width': 0 })
                    break
                case 1:
                    hundu.rotate(180, yuanxin.x, yuanxin.y)
                    nowOption.paper.rect(yuanxin.x - wi_g * 2, yuanxin.y + lr - wi_g / 2, wi_g, wi_g).attr({ fill: nowOption.color[i], 'stroke-width': 0 })
                    break
            }
            hundu.mouseover(function(e) {
                nowOption.mouseover({
                    'pos': this.getBBox(),
                    'index': this.data('index'),
                    'mousepos': {
                        x: e.offsetX || e.screenX,
                        y: e.offsetY || e.offsetY
                    }
                })
            }).mouseout(function(e) {
                nowOption.mouseout()
            })
            if (nowOption.weidu) {
                nowOption.paper.rect(nowOption.width * 0.75, (i + 1) * 15, 10, 10).attr({ 'stroke-width': 0, 'fill': nowOption.color[i] })
                nowOption.paper.text(nowOption.width * 0.75 + 25, (i + 1) * 15 + wi_g, nowOption.formatKdX(nowOption.x[i])).attr({
                    font: nowOption.font,
                    fill: nowOption.color[i],
                    'text-anchor': 'start'
                });
                nowOption.paper.text(nowOption.width * 0.75 - 15, (i + 1) * 15 + wi_g, nowOption.format(nowOption.data[i])).attr({
                    font: nowOption.font,
                    fill: nowOption.color[i],
                    'text-anchor': 'end'
                });
            }

            lr = lr - wi_g - wi_l
        }
    },
    //画关系图
    drawre: function(nowOption) {
        var lr = nowOption.width > nowOption.height ? (nowOption.height - 20) / 2 : (nowOption.width - 20) / 2
        var yuanxin = { x: nowOption.width / 2, y: nowOption.height / 2 }

        var ju = Math.floor(360 / nowOption.data)
        var line = nowOption.paper.set()
        for (var i = 0; i < nowOption.data; i++) {
            var nr = lr * 0.5
            var ma = Math.random() * lr * 0.5
            var nx = Math.floor(nr + ma) * Math.sin(i * ju * Math.PI / 180)
            var ny = Math.floor(nr + ma) * Math.cos(i * ju * Math.PI / 180)
            var temp = nowOption.paper.path('M' + yuanxin.x + ' ' + yuanxin.y + 'L' + (yuanxin.x + nx) + ' ' + (yuanxin.y + ny)).attr({
                'stroke': nowOption.lineColor[i],
                'stroke-width': 2,
                'stroke-opacity': 0
            })
            line.push(temp)
            nowOption.paper.circle(yuanxin.x, yuanxin.y, nowOption.cp.r).attr({
                fill: nowOption.cp.colorlist[i],
                'stroke-width': 0,
                'fill-opacity': 1
            }).data({ index: i }).mouseover(function(e) {
                nowOption.mouseover({
                    'pos': this.getBBox(),
                    'index': this.data('index'),
                    'mousepos': {
                        x: e.offsetX || e.screenX,
                        y: e.offsetY || e.offsetY
                    }
                })
            }).mouseout(function(e) {
                nowOption.mouseout()
            }).click(function(e) {
                nowOption.click({ 'index': this.data('index') })
            }).animate({ cx: (yuanxin.x + nx), cy: (yuanxin.y + ny) }, 1000)
        }
        setTimeout(function() {
            line.animate({ 'stroke-opacity': 1 }, 300)
        }, 800)
        nowOption.paper.circle(yuanxin.x, yuanxin.y, nowOption.fp.r).attr({
            fill: nowOption.fp.color,
            'stroke-width': 0,
            'fill-opacity': 1
        }).data({ index: 'f' }).mouseover(function(e) {
            nowOption.mouseover({
                'pos': this.getBBox(),
                'index': this.data('index'),
                'mousepos': {
                    x: e.offsetX || e.screenX,
                    y: e.offsetY || e.offsetY
                }
            })
        }).mouseout(function(e) {
            nowOption.mouseout()
        }).click(function(e) {
            nowOption.click({ 'index': this.data('index') })
        })
    }
}

function drawCircleOne(nowOption, newInfo, mouse) {
    var max = nowOption.maxY
    var st
    switch (nowOption.xytext.x) {
        case 'left':
            st = nowOption.showArr.st
            break
        case 'middle':
            st = nowOption.showArr.st + 0.5 * nowOption.showArr.w / (nowOption.x.length)
            break
    }
    var lin = nowOption.paper.set()
    var lineArr = []


    for (var i = 0; i < nowOption.data.length; i++) {
        var pre = nowOption.data[i] / max
        var h = nowOption.showArr.h + nowOption.top
        switch (nowOption.xytext.y) {
            case 'bottom':
                h -= Math.floor(nowOption.showArr.h * pre)
                break
            case 'middle':
                h -= Math.floor((nowOption.showArr.h - newInfo.jg) * pre)
                break
        }
        nowOption.paper.circle(st + i * (nowOption.showArr.w / nowOption.x.length), h, Math.floor(0.5 * newInfo.jg * pre)).attr({
            fill: nowOption.color[i],
            'stroke-width': 0,
            'fill-opacity': 0.5
        })
        if (mouse) {
            var ttNew = nowOption.top
            if (nowOption.avage > nowOption.maxY) {
                ttNew = ttNew - newInfo.jg
            }
            var line = nowOption.paper.rect(st + i * (nowOption.showArr.w / nowOption.x.length), ttNew, 1, nowOption.showArr.h + nowOption.top - ttNew).attr({ 'stroke-width': 0, fill: nowOption.backLineColor }).hide()
            lineArr.push(line)
            lin.push(line)
            var rect = nowOption.paper.rect(st + i * (nowOption.showArr.w / nowOption.x.length) - 3, ttNew, 6, nowOption.showArr.h + nowOption.top - ttNew).attr({
                fill: '#fff',
                'stroke-width': 1,
                'fill-opacity': 0,
                'opacity': 0
            }).data({
                index: i
            }).mouseover(function(e) {
                lineArr[this.data('index')].show()
                nowOption.mouseover({
                    'pos': this.getBBox(),
                    'index': this.data('index'),
                    'mousepos': {
                        x: e.offsetX || e.screenX,
                        y: e.offsetY || e.offsetY
                    }
                })
            }).mouseout(function(e) {
                lineArr[this.data('index')].hide()
                nowOption.mouseout()
            })
        }
    }

    lin.toBack()
}
module.exports = DrawRadar;