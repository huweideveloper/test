require("./cttool.less");
class ctcornerstone extends ctcornerstone_base {
    constructor(app, dom, value, addMore) {
        super(app, dom, value, addMore)
        this.html = require('./tpl.html')
        let Model = require("./cttool_model.js")
        this.model = new Model(this.app)
        this.drawInfo = require("./manager.js")
        try {
            this.hitArea = new createjs.Shape();
            this.hitArea.graphics.beginFill("#000").drawRect(0, 0, this.model._pathSize, this.model._pathSize);
        } catch (err) {
            console.log(err)
        }
        this.controlename = 'move'
        this.freehand = require("./freedhand.js")
            //console.log(this.freehand)
    }
    complete() {
        this.moduleLoad()
        this.tpLoad()
        if (location.href.includes('drapCanvasPro')) {
            document.getElementById("canvas_box").className = "drapCanvasPro"
            console.log(document.getElementById("canvas_box"), '我是dom')
        }
    }

    //加载缩略图和进度条模块
    tpLoad() {
        let thumbnailprogress = require("../thumbnailprogress/thumbnailprogress.js")
        this.tpControl = this.app.loadModule(thumbnailprogress, this.dom.find('#canvas_box .tp'))
        this.tpControl.model = this.model
        this.tpControl.event._addEvent('ThumbnailProgress.dragThumbnail', (value) => {

            this.moveBoX(value)
        })
        this.tpControl.event._addEvent('ThumbnailProgress.bgClick', (value) => {
            console.log(value)
            this.moveBoXLarge(value)
        })
        this.tpControl.event._addEvent('ThumbnailProgress.borClick', (value) => {
            this.stage.mouseX = this.model._vpCanvasInfo.width / 2
            this.stage.mouseY = this.model._vpCanvasInfo.height / 2
            this.scaleCanvas(value.x, value.y)
        })
        this.tpControl.event._addEvent('ThumbnailProgress.progress', (e) => {
            this.stage.mouseX = this.model._vpCanvasInfo.width / 2
            this.stage.mouseY = this.model._vpCanvasInfo.height / 2
            this.tpControl.progressPos.call(this, e.pageY)
        })

        this.tpControl.event._addEvent('ThumbnailProgress.changeImage', (value) => {
            this.setContainerPos(value.spos)
            this.model.nowImageLevel = value.level
            this.model.pathSize = value.pathSize
            this.handlerImageLoad()
        })
        this.tpControl.event._addEvent('ThumbnailProgress.scaleImage', (value) => {
            this.setContainerPos(value.spos)
            this.model.pathSize = value.pathSize
            this.scaleBox()
        })
    }
    initCT(totalImage, imageAddress, data) {
        this.model.serinfo = data.data
        this.model.orginImgSizes = data.data.segmentationInfo
        this.tpControl.initBreviaryImg()
            //this.initBreviaryImg()
        this.initImgCanvas()
        this.ctEvent()
    }

