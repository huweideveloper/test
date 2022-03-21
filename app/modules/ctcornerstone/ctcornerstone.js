require("./ctcornerstone.less");

/*


 */
class ctcornerstone extends ctcornerstone_base {
    constructor(app, dom, value, addMore) {
        super(app, dom, value, addMore)
        this.freehand = require("./freedhand.js")
            //console.log(this.freehand)
    }
    ctEvent(id, imageAddress, data, total) {
        let that = this

        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.ImageRendered', function(value) {
            //console.log(that.initFrist[id])
            if (that.model.seriesInfo[that.cornerstoneArray[id].sId]) {
                value.image.columnPixelSpacing = that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.columnPixelSpacing
                value.image.rowPixelSpacing = that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.rowPixelSpacing
            }
            if (that.model.seriesInfo[that.cornerstoneArray[id].sId]) {
                that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.column = value.image.columns
                that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.row = value.image.rows
            }
            //console.log(value, 'dksajldkjaksd')

            //console.log(that.model.seriesInfo[that.cornerstoneArray[id].sId], 'that.model.seriesInfo[that.cornerstoneArray[id].sId]')
            if (that.model.seriesInfo[that.cornerstoneArray[id].sId]) {
                if (that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.fileType == "DCM") {
                    that.showWWC(value.viewport, that.cornerstoneArray[id].sId, id)
                }
            }
            if (that.baseLineOpen) {
                if (that.nowLayNum(id) != Tool.changeToName(imageAddress[value.currentCount * 1], 'jpg')) {
                    that.makeBaseLine(that.cornerstoneArray[id].sId, Tool.changeToName(imageAddress[value.currentCount * 1], 'jpg'))
                }
                if (that.nowLine) {
                    if (that.nowLine[that.cornerstoneArray[id].sId]) {
                        let point = that.nowLine[that.cornerstoneArray[id].sId]
                        if (point.length != 0) {
                            let ctx = value.canvasContext
                            ctx.beginPath();
                            ctx.mozImageSmoothingEnabled = false;
                            ctx.lineWidth = Math.floor(value.image.columns / 512)
                            ctx.strokeStyle = '#f00';
                            ctx.moveTo(point[0].x, point[0].y)
                            ctx.lineTo(point[1].x, point[1].y)
                            ctx.stroke();
                        }
                    }
                }
            }
            if (that.crossOpen && !that.crossmove) {
                that.calflow(id)
            }

            let who = ES.selctorDoc(value.element).parent()
            let nowId = ES.selctorDoc(value.element).attr('id').replace('ct', '') * 1
            let layers = Tool.changeToName(imageAddress[value.currentCount * 1], 'jpg')
            that.model.currentLayer = layers
            that.dom.find('.ct' + id + ' .layer').html(layers + '/' + total)
            $('.ct' + id).find('.slideContainer li').each(function(index){
                let number = Number($(this).attr("number"));
                if( number === layers ){
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active")
                }
            })
            that.dom.find('.ct' + id + ' .sc').html(that.cornerstoneArray[id].getViewport().scale.toFixed(2))
            let nodeA = (that.nodeInfo ? that.nodeInfo[layers] : [])
            nodeA = nodeA ? nodeA : []

            let fliterNodes = nodeA.filter((item) => {
                if (!item.show) {
                    let toolData = that.cornerstoneArray[id].getAllState()
                    toolData.map(function(items) {
                        console.log(items, 'itemitemitemitem')
                        if (items.uuid && items.tooltype != "alignment" && items.uuid == item.nodeInfo.uuid) {
                            that.cornerstoneArray[id].clearSigleData(items.tooltype, items, true)
                        }
                    })
                }
                return item.sId == that.cornerstoneArray[id].sId && item.show
            })
            let brushInfoAll = that.brushManage.brushInfo[layers] ? that.brushManage.brushInfo[layers] : {}
            let brushNodes = {}

            for (let i in brushInfoAll) {
                if (brushInfoAll[i].sId) {
                    let index = brushInfoAll[i].sId.split('_').lastIndexOf(that.cornerstoneArray[id].sId)
                    if (index != -1 && brushInfoAll[i].show) {
                        brushNodes[i] = brushInfoAll[i]
                    }
                }
            }
            if (that.nodeShow) {
                //console.log(brushInfoAll)
                that.drawImg(brushNodes, value)
            }
            //return
            //console.log(fliterNodes, 'fliterNodesfliterNodesfliterNodesfliterNodes', nodeA)
            //that.dom.find('.ct' + id + ' .cal').html('')
            if (that.nodeShow) {
                that.drawNode(fliterNodes, value)
            }
            let nowVO = that.cornerstoneArray[id].getViewport().voi
                //console.log(that.nowWWC[id], 'that.nowWWC[id]that.nowWWC[id]that.nowWWC[id]', nowVO)
            if (that.nowWWC[id]) {
                if (nowVO.windowCenter != that.nowWWC[id].c || nowVO.windowWidth != that.nowWWC[id].w) {
                    that.lungWindown(nowVO.windowCenter, nowVO.windowWidth)
                    //that.lungWindown(that.nowWWC[id].c, that.nowWWC[id].d)
                }
            }
            //console.log(that.cornerstoneArray[id].getViewport())
            if (that.controlename == 'brushFan' || that.controlename == 'earseFan' || that.controlename == 'brushFanTe') {
                if (that.nowWWC[id]) {
                    //console.log(that.nowWWC, 'that.nowWWCthat.nowWWC')
                    that.lungWindown(that.nowWWC[id].c, that.nowWWC[id].w)
                }
            }
            if (!that.initFrist[id]) {
                that.initFrist[id] = true
                let nowCOlor = that.controlename
                if ((value.image.rows > 1000 || value.image.columns > 1000) && value.image.rate < 1) {
                    that.defaultFunction("brushFanTe")

                }
                that.defaultFunction("")
                if (nowCOlor) {
                    that.defaultFunction(nowCOlor)
                }
                that.event._dispatch('ctcornerstone.loadingfinish', {
                    sId: that.cornerstoneArray[id].sId
                })
            }
            if (that.changeLayeIdTime == null) {
                console.log(that.nowLayNum(id))
                that.cornerstoneArray[id].progress.setPosBar(that.nowLayNum(id))
            }

        })

        //return
        //bursh以外的标注事件
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.ModifiedFinsh', function(value) {
            console.log(that.controlename)
            if (that.controlename != "zoomFan" && that.controlename != "wlFan" && that.controlename != "restFan") {
                let sid = that.cornerstoneArray[id].sId
                if (!that.model.seriesInfo[sid].needAnno) {
                    return
                }
            }
            // console.log(value.splitHandle.id, 'ModifiedFinshModifiedFinshModifiedFinshModifiedFinsh')
            //console.log(value)
            that.model.controlStauts.delete = true
            let layer = that.getAlllayer(ES.selctorDoc(value.element).attr('id').replace('ct', '') * 1)
                //console.log(value)
                // return
            let element = that.cornerstoneArray[layer[layer.length - 1]]
            let e = value.e
                //console.log(value.splitHandle.handles)
            let handles = value.splitHandle.handles
            let sx = handles.start ? handles.start.x : handles.end.x
            let sy = handles.start ? handles.start.y : handles.end.y
            let ex = handles.end ? handles.end.x : handles.start.x
            let ey = handles.end ? handles.end.y : handles.start.y
            let startX = (sx + ex) / 2
            let startY = (sy + ey) / 2
            let maxd = Math.max(ey - sy, ex - sx)
            let mind = Math.max(ey - sy, ex - sx)
                //var position = that.getPosition(startX, startY)

            let moveAllElementData = {
                    "handles": handles,
                    "id": value.splitHandle.id,
                    "uuid": value.splitHandle.uuid,
                    "tooltype": e.detail.toolType,
                    "layerNumber": that.nowLayNum(id), // element.axialStack1.currentImageIdIndex + 1,
                    "diameter": mind,
                    "meanHu": value.splitHandle.meanStdDev ? value.splitHandle.meanStdDev.mean : 0,
                    "makeType": 0,
                    "diameterm": maxd.toFixed(2) //, //(xq * value.spsec).toFixed(2),
                        // "spliteV": JSON.stringify(value.splitHandle ? value.splitHandle : "")
                }
                // console.log('ModifiedFinsh================', e.detail.toolType, value.splitHandle.uuid)
            if (e.detail.toolType == 'simpleAngle') {
                let handel = handles
                moveAllElementData.pointArray = [handel.start.x, handel.start.y, handel.middle.x, handel.middle.y, handel.end.x, handel.end.y].toString()
                moveAllElementData.rangel = value.splitHandle.rAngle
            }
            if (e.detail.toolType == 'rectangleRoi' || e.detail.toolType == 'ellipticalRoi' || e.detail.toolType == "length") {
                //  console.log(value)
                let handel = handles
                moveAllElementData.pointArray = [handel.start.x, handel.start.y, null, null, handel.end.x, handel.end.y].toString()
                moveAllElementData.rangel = 0
            }

            //console.log(moveAllElementData,'moveAllElementDatamoveAllElementDatamoveAllElementData')
          that.cornerstoneArray[id].moveAllElementData = moveAllElementData

        })

        //获取标注信息
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MeasurementEnd', function(value) {
            //console.log(value,'valuevaluevalue')
            //画笔特殊情况，因为画笔只有面积的变化，他不大依赖点位信息，只有面积信息，所以所有的信息最后变成一张png图片
          // console.log('=================', that.cornerstoneArray[id].moveAllElementData)
            if (!value) {
                return
            }
            if (that.controlename != "zoomFan" && that.controlename != "wlFan" && that.controlename != "restFan") {
                let sid = that.cornerstoneArray[id].sId
                if (!that.model.seriesInfo[sid].needAnno) {
                    return
                }
            }
            value.sId = that.cornerstoneArray[id].sId
            that.model.controlStauts.delete = true
            let layerNumber = that.nowLayNum(id) //that.cornerstoneArray[0].axialStack1.currentImageIdIndex + 1
                //console.log(that.controlename ,'that.controlename')
            if (that.controlename == 'brushFan' || that.controlename == 'earseFan') {
                if (!that.model.nidusChoose) {
                    return
                }
                let imageAnnotationToolType = that.model.nidusChoose.toolType.imageAnnotationToolType
                if (imageAnnotationToolType != 'MAGIC_STICK_SINGLE' && imageAnnotationToolType != 'POLYGON' && imageAnnotationToolType != 'QSELECT' && imageAnnotationToolType != 'REGION_PAINT' && imageAnnotationToolType != 'FREEHAND') {
                    that.brushId = null
                    return
                }
                if (imageAnnotationToolType == 'MAGIC_STICK_SINGLE' || imageAnnotationToolType == 'POLYGON' || imageAnnotationToolType == 'QSELECT' || imageAnnotationToolType == 'REGION_PAINT' || imageAnnotationToolType == 'FREEHAND') {
                    value.layerNumber = layerNumber
                    console.log(that.model.nidusChoose)
                    value.backId = that.model.nidusChoose.bid
                    value.toolType = value.toolType ? value.toolType : {
                        type: that.model.nidusChoose.toolType.imageAnnotationToolType
                    }
                    that.updateAllCanvas(value.sId)
                        //cornerstone.updateImage(that.cornerstoneArray[id].element)
                    that.event._dispatch('ctcornerstone.editBrush', value)
                    return
                }
            }
            //多边形
            if (that.controlename == 'polygonFan') {
                /*let nowId = value.uuid // that.model.nidusChoose ? that.model.nidusChoose.uuid : value.uuid
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                        nowId = that.model.nidusChoose.uuid
                    }
                }*/
                // let imageAll = new Image()
                // imageAll.onload = function() {
                let brushInfo = that.brushManage.creatBrush(value.layerNumber, that.freehand.endPath(), value.uuid, that.cornerstoneArray[id].sId, {
                    w: that.freehand.canvas.width,
                    h: that.freehand.canvas.height
                })

                // console.log(that.brushManage.brushInfo)
                that.cornerstoneArray[id].moveAllElementData.image = brushInfo.image
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'POLYGON') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            value.backId = that.model.nidusChoose.bid
                            that.event._dispatch('ctcornerstone.editBrush', value)
                            that.updateAllCanvas(value.sId)
                                //cornerstone.updateImage(that.cornerstoneArray[id].element)
                            that.cornerstoneArray[id].moveAllElementData = null
                            return
                        }
                    }
                }
                value.show = true
                that.sequencelist.addNode(value, true)
                that.event._dispatch('ctcornerstone.addImageResult', value)
                that.updateAllCanvas(value.sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)
                that.cornerstoneArray[id].moveAllElementData = null
                    // }
                    //imageAll.src = that.freehand.endPath().src

                return
            }
            //自由画笔
            if (that.controlename == 'freehandFan') {

                //let imageAll = new Image()
                //imageAll.onload = function() {
                let brushInfo = that.brushManage.creatBrush(value.layerNumber, that.freehand.noneClosePath(), value.uuid, that.cornerstoneArray[id].sId, {
                    w: that.freehand.canvas.width,
                    h: that.freehand.canvas.height
                })

                // console.log(that.brushManage.brushInfo)
                that.cornerstoneArray[id].moveAllElementData.image = brushInfo.image
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'FREEHAND') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            value.backId = that.model.nidusChoose.bid
                            that.event._dispatch('ctcornerstone.editBrush', value)
                            that.updateAllCanvas(value.sId)
                                //cornerstone.updateImage(that.cornerstoneArray[id].element)
                            that.cornerstoneArray[id].moveAllElementData = null
                            return
                        }
                    }
                }
                value.show = true
                that.sequencelist.addNode(value, true)
                that.event._dispatch('ctcornerstone.addImageResult', value)
                that.updateAllCanvas(value.sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)
                that.cornerstoneArray[id].moveAllElementData = null
                    //}
                    //imageAll.src = that.freehand.noneClosePath().src

                return
            }
            if (that.controlename == 'regionpaintFan') {
                console.log(value)
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'REGION_PAINT') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            value.backId = that.model.nidusChoose.bid
                            that.event._dispatch('ctcornerstone.editBrush', value)
                            that.updateAllCanvas(value.sId)
                                //cornerstone.updateImage(that.cornerstoneArray[id].element)
                            that.cornerstoneArray[id].moveAllElementData = null
                            return
                        }
                    }
                }
                value.show = true
                that.sequencelist.addNode(value, true)
                that.updateAllCanvas(value.sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)
                that.event._dispatch('ctcornerstone.addImageResult', value)
                that.cornerstoneArray[id].moveAllElementData = null
                return
            }
            console.log(value, 'cobbFan', that.controlename, value.tooltype, value.uuid)
            console.log(cornerstoneTools.getToolState(that.cornerstoneArray[id].element, "length"))

            if (that.controlename == 'cobbFan' && !value.uuid) {
                //let typeC = that.controlename.replace('Fan', '')
                console.log(that.model.nidusChoose)
                if (!that.model.nidusChoose) {
                    console.log('addd')
                    that.cobbAdd(value, layerNumber, id)
                    return
                }
                if (that.model.nidusChoose && that.model.nidusChoose.type != 'cobb') {
                    console.log('addd')
                    that.cobbAdd(value, layerNumber, id)
                    return
                }
                if (that.model.nidusChoose) {
                    let data = that.drawInfo.getInfo(that.model.nidusChoose)
                    if (data.lineA.length == 2) {
                        console.log('addd')
                        that.cobbAdd(value, layerNumber, id)
                        return
                    }
                    if (data.lineA.length < 2) {
                        console.log('edit')
                            //value.uuid = that.model.nidusChoose.uuid
                        that.setSpliceUUID(value, 'length', that.model.nidusChoose.uuid, id)
                        data.lineA.push(value.handles)
                            //data.handles=value.handles
                        that.dom.find('.ct' + id + ' .cal').html('cobb角' + Tool.calAngel(data.lineA[0], data.lineA[1]))
                            //console.log()
                        data.setDataType = 'number'
                        that.event._dispatch('ctcornerstone.editNode', data)
                        return
                    }
                }
            }
            if ((that.controlename == 'rectangleRoiFan' || that.controlename == 'ellipticalRoiFan' || that.controlename == 'simpleAngleFan' || that.controlename == 'lengthFan') && !value.uuid) {
                let type = that.controlename.replace('Fan', '')
                if (type == value.tooltype) {
                    if (!value.uuid) {
                        that.setSpliceUUID(value, type, value.id, id)
                    }
                    that.drawInfo.setInfo(value)
                    value.setDataType = 'number'
                    value.toolType = that.tooltype
                    value.layerNumber = layerNumber
                    value.show = true
                    value.type = type
                        //value.sId=that.cornerstoneArray[id].sId
                    that.sequencelist.addNode(value, true)
                    if (!that.nodeInfo) {
                        that.nodeInfo = {}
                    }
                    if (!that.nodeInfo[layerNumber]) {
                        that.nodeInfo[layerNumber] = []
                    }
                    that.nodeInfo[layerNumber].push({
                        layerNumber: layerNumber,
                        type: value.tooltype,
                        nodeInfo: value,
                        sId: value.sId,
                        show: true
                    })
                    that.event._dispatch('ctcornerstone.addNode', value)
                    return
                }
            }
            if (value.tooltype) {
                if ((value.tooltype == "rectangleRoi" || value.tooltype == 'ellipticalRoi' || value.tooltype == 'simpleAngle' || value.tooltype == 'length') && value.uuid) {
                    //console.log(value, 'rectangleRoirectangleRoirectangleRoirectangleRoirectangleRoi', JSON.stringify(value))
                    that.drawInfo.setInfo(value)
                    if (value.type == "cobb") {
                        let nowData = that.cornerstoneArray[id].geSiglneState('length')
                        console.log(nowData)
                        if (nowData) {
                            value.lineA = []
                            nowData.data.map(function(item) {
                                    if (item.uuid == value.uuid) {
                                        value.lineA.push(item.handles)
                                    }
                                })
                                //console.log('aaaaaaaaaaaaaaaa', Tool.calAngel(value.lineA[0], value.lineA[1]))
                            if (value.lineA.length == 2) {
                                that.dom.find('.ct' + id + ' .cal').html('cobb角:' + Tool.calAngel(value.lineA[0], value.lineA[1]))
                            }
                        }
                    }
                    value.imageAnnotationId = value.toolType.imageAnnotationId || value.imageAnnotationId
                    value.imageAnnotationToolId = value.toolType.id || value.imageAnnotationToolId
                    value.imageAnnotationToolType = value.toolType.type || value.imageAnnotationToolType
                    value.imageAnnotationType = value.toolType.imageAnnotation || value.imageAnnotationType
                        ///console.log(value, that.drawInfo.info)
                    value.setDataType = 'number'
                    that.event._dispatch('ctcornerstone.editNode', value)
                }
            }
        })

        //bursh移动侦听
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.brushDown', function(value) {
            if (that.controlename == 'brushFan') {}
        })

        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.click', function(value) {
            console.log(that.controlename, value.e.detail, '=======')
            if (!that.controlename || that.controlename == "zoomFan" || that.controlename == "wlFan" || that.controlename == "restFan") {
                let x = value.e.detail.currentPoints.image.x
                let y = value.e.detail.currentPoints.image.y
                let layersNum = that.nowLayNum(id)
                let nodeA = (that.nodeInfo ? that.nodeInfo[layersNum] : [])
                nodeA = nodeA ? nodeA : []
                nodeA = nodeA.filter((item) => {
                    return item.show
                })
                let backId
                nodeA.map((item1) => {
                    let nodeInfo = item1.nodeInfo
                    if (nodeInfo.handles) {
                        if (nodeInfo.handles.start.x < x && nodeInfo.handles.end.x > x && nodeInfo.handles.start.y < y && nodeInfo.handles.end.y > y) {
                            backId = nodeInfo.backId || nodeInfo.uuid
                            console.log('aaaaaaaaaaaa')
                            that.sequencelist.clickById({
                                uuid: backId
                            })
                            return
                        }
                    }
                    if (nodeInfo.pointA) {
                        let nx = [20000, 0]
                        let ny = [20000, 0]
                        nodeInfo.pointA.map((itptem) => {
                            nx[0] = nx[0] < itptem.start.x ? nx[0] : itptem.start.x
                            nx[1] = nx[1] > itptem.start.x ? nx[1] : itptem.start.x
                            ny[0] = ny[0] < itptem.start.y ? ny[0] : itptem.start.y
                            ny[1] = ny[1] > itptem.start.y ? ny[1] : itptem.start.y
                        })
                        console.log(nx, ny)
                        if (nx[0] < x && nx[1] > x && ny[0] < y && ny[1] > y) {
                            backId = nodeInfo.backId || nodeInfo.uuid
                            that.sequencelist.clickById({
                                uuid: backId
                            })
                            return
                        }
                        console.log(nodeInfo)
                    }
                })
                if (backId) {
                    return
                }
                let brushInfoAll = that.brushManage.brushInfo[layersNum] ? that.brushManage.brushInfo[layersNum] : {}
                let brushNodes = {}
                console.log(brushInfoAll)
                for (let i in brushInfoAll) {
                    if (brushInfoAll[i].sId) {
                        let index = brushInfoAll[i].sId.split('_').lastIndexOf(that.cornerstoneArray[id].sId)
                        if (index != -1) {
                            let dataNum = Math.floor(y) * value.e.detail.image.width + Math.floor(x)
                            console.log(dataNum)
                            if (brushInfoAll[i].orginimage.includes(dataNum)) {
                                backId = brushInfoAll[i].backId || brushInfoAll[i].id
                                that.sequencelist.clickById({
                                    uuid: backId
                                })
                                return
                            }
                            // brushInfoAll[i].orginimage
                        }
                    }
                }
                //console.log(that.nodeInfo, that.nowLayNum(id))
                return
            }
            if (that.controlename != "zoomFan" && that.controlename != "wlFan" && that.controlename != "restFan") {
                let sid = that.cornerstoneArray[id].sId
                if (!that.model.seriesInfo[sid].needAnno) {
                    return
                }
            }
            if (that.controlename == 'magicStickSingleFan') {
                //console.log(value)
                value.layerNumber = that.nowLayNum(id)
                value.toolType = that.tooltype
                value.id = value.uuid = Tool.guid()
                value.type = that.controlename.replace('Fan', '')
                value.imageAnnotationId = value.toolType.imageAnnotationId
                value.imageAnnotationToolId = value.toolType.id
                value.imageAnnotationToolType = value.toolType.type
                value.imageAnnotationType = value.toolType.imageAnnotation
                value.sId = that.cornerstoneArray[id].sId
                that.sequencelist.addNode(value, true)
                let pianyi = [
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1]
                ]
                value.points = []
                for (let i = 0; i < 4; i++) {
                    let data = {
                        image: value.e.detail.image,
                        currentPoints: {
                            image: {
                                x: value.e.detail.currentPoints.image.x + pianyi[i][0],
                                y: value.e.detail.currentPoints.image.y + pianyi[i][1]
                            }
                        }
                    }
                    data.currentPoints.image.ct = that.model.getDicomValue(data).hu
                        //console.log(data.currentPoints.image)
                    value.points.push(data.currentPoints.image)
                }
                value.ct = that.model.getDicomValue(value.e.detail)
                that.event._dispatch('ctcornerstone.makeMagic', value)
            }
            if (that.controlename == "quickselectFan") {
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        that.app.alert.show({
                            title: ' ',
                            msg: '选择的病灶跟当前选中序列不是同一序列，请取消病灶选中，或者切换序列',
                            close: true
                        })
                        return
                    }
                }
                //let uuid = that.cornerstoneArray[id].moveAllElementData ? that.cornerstoneArray[id].moveAllElementData.uuid : ""
                let uuid = "" //that.model.nidusChoose ? that.model.nidusChoose.uuid : uuid
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'QSELECT') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            uuid = that.model.nidusChoose.uuid
                        }
                    }
                }
                //let points = that.model.floodFill_newRGB32(value.e.detail, that.cornerstoneTools_config.quickselect_config)
                let points = that.model.makeCiclePoint(value.e.detail, that.cornerstoneTools_config.quickselect_config)
                    //console.log(value.e.detail.image.width)
                let brushInfo = that.brushManage.setBrush(that.nowLayNum(id), points, 0, {
                    w: value.e.detail.image.width,
                    h: value.e.detail.image.height
                }, uuid, that.cornerstoneArray[id].sId)
                brushInfo.toolType = that.tooltype
                brushInfo.layerNumber = that.nowLayNum(id)
                brushInfo.type = 'brush'
                brushInfo.imageAnnotationId = that.tooltype.imageAnnotationId
                brushInfo.imageAnnotationToolId = that.tooltype.id
                brushInfo.imageAnnotationToolType = that.tooltype.type
                brushInfo.imageAnnotationType = that.tooltype.imageAnnotation
                brushInfo.sId = that.cornerstoneArray[id].sId
                brushInfo.show = true
                that.cornerstoneArray[id].moveAllElementData = brushInfo
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        return
                    }
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'QSELECT') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            brushInfo.backId = that.model.nidusChoose.bid
                            that.updateAllCanvas(that.cornerstoneArray[id].sId)
                                //cornerstone.updateImage(that.cornerstoneArray[id].element)
                            that.event._dispatch('ctcornerstone.editBrush', brushInfo)
                            that.cornerstoneArray[id].moveAllElementData = null
                            return
                        }
                    }
                }
                console.log(brushInfo, 'brushInfobrushInfobrushInfobrushInfobrushInfobrushInfobrushInfobrushInfo')
                that.sequencelist.addNode(brushInfo, true)
                that.updateAllCanvas(that.cornerstoneArray[id].sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)
                that.event._dispatch('ctcornerstone.addImageResult', brushInfo)
                that.cornerstoneArray[id].moveAllElementData = null
                    //console.log(points)
            }
            if (that.controlename == 'alignmentFan') {
                //let typeC = that.controlename.replace('Fan', '')
                console.log(that.model.nidusChoose)
                if (!that.model.nidusChoose) {
                    //value.e.detail.currentPoints
                    console.log('addd')
                    that.alignmentAdd(value, id)
                    that.dom.find('.ct' + id + ' .cal').html('前上缘')
                    return
                }
                if (that.model.nidusChoose && that.model.nidusChoose.type != 'alignment') {
                    console.log('addd')
                    that.alignmentAdd(value, id)
                    that.dom.find('.ct' + id + ' .cal').html('前上缘')
                    return
                }
                if (that.model.nidusChoose && that.model.nidusChoose.imageAnnotationType != that.tooltype.imageAnnotation) {
                    console.log('addd')
                    that.alignmentAdd(value, id)
                    that.dom.find('.ct' + id + ' .cal').html('前上缘')
                    return
                }
                if (that.model.nidusChoose) {
                    let data = that.drawInfo.getInfo(that.model.nidusChoose)
                    if (data.pointA.length == 4) {
                        console.log('addd')
                        that.alignmentAdd(value, id)
                        that.dom.find('.ct' + id + ' .cal').html('前上缘')
                        that.gotoLayer(id, that.cornerstoneArray[id].sId)
                        return
                    }
                    if (data.pointA.length < 4) {
                        console.log('edit', data)
                        data.layerNumber = that.nowLayNum(id)
                        data.pointA.push({
                            start: {
                                x: value.e.detail.currentPoints.image.x,
                                y: value.e.detail.currentPoints.image.y
                            }
                        })
                        data.setDataType = 'number'
                        let name = that.model.returnBodyName(data.pointA.length)
                        that.nodeInfo[data.layerNumber].map((item) => {
                            if (item.nodeInfo.uuid == data.uuid || item.nodeInfo.uuid == data.id) {
                                item.nodeInfo.pointA = data.pointA
                            }
                        })
                        that.dom.find('.ct' + id + ' .cal').html(name)
                        that.gotoLayer(null, that.cornerstoneArray[id].sId)
                        that.event._dispatch('ctcornerstone.editNode', data)
                        return
                    }

                }

            }
        })
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.mousedown', function(value) {
            //console.log(that.controlename, that.cornerstoneArray[id].moveAllElementData.uuid)
            if (that.controlename != "zoomFan" && that.controlename != "wlFan" && that.controlename != "restFan" && that.controlename) {
                let sid = that.cornerstoneArray[id].sId
                if (!that.model.seriesInfo[sid].needAnno) {
                    that.app.alert.show({
                        title: ' ',
                        msg: '该序列不能标注',
                        close: true
                    })
                    return
                }
            }
            if (that.cornerstoneArray[id].moveAllElementData) {
                if (that.cornerstoneArray[id].moveAllElementData.uuid && that.cornerstoneArray[id].moveAllElementData.tooltype == "simpleAngle") {
                    let avalue = that.drawInfo.getInfo(that.cornerstoneArray[id].moveAllElementData)
                        //console.log(avalue, that.cornerstoneArray[id].moveAllElementData)
                    if (avalue) {
                        avalue.handles = that.cornerstoneArray[id].moveAllElementData.handles
                        avalue.imageAnnotationId = avalue.toolType.imageAnnotationId || avalue.imageAnnotationId
                        avalue.imageAnnotationToolId = avalue.toolType.id || avalue.imageAnnotationToolId
                        avalue.imageAnnotationToolType = avalue.toolType.type || avalue.imageAnnotationToolType
                        avalue.imageAnnotationType = avalue.toolType.imageAnnotation || avalue.imageAnnotationType
                        avalue.setDataType = 'number'
                        that.event._dispatch('ctcornerstone.editNode', avalue)
                        that.cornerstoneArray[id].moveAllElementDat = null
                    }

                }
            }

            if (that.controlename == 'brushFan' || that.controlename == 'earseFan') {
                if (!that.model.nidusChoose) {
                    //console.log(value.tooltype)
                    if (value.toolType) {
                        that.sequencelist.addNode(value, true)
                    } else {
                        that.app.alert.show({
                            title: ' ',
                            msg: '没有对应的病灶',
                            close: true
                        })
                    }
                    return
                }
            }
            //console.log(that.cornerstoneTools_config,that.controlename.replace('Fan','_config'),that.controlename)

            if (that.controlename == "polygonFan" || that.controlename == "freehandFan") {
                let lineWidth = that.cornerstoneTools_config[that.controlename.replace('Fan', '_config')].lineWidth
                let e = value.e
                let wh = {
                    width: e.detail.image.width,
                    height: e.detail.image.height
                }
                console.log(that.cornerstoneArray[id].moveAllElementData, that.model.nidusChoose)
                let image
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        that.app.alert.show({
                            title: ' ',
                            msg: '选择的病灶跟当前选中序列不是同一序列，请取消病灶选中，或者切换序列',
                            close: true
                        })
                        return
                    }
                    let nowbackName = that.controlename.replace('Fan', '')
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == nowbackName.toUpperCase()) {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            console.log('same')
                                //if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'POLYGON') {
                            let data = {
                                layerNumber: that.nowLayNum(id),
                                uuid: that.model.nidusChoose.uuid
                            }
                            let info = that.brushManage.getInfo(data)
                                //image = info ? info.image : null
                            image = info ? info.orginimage : null
                        } else {
                            image = null
                        }
                    } else {
                        image = null
                    }
                } else {
                    //image = that.cornerstoneArray[id].moveAllElementData ? that.cornerstoneArray[id].moveAllElementData.image : null
                    image = that.cornerstoneArray[id].moveAllElementData ? that.cornerstoneArray[id].moveAllElementData.orginimage : null
                }
                that.chooseHU = that.model.getDicomValue(value.e.detail)
                that.freehand.creatPath(e.detail.startPoints.image, wh, image, lineWidth)
            }
        })

        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MouseDrag', function(value) {
            //console.log(value.e, 'MeasurementEndMeasurementEndMeasurementEnd', that.controlename)
            //console.log('aaaaaaaaaaa')
            if (that.controlename != "zoomFan" && that.controlename != "wlFan" && that.controlename != "restFan") {
                let sid = that.cornerstoneArray[id].sId
                if (!that.model.seriesInfo[sid].needAnno) {
                    return
                }
            }
            value.layerNumber = that.nowLayNum(id)
            let radius = that.cornerstoneTools_config.brush_config.radius // cornerstoneTools.brush.getConfiguration().radius
            let lineWidth = that.cornerstoneTools_config.brush_config.lineWidth
                //console.log(cornerstoneTools.brush.getConfiguration())
            let brushInfo = null
            let uuid = that.cornerstoneArray[id].moveAllElementData ? that.cornerstoneArray[id].moveAllElementData.uuid : ""
            if (that.controlename == "polygonFan" || that.controlename == "freehandFan") {
                if (that.model.nidusChoose) {
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        return
                    }
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == that.controlename || that.model.nidusChoose.toolType.imageAnnotationToolType == that.controlename.replace('Fan', '').toUpperCase()) {
                        //if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'polygonFan' || that.model.nidusChoose.toolType.imageAnnotationToolType == 'POLYGON') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            uuid = that.model.nidusChoose.uuid
                        }
                    }
                }
                //console.log(that.findHU(value.e.detail), value.e.detail.currentPoints.image)
                console.log(value.layerNumber, uuid)
                let point = value.e.detail.currentPoints.image //that.model.findHU(value.e.detail, that.cornerstoneTools_config.polygon_config, that.chooseHU) || value.e.detail.currentPoints.image

                //let imageAll = new Image()
                //imageAll.onload = function() {
                let brushInfo = that.brushManage.creatBrush(value.layerNumber, that.freehand.drawPath(point), uuid, that.cornerstoneArray[id].sId, {
                    w: value.e.detail.image.width,
                    h: value.e.detail.image.height
                })
                brushInfo.toolType = that.tooltype
                brushInfo.layerNumber = value.layerNumber
                brushInfo.type = 'brush'
                brushInfo.imageAnnotationId = that.tooltype.imageAnnotationId
                brushInfo.imageAnnotationToolId = that.tooltype.id
                brushInfo.imageAnnotationToolType = that.tooltype.type
                brushInfo.imageAnnotationType = that.tooltype.imageAnnotation
                brushInfo.show = true
                that.cornerstoneArray[id].moveAllElementData = brushInfo
                that.updateAllCanvas(that.cornerstoneArray[id].sId)
                    // }
                    //imageAll.src = that.freehand.drawPath(point).src

                //cornerstone.updateImage(that.cornerstoneArray[id].element)
                return
            }

            if (that.controlename == "regionpaintFan") {
                if (that.model.nidusChoose) {
                    //console.log(that.model.nidusChoose.toolType.imageAnnotationToolType)
                    if (that.model.nidusChoose.toolType.imageAnnotationToolType == 'regionpaintFan' || that.model.nidusChoose.toolType.imageAnnotationToolType == 'REGION_PAINT') {
                        if (that.model.nidusChoose.toolType.imageAnnotation == that.tooltype.imageAnnotation) {
                            uuid = that.model.nidusChoose.uuid
                        }
                    }
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        return
                    }
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        return
                    }
                }
                //console.log(that.findHU(value.e.detail), value.e.detail.currentPoints.image)
                console.log(value.e.detail.image)
                let brushInfo = that.brushManage.setBrush(value.layerNumber, value.e.detail.currentPoints.image, radius, {
                    w: value.e.detail.image.width,
                    h: value.e.detail.image.height
                }, uuid, that.cornerstoneArray[id].sId)
                brushInfo.toolType = that.tooltype
                brushInfo.layerNumber = value.layerNumber
                brushInfo.type = 'brush'
                brushInfo.imageAnnotationId = that.tooltype.imageAnnotationId
                brushInfo.imageAnnotationToolId = that.tooltype.id
                brushInfo.imageAnnotationToolType = that.tooltype.type
                brushInfo.imageAnnotationType = that.tooltype.imageAnnotation
                brushInfo.show = true
                that.cornerstoneArray[id].moveAllElementData = brushInfo
                that.updateAllCanvas(that.cornerstoneArray[id].sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)
                return
            }
            that.model.controlStauts.delete = true
            if (that.app.parpam['type'] == 'preview' && that.model.nidusChoose) {
                that.model.nidusChoose.bid = that.model.nidusChoose.uuid
            }
            if (that.controlename == 'brushFan' || that.controlename == 'earseFan') {
                if (!that.model.nidusChoose) {
                    return
                } else {
                    if (that.model.nidusChoose.sId != that.cornerstoneArray[id].sId) {
                        return
                    }
                }
            }
            //console.log('brushFan', that.controlename)
            if (that.controlename == 'brushFan') {
                // that.nowImage =
                uuid = that.model.nidusChoose ? that.model.nidusChoose.uuid : ""
                if (that.model.nidusChoose.toolType.imageAnnotationToolType == "MAGIC_STICK_SINGLE") {
                    uuid = that.model.nidusChoose ? that.model.nidusChoose.bid : ""
                }
                brushInfo = that.brushManage.setBrush(value.layerNumber, value.e.detail.currentPoints.image, radius, {
                    w: value.e.detail.image.width,
                    h: value.e.detail.image.height
                }, uuid, that.cornerstoneArray[id].sId)
                that.updateAllCanvas(that.cornerstoneArray[id].sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)

                //that.gotoLayer(that.nowLayNum())
                // that.drawInfo.setBrush(value.layerNumber, value.e.detail.currentPoints.image, radius, value.e.detail.image.width)
            }
            if (that.controlename == 'earseFan') {
                console.log('earseFan', '====================', value.layerNumber, uuid)
                uuid = that.model.nidusChoose ? that.model.nidusChoose.uuid : ""
                if (that.model.nidusChoose.toolType.imageAnnotationToolType == "MAGIC_STICK_SINGLE") {
                    uuid = that.model.nidusChoose ? that.model.nidusChoose.bid : ""
                }
                brushInfo = that.brushManage.removeBrush(value.layerNumber, value.e.detail.currentPoints.image, radius, {
                    w: value.e.detail.image.width,
                    h: value.e.detail.image.height
                }, uuid)
                that.updateAllCanvas(that.cornerstoneArray[id].sId)
                    //cornerstone.updateImage(that.cornerstoneArray[id].element)
            }

            that.cornerstoneArray[id].moveAllElementData = brushInfo
        })

        //标注移除
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MeasurementRemove', function(value) {
            //console.log(that.model.controlStauts.delete)
            if (!that.model.controlStauts.delete) {
                return
            }
            console.log(value, 'MeasurementRemoveMeasurementRemoveMeasurementRemoveMeasurementRemove', that.cornerstoneArray[id].moveAllElementData)
            if (value.id) {
                that.endDone(value, 0)
            }
        })
        ES.selctorDoc(window).on('mousemove', function(e) {
            //console.log(that.controlename)
            let cid = ES.selctorDoc(e.target).parent().attr('id')
                //console.log(cid)
            if (cid) {
                cid = cid.replace('ct', '') * 1
                if (that.cornerstoneArray[cid]) {
                    that.mousemoveView = that.cornerstoneArray[cid].getViewport()
                    that.mousePos = {
                        x: e.pageX,
                        y: e.pageY
                    }
                } else {
                    that.mousemoveView = null
                    that.mousePos = null
                }
            }
            if (that.controlename == 'quickselectFan') {
                if (cid != null) {
                    that.makeCicle()
                }
            } else if (that.controlename == 'brushFan' || that.controlename == 'earseFan') {
                if (cid != null) {
                    console.log('================')
                    that.makeBrushCicle()
                }
            } else {
                that.dom.find('.cicle').hide()
            }

        })
    }

    alignmentAdd(value, id, who) {
        value.layerNumber = this.nowLayNum(id)
        this.drawInfo.setInfo(value)
        value.show = true
        value.toolType = this.tooltype
        value.id = value.uuid = Tool.guid()
        value.type = this.controlename.replace('Fan', '')
        value.imageAnnotationId = value.toolType.imageAnnotationId
        value.imageAnnotationToolId = value.toolType.id
        value.imageAnnotationToolType = value.toolType.type
        value.imageAnnotationType = value.toolType.imageAnnotation
        value.sId = this.cornerstoneArray[id].sId
        if (value.e) {
            value.pointA = [{
                start: {
                    x: value.e.detail.currentPoints.image.x,
                    y: value.e.detail.currentPoints.image.y
                }
            }]
        } else {
            value.pointA = [{}]
        }
        console.log(value)
        value.handles = {
            start: {},
            end: {}
        }
        if (!this.nodeInfo) {
            this.nodeInfo = {}
        }
        if (!this.nodeInfo[value.layerNumber]) {
            this.nodeInfo[value.layerNumber] = []
        }
        this.nodeInfo[value.layerNumber].push({
            layerNumber: value.layerNumber,
            type: value.type,
            nodeInfo: value,
            sId: value.sId,
            show: true
        })
        this.sequencelist.addNode(value, true)
        this.event._dispatch('ctcornerstone.addNode', value)
    }
    cobbAdd(value, layerNumber, id) {
        let typeC = this.controlename.replace('Fan', '')
        if (!value.uuid) {
            this.setSpliceUUID(value, 'length', value.id, id)
        }
        this.drawInfo.setInfo(value)
        value.setDataType = 'number'
        value.toolType = this.tooltype
        value.layerNumber = layerNumber
        value.type = typeC
        value.lineA = [value.handles]
        value.show = true
            //value.sId=that.cornerstoneArray[id].sId
        this.sequencelist.addNode(value, true)
        if (!this.nodeInfo) {
            this.nodeInfo = {}
        }
        if (!this.nodeInfo[layerNumber]) {
            this.nodeInfo[layerNumber] = []
        }
        this.nodeInfo[layerNumber].push({
            layerNumber: layerNumber,
            type: value.tooltype,
            nodeInfo: value,
            sId: value.sId,
            show: true
        })
        this.event._dispatch('ctcornerstone.addNode', value)
    }
    makeCicle() {
        if (!this.mousemoveView) {
            return
        }
        let radius = this.cornerstoneTools_config.quickselect_config.deviation
        let showRadius = Math.ceil(radius * this.mousemoveView.scale)
        this.dom.find('.cicle').hide()
        this.dom.find('.cicle').css({
            "width": showRadius,
            "height": showRadius,
            'border-radius': showRadius,
            'broder': '1px dashed #000',
            "background": 'transparent',
            "transform": "translate(" + (this.mousePos.x - showRadius / 2) + "px," + (this.mousePos.y - showRadius / 2) + "px)",
            "display": "block"
        })
    }
    makeBrushCicle() {
        if (!this.mousemoveView) {
            return
        }
        let radius = this.cornerstoneTools_config.brush_config.radius
        let showRadius = Math.ceil(radius * this.mousemoveView.scale)
        this.dom.find('.cicle').hide()
        this.dom.find('.cicle').css({
            "width": showRadius,
            "height": showRadius,
            'border-radius': showRadius,
            'broder': '0',
            "background": '#f00',
            "transform": "translate(" + (this.mousePos.x - showRadius / 2) + "px," + (this.mousePos.y - showRadius / 2) + "px)",
            "display": "block"
        })
    }

    //为了快速选择做的玩意
    updateAllCanvas(sId) {
        if (this.model.nidusChoose) {
            //console.log(this.model.nidusChoose)
            let backId = this.model.nidusChoose.bid || this.model.nidusChoose.uuid
            let dataVol = Math.floor(this.brushManage.getPixTotal(backId, this.model.nidusChoose.uuid) * this.model.seriesInfo[sId].volumeCal * 100)
            let calData = {
                id: backId,
                cal: "出血量:" + (dataVol / 100) + 'mm<sup>3</sup>'
            }
            this.sequencelist.upCal(calData)
        }
        for (let i = 0; i < this.sceen; i++) {
            if (this.cornerstoneArray[i] && this.cornerstoneArray[i].sId == sId) {
                cornerstone.updateImage(this.cornerstoneArray[i].element)
            }
        }
    }
    drawImg(brushInfoAll, value) {
        let aa = cornerstone.pixelToCanvas(value.element, {
            x: 0,
            y: 0
        })
        let allmove = cornerstone.getViewport(value.element)
        for (let bid in brushInfoAll) {
            if (brushInfoAll[bid].image) {

                let image = brushInfoAll[bid].image
                    /*if (bid == this.model.nidusChoose.bid) {
                        imge = this.brushManage.resetColor(brushInfoAll[bid].image)
                    } else {
                        imge = brushInfoAll[bid].image
                    }*/
                let w = brushInfoAll[bid].image.width
                let h = brushInfoAll[bid].image.height
                    /*if (value.image.rows > 1025 || value.image.columns > 1025) {
                        value.canvasContext.drawImage(image, 0, 0, image.width, image.height, aa.x, aa.y, image.width * allmove.scale, image.height * allmove.scale)
                    } else {*/
                value.canvasContext.drawImage(image, 0, 0)
                    //}
                    //value.canvasContext.drawImage(imge,0,0)
                    //console.log(imge,brushInfoAll[bid].image.width,brushInfoAll[bid].image.height,aa,allmove)
                    //}

            }
        }
    }
    drawNode(nodeA, value) {
        let all = 0
        let aa = cornerstone.pixelToCanvas(value.element, {
            x: 0,
            y: 0
        })
        let allmove = cornerstone.getViewport(value.element)


        for (var i = 0; i < nodeA.length; i++) {
            //console.log(nodeA[i].type)
            let ntype = nodeA[i].type
                //ctx.fillStyle = '#f00'
            switch (nodeA[i].type) {
                case "cobb":
                    ntype = 'length'
                    break
            }
            let drawneed = true
                //  console.log(nodeA[i].type)
            if (nodeA[i].type == 'alignment') {
                all = 1
                drawneed = false
            } else {
                let dataTool = cornerstoneTools.getToolState(value.element, ntype)
                if (dataTool) {
                    //  console.log(dataTool.data)
                    dataTool.data.map(function(item) {
                        // console.log(item, 'itemitem')
                        if (item.uuid == nodeA[i].nodeInfo.uuid) {
                            drawneed = false
                            all++
                        }
                    })
                }
            }

            if (this.model.nidusChoose) {
                if (nodeA[i].nodeInfo && (this.model.nidusChoose.uuid == nodeA[i].nodeInfo.uuid || this.model.nidusChoose.id == nodeA[i].nodeInfo.uuid)) {
                    let handles = nodeA[i].nodeInfo.handles
                    let ctx = value.canvasContext
                    ctx.lineWidth = 10
                    ctx.strokeStyle = '#f00';
                    ctx.beginPath();
                    ctx.mozImageSmoothingEnabled = false;
                    if (nodeA[i].type == 'cobb' || nodeA[i].type == 'alignment') {
                        if (nodeA[i].type == 'cobb' && nodeA[i].nodeInfo.lineA.length == 2) {
                            //console.log(nodeA[i].nodeInfo.lineA)
                            let spx = (nodeA[i].nodeInfo.lineA[0].handles.start.x + nodeA[i].nodeInfo.lineA[0].handles.end.x) / 2
                            let spy = (nodeA[i].nodeInfo.lineA[0].handles.start.y + nodeA[i].nodeInfo.lineA[0].handles.end.y) / 2
                            ctx.strokeRect(spx, spy, 2, 2)
                            this.dom.find('.' + value.element.id + ' .cal').html('cobb角' + Tool.calAngel(nodeA[i].nodeInfo.lineA[0].handles, nodeA[i].nodeInfo.lineA[1].handles))
                        }
                        if (nodeA[i].type == 'alignment') {
                            this.drawAlignment(value, nodeA[i], '#0f0', true)
                        }
                    } else if (handles){
                        console.log(handles, 'handleshandleshandles')
                        ctx.moveTo((handles.start.x * 1 + handles.end.x * 1) / 2, handles.start.y * 1 - 5)
                        ctx.lineTo((handles.start.x * 1 + handles.end.x * 1) / 2, handles.start.y * 1 - 2)
                        ctx.lineTo((handles.start.x * 1 + handles.end.x * 1) / 2 + 3, handles.start.y * 1 - 2)
                        ctx.lineTo((handles.start.x * 1 + handles.end.x * 1) / 2 + 3, handles.start.y * 1 - 5)
                        ctx.lineTo((handles.start.x * 1 + handles.end.x * 1) / 2, handles.start.y * 1 - 5)
                        ctx.stroke();
                    }
                } else {
                    if (nodeA[i].type == 'alignment') {
                        this.drawAlignment(value, nodeA[i], '#f00')
                    }
                }
            } else {
                if (nodeA[i].type == 'alignment') {
                    this.drawAlignment(value, nodeA[i], '#f00')
                }
            }

            //console.log(drawneed, all)
            //onsole.log(nodeA)
            /*if (nodeA[i].type == 'alignment') {
                ctx.mozImageSmoothingEnabled = false;
                nodeA[i].nodeInfo.pointA.map((itemPoint) => {
                    if (itemPoint.start) {
                        ctx.strokeRect(itemPoint.start.x, itemPoint.start.y, 3, 3)
                    }
                })
                ctx.stroke();
            }*/
            if (drawneed && nodeA[i].nodeInfo) {
                if (nodeA[i].type == 'cobb') {
                    nodeA[i].nodeInfo.lineA.map((item) => {
                        cornerstoneTools.addToolState(value.element, 'length', item)
                    })
                    return
                }
                cornerstoneTools.addToolState(value.element, nodeA[i].type, nodeA[i].nodeInfo)
                let num = this.app.local.get(nodeA[i].nodeInfo.uuid) ? this.app.local.get(nodeA[i].nodeInfo.uuid) * 1 : 1
                this.app.local.set(nodeA[i].nodeInfo.uuid, num + 1, true)
                cornerstoneTools[nodeA[i].type] && cornerstoneTools[nodeA[i].type].activate(value.element, 1);

                this.defaultFunction(this.controlename)
            }
        }

        if (all == 0 && nodeA.length != 0) {
            // console.log(this.controlename)
            this.defaultFunction(this.controlename)
        }
    }
    drawAlignment(value, nodeA, color, textshow) {
        let ctx = value.canvasContext
        ctx.font = 'bold 28px Arial';
        let numPos = 1
        ctx.lineWidth = 2
        ctx.strokeStyle = color;
        ctx.mozImageSmoothingEnabled = false;
        nodeA.nodeInfo.pointA.map((itemPoint) => {
            if (itemPoint.start) {
                ctx.strokeRect(itemPoint.start.x, itemPoint.start.y, 3, 3)
                if (textshow) {
                    ctx.fillStyle = "#0f0"
                    ctx.fillText(numPos, itemPoint.start.x + 5, itemPoint.start.y)
                }
            }
            numPos++
        })

        //ctx.stroke();
    }
}

//原型链一定要有的
module.exports = ctcornerstone;
