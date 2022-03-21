/**
 * @class CanvasBase
 * @classdesc 初始化createJS，挂载event事件，渲染画布
 * 
 * 对外事件
 * @event 鼠标按下 stageMousedown
 * @event 鼠标松开 stageMouseup
 * @event 鼠标移动 stageMove
 * 
 * 暂时只兼容Chrome
 */
class CanvasBase extends Interstellar.pagesBase {
  constructor(app, api, dom, model) {
    super(app, api, dom, model)
  }
  complete() {
    this.initBreviaryImg()
    this.initImgCanvas()
    this.styleModel(1)
  }
  //图片加载
  loadImage(path, pos, bitmapPos) {
    let image = new Image()
    image.src = `proxyImg/images/real/${path}.jpg`
    image.onload = e => {
      if (!this.model.imagePool[pos]) {
        this.model.imagePool[pos] = new createjs.Bitmap(e.target)
        this.container.addChild(this.model.imagePool[pos])
      } else {
        this.model.imagePool[pos].image = e.target
      }
      this.model.imagePool[pos].x = bitmapPos.bitmapNumx * this.model._pathSize
      this.model.imagePool[pos].y = bitmapPos.bitmapNumy * this.model._pathSize
      this.model.imagePool[pos].scale = this.model._pathSize / this.model._section
      this.stage.update()
    }
    image.onerror = e => {
      console.log('no path')
    }
  }
  //初始化整个场景
  initBreviaryImg() {
    let imageSrc = new Image()
    let that = this
    imageSrc.id = "bre_img"
    imageSrc.onload = function () {
      that.dom.find('#bre_img').attr('src', this.src)
      let posObect = { width: 0, height: 0, top: 0, left: 0 }
      if (this.width / this.height < that.model._breviaryImgBorder.width / that.model._breviaryImgBorder.height) {
        posObect.height = that.model._breviaryImgBorder.height
        posObect.top = 0
        posObect.width = this.width * that.model._breviaryImgBorder.height / this.height
        posObect.left = (that.model._breviaryImgBorder.width - posObect.width) / 2
      } else {
        posObect.width = that.model._breviaryImgBorder.width
        posObect.left = 0
        posObect.height = this.height * that.model._breviaryImgBorder.width / this.width
        posObect.top = (that.model._breviaryImgBorder.height - posObect.height) / 2 
      }
      that.model.breviaryImg = JSON.parse(JSON.stringify(posObect))
      that.dom.find('#bre_img').css(posObect)
      that.makeShowArea()
    }
    imageSrc.src = "proxyImg/images/real/thrum.jpg"
    imageSrc.crossOrigin = "Anonymous"
    let pos = {}
    this.dom.find('#drag_div').on('mousedown', (e) => {
      pos = { x: e.pageX, y: e.pageY }

      this.rate = this.model.breviaryImg.width / (this.orginImg.colnum * this.model._pathSize)
      this.dom.find('#breviary').on('mousemove', (ev) => {
        let changeX = ev.pageX - pos.x
        let changeY = ev.pageY - pos.y
        this.dragDivPos({ changeX, changeY })

        pos = { x: ev.pageX, y: ev.pageY }
      })
    })
    this.dom.find('#drag_div').on('mouseup', (e) => {
      this.dom.find('#breviary').off('mousemove')
    })
    this.dom.find('#bre_img').on('click', (e) => {
      this.rate = this.model.breviaryImg.width / (this.orginImg.colnum * this.model._pathSize)
      let box = this.dom.find('#breviary').box()
      let px = e.pageX - box.offsetLeft
      let py = e.pageY - box.offsetTop
      let xyA = this.returnXY()
      let changeX = Math.floor(px - this.dom.find('#drag_div').dom[0].dom.style.width.replace('px', '') * 1 / 2 - xyA[0] * 1)
      let changeY = Math.floor(py - this.dom.find('#drag_div').dom[0].dom.style.height.replace('px', '') * 1 / 2 - xyA[1] * 1)
      this.dragDivPos({ changeX, changeY })
    })
    this.dom.find('.bor').on('click', (e) => {
      this.stage.mouseX = this.model._vpCanvasInfo.width / 2
      this.stage.mouseY = this.model._vpCanvasInfo.height / 2
      this.scaleCanvas(0, (e.target.innerHTML == '-' ? -1 : 1))
    })
    this.dom.find('#myProgress').on('click', (e) => {
      this.stage.mouseX = this.model._vpCanvasInfo.width / 2
      this.stage.mouseY = this.model._vpCanvasInfo.height / 2
      this.progressPos(e.pageY)
    })
  }
  //滚动条相关
  progressPos(posY) {
    let pos = posY - document.getElementById("myProgress").getClientRects()[0].top
    console.log(pos)
    let levelFenduan = (200 / this.model._orginImgSizes.length * 2)
    console.log(levelFenduan.length)
    let level = Math.floor(((200 - pos) / levelFenduan))
    level = Math.floor(level / 2 + 1) + 'x'
    
    let pathSize = this.model._sectio + Math.floor(((200 - pos) % levelFenduan) * (this.model._changeRange / 100))
    let spos
    if (level != this.model.nowImageLevel) {
      let rate = 1 - (this.model._orginImgSizes[level].colnum * pathSize / (this.model._orginImgSizes[this.model.nowImageLevel].colnum * this.model._pathSize))
      spos = {
        moveX: (this.stage.mouseX - this.model.imageLeftPoint.x) * rate,
        moveY: (this.stage.mouseY - this.model.imageLeftPoint.y) * rate
      }
      this.setContainerPos(spos)
      this.model.nowImageLevel = level
      this.model.pathSize = pathSize
      this.handlerImageLoad()
    } else {
      let cr = this.getColRow({ x: this.model.imageLeftPoint.x, y: this.model.imageLeftPoint.y }, { x: this.stage.mouseX, y: this.stage.mouseY })
      spos = { moveX: -cr.col * (pathSize - this.model.pathSize), moveY: -cr.row * (pathSize - this.model.pathSize) }
      this.setContainerPos(spos)
      this.model.pathSize = pathSize
      this.scaleBox()
    }
  }
  changProgress() {
    let levelFenduan = 100 / this.model._orginImgSizes.length
    let jg = 0.5 * levelFenduan * (this.model.pathSize - this.model._section + this.model._changeRange) / this.model._changeRange
    let h = (this.model.nowImageLevel.replace('x', '') * 1 - 1) * levelFenduan + jg
    h += 'px'
    // this.dom.find('#').css({ height: h })
    document.querySelector(".progress_val").style.height = h
  }
  //缩略图
  dragDivPos(pos) {
    let xyA = this.returnXY()
    let dx = (xyA[0] * 1 + pos.changeX)
    let dy = (xyA[1] * 1 + pos.changeY)
    let translates = "translate(" + dx + "px," + dy + "px)"
    this.dom.find('#drag_div').css({ transform: translates })
    let moveX = -pos.changeX / this.rate
    let moveY = -pos.changeY / this.rate
    this.moveBoX({ moveX, moveY })
  }
  returnXY() {
    let transform = this.dom.find('#drag_div').dom[0].dom.style.transform
    console.log(transform)
    let xyA = transform.match(/(\-\d|\d){1,}/g)
    return xyA
  }
  makeShowArea() {
    let rate = this.model.breviaryImg.width / (this.orginImg.colnum * this.model._pathSize)
    let dragDivCss = {}
    let dx = this.model.breviaryImg.left - this.model.imageLeftPoint.x * rate
    let dy = this.model.breviaryImg.top - this.model.imageLeftPoint.y * rate
    dragDivCss.width = this.model._vpCanvasInfo.width * rate
    dragDivCss.height = this.model._vpCanvasInfo.height * rate
    dragDivCss.transform = "translate(" + dx + "px," + dy + "px)"
    this.dom.find('#drag_div').css(dragDivCss)
  }