    //图片加载
    async loadImage(path, pos, bitmapPos) {
        if (path.lastIndexOf('undefined') != -1) {
            return
        }
        let image = new Image()
            // image.src = `proxyImg/images/real/${path}.jpg`
        image.src = path
        image.crossOrigin = "Anonymous"
        image.onload = e => {
            console.log(path.split("?")[0], bitmapPos)
            this.makeSingleBitmap(pos, e.target, bitmapPos)
        }
        image.onerror = e => {
            console.log('no path')
        }
    }
    makeSingleBitmap(pos, img, bitmapPos) {
        //console.log(this.model.imagePool[pos],pos,bitmapPos)
        if (!this.model.imagePool[pos]) {
            let bitmap = new createjs.Bitmap(img)
            this.model.imagePool[pos] = bitmap
            bitmap.hitArea = this.hitArea
            this.container.addChild(this.model.imagePool[pos])
        } else {
            this.model.imagePool[pos].image = img
        }
        this.model.imagePool[pos].x = bitmapPos.bitmapNumx * this.model._pathSize
        this.model.imagePool[pos].y = bitmapPos.bitmapNumy * this.model._pathSize
        this.model.imagePool[pos].scale = this.model._pathSize / this.model._section
        this.model.imagePool[pos].bx = bitmapPos.bitmapNumx
        this.model.imagePool[pos].by = bitmapPos.bitmapNumy
        this.renderStage()
            //this.stage.update()
    }
    queryImgs() {
        if (this.model.numberList.length == 0) {
            return
        }

        let numberList = []
        this.model.numberList.forEach(item => {
            let k = Object.keys(item)[0]
            if (k != "blank") {
                numberList.push(Number(k))
            }
        })
        let queryImgs = []
        console.log(this.model.numberList)
        console.log(numberList)
        if (numberList.length != 0) {
            this.event._dispatch('ctcornerstone.loadImage', {
                seriesInstanceUID: this.model.serinfo.seriesInstanceUID,
                fileType: "BIG_IMAGE",
                windowType: this.model.nowImageLevel,
                numberList
            })
        } else {
            this.makeImage({
                data: {
                    list: []
                }
            })
        }
    }
    makeImage(value) {
        let queryImgs = []

        for (let i = 0; i < value.data.list.length; i++) {
            let item = value.data.list[i]
            queryImgs[item.number] = item.urlWAN

            //.replace('http://proximadev.cn-sh2.ufileos.com', '/proxyImg') //做了图片代理，可以不做的，主要是觉得那个会增加损耗。所以不高兴用
        }
        this.model.numberList.forEach(item => {
            let k = Object.keys(item)[0]
            if (k != "blank") {
                let url = queryImgs[Number(k)]
                setTimeout(() => {
                    this.loadImage(url, item[k].i, item[k].bit)
                }, 60)
            } else {
                this.makeSingleBitmap(item[k].i, this.model.blank, item[k].bit)
            }
        })
    }

