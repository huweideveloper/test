//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
//存放在里面用的一些静态信息。这些都是由接口获取的，然后由页面直接传入
/*
nidusComponentInfo 保存所有组件信息。组件信息分为两块，一块是整体序列的信息，key值为all
另外一块是病症的组件信息。分别以病症的命名来保存的

nidusComponentData 保存每个被标注出来的病症的组件数据是什么

nidusChoose 选择了的病灶信息
*/

class ctmanage extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.nidusComponentInfo = {}
    this.nidusComponentData = {}
    this.nidusChoose = null
    this.seriesInfo = {}
    this.controlStauts = {
      delete: true
    }
    this.allresult = null
    let wh = this.getCanvasSize()

    this._pathSize = 254
    this._section = 254
    this._changeRange = Math.round(this._section / 3)
    let crl = this.viewPortColRow({ w: wh.width, h: wh.height })
    this.blank = ""
    this.seriesNext = []
    this.getBlankImg()
    this._vpCanvasInfo = {
      width: wh.width,
      height: wh.height,
      colnum: crl.col,
      row: crl.row,
      length: crl.length
    }
    this._orginImgSizes = {

    }

    this.sequence = {} // 图片信息
    this.numberList = []
    this.breviaryImg = {
      width: 600,
      height: 225,
      top: 0,
      left: 0
    }
    this._breviaryImgBorder = {
      width: 148,
      height: 148
    }
    this.imageLeftPoint = { x: 0, y: 0 }
    this.imagePool = []
    this.beforeImages = []
    this.afterImages = []
    this.nowImageLevel = "1x"
  }
  get pathSize() {
    return this._pathSize
  }
  set pathSize(value) {
    this.setPrivate(this, { _pathSize: value })
  }
  set orginImgSizes(value) {
    this.setPrivate(this, { _orginImgSizes: value })
  }
  viewPortColRow(wh) {
    return {
      col: Math.ceil(1.5 * wh.w / this._pathSize) + 2,
      row: Math.ceil(1.5 * wh.h / this._pathSize) + 2,
      length: (Math.ceil(1.5 * wh.w / this._pathSize) + 2) * (Math.ceil(1.5 * wh.h / this._pathSize) + 2)
    }
  }
  changeViewPort(vp) {
    this.setPrivate(this._vpCanvasInfo, vp)
    //this._vpCanvasInfo = value
  }
  backImageNumber(cr) {
    if (cr.bitmapNumx >= this._orginImgSizes[this.nowImageLevel].colnum || cr.bitmapNumy >= this._orginImgSizes[this.nowImageLevel].row) {
      return 'blank'
    }
    if (cr.bitmapNumy < 0 || cr.bitmapNumx < 0) {
      return 'blank'
    }
    console.log(cr,this._orginImgSizes[this.nowImageLevel],this.nowImageLevel)
    return (cr.bitmapNumx + cr.bitmapNumy * this._orginImgSizes[this.nowImageLevel].colnum) + 1
  }

  getCanvasSize() {
    let width = window.innerWidth - 180 - 289
    let height = window.innerHeight - 60 - 60
    if (location.href.includes('drapCanvasPro')) {
      width -= 174
    }
    return {
      width,
      height
    }
  }

  getBlankImg() {
    let image = new Image()
    image.onload = e => {
      this.blank = e.target
    }
    image.src = '/images/blank.jpg'
    image.crossOrigin = "Anonymous"
  }
  returnRate() {
    let nowwidth = this._orginImgSizes[this.nowImageLevel].width * (this._pathSize / this._section)
    let maxWidth = this._orginImgSizes[this._orginImgSizes.length + 'x'].width
    return maxWidth / nowwidth
  }
  calSaveXYPos(data) {
    let rate = this.returnRate()
    let xd = Math.round((data.x - this.imageLeftPoint.x) * rate)
    let yd = Math.round((data.y - this.imageLeftPoint.y) * rate)
    return { x: xd, y: yd }
  }
  calXYPos(data) {
    let xd = Math.round(data.x - this.imageLeftPoint.x)
    let yd = Math.round(data.y - this.imageLeftPoint.y)
    return { x: xd, y: yd }
  }
  calShowXYPos(data) {
    let rate = 1 / this.returnRate()
    let xd = data.x * rate
    let yd = data.y * rate
    return { x: xd, y: yd }
  }
  returnNull(data) {
    let arr = []
    for (let i in data) {
      if (!data[i].father || !data[i].child) {
        arr.push(i)
      }
    }
    let rate = 1 / this.returnRate()
    if (arr[0] && arr[1]) {
      let a = data[arr[0]]
      let b = data[arr[1]]
      let d = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
      d = d * rate * rate
      if (d < 300) {
        if (!data[arr[0]].child) {
          data[arr[0]].child = data[arr[1]].x + '_' + data[arr[1]].y
          data[arr[1]].father = data[arr[0]].x + '_' + data[arr[0]].y
          return arr[1]
        } else {
          data[arr[1]].child = data[arr[0]].x + '_' + data[arr[0]].y
          data[arr[0]].father = data[arr[1]].x + '_' + data[arr[1]].y
          return arr[0]
        }
      }
    }

    return false
  }
  removeData(data, now) {
    let rate = this.returnRate()
    let xy = this.calXYPos({ x: now.x, y: now.y })
    let rangeX = [(xy.x - now.d) * rate, (xy.x + now.d) * rate]
    let rangeY = [(xy.y - now.y) * rate, (xy.y + now.d) * rate]
    for (let i in data) {
      if (data[i].x >= rangeX[0] && data[i].x <= rangeX[1] && data[i].y >= rangeY[0] && data[i].y <= rangeY[1]) {
        let f = data[i].father
        let c = data[i].child
        //console.log(i, f, c)
        delete data[i]
        if (data[f]) {
          data[f].child = null
        }
        if (data[c]) {
          data[c].father = null
        }
      }
    }
  }
  calGetMinDistance(data, point) {
    let who
    let d = null

    for (let i in data) {
      if (!data[i].father || !data[i].child) {
        let now = (data[i].x - point.x) * (data[i].x - point.x) + (data[i].y - point.y) * (data[i].y - point.y)
        //console.log(now,data[i])
        if (d == null) {
          d = now
          who = i
        } else {
          if (now < d) {
            who = i
          }
        }
      }
    }
    //console.log(data[who],this.calShowXYPos(data[who].x, data[who].y))
    if (who) {
      if (!data[who].father || !data[who].child) {
        data[point.x + '_' + point.y] = { x: point.x, y: point.y }
        if (data[who].father) {
          data[point.x + '_' + point.y].father = who
          data[who].child = point.x + '_' + point.y
        } else {
          data[point.x + '_' + point.y].child = who
          data[who].father = point.x + '_' + point.y
        }
        return this.calShowXYPos({ x: data[who].x, y: data[who].y })
      } else {
        data[point.x + '_' + point.y] = { x: point.x, y: point.y, father: null, child: null }
        return this.calShowXYPos({ x: point.x, y: point.y })
      }
    } else {
      data[point.x + '_' + point.y] = { x: point.x, y: point.y, father: null, child: null }
      return this.calShowXYPos({ x: point.x, y: point.y })
    }
  }

}
module.exports = ctmanage;