  /**
   * @desc 初始化createJS挂载event
   */
  initImgCanvas() {
    this.canvas = document.getElementById('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.stage = new createjs.Stage(canvas)
    this.container = new createjs.Container();
    this.container.x = this.model.imageLeftPoint.x
    this.container.y = this.model.imageLeftPoint.y
    this.stage.addChild(this.container)
    createjs.Ticker.setFPS(60)
    this.dragOffset = new createjs.Point()
    this.stage.addEventListener("mousedown", e => {
      this.dragOffset.x = this.stage.mouseX
      this.dragOffset.y = this.stage.mouseY
    })
    this.stage.addEventListener("pressmove", e => {
      let moveX = this.stage.mouseX - this.dragOffset.x
      let moveY = this.stage.mouseY - this.dragOffset.y
      document.querySelector(".scale").value == "开启缩放" ? this.moveBoX({ moveX, moveY }) : this.scaleCanvas(moveX, moveY)
      this.dragOffset.x = this.stage.mouseX
      this.dragOffset.y = this.stage.mouseY
    })
    
    this.dom.find(".scaleIcon").on('click', e => {
      console.log(e, "你好")
      // this.dom.find(".scale").val() == "开启缩放" ? this.dom.find(".scale").val('关闭缩放') : this.dom.find(".scale").val('开启缩放')
    })
    this.handlerImageLoad()
  }

  handlerImageLoad() {
    let leftTopX = Math.floor(Math.abs(-this.model.imageLeftPoint.x / this.model._pathSize)) //获取格子的列下标 
    let leftTopY = Math.floor(Math.abs(-this.model.imageLeftPoint.y / this.model._pathSize)) //获取格子的行下标
    leftTopX = leftTopX < 0 ? 0 : leftTopX
    leftTopY = leftTopY < 0 ? 0 : leftTopY
    let sx = Math.floor(this.model.imageLeftPoint.x % this.model._pathSize) //获取格子的x坐标
    let sy = Math.floor(this.model.imageLeftPoint.x % this.model._pathSize) //获取格子的y坐标
    this.orginImg = this.model._orginImgSizes[this.model.nowImageLevel]
    let colnum = this.model._vpCanvasInfo.colnum
    let row = this.model._vpCanvasInfo.row
    let showNum = row * colnum
    for (let i = 0; i < showNum; i++) {
      let bitmapNumx = leftTopX + (i % colnum)
      let bitmapNumy = leftTopY + Math.floor(i / colnum)
      //用的那张图

      let back = this.model.backImageNumber({ bitmapNumx, bitmapNumy })
      let filePath = back == "blank" ? back : this.orginImg.filePath + back
      this.loadImage(filePath, i, { bitmapNumx, bitmapNumy })
    }
    this.makeShowArea()
    this.changProgress()
  }

  setContainerPos(pos) {
    this.model.imageLeftPoint.x = this.model.imageLeftPoint.x + pos.moveX
    this.model.imageLeftPoint.y = this.model.imageLeftPoint.y + pos.moveY
    this.container.x = this.model.imageLeftPoint.x
    this.container.y = this.model.imageLeftPoint.y
  }

  moveBoX(pos) {
    this.setContainerPos(pos)
    let length = this.model.imagePool.length
    for (let i = 0; i < length; i++) {
      let changeImage = false
      let bitmapNumx = Math.round(this.model.imagePool[i].x / this.model._pathSize)
      let bitmapNumy = Math.round(this.model.imagePool[i].y / this.model._pathSize)
      //console.log({ bitmapNumx, bitmapNumy })
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
      if (changeImage && bitmapNumx >= 0 && bitmapNumy >= 0 && bitmapNumx < this.orginImg.colnum && bitmapNumy < this.orginImg.row) {
        let filePath = this.orginImg.filePath + this.model.backImageNumber({ bitmapNumx, bitmapNumy })
        this.loadImage(filePath, i, { bitmapNumx, bitmapNumy })
      }
    }
    this.makeShowArea()
    this.stage.update()
  }

  scaleCanvas(moveX, moveY) {
    if (!moveY) {
      return
    }
    if (this.model.nowImageLevel == '1x' && this.model._pathSize <= this.model._section - this.model._changeRange) {
      return
    }
    if (this.model.nowImageLevel == this.model._orginImgSizes.length + 'x' && this.model._pathSize >= this.model._section + this.model._changeRange) {
      return
    }
    let changeNum = moveY < 0 ? -2 : 2
    let cr = this.getColRow({ x: this.model.imageLeftPoint.x, y: this.model.imageLeftPoint.y }, { x: this.stage.mouseX, y: this.stage.mouseY })
    let pos = { moveX: -cr.col * changeNum, moveY: -cr.row * changeNum }
    this.setContainerPos(pos)
    this.model.pathSize = this.model._pathSize + changeNum
    if (this.model._pathSize > this.model._section + this.model._changeRange) {
      this.model.pathSize = this.model._section - this.model._changeRange
      this.model.nowImageLevel = (this.model.nowImageLevel.replace('x', '') * 1 + 1) + "x"
      this.handlerImageLoad()
      return
    }
    if (this.model._pathSize < this.model._section - this.model._changeRange) {
      this.model.pathSize = this.model._section + this.model._changeRange
      this.model.nowImageLevel = (this.model.nowImageLevel.replace('x', '') * 1 - 1) + "x"
      this.handlerImageLoad()
      return
    }
    this.scaleBox()
  }
  scaleBox() {
    for (let i = 0; i < this.model.imagePool.length; i++) {
      this.model.imagePool[i].scale = this.model._pathSize / this.model._section
      let now = this.model.imagePool[i].image.src.match(/(\/\d{1,}.jpg)/g)
      let num = now ? (now[0].replace('.jpg', '').replace('/', '') * 1 - 1) : -4
      // 拿到缩放xy 的坐标
      this.model.imagePool[i].x = this.model._pathSize * Math.floor(num % this.orginImg.colnum)
      this.model.imagePool[i].y = this.model._pathSize * Math.floor(num / this.orginImg.colnum)
    }
    this.makeShowArea()
    this.changProgress()
    this.stage.update()
  }
  getColRow(screen, boxpos) {
    let col = Math.floor((boxpos.x - screen.x) / this.model._pathSize)
    let row = Math.floor((boxpos.y - screen.y) / this.model._pathSize)
    return { col, row }
  }
}
module.exports = CanvasBase