    //事件
    ctEvent() {
        let isScale = true
        this.stage.addEventListener("stagemousedown", e => {
            isScale = false
            if (e.nativeEvent.buttons == 2) {
                isScale = true
                return
            }
            this.dragOffset.x = this.stage.mouseX
            this.dragOffset.y = this.stage.mouseY
            if (this.controlename == "brushFan" || this.controlename == "earseFan") {
                if (!this.model.nidusChoose) {
                    isScale = true
                    this.app.alert.show({
                        title: ' ',
                        msg: '没有对应的病灶',
                        close: true
                    })
                    return
                }
            }
            if (e.nativeEvent.buttons == 1) {
                this.craetData()
            }
        })
        this.stage.addEventListener("stagemousemove", e => {
            let moveX = this.stage.mouseX - this.dragOffset.x
            let moveY = this.stage.mouseY - this.dragOffset.y
            this.dragOffset.x = this.stage.mouseX
            this.dragOffset.y = this.stage.mouseY
            if (e.nativeEvent.buttons == 2) {
                // console.log('aaaaaaaaaaaa', moveX, moveY)
                this.moveBoX({
                    moveX,
                    moveY
                })
            }
            if (isScale) return
            if (e.nativeEvent.buttons == 1) {
                switch (this.controlename.replace('Fan', '')) {
                    case "move":
                        this.moveBoX({
                            moveX,
                            moveY
                        })
                        break
                    case "freehand":
                        this.drawLine()
                        break
                    case "zoom":
                        //console.log('aaaaaaaaaaaa', moveX, moveY)
                        this.scaleCanvas(moveX, moveY)
                        break
                    case "brush":
                        this.editLine('add')
                        break
                    case "earse":
                        this.editLine('remove')
                        break
                }
            }
        })
        this.stage.addEventListener("stagemouseup", e => {
                isScale = true
                this.endDraw()
            })
            /*this.stage.addEventListener("stagemousemove", e => {
                if (!isScale) return
                this.dragOffset.x = this.stage.mouseX
                this.dragOffset.y = this.stage.mouseY
            })*/
    }
    setSequence(value, childrens) {
        //let that = this
        //console.log(childrens)
        this.nodeInfo = childrens.length != 0 ? {} : null
        let sData = value // [{ id: 1, imageAddress: this.baseData.imageAddress, totalImage: this.baseData.totalImage, major: 'master' }]
        console.log(childrens, '我是粗来的值==============', sData)
        sData.map((item) => {
            item.id = typeof item.id == 'object' ? item.id.series : item.id
            item.sequenceName = typeof item.sequenceName == 'object' ? item.sequenceName.series : item.sequenceName
            item.studyId = typeof item.studyId == 'object' ? item.studyId.series : item.studyId
        })
        childrens.map((item) => {
                //console.log(item)
                if (!this.nodeInfo[item.layerNumber]) {
                    this.nodeInfo[item.layerNumber] = []
                }
                if (!this.model.nidusComponentData[item.id]) {
                    this.model.nidusComponentData[item.id] = {}
                }
                let daa = {}
                    //daa.nodeInfo.uuid = item.uuid
                daa.layerNumber = item.layerNumber
                    //console.log('+++++++++++++++')
                daa.sId = item.sId
                daa.type = item.type
                daa.uuid = item.uuid
                daa.show = true
                daa.nodeInfo = {
                    uuid: item.uuid,
                    id: item.id
                }
                console.log(item, 'item')
                this.nodeInfo[item.layerNumber].push(daa)
                this.drawInfo.setInfo(item)
                if (item.annotationItemResultList) {
                    item.annotationItemResultList.map((res) => {
                        this.model.nidusComponentData[item.id][res.annotationItemId] = res
                    })
                }
                if (item.orginannotationItemResultList) {
                    this.model.nidusComponentData[item.id].orginannotationItemResultList = item.orginannotationItemResultList
                }
                this.model.nidusComponentData[item.id].doctorName = item.doctorName
                this.model.nidusComponentData[item.id].imageRemark = item.imageRemark
            })
            //alert(1)
        this.sequencelist.setData(sData, childrens)
        this.drawNode(false)
        this.renderStage()
    }
    creatShape(type, borderColor) {
        let that = this
        let shape = new createjs.Shape()
        shape.graphics.beginStroke(borderColor ? "#0f0" : "#f00");
        shape.graphics.setStrokeStyle(this.cornerstoneTools_config['freehand_config'].lineWidth, "round", "round")
        shape.x = this.model.imageLeftPoint.x
        shape.y = this.model.imageLeftPoint.y
        shape.addEventListener("click", function(evt) {
            that.sequencelist.clickById({
                uuid: evt.target.uuid
            })
        })
        if (this.stage) {
            if (type) {
                this.stage.addChild(shape)
            }
        }
        console.log(this.stage)
        return shape
    }
    craetData() {
        switch (this.controlename.replace('Fan', '')) {
            case "freehand":
                this.drawData = this.model.nidusChoose ? this.drawInfo.getInfo(this.model.nidusChoose) : this.drawInfo.setInfo({
                    path: {},
                    uuid: null
                })

                //this.drawData.path()
                this.drawData.type = 'freehandline'
                this.drawData.setDataType = 'number'
                this.drawData.layerNumber = 1
                this.drawData.sId = this.model.serinfo.seriesInstanceUID
                this.drawData.imageAnnotationId = this.tooltype.imageAnnotationId
                this.drawData.imageAnnotationToolId = this.tooltype.id
                this.drawData.imageAnnotationToolType = this.tooltype.type
                this.drawData.imageAnnotationType = this.tooltype.imageAnnotation
                console.log(this.tooltype)
                this.drawData.toolType = this.tooltype
                if (!this.model.nidusChoose) {
                    let pos = this.model.calSaveXYPos({
                        x: this.stage.mouseX,
                        y: this.stage.mouseY
                    })
                    pos.father = null
                    pos.child = null
                    console.log(pos)
                    this.drawData.path[pos.x + '_' + pos.y] = pos
                    this.prePoint = pos
                        //console.log()
                    this.drawData.shape = this.creatShape(true, false)
                    let drawPos = this.model.calXYPos({
                        x: this.stage.mouseX,
                        y: this.stage.mouseY
                    })
                    this.drawData.shape.graphics.moveTo(drawPos.x, drawPos.y)
                    this.drawData.shape.uuid = this.drawData.uuid
                    this.drawData.show = true
                    this.renderStage(false)
                } else {
                    let drawPos = this.model.calSaveXYPos({
                        x: this.stage.mouseX,
                        y: this.stage.mouseY
                    })
                    this.prePoint = drawPos
                    let data = this.drawInfo.getInfo(this.model.nidusChoose)
                    let modelD = this.model.calGetMinDistance(data.path, drawPos)
                    data.shape.graphics.moveTo(modelD.x, modelD.y)
                    let drawPoss = this.model.calXYPos({
                        x: this.stage.mouseX,
                        y: this.stage.mouseY
                    })
                    data.shape.graphics.lineTo(drawPoss.x, drawPoss.y)
                }
                break
            case "brush":
                this.drawData = this.drawInfo.getInfo(this.model.nidusChoose)
                let drawPos = this.model.calSaveXYPos({
                    x: this.stage.mouseX,
                    y: this.stage.mouseY
                })
                let modelD = this.model.calGetMinDistance(this.drawData.path, drawPos)
                this.prePoint = drawPos
                this.drawData.shape.graphics.moveTo(modelD.x, modelD.y)
                let drawPoss = this.model.calXYPos({
                    x: this.stage.mouseX,
                    y: this.stage.mouseY
                })
                this.drawData.shape.graphics.lineTo(drawPoss.x, drawPoss.y)
                break
        }
    }
    drawLine() {
        let data = this.drawData
        let pos = this.model.calSaveXYPos({
            x: this.stage.mouseX,
            y: this.stage.mouseY
        })
        if (pos.x == this.prePoint.x && pos.y == this.prePoint.y) {
            return
        }
        let key = this.prePoint.x + '_' + this.prePoint.y
        if (!this.drawData.path[key].child) {
            this.drawData.path[key].child = pos.x + '_' + pos.y
            data.path[pos.x + '_' + pos.y] = pos
            pos.father = key
            pos.child = null
        } else {
            this.drawData.path[key].father = pos.x + '_' + pos.y
            data.path[pos.x + '_' + pos.y] = pos
            pos.child = key
            pos.father = null
        }
        /*&pos.father = this.prePoint.x + '_' + this.prePoint.y
        pos.child = null
        this.drawData.path[pos.father].child = pos.x + '_' + pos.y
        data.path[pos.x + '_' + pos.y] = pos*/
        this.prePoint = pos
        let drawPos = this.model.calXYPos({
            x: this.stage.mouseX,
            y: this.stage.mouseY
        })
        data.shape.graphics.lineTo(drawPos.x, drawPos.y)
        this.renderStage()
    }
    endDraw() {
        if (!this.drawData) {
            return
        }
        let data = {}
        let aa = this.model.returnNull(this.drawData.path)
        if (aa) {
            let drawPos = this.model.calShowXYPos(this.drawData.path[aa])
            this.drawData.shape.graphics.lineTo(drawPos.x, drawPos.y)
            this.renderStage()
        }
        for (let i in this.drawData) {
            data[i] = this.drawData[i]
        }
        console.log(this.drawData)
        if (!this.model.nidusChoose && this.drawData) {
            this.sequencelist.addNode(data)
            if (!this.nodeInfo) {
                this.nodeInfo = {}
            }
            if (!this.nodeInfo[1]) {
                this.nodeInfo[1] = []
            }
            this.nodeInfo[1].push({
                layerNumber: 1,
                type: data.tooltype,
                nodeInfo: data,
                sId: this.model.serinfo.seriesInstanceUID,
                show: true
            })
            this.event._dispatch('ctcornerstone.addNode', this.drawData)
        } else {
            console.log(this.drawData)
            this.event._dispatch('ctcornerstone.editNode', this.drawData)
        }
        this.drawData = null
        this.prePoint = null
    }
    editLine(type) {
        //console.log(this.model.nidusChoose.uuid)
        //console.log(data.shape)
        if (type == 'add') {
            this.drawLine()
        } else {
            this.drawData = this.drawInfo.getInfo(this.model.nidusChoose)
            let data = this.drawData
            this.drawData.shape.graphics.clear()
            this.drawData.shape.graphics.beginStroke("#f00");
            this.drawData.shape.graphics.setStrokeStyle(this.cornerstoneTools_config['freehand_config'].lineWidth, "round", "round")
            this.model.removeData(this.drawData.path, {
                x: this.stage.mouseX,
                y: this.stage.mouseY,
                d: this.cornerstoneTools_config['earse_config'].radius
            })
            this.reDrawShape(this.drawData.path, this.drawData.shape)
            this.renderStage()
        }
    }
    reDrawShape(path, shape) {
        for (var i in path) {
            let item = path[i]
            if (item.child) {
                let p0 = this.model.calShowXYPos(item)
                shape.graphics.moveTo(p0.x, p0.y)
                    //console.log(path[item.child], item.child, item)
                if (path[item.child]) {
                    let p1 = this.model.calShowXYPos(path[item.child])
                    shape.graphics.lineTo(p1.x, p1.y)
                }

            }
        }
    }

