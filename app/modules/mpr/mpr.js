require("./mpr.less")
class progress extends Interstellar.moduleBase {
  constructor(app, value, api, addMode) {
    super(app, value, api, addMode)
    this.html = require('./tpl.html')
    this.name = 'mpr'
    this.screen = 3
    let imageS = require('./makeJPG.js')
    this.modelImage = new imageS()
    this.imageList
    require.ensure("../../utils/cornerstone_class.js", () => {  
      this.class_c = require("../../utils/cornerstone_class.js")
    })
    this.cornerstoneArray = new Array(3)
    this.crossArray = new Array(3)
    console.log(this.initDate.info)
    let info = this.initDate.info.info.data
    window.targetInfo = {
      wc: info.firstWindowCenter,
      ww: info.firstWindowWidth,
      columnPixelSpacing: info.pixelSpacing[0],
      rowPixelSpacing: info.pixelSpacing[1]
    }
    if (this.initDate.info.people[1] && this.initDate.info.people[2]) {
      window.depth = Math.abs(this.initDate.info.people[1].imagePositionPatient[2] - this.initDate.info.people[2].imagePositionPatient[2])
    } else {
      window.depth = info.pixelSpacing[0]
    }
    this.crossline = require('../crossline/crossline.js')
  }
  complete() {
    this.dom.find('.close_btn').on('click', () => {
      this.close()
    })
  }
  openS(value, nodeInfo, brush) {
    this.dom.show()
    this.modelImage.imageList(value)
    this.nodeInfo = nodeInfo
    this.brushManage = brush
    this.modelImage.event._addEvent('makeJPG.finish', () => {
      this.app.loading.hide()
      this.xUrl = this.modelImage.xUrl
      this.yUrl = this.modelImage.yUrl
      this.zUrl = this.modelImage.zUrl
     // console.log(this.xUrl)
      this.point = { x: Math.floor(this.modelImage.width / 2), y: Math.floor(this.modelImage.height / 2), z: Math.floor(this.modelImage.zUrl.length / 2) }
      this.loadAll()
    })
    //this.don
  }
  loadAll() {
    this.nowWWC = []
    this.loadSing(0, this.zUrl, 'z')
    this.loadSing(1, this.yUrl, 'y')
    this.loadSing(2, this.xUrl, 'x')
  }
  loadSing(id, xy, type) {
    let imageAddress = xy
    let box = this.dom.find('#cb' + id).box()
    let that = this
    let firse = false
    if (this.modelImage.type == 'jpg') {
      let max = this.initDate.info.info.data.firstWindowCenter + this.initDate.info.info.data.firstWindowWidth / 2
      let min = this.initDate.info.info.data.firstWindowCenter - this.initDate.info.info.data.firstWindowWidth / 2
      let mindata = this.initDate.info.info.wwc.low * 1
      let range = this.initDate.info.info.wwc.hight * 1 - this.initDate.info.info.wwc.low * 1
      let minS = 255 * (min - mindata) / range
      let maxS = 255 * (max - mindata) / range
      //console.log(minS, maxS)
      this.nowWWC[id] = { c: (minS + maxS) / 2, w: (maxS - minS) }
    }
    this.crossArray[id] = this.app.loadModule(this.crossline, this.dom.find('.cb' + id + ' .line'))
    this.crossArray[id].type = type
    this.crossArray[id].setPos({ x: 0, y: 0 })
    this.crossArray[id].setYHeight(box.clientHeight)
    this.crossArray[id].event._addEvent('crossline.move', () => {
      this.crossmove = true
      if (this.cornerstoneArray[id]) {
        //console.log(this.crossArray[id].nowpos, this.cornerstoneArray[id].getViewport(), this.dom.find('#cb' + id).box(), type)
        this.changePOint(this.crossArray[id].nowpos, this.cornerstoneArray[id].getViewport(), this.dom.find('#cb' + id).box(), type)
      }
    })
    this.crossArray[id].event._addEvent('crossline.mouseup', () => {
      this.crossmove = false
    })
    this.cornerstoneArray[id] = new this.class_c({
      element: this.dom.find('#cb' + id).dom[0].dom,
      totalImage: xy.length,
      imageAddress: xy,
      index: 0,
      type: "JPG"
    })
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.cornerstonetoolsmousemove', function (value) { })
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.ImageRendered', function (value) {
      // console.log(imageAddress[value.currentCount * 1],'===========')
      let who = ES.selctorDoc(value.element).parent()
      let nowId = ES.selctorDoc(value.element).attr('id').replace('cb', '') * 1
      let layers = imageAddress[value.currentCount * 1].match(/\d{1,}/g)[0] * 1 + 1 //Tool.changeToName(imageAddress[value.currentCount * 1], 'jpg')
      that.dom.find('.cb' + id + ' .layer').html(layers + '/' + xy.length)
      that.dom.find('.cb' + id + ' .sc').html(that.cornerstoneArray[id].getViewport().scale.toFixed(2))
      if (firse) {
        that.point[type] = layers
      } else {
        let nowVO = that.cornerstoneArray[id].getViewport().voi
        if (that.nowWWC[id]) {
          if (nowVO.windowCenter != that.nowWWC[id].c || nowVO.windowWidth != that.nowWWC[id].w) {
            that.lungWindown(that.nowWWC[id].c, that.nowWWC[id].w, id)
          }
        }
        firse = true
      }
      if (!that.crossmove) {
        that.renderXYZ()
      }
      //console.log(that.nowWWC[id], 'that.nowWWC[id]that.nowWWC[id]that.nowWWC[id]', nowVO)

      if (type == 'z') {
        let aa = cornerstone.pixelToCanvas(value.element, { x: 0, y: 0 })
        let allmove = cornerstone.getViewport(value.element)
        let brushInfoAll = that.brushManage.brushInfo[layers] ? that.brushManage.brushInfo[layers] : {}
        let brushNodes = {}
        for (let i in brushInfoAll) {
          if (brushInfoAll[i].sId == that.sId) {
            brushNodes[i] = brushInfoAll[i]
          }
        }
        for (let bid in brushNodes) {
          if (brushNodes[bid].image) {
            let image = brushInfoAll[bid].image
            value.canvasContext.drawImage(brushInfoAll[bid].image, 0, 0)
          }
        }
        let nodeA = (that.nodeInfo ? that.nodeInfo[layers] : [])
        //console.log(value)
        nodeA = nodeA ? nodeA : []
        let fliterNodes = nodeA.filter((item) => {
          return item.sId == that.sId
        })
        for (var i = 0; i < fliterNodes.length; i++) {
          let ctx = value.canvasContext
          ctx.beginPath();
          ctx.mozImageSmoothingEnabled = false;
          ctx.lineWidth = Math.floor(value.image.columns / 512)
          ctx.strokeStyle = '#f00';
          if (that.chooseNidus) {
            if (that.chooseNidus.uuid == fliterNodes[i].nodeInfo.uuid || that.chooseNidus.id == fliterNodes[i].nodeInfo.uuid) {
              ctx.strokeStyle = '#0ff';
            }
          }
          let handles = fliterNodes[i].nodeInfo.handles
          switch (fliterNodes[i].type) {
            case "rectangleRoi":
              let w = Math.abs((handles.end.x - handles.start.x))
              let h = Math.abs((handles.end.y - handles.start.y))
              let minx = Math.min(handles.end.x, handles.start.x)
              let miny = Math.min(handles.end.y, handles.start.y)
              ctx.strokeRect(minx, miny, w, h)
              ctx.stroke();
              break
            case "ellipticalRoi":
              let rx = (handles.start.x + handles.end.x) / 2
              let ry = (handles.start.y + handles.end.y) / 2
              let r = Math.max(Math.abs((handles.end.x - handles.start.x) / 2), Math.abs((handles.end.y - handles.start.y) / 2))
              //ctx.ellipse(rx, ry, w / 2, h / 2, angle, 0, 2 * Math.PI);
              ctx.arc(rx, ry, r, 0, 2 * Math.PI, false);
              ctx.stroke();
              break
            case "length":
              ctx.moveTo(handles.start.x, handles.start.y)
              ctx.lineTo(handles.end.x, handles.end.y)
              ctx.stroke();
              break
            case "simpleAngle":
              ctx.moveTo(handles.start.x, handles.start.y)
              ctx.lineTo(handles.middle.x, handles.middle.y)
              ctx.lineTo(handles.end.x, handles.end.y)
              ctx.stroke();
              break
          }
        }
      }
    })
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.ModifiedFinsh', function (value) { })
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MeasurementEnd', function (value) { })
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.brushDown', function (value) { })

    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.click', function (value) { })
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.mousedown', function (value) { })

    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MouseDrag', function (value) { })

    //标注移除
    this.cornerstoneArray[id].event._addEvent('Cornerstone_Class.MeasurementRemove', function (value) { })
  }
  lungWindown(c, w, id) {
    //console.log(c, w)
    if (c == null || w == null) {
      c = 128 //this.cornerstoneArray[this.choosescreen].colcDefault
      w = 256 //this.cornerstoneArray[this.choosescreen].colwDefault
    }
    this.nowWWC[id] = {
      c: c,
      w: w
    }
    if (!this.cornerstoneArray[id]) {
      return
    }

    this.cornerstoneArray[id].lungWindown(c, w);
    this.nowWWC[id] = {
      c: this.cornerstoneArray[id].getViewport().voi.windowCenter,
      w: this.cornerstoneArray[id].getViewport().voi.windowWidth
    } //this.cornerstoneArray[this.choosescreen].getViewport()
  }
  close() {
    //this.dom.html('')
    this.modelImage.clearAllData()
    this.xUrl = this.yUrl = this.zUrl = null
    for (let i = 0; i < 3; i++) {
      if (this.cornerstoneArray[i]) {
        this.dom.find('.cb' + i + ' .line').remove()
        this.cornerstoneArray[i].close()
        this.cornerstoneArray[i] = null
        //console.log('aaaaa')
        //this.dom.find('.cb' + i + ' .line').remove()
        // this.dom.find('.cb' + i).append('<div class="line"></div>')
      }
    }
    //this.bin = null
    this.event._dispatch('mpr.closeAll')
  }
  defaultFunction(name) {
    let funName = name
    if (funName != "restFan" && funName != "clearFan" && funName != "resizeCon" && funName != "wlFan" && funName != 'zoomFan') {
      funName = ""
    }
    for (let i = 0; i < 3; i++) {
      if (this.cornerstoneArray[i]) {
        eval('this.cornerstoneArray[i].' + funName + '()')
      }
    }
  }
  renderXYZ() {
    let atype = ['z', 'y', 'x']
    for (let i = 0; i < 3; i++) {
      let layer = this.dom.find('.cb' + i + ' .layer').html().split('/')[0]
      // console.log(layer)
      if (layer) {
        //console.log(this.point[atype[i]])
        if (layer != this.point[atype[i]]) {
          //console.log('===')
          this.cornerstoneArray[i].funcNodule(this.point[atype[i]])
        }
      }

      let box = this.dom.find('#cb' + i).box()
      let getViewport = this.cornerstoneArray[i].getViewport()
      //console.log(cornerstone.pixelToCanvas(this.cornerstoneArray[id].element,getViewport.translation))
      if (atype[i] == 'z') {
        this.crossArray[i].setPos(this.returnXY({ x: this.point.x, y: this.point.y }, getViewport, box))
      }
      if (atype[i] == 'y') {
        let ratex = window.depth / window.targetInfo.columnPixelSpacing
        this.crossArray[i].setPos(this.returnXY({ x: this.point.x, y: (this.point.z - 1) * ratex }, getViewport, box))
      }
      if (atype[i] == 'x') {
        let ratey = window.depth / window.targetInfo.rowPixelSpacing
        this.crossArray[i].setPos(this.returnXY({ x: this.point.y, y: (this.point.z - 1) * ratey }, getViewport, box))
      }
    }
  }
  changePOint(point, getViewport, box, type) {
    let stPos = this.getStartPos(getViewport, box)
    let x = Math.floor((point.x - stPos.x) / getViewport.scale)
    let y = Math.floor((point.y - stPos.y) / getViewport.scale)
    let rate = type == 'y' ? (window.depth / window.targetInfo.rowPixelSpacing) : (window.depth / window.targetInfo.columnPixelSpacing)
    rate = rate < 1 ? 1 : rate
    switch (type) {
      case 'z':
        this.point.x = x
        this.point.y = y
        break
      case 'y':
        this.point.x = x
        this.point.z = Math.floor(y / rate)
        break
      case 'x':
        this.point.y = x
        this.point.z = Math.floor(y / rate)
        break
    }
    this.renderXYZ()
  }
  getStartPos(getViewport, box) {
    let orw = getViewport.displayedArea.brhc.x
    let orh = getViewport.displayedArea.brhc.y
    let x = 0
    let y = 0
    if (orw / orh > box.clientWidth / box.clientHeight) {
      y = (box.clientHeight - box.clientWidth * orh / orw) / 2
    } else {
      x = (box.clientWidth - box.clientHeight * orw / orh) / 2
    }
    return { x, y }
  }
  returnXY(point, getViewport, box) {
    let stPos = this.getStartPos(getViewport, box)
    //console.log(stPos,'stPosstPosstPosstPos',getViewport, box,point)
    let x = Math.floor(stPos.x + (getViewport.translation.x + point.x) * getViewport.scale)
    let y = Math.floor(stPos.y + (getViewport.translation.y + point.y) * getViewport.scale)
    //console.log(x, y)
    stPos = null
    return { x, y }
  }
  resize(w, h) {
    this.dom.find('#cb0').css({ width: (w / 2 - 2), height: h - 2 })
    this.dom.find('#cb1').css({ width: (w / 2 - 3), height: h / 2 - 2 })
    this.dom.find('#cb2').css({ width: (w / 2 - 3), height: h / 2 - 2 })
    for (let i = 0; i < 3; i++) {
      if (this.cornerstoneArray[i]) {
        this.cornerstoneArray[i].resizeCon()
      }
    }
  }
  renderAllLayer() {
    for (let i = 0; i < 3; i++) {
      let layer = this.dom.find('.cb' + i + ' .layer').html().split('/')[0]
      if (layer) {
        this.cornerstoneArray[i].funcNodule(layer)
      }
    }
  }
  nidusChoose(value) {
    this.chooseNidus = value
    this.renderAllLayer()
  }

}
module.exports = progress;