function nodetranslate(app) {
    let nodeFunction = {}
    nodeFunction.app = app
    let upperLeft = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'upperLeft')
    let lowerLeft = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'lowerLeft')
    let rightUpper = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'rightUpper')
    let rightMiddle = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'rightMiddle')
    let lowerRight = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'lowerRight')
    let lizi = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'lizi')
    let lizipos = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'lizipos')
    let newN = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'new')
    let enlarge = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'enlarge')
    let shrink = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'shrink')
    let disappear = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'disappear')
    let notNodular = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'notNodular')
    let annotated = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'annotated')
    let clear = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'clear')
    let distinct = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'distinct')
    let smooth = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'smooth')
    let rough = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'rough')
    let solid = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'solid')
    let GGO = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'GGO')
    let mixed = nodeFunction.app.languageMode.getTranslate(nodeFunction.app.language, 'nodetranslate', 'mixed')
    nodeFunction.getReport = function(nodeInfo) {
        let str = ""
        let pos = ""
        if (nodeInfo.taggingType != 0) {
            switch (nodeInfo.position) {
                case 1:
                    pos = upperLeft
                    break
                case 2:
                    pos = lowerLeft
                    break
                case 3:
                    pos = rightUpper
                    break
                case 4:
                    pos = rightMiddle
                    break
                case 5:
                    pos = lowerRight
                    break
            }
            str = pos + lizi + nodeInfo.length + "mm &times; " + nodeInfo.width + lizipos;
        }
        return str
    }
    nodeFunction.getNodeStatus = function(nodeInfo) {
        let str = ""
        switch (nodeInfo.compareStatus) {
            case 1:
                str = newN
                break
            case 2:
                str = enlarge
                break
            case 3:
                str = shrink
                break
            case 4:
                str = disappear
                break
            case 5:
                str = notNodular
                break
            case 6:
                str = annotated
                break
        }
        return str
    }
    nodeFunction.getName = function(value) {
        let data = {
            boundary: '--',
            borderSymptom: "--",
            densityType: '--',
            diameter: '0',
            studyDate: ''
        }
        if (value.boundary != null && value.boundary != 'null' && value.boundary != '') {
            if (value.boundary == 1) {
                data.boundary = clear
            } else if (value.boundary == 2) {
                data.boundary = distinct
            }
        } else {
            data.boundary = "--"
        }

        var srcEdgeSmooth = value.borderSymptom;
        if (srcEdgeSmooth != null && srcEdgeSmooth != "null" && srcEdgeSmooth != '') {
            srcEdgeSmooth = srcEdgeSmooth.split("|")[0];
            if (srcEdgeSmooth == 1) {
                // data.borderSymptom = '??????'
                data.borderSymptom = smooth
            } else if (srcEdgeSmooth == 2) {
                // data.borderSymptom = '??????'
                data.borderSymptom = rough
            }
        } else {
            data.borderSymptom = '--'
        }
        if (value.densityType != null && value.densityType != 'null' && value.densityType != '') {
            if (value.densityType == 1) {
                // data.densityType = '??????'
                data.densityType = solid
            } else if (value.densityType == 2) {
                // data.densityType = '????????????'
                data.densityType = GGO
            } else if (value.densityType == 3) {
                // data.densityType = '??????'
                data.densityType = mixed
            }
        } else {
            data.densityType = '--'
        }
        if (value.diameter != null && value.diameter != 'null' && value.diameter != '') {
            data.diameter = value.diameter
        } else {
            data.diameter = '0'
        }
        if (value.studyDate != null && value.studyDate != 'null' && value.studyDate != '') {
            data.studyDate = value.studyDate
        } else {
            data.studyDate = ''
        }

        return data
    }
    //value?????????????????????pagesize?????????????????????page????????????type????????????????????????????????????????????????????????????????????????????????????????????????sort?????????{type:???????????????order???????????????,0????????????1?????????}
    //type 0:?????????1????????????2????????????3??????????????????4???????????????
    nodeFunction.getpage = function(value, pagesize, page, type, sort) {
        let data = {}
        let orgin = []
        data.list = []
        let allpagesize = pagesize || 10
        let allpage = page || 1
        let allsort = sort ||{ type: 'probMean', order: 0 }
        let displayAll = false
        if (type) {
            if (type == 4) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i].display == type) {
                        orgin.push(value[i])
                    }
                }
            } else {
                for (var i = 0; i < value.length; i++) {
                    if (value[i].taggingType == type) {
                        orgin.push(value[i])
                    }
                }
            }
        } else {
            orgin = value
        }
        let newArr = []
        for (var j = 0; j < orgin.length; j++) {
            if (orgin[j].display == 4) {
                displayAll = true
            }
            //newArr.push(orgin[j][sort.type])
        }
       // console.log(sort)
        newArr = dealAllData(sort, orgin)
        //console.log(newArr)
        //returnsingle(newArr, sort.order)
        orgin = sortword(orgin, sort.type, newArr)
        newArr = null
        if (displayAll) {
            let normalArr = []
            let teshuarr = []
            for (var t = 0; t < orgin.length; t++) {
                if (orgin[t].display == 4) {
                    teshuarr.push(orgin[t])
                } else {
                    normalArr.push(orgin[t])
                }
            }
            orgin = normalArr.concat(teshuarr)
        }
        data.total = Math.floor((orgin.length - 1) / allpagesize) + 1
        data.total = data.total == 0 ? 1 : data.total
        let st = (allpage - 1) * allpagesize
        let shuzi = 0
        for (var k = st; k < st + allpagesize; k++) {
            if (orgin[k]) {
                orgin[k].numNo = (orgin[k].numNo != '????????????' ? (++shuzi) : "????????????")
                data.list.push(orgin[k])
            }
        }
        return data
    }
    //????????????
    function sortbyall(startArray, num, paixu, pos) {
        let allsort = dealAllData(paixu[num], startArray.array)
        let next = sortword(paixu[num].type, startArray.array, allsort)
        if (next.next.nextDone && num < paixu.length - 1) {
            delete next.next.nextDone
            num++
            for (var i in next.next) {
                let a = init(next.next[i], num, paixu,next.next[i].pos)
                let info = next.next[i].pos
                console.log(a, info, num, paixu[num], pos, next.next[i].pos)
                a.endlist.map(function(item) {
                    next.endlist[info] = item
                    info++
                })
            }
            return next
        } else {
            return next
        }
    }
    //??????????????????????????????
    function dealAllData(sorttype, orgin) {
        let keyv = sorttype.type
        let data = []
        let returnD = {}
        for (var i = 0; i < orgin.length; i++) {
            data.push(orgin[i][sorttype.type])
        }
        returnsingle(data, sorttype.order)
        return data
    }
    //??????????????????????????????????????????,type???????????????????????????value????????????????????????
    function returnsingle(value, type) {
        let sortvalue = 1
        if (type == 1) {
            sortvalue = -1
        }
        value.sort(function(a, b) {
            return sortvalue * (b - a)
        })
    }
    //???????????????????????????value???????????????????????????key?????????????????????????????????sortArr???????????????????????????
    function sortword(value, key, sortArr) {
        let endlist = []
        value.map(function(item) {
            let pos = sortArr.lastIndexOf(item[key])
            sortArr[pos] = null
            endlist[pos] = item
        })
        return endlist
        // console.log(endlist)
    }
    return nodeFunction
}


module.exports = nodetranslate;