    //初始化场景
    initImgCanvas() {
        this.canvas = document.getElementById('canvas')
        let size = this.model.getCanvasSize()
        this.canvas.width = size.width
        this.canvas.height = size.height
        this.stage = new createjs.Stage(canvas)
        this.container = new createjs.Container();
        this.container.x = this.model.imageLeftPoint.x
        this.container.y = this.model.imageLeftPoint.y
        this.stage.addChild(this.container)
            //createjs.Ticker.setFPS(60)
        this.dragOffset = {
                x: 0,
                y: 0
            }
            //this.dragOffset = new createjs.Point()
            // 滚轮缩放
        window.onmousewhee = document.onmousewheel = event => {
                var delta = 0;
                if (!event) event = window.event;
                if (event.wheelDelta) { //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                    delta = event.wheelDelta / 120;
                    if (window.opera) delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
                }
                console.log(delta)
                if (delta) {
                    this.scaleCanvas("", delta)
                }
            }
            //console.log('handlerImageLoad')
        this.handlerImageLoad()
    }
    handlerImageLoad() {
        let leftTopX = Math.floor(-this.model.imageLeftPoint.x / this.model._pathSize) //获取格子的列下标 
        let leftTopY = Math.floor(-this.model.imageLeftPoint.y / this.model._pathSize) //获取格子的行下标
        leftTopX = leftTopX < 0 ? 0 : leftTopX
        leftTopY = leftTopY < 0 ? 0 : leftTopY
        let sx = Math.floor(this.model.imageLeftPoint.x % this.model._pathSize) //获取格子的x坐标
        let sy = Math.floor(this.model.imageLeftPoint.x % this.model._pathSize) //获取格子的y坐标

        this.orginImg = this.model._orginImgSizes[this.model.nowImageLevel]
        console.log(this.orginImg, "我是最新的倍数")
        this.tpControl.orginImg = this.orginImg
        let colnum = this.model._vpCanvasInfo.colnum
        let row = this.model._vpCanvasInfo.row
        let showNum = row * colnum
        this.model.numberList = []
            //console.log(this.model._vpCanvasInfo,'this.model._vpCanvasInfo')
            // this.container.clear()
            // console.log(leftTopX, leftTopY, this.model.imageLeftPoint.x, this.model.imageLeftPoint.y)
        for (let i = 0; i < showNum; i++) {
            let bitmapNumx = leftTopX + (i % colnum)
            let bitmapNumy = leftTopY + Math.floor(i / colnum)
                //用的那张图
            let back = this.model.backImageNumber({
                bitmapNumx,
                bitmapNumy
            })
            let obj = {}
            obj[back] = {
                i,
                bit: {
                    bitmapNumx,
                    bitmapNumy
                }
            }
            this.model.numberList.push(obj)
        }

        this.queryImgs()
        setTimeout(() => {
            this.tpControl.makeShowArea()
        }, 100)

        //this.makeShowArea()
        this.tpControl.changProgress()
    }

