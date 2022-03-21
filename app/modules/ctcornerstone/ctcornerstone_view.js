require("./ctcornerstone.less");

/**/
class ctcornerstone extends ctcornerstone_base {
    constructor(app, dom, value, addMore) {
        super(app, dom, value, addMore)
    }
    ctEvent(id, imageAddress, data, total) {
        let that = this

        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.ImageRendered', function(value) {
            if (that.model.seriesInfo[that.cornerstoneArray[id].sId]) {
                value.image.columnPixelSpacing = that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.columnPixelSpacing
                value.image.rowPixelSpacing = that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.rowPixelSpacing
            }
            if (that.model.seriesInfo[that.cornerstoneArray[id].sId]) {
                that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.column = value.image.columns
                that.model.seriesInfo[that.cornerstoneArray[id].sId].info.data.row = value.image.rows
            }
            if (!that.initFrist[id]) {
                that.initFrist[id] = true
                    //console.log(value.image)
                if ((value.image.rows > 1000 || value.image.columns > 1000) && value.image.rate < 1) {
                    that.defaultFunction("brushFanTe")
                    that.defaultFunction("")
                }
                that.event._dispatch('ctcornerstone.loadingfinish', {
                    sId: that.cornerstoneArray[id].sId
                })
            }
            //console.log(that.cornerstoneArray[id].sId,that.model.seriesInfo,'-----------------------')
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
                            ctx.strokeStyle = '#fff';
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
            let nowId = id // ES.selctorDoc(value.element).attr('id').replace('ct', '') * 1
            let timeD = value.xDate
            let layers = Tool.changeToName(imageAddress[value.currentCount * 1], 'jpg')
            //that.dom.find('.layer').html(String(value.currentCount * 1 + 1) + '/' + total)
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
            console.log(that.model.nidusChoose)
            if (that.nodeShow) {
                let aa = cornerstone.pixelToCanvas(value.element, {
                    x: 0,
                    y: 0
                })
                let allmove = cornerstone.getViewport(value.element)
                let brushInfoAll = that.brushManage.brushInfo[layers] ? that.brushManage.brushInfo[layers] : {}
                let brushNodes = {}
                for (let i in brushInfoAll) {
                    console.log(brushInfoAll[i].sId)
                    let index = brushInfoAll[i].sId.split('_').lastIndexOf(that.cornerstoneArray[id].sId)
                    if (index != -1 && brushInfoAll[i].show) {
                        brushNodes[i] = brushInfoAll[i]
                    }
                }
                console.log(brushNodes, 'brushNodesbrushNodesbrushNodesbrushNodes', brushInfoAll)
                for (let bid in brushNodes) {
                    if (brushNodes[bid].image) {
                        let image = brushInfoAll[bid].image
                            /*if (value.image.rows > 1025 || value.image.columns > 1025) {
                                console.log('wwwwwwwwwwwwwwwww')
                                value.canvasContext.drawImage(image, 0, 0, image.width, image.height, aa.x, aa.y, image.width * allmove.scale, image.height * allmove.scale)
                            } else {*/
                        value.canvasContext.drawImage(brushInfoAll[bid].image, 0, 0)
                            //}
                            //value.canvasContext.drawImage(brushNodes[bid].image, 0, 0)
                    }
                }
                let nodeA = (that.nodeInfo ? that.nodeInfo[layers] : [])
                    //console.log(value)
                nodeA = nodeA ? nodeA : []
                let fliterNodes = nodeA.filter((item) => {
                    return item.sId == that.cornerstoneArray[id].sId && item.show
                })
                console.log(that.model.nidusChoose, 'that.model.nidusChoosethat.model.nidusChoosethat.model.nidusChoose', fliterNodes)
                for (var i = 0; i < fliterNodes.length; i++) {
                    //console.log(nodeA[i])
                    let ctx = value.canvasContext
                    ctx.beginPath();
                    ctx.mozImageSmoothingEnabled = false;
                    ctx.lineWidth = Math.floor(value.image.columns / 512)
                    ctx.strokeStyle = '#f00';
                    ctx.fillStyle = '#f00';
                    let hashText = false
                    if (that.model.nidusChoose) {
                        if (that.model.nidusChoose.uuid == fliterNodes[i].nodeInfo.uuid || that.model.nidusChoose.id == fliterNodes[i].nodeInfo.uuid) {
                            ctx.strokeStyle = '#0ff';
                            ctx.fillStyle = '#0ff'
                            hashText = true
                        }
                    }
                    let handles = fliterNodes[i].nodeInfo.handles
                    switch (fliterNodes[i].type) {
                        case "rectangleRoi":
                            let w = Math.abs((handles.end.x * 1 - handles.start.x * 1))
                            let h = Math.abs((handles.end.y * 1 - handles.start.y * 1))
                            let minx = Math.min(handles.end.x * 1, handles.start.x * 1)
                            let miny = Math.min(handles.end.y * 1, handles.start.y * 1)
                            console.log(aa, allmove)
                                /*if (value.image.rows > 1025 || value.image.columns > 1025) {
                                    ctx.strokeRect(aa.x + minx * allmove.scale, aa.y + miny * allmove.scale, w * allmove.scale, h * allmove.scale)
                                } else {*/
                            console.log(minx)
                            ctx.strokeRect(minx, miny, w, h)
                                //}
                                //ctx.strokeRect(minx, miny, w, h)
                            ctx.stroke();
                            break
                        case "ellipticalRoi":
                            let rx = (handles.start.x * 1 + handles.end.x * 1) / 2
                            let ry = (handles.start.y * 1 + handles.end.y * 1) / 2
                            let r = Math.max(Math.abs((handles.end.x * 1 - handles.start.x * 1) / 2), Math.abs((handles.end.y * 1 - handles.start.y * 1) / 2))
                                /*if (value.image.rows > 1025 || value.image.columns > 1025) {
                                    ctx.arc(aa.x + rx * allmove.scale, aa.y + ry * allmove.scale, r * allmove.scale, 0, 2 * Math.PI, false);
                                } else {*/
                            ctx.arc(rx, ry, r, 0, 2 * Math.PI, false);
                            //}
                            //ctx.arc(rx, ry, r, 0, 2 * Math.PI, false);
                            ctx.stroke();
                            break
                        case "length":
                            ctx.moveTo(handles.start.x, handles.start.y)
                            ctx.lineTo(handles.end.x, handles.end.y)
                            ctx.stroke();
                            break
                        case "simpleAngle":
                            /*if (value.image.rows > 1025 || value.image.columns > 1025) {
                                ctx.moveTo(aa.x + handles.start.x * allmove.scale, aa.y + handles.start.y * allmove.scale)
                                ctx.lineTo(aa.x + handles.end.x * allmove.scale, aa.y + handles.end.y * allmove.scale)
                            } else {
                                ctx.moveTo(handles.start.x, handles.start.y)
                                ctx.lineTo(handles.end.x, handles.end.y)
                            }*/
                            ctx.moveTo(handles.start.x, handles.start.y)
                            ctx.lineTo(handles.middle.x, handles.middle.y)
                            ctx.lineTo(handles.end.x, handles.end.y)
                            ctx.stroke();
                            break
                        case "cobb":
                            fliterNodes[i].nodeInfo.lineA.map((item) => {
                                ctx.moveTo(item.handles.start.x, item.handles.start.y)
                                ctx.lineTo(item.handles.end.x, item.handles.end.y)
                            })
                            if (that.model.nidusChoose) {
                                if ((that.model.nidusChoose.uuid == fliterNodes[i].nodeInfo.uuid || that.model.nidusChoose.id == fliterNodes[i].nodeInfo.uuid) && fliterNodes[i].nodeInfo.lineA.length == 2) {
                                    that.dom.find('.ct' + id + ' .cal').html('cobb角' + Tool.calAngel(fliterNodes[i].nodeInfo.lineA[0].handles, fliterNodes[i].nodeInfo.lineA[1].handles))
                                }
                            }
                            ctx.stroke();
                            break
                        case "alignment":
                            console.log(fliterNodes[i].nodeInfo.pointA, 'fliterNodes[i].nodeInfo.pointAfliterNodes[i].nodeInfo.pointA')
                            ctx.font = 'bold 28px Arial';
                            let numPos = 1
                            fliterNodes[i].nodeInfo.pointA.map((iPoint) => {
                                if (iPoint.start) {
                                    ctx.fillRect(iPoint.start.x, iPoint.start.y, 3, 3)
                                    if (hashText) {
                                        ctx.fillText(numPos, iPoint.start.x + 5, iPoint.start.y);
                                    }
                                }
                                numPos++
                            })
                            ctx.stroke();
                            break
                    }
                }
            }
            if (that.changeLayeIdTime == null) {
                that.cornerstoneArray[id].progress.setPosBar(that.nowLayNum(id))
            }
        })

        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.click', function(value) {
            console.log(that.controlename, value.e.detail, '=======')
            if (!that.controlename|| that.controlename == "zoomFan" || that.controlename == "wlFan" || that.controlename == "restFan") {
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
                            that.sequencelist.clickById({
                                uuid: backId
                            })
                            return
                        }
                    }
                    if (nodeInfo.pointA) {
                        let nx = [100000, 0]
                        let ny = [100000, 0]
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

        })

        //bursh以外的标注事件
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.ModifiedFinsh', function(value) {

        })

        //获取标注信息
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MeasurementEnd', function(value) {
            //console.log(value)

        })

        //bursh移动侦听
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.brushDown', function(value) {

        })
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MouseDrag', function(value) {
            //console.log(value.e, 'MeasurementEndMeasurementEndMeasurementEnd')

        })

        //标注移除
        this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MeasurementRemove', function(value) {

        })
    }
    setbrush(value) {
        console.log(value, '')
        if (value.imglist.length == 0) {
            this.event._dispatch('ctcornerstone.brushfirstload')
            return
        }
        let that = this
        let length = value.imglist.filter((item) => {
            return item
        }).length
        let num = 0
        let allload = 0
        for (let i = 0; i < value.imglist.length; i++) {
            if (value.imglist[i]) {
                if (num == 0) {
                    num = i
                }
                /*console.log(num,Math.floor(length / 2))
                if (num == Math.floor(length / 2)) {
                    this.sequencelist.setLayerInfo(value, num)
                }*/
                setTimeout(function() {
                    let img = new Image()
                    img.id = i
                    img.crossOrigin = '';
                    img.onload = function() {
                        allload++
                        that.brushManage.creatNewImage(this, value, {
                            width: this.width,
                            height: this.height
                        }, this.id)
                        if (allload == value.imglist.length) {
                            let dataVol=Math.floor(that.brushManage.getPixTotal(value.id)*that.model.seriesInfo[value.sId].volumeCal*100)
                            let calData={id:value.id,cal:"出血量:"+(dataVol/100)+'mm<sup>3</sup>'}
                            that.sequencelist.upCal(calData)
                            that.event._dispatch('ctcornerstone.brushfirstload')
                            that.gotoLayer(that.nowLayNum(), value.sId)
                        }
                    }
                    img.onerror = function() {
                        allload++
                        if (allload == value.imglist.length) {
                            that.event._dispatch('ctcornerstone.brushfirstload')
                            that.gotoLayer(that.nowLayNum(), value.sId)
                        }
                    }
                    img.src = value.imglist[i]
                }, 300)
            } else {
                allload++
                if (allload == value.imglist.length) {
                    that.event._dispatch('ctcornerstone.brushfirstload')
                    that.gotoLayer(that.nowLayNum(), value.sId)
                }
            }
        }
        this.sequencelist.setLayerInfo(value, num)
            //this.addVlaue = value
    }
}

//原型链一定要有的
module.exports = ctcornerstone;
