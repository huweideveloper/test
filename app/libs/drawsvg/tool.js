function calculate() {
    var tempTool = {}
    //平均值处理
    tempTool.avage = function(option) {
        if (option.x.length == 0) {
            option.x = dataDeal(option.ftype, option.data, option.ctype)
            if (option.avage > option.x[option.x.length - 1]) {
                /*var toubu = String(option.avage).substr(0, 1) * 1 + 1
                var pusnum = toubu * Math.pow(10, String(option.avage).length - 1)
                option.x.push(pusnum)
                option.maxX = option.x[option.x.length - 2]*/
                option.maxX = option.x[option.x.length - 1]
            } else {
                option.maxX = option.x[option.x.length - 1]
            }
            option.minX = option.x[0]
        }
        if (option.y.length == 0) {
            if (option.ftype != 'multi') {
                // console.log(option.maxY,'option.maxYoption.maxYoption.maxY')
                if (option.maxY != undefined && option.maxY != null && option.maxY != "") {
                    var min = option.minY ? option.minY : 0
                    for (var i = 0; i < 5; i++) {
                        option.y.push(min * 1 + i * (option.maxY - min) / 4)
                    }
                } else {
                    if (option.avage) {
                        var temp = []
                        if (option.ctype == 'noraml') {
                            temp = temp.concat(option.data).concat(option.avage)
                        } else {
                            for (var j = 0; j < option.data.length; j++) {
                                temp[j] = []
                                temp[j] = temp[j].concat(option.data[j]).concat(option.avage)
                            }
                        }
                        option.y = dataDeal(option.ftype, temp, option.ctype)
                    } else {
                        option.y = dataDeal(option.ftype, option.data, option.ctype)
                    }
                }
            } else {
                var soc
                if (option.avage) {
                    var temp = { yr: [], yl: [] }
                    var avag = { yr: [], yl: [] }
                    $.each(option.avage, function(news, numv) {
                        console.log()
                        if (Math.floor(news % 2 == 0)) {
                            if (numv || numv == 0) {
                                avag.yr.push(numv)
                            }
                        } else {
                            if (numv || numv == 0) {
                                avag.yl.push(numv)
                            }
                        }
                    })
                    if (option.ctype.yr == 'noraml') {
                        temp.yr = temp.yr.concat(option.data.yr).concat(avag.yr)
                    } else {
                        $.each(option.data.yr, function(nwu, val) {
                            temp.yr[nwu] = []
                            temp.yr[nwu] = temp.yr[nwu].concat(val).concat(avag.yr)
                        })
                    }
                    if (option.ctype.yl == 'noraml') {
                        temp.yl = temp.yl.concat(option.data.yl).concat(avag.yl)
                    } else {
                        $.each(option.data.yl, function(nwu, val) {
                            temp.yl[nwu] = []
                            temp.yl[nwu] = temp.yl[nwu].concat(val).concat(avag.yl)
                        })
                    }
                    console.log(temp)
                    soc = dataDeal(option.ftype, temp, option.ctype)
                } else {
                    soc = dataDeal(option.ftype, option.data, option.ctype)
                }
                //var soc = dataDeal(option.ftype, option.data, option.ctype)
                var yA = soc.yA
                var yB = soc.yB
                option.y = yA
                option.twoW = { yA: yA, yB: yB }
                if (option.maxY != undefined && option.maxY != null && option.maxY != "") {
                    $.each(option.twoW.yA, function(index, val) {
                        var min = option.minY ? option.minY : 0
                        option.twoW.yA[index] = min * 1 + Math.floor(index * ((option.maxY - min) / option.twoW.yA.length))
                        if (index == option.twoW.yA.length - 1) {
                            option.twoW.yA[index] = option.maxY * 1
                        }
                    })
                    //console.log(option.minY, option.maxY)
                }
                if (option.maxpY != undefined && option.maxpY != null && option.maxpY != "") {
                    $.each(option.twoW.yB, function(index, val) {
                        var min = option.minpY ? option.minpY : 0
                        option.twoW.yB[index] = min * 1 + Math.floor(index * ((option.maxpY - min) / option.twoW.yB.length))
                        if (index == option.twoW.yB.length - 1) {
                            option.twoW.yB[index] = option.maxpY * 1
                        }
                    })
                    //console.log(option.minpY, option.maxpY)
                }
                //console.log(option.twoW)
            }
            if (option.avage > option.y[option.y.length - 1]) {
                /*var toubu = String(option.avage).substr(0, 1) * 1 + 1
                var pusnum = toubu * Math.pow(10, String(option.avage).length - 1)
                option.y.push(pusnum)
                option.maxY = option.y[option.y.length - 2]*/
                option.maxY = option.y[option.y.length - 1]
            } else {
                option.maxY = option.y[option.y.length - 1]
            }
            option.minY = option.y[0]

        }
    }

    //多维度处理
    function dataDeal(ftype, data, ctype) {
        var scale = []
        var another = {}
        //////console.log(ftype)
        switch (ftype) {
            case "normal":
                scale = cdataDeal(ctype, data)

                break
            case "multi":
                // //console.log(ctype.yl)
                var yA = cdataDeal(ctype.yr, data.yr)
                var yB = cdataDeal(ctype.yl, data.yl)
                // //console.log(yA,yB,data.yl)
                if ((yA[0] == 0 && yB[0] == 0) || yA[0] < 0 && yB[0] < 0) {
                    if (yA.length < yB.length) {
                        yA = markArray(yA, yB)
                    }
                    if (yA.length > yB.length) {
                        yB = markArray(yB, yA)
                    }
                    // //console.log(yA,yB)
                } else {
                    var tempyA = markArray(yA, yB)
                    var tempyB = markArray(yB, yA)
                    yA = tempyA
                    yB = tempyB
                    //  //console.log(tempyA)
                    ////console.log(tempyB)
                }
                another = { yA: yA, yB: yB }
                ////console.log(another)
                return another
                break
        }
        return scale
    }

    function cdataDeal(ctype, data) {
        var scale = []
        var another = {}
        switch (ctype) {
            case "normal":
                scale = numberXY(data)
                //////console.log('dsjdak')
                break
            case "add":
                var temp = []
                // console.log(data)
                for (var j = 0; j < data[0].length; j++) {
                    var num = 0
                    for (var i = 0; i < data.length; i++) {
                        num += data[i][j]
                    }
                    temp.push(num)
                }
                //////console.log(temp)
                scale = numberXY(temp)
                break
            case "radd":
                var temp = []
                //console.log(data)
                for (var j = 0; j < data.length; j++) {
                    var num = 0
                    for (var i = 0; i < data[j].length; i++) {
                        num += data[j][i]
                    }
                    //console.log(num)
                    temp.push(num)
                }
                //console.log(temp, 'dddddd')
                scale = numberXY(temp)
                break
            case "more":
                var temp = []
                for (var j = 0; j < data.length; j++) {
                    temp = temp.concat(data[j])
                }
                //console.log(temp,'djalksjdksajdklasjdklasjd')
                scale = numberXY(temp)
                break
            case 'reverse':
                var temp = []
                for (var j = 0; j < data.length; j++) {
                    temp = temp.concat(data[j])
                }
                ////console.log(temp)
                scale = numberXY(temp)
                break
        }
        return scale
    }

    //数组补足
    function markArray(a, b) {
        // //console.log(a,b)
        if (a[0] * b[0] >= 0) {
            var total = b.length - a.length
            for (var i = 0; i < total; i++) {
                var neD = a[a.length - 1] + (a[1] - a[0])
                a.push(neD)
            }
        } else {
            //var st = a[0] > b[0] ? b[0] : a[0]
            //var et = a[0] > b[0] ? a[a.length - 1] : b[b.length - 1]
            var num = a[0] < 0 ? a[0] : -a[a.length - 1]
            a = [num, num / 2, 0, -num / 2, -num]
            ////console.log(a)
        }
        return a
    }

    //整理数据
    tempTool.svgData = function(nowOption, svgLib) {
        var data = {}
        data = tempTool.optionMatch(data, svgLib)
        data = tempTool.optionMatch(data, nowOption)
        return data
    }

    //初始化整个场景
    tempTool.initScreenData = function(svgLib, ya, yb) {
        //  console.log(svgLib, ya, yb, 'svgLibsvgLibsvgLib')
        var showArr = {}
        if (svgLib.twoW) {
            var wordle = 0
            var rj = 0
            $.each(ya.y, function(i, val) {
                var nowl = Tool.changeNumberByFromat(val, ya.yformat).length
                if (wordle < nowl) {
                    wordle = nowl
                }
            })
            wordle = ya.yformat[1] * 1 != 0 ? (wordle - 1) : wordle
            $.each(yb.y, function(i, val) {
                var nowl = Tool.changeNumberByFromat(val, yb.yformat).length
                if (rj < nowl) {
                    rj = nowl
                }
            })
            rj = yb.yformat[1] * 1 != 0 ? (rj - 1) : rj
            //console.log(wordle, rj, 'svgLibsvgLibsvgLib')
            showArr.st = (wordle + 2) * 12
            showArr.et = svgLib.width - (rj + 2) * 12
            showArr.w = showArr.et - showArr.st
            showArr.h = svgLib.height - svgLib.bottom - svgLib.top
        } else {
            var wordle = 0
            var rj = 20

            if (svgLib.maxX) {
                svgLib.bottom = 40
                $.each(svgLib.y, function(i, val) {
                    var nowl = val.length
                    if (wordle < nowl) {
                        wordle = nowl
                    }
                })
                rj = (Tool.changeNumberByFromat(svgLib.maxX * 1, svgLib.yformat).length + 2) * 12
                showArr.h = svgLib.height - svgLib.bottom - svgLib.top
            } else {
                $.each(svgLib.y, function(i, val) {
                    // console.log(val,'sdkskdhsjkd')
                    var nowl = Tool.changeNumberByFromat(val * 1, svgLib.yformat).length
                    if (wordle < nowl) {
                        wordle = nowl
                    }
                })
                showArr.h = svgLib.height - svgLib.bottom - svgLib.top
            }
           // console.log(wordle, 'rjrjrjrj')
            showArr.st = (wordle + 2) * 6
            showArr.et = svgLib.width - rj
            showArr.w = svgLib.width - showArr.st - rj
        }
        return showArr
    }

    //object浅层clone
    tempTool.optionMatch = function(option, matchOption) {
        for (var k in matchOption) {
            if (matchOption[k] != undefined) {
                option[k] = matchOption[k]
            }
        }
        return option
    }

    //Array浅层clone
    tempTool.cloneArr = function(valueArr) {
        var newArr = {}
        for (var i in valueArr) {
            newArr[i] = valueArr[i]
        }
        return newArr

    }
    tempTool.numberXY = function(value) {
        return numberXY(value)
    }
    //根据最大和最小获取y值
    tempTool.getYArray = function(max, min) {
        var aa = []
        for (var i = 0; i < 5; i++) {
            aa.push(min * 1 + i * (max - min) / 4)
        }
        return aa
    }
    //获取当前y轴的应用格式
    tempTool.getFromat = function(value, value1) {
        //console.log(value, 'sdjsakjdlvaluevaluevalue')
        var num = (value - value1) / 4
        var weishu = 0
        if (String(value).length != String(num).length) {
            weishu = 2
        }
        if ((value - value1) <= 60000) {
            weishu = 2
        }
        if ((value - value1) <= 600000000 && value >= 100000000) {
            weishu = 2
        }
        if (value > 100000 && value < 100000000 && String(num).lastIndexOf('.') == -1) {
            weishu = 0
        }
        if (value > 1000000000 && String(num).lastIndexOf('.') == -1) {
            weishu = 0
        }
        if (String(num).lastIndexOf('.') != -1) {
            weishu = 2
        }
        // console.log(num)
        if (value < 10000) {
            return ["显示数值", weishu, "0", "无", "!&++&!"]
        }
        if (value >= 10000 && value < 100000000) {
            return ["显示数值", weishu, "0", "万", "!&++&!"]
        }
        if (value >= 100000000) {
            // console.log(value)
            return ["显示数值", weishu, "0", "亿", "!&++&!"]
        }
    }
    //获取xy的最大值，进行排序
    function numberXY(value) {
        var newV = value.toString().split(',')
        var newdata = newV.sort(function NumDescSort(a, b) {
            return b * 1 - a * 1;
        })
        //console.log(newdata)
        var result = []
        var type = newdata[0] * newdata[newdata.length - 1] < 0 ? '-' : '+'
        if (newdata[0] == 0 || newdata[newdata.length - 1] == 0) {
            type = "0"
        }
        switch (type) {
            case "0":
                if (newdata[0] == 0 && newdata[newdata.length - 1] == 0) {
                    for (var i = 0; i < 5; i++) {
                        result.push(i)
                    }
                } else {
                    result = doMax(newdata[0] == 0 ? newdata[newdata.length - 1] : newdata[0])
                }
                //if(newdata[0])
                break
            case "-":
                var toplevel = Math.abs(newdata[0]) > Math.abs(newdata[newdata.length - 1]) ? Math.pow(10, (String(Math.floor(newdata[0]))).length) : Math.pow(10, ((String(Math.floor(newdata[newdata.length - 1]))).length - 1))
                var maxNUm = Math.abs(newdata[0]) > Math.abs(newdata[newdata.length - 1]) ? Math.floor(newdata[0]) : Math.abs(newdata[newdata.length - 1])
                var maxL = (String(maxNUm).substr(0, 1) * 1 + 1) * Math.pow(10, (String(parseInt(maxNUm))).length - 1)
                //console.log(maxL)
                result = [-maxL, -maxL / 2, 0, maxL / 2, maxL]
                break
            case "+":
                if (newdata[0] * 1 > 0) {
                    result = doMax(newdata[0])
                } else {
                    result = doMax(newdata[newdata.length - 1])
                }
                break
        }
        // //console.log(result)
        return result
    }

    function doMax(value) {
        var fuhao = Math.floor(Math.abs(value) / value)
        var juedui = Math.abs(Math.floor(value))
        var toplevel = juedui != 0 ? Math.pow(10, (String(juedui)).length) : 1
        var maxL = (String(juedui).substr(0, 1) * 1 + 1) * Math.pow(10, (String(juedui)).length - 1)
        var jg

        var snum = (String(juedui).substr(0, 1) * 1 + 1)

        //var zuobmax = snum * Math.pow(10, (String(juedui)).length - 1)
        if (Math.floor(snum % 2) == 1) {
            maxL = (snum + 1) * Math.pow(10, (String(juedui)).length - 1)
        }
        if ((maxL - juedui) > maxL / 4 && (maxL - juedui) <= 3 * maxL / 8) {
            maxL = maxL - 0.4 * Math.pow(10, (String(juedui)).length - 1)
        }
        if ((maxL - juedui) > maxL * 3 / 8 && (maxL - juedui) < maxL / 2) {
            maxL = maxL - 0.8 * Math.pow(10, (String(juedui)).length - 1)
        }
        // console.log(maxL)
        if (maxL <= 10 && maxL > 0) {
            //console.log(juedui)
            if (juedui < 1) {
                maxL = 1
            } else if (juedui < 4) {
                maxL = 4
            } else if (juedui < 8 && juedui >= 4) {
                maxL = 8
            } else {
                maxL = 12
            }
        }
        //console.log(maxL)
        jg = Math.floor(maxL / 4)

        var tempAtr = []
        // console.log(jg, 'jg')
        if (jg != 0) {
            for (var i = 0; i < 5; i++) {
                //var tjg = newdata[0] > 0 ? jg : -jg
                //maxL*fuhao
                tempAtr.push(i * jg * fuhao)
            }
        } else {
            for (var i = 0; i < 5; i++) {
                tempAtr.push((Math.floor(toplevel / 5) + 1) * i)
            }
        }
        if (maxL == 1) {
            tempAtr = [0, 0.25, 0.5, 0.75, 1]
        }
        if (fuhao == -1) {
            var newdata = tempAtr.sort(function NumDescSort(a, b) {
                return Math.floor(a) - Math.floor(b);
            })
            tempAtr = newdata
        }
        //console.log(tempAtr, 'tempAtr')
        return tempAtr
    }
    return tempTool
}
module.exports = new calculate();