    //设置场景位置
    setContainerPos(pos) {
        this.model.imageLeftPoint.x = this.model.imageLeftPoint.x + pos.moveX
        this.model.imageLeftPoint.y = this.model.imageLeftPoint.y + pos.moveY
        this.container.x = this.model.imageLeftPoint.x
        this.container.y = this.model.imageLeftPoint.y
    }
    moveBoXLarge(pos) {
        this.setContainerPos(pos)
        console.log(this.model.imageLeftPoint, pos)
        let length = this.model.imagePool.length
        this.model.numberList = []
        let stx = -Math.floor(this.model.imageLeftPoint.x / this.model._pathSize)
        stx=stx<0?0:stx
        let sty = -Math.floor(this.model.imageLeftPoint.y / this.model._pathSize)
        sty=sty<0?0:sty
        for (let i = 0; i < length; i++) {
            let changeImage = true
            let bitmapNumx = stx-1+(i%this.model._vpCanvasInfo.colnum)
            let bitmapNumy = sty-1+Math.floor(i/this.model._vpCanvasInfo.colnum)
            let back = this.model.backImageNumber({
                bitmapNumx,
                bitmapNumy
            })
            let obj = {}
                //console.log({ bitmapNumx, bitmapNumy }, i)
            obj[back] = {
                i,
                bit: {
                    bitmapNumx,
                    bitmapNumy
                }
            }
            this.model.numberList.push(obj)
        }

        //console.log('aaaaaaaaaaaaaaa', this.model.numberList)
        this.queryImgs()
        this.tpControl.makeShowArea()
            //this.makeShowArea()
        this.drawNode(false)
        this.renderStage()
            //this.stage.update()
    }

    //移动
    moveBoX(pos) {
        this.setContainerPos(pos)
        console.log(this.model.imageLeftPoint, pos)
        let length = this.model.imagePool.length
        this.model.numberList = []
            //console.log(length)
        console.log(pos.moveX / this.model._pathSize)
        console.log(pos.moveY / this.model._pathSize)
        console.log(this.model._vpCanvasInfo)

        for (let i = 0; i < length; i++) {
            let changeImage = false
            let bitmapNumx = Math.round(this.model.imagePool[i].x / this.model._pathSize)
            let bitmapNumy = Math.round(this.model.imagePool[i].y / this.model._pathSize)
                //console.log(this.model.imagePool[i].x + this.container.x)
                //console.log(this.model._vpCanvasInfo.width + this.model._pathSize / 2)
                //console.log(this.model._vpCanvasInfo)
            if (this.model.imagePool[i].x + this.container.x + this.model._pathSize <= -this.model._pathSize / 2) {
                bitmapNumx += this.model._vpCanvasInfo.colnum
                changeImage = true
            }
            if (this.model.imagePool[i].x + this.container.x >= this.model._vpCanvasInfo.width + this.model._pathSize / 2) {
                bitmapNumx -= this.model._vpCanvasInfo.colnum
                changeImage = true
            }
            if (this.model.imagePool[i].y + this.container.y + this.model._pathSize < -this.model._pathSize / 2) {
                bitmapNumy += this.model._vpCanvasInfo.row
                changeImage = true
            }
            if (this.model.imagePool[i].y + this.container.y >= this.model._vpCanvasInfo.height + this.model._pathSize / 2) {
                bitmapNumy -= this.model._vpCanvasInfo.row
                changeImage = true
            }
            console.log(changeImage)
            if (changeImage) {
                let back = this.model.backImageNumber({
                    bitmapNumx,
                    bitmapNumy
                })
                let obj = {}
                    //console.log({ bitmapNumx, bitmapNumy }, i)
                obj[back] = {
                    i,
                    bit: {
                        bitmapNumx,
                        bitmapNumy
                    }
                }
                this.model.numberList.push(obj)
            }
        }
        //console.log('aaaaaaaaaaaaaaa', this.model.numberList)
        this.queryImgs()
        this.tpControl.makeShowArea()
            //this.makeShowArea()
        this.drawNode(false)
        this.renderStage()
            //this.stage.update()
    }

    //缩放
    scaleCanvas(moveX, moveY) {
        if (!moveY) {
            return
        }
        let changeNum = moveY < 0 ? -2 : 2

        //console.log('aaaaaa')
        if (this.model.nowImageLevel == '1x' && this.model._pathSize + changeNum < this.model._section - this.model._changeRange) {
            return
        }
        if (this.model.nowImageLevel == this.model._orginImgSizes.length + 'x' && this.model._pathSize + changeNum >= this.model._section + this.model._changeRange) {
            return
        }
        let cr = this.getColRow({
            x: this.model.imageLeftPoint.x,
            y: this.model.imageLeftPoint.y
        }, {
            x: this.stage.mouseX,
            y: this.stage.mouseY
        })
        let pos = {
            moveX: -cr.col * changeNum,
            moveY: -cr.row * changeNum
        }
        this.setContainerPos(pos)
        this.model.pathSize = this.model._pathSize + changeNum

        if (this.model._pathSize > this.model._section + this.model._changeRange) {
            //console.log('aaaaaaccc')
            this.model.pathSize = this.model._section - this.model._changeRange
            this.model.nowImageLevel = (this.model.nowImageLevel.replace('x', '') * 1 + 1) + "x"
            this.drawNode(true)
            this.handlerImageLoad()
            return
        }
        if (this.model._pathSize < this.model._section - this.model._changeRange) {
            //console.log('aaaaaaddd')
            this.model.pathSize = this.model._section + this.model._changeRange
            this.model.nowImageLevel = (this.model.nowImageLevel.replace('x', '') * 1 - 1) + "x"
            this.drawNode(true)
            this.handlerImageLoad()
            return
        }
        this.scaleBox()
    }
    scaleBox() {
        for (let i = 0; i < this.model.imagePool.length; i++) {
            this.model.imagePool[i].scale = this.model._pathSize / this.model._section
            this.model.imagePool[i].x = this.model._pathSize * this.model.imagePool[i].bx //Math.floor(num % this.orginImg.colnum)
            this.model.imagePool[i].y = this.model._pathSize * this.model.imagePool[i].by // Math.floor(num / this.orginImg.colnum)
        }
        this.tpControl.makeShowArea()
            //this.makeShowArea()
        this.tpControl.changProgress()
            //console.log('wwwwwwwwwwww')
        this.drawNode(true)
        console.log('scaleBox2')
        this.renderStage()
            //this.stage.update()
    }
    getColRow(screen, boxpos) {
        let col = Math.floor((boxpos.x - screen.x) / this.model._pathSize)
        let row = Math.floor((boxpos.y - screen.y) / this.model._pathSize)
        return {
            col,
            row
        }
    }
    resize() {
        let cw = ES.selctorDoc(window).box().clientWidth
        let ch = ES.selctorDoc(window).box().clientHeight - 60 - 64
        this.dom.find('.ctcornerstone').css({
            'width': cw
        })
        this.dom.find('.ctcornerstone .slist').css({
            'width': cw - 290 - 180
        })
        this.dom.find('.ctcornerstone .xulielist').css({
            'height': ch
        })
        this.dom.find('.ctcornerstone .info').css({
            'height': ch
        })
        this.dom.find('.ctcornerstone .nidus_content').css({
            'height': ch
        })
        this.dom.find('#canvas_box').css({
            width: this.model._vpCanvasInfo.width - 1,
            height: this.model._vpCanvasInfo.height
        })
        if (this.nidusControl) {
            this.nidusControl.resize()
        }
        if (this.nidusControlAll) {
            this.nidusControlAll.resize()
        }
    }
    close() {

    }

    //删除病症
    doneDelete(key, value) {
        console.log(key, value)
        this.stage.removeChild(value.shape)
        this.drawInfo.removeInfo(value)
        this.sequencelist.removeNode(value)
        this.nodeInfo[1] = this.nodeInfo[1].filter((item) => {
            return item.uuid != value.uuid
        })
        this.model.nidusChoose = null
        this.renderStage()
        this.event._dispatch('ctcornerstone.deleteNode', {
            backId: value.backId
        })
    }

    renderStage() {
        //console.log('wwww', this.nodeInfo)
        console.log('cttool.renderStage')
        this.event._dispatch('cttool.renderStage')
        this.stage.update()
    }

    //st代表是否要强制重新刷新
    drawNode(st) {
        console.log(this.nodeInfo)
        if (this.nodeInfo) {
            if (this.nodeInfo[1]) {
                this.nodeInfo[1].forEach((item) => {
                    item.uuid = item.uuid || (item.nodeInfo ? item.nodeInfo.uuid : "")
                    let datae = this.drawInfo.getInfo(item)
                    console.log(datae.shape)
                    if (datae) {
                        if (st && datae.shape) {
                            this.stage.removeChild(datae.shape)
                            datae.shape = null
                        }
                        if (item.show) {
                            if (!datae.shape) {
                                if (this.model.nidusChoose && this.model.nidusChoose.uuid == datae.uuid) {
                                    datae.shape = this.creatShape(true, true)
                                } else {
                                    datae.shape = this.creatShape(true, false)
                                }
                                datae.shape.uuid = item.uuid

                                // datae.shape = this.creatShape(true, false)
                                this.reDrawShape(datae.path, datae.shape)
                            } else {
                                datae.shape.x = this.model.imageLeftPoint.x
                                datae.shape.y = this.model.imageLeftPoint.y
                            }
                        }
                    }
                })
            }
        }
    }

    //tool
    freehandFan() {
        this.controlename = 'freehand'
    }
    movefun() {
        this.controlename = 'move'
    }
    zoomFan() {
        this.controlename = 'scale'
    }
    brushFan() {
        this.controlename = 'brush'
    }
    earseFan() {
        this.controlename = 'earse'
    }
    restFan() {

    }

}

//原型链一定要有的
module.exports = ctcornerstone;