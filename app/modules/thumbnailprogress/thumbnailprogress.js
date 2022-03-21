/*
model为外面的数据同步

事件
1.ThumbnailProgress.borClick 进度条的上下按钮
2.ThumbnailProgress.changeImage 缩放的时候需要换图
3.ThumbnailProgress.scaleImage 缩放的时候只缩放图片
4.ThumbnailProgress.dragThumbnail 拖动缩略图的红框
*/
let nowRange = 132
var value = ""
class ThumbnailProgress extends Interstellar.moduleBase {
  constructor(app, dom, value, addMore) {
    super(app, dom, value, addMore)
    require("./thumbnailprogress.less")
    this.html = require("./tpl.html")
    this.name = "ThumbnailProgress"
    this.model = {}
    value = value
  }
  complete() {
    //   this.initBreviaryImg()
    if (
      window.location.hash.lastIndexOf("/drapCanvasAud/") != -1 ||
      window.location.hash.lastIndexOf("/drapCanvasAudEdit/") != -1
    ) {
      this.dom.find(".breviary").css({
        right: 180
      })
      this.dom.find(".progress").css({
        right: 200
      })
    }
  }
  //缩略图
  initBreviaryImg() {
    let imageSrc = new Image()
    let that = this
    imageSrc.id = "bre_img"
    imageSrc.onload = function() {
      that.dom.find("#bre_img").attr("src", this.src)
      let posObect = {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      }
      if (
        this.width / this.height <
        that.model._breviaryImgBorder.width /
          that.model._breviaryImgBorder.height
      ) {
        posObect.height = that.model._breviaryImgBorder.height
        posObect.top = 0
        posObect.width =
          (this.width * that.model._breviaryImgBorder.height) / this.height
        posObect.left =
          (that.model._breviaryImgBorder.width - posObect.width) / 2
      } else {
        posObect.width = that.model._breviaryImgBorder.width
        posObect.left = 0
        posObect.height =
          (this.height * that.model._breviaryImgBorder.width) / this.width
        posObect.top =
          (that.model._breviaryImgBorder.height - posObect.height) / 2
      }
      that.model.breviaryImg = JSON.parse(JSON.stringify(posObect))
      that.dom.find("#bre_img").css(posObect)
      //that.dragDivPos({ changeX:0, changeY:0 })
      that.makeShowArea()
    }
    imageSrc.src = this.model._orginImgSizes.thumbnail
    imageSrc.crossOrigin = "Anonymous"
    let pos = {}
    this.dom.find("#drag_div").on("mousedown", e => {
      pos = {
        x: e.pageX,
        y: e.pageY
      }
      this.rate =
        this.model.breviaryImg.width /
        (this.orginImg.colnum * this.model.pathSize)
      this.dom.find("#breviary").on("mousemove", ev => {
        let changeX = ev.pageX - pos.x
        let changeY = ev.pageY - pos.y
        this.dragDivPos(
          {
            changeX,
            changeY
          },
          "drag"
        )
        pos = {
          x: ev.pageX,
          y: ev.pageY
        }
      })
      this.dom.find("#breviary").on("mouseup", ev => {
        this.dom.find("#breviary").off("mousemove")
      })
    })
    this.dom.find("#bre_img").on("click", e => {
      this.rate =
        this.model.breviaryImg.width /
        (this.orginImg.colnum * this.model.pathSize)
      let box = document.querySelector("#breviary").getClientRects()[0]
      let px = e.pageX - box.left
      let py = e.pageY - box.top
      let xyA = this.returnXY()
      let changeX = Math.floor(
        px -
          (this.dom.find("#drag_div").dom[0].dom.style.width.replace("px", "") *
            1) /
            2 -
          xyA[0] * 1
      )
      let changeY = Math.floor(
        py -
          (this.dom
            .find("#drag_div")
            .dom[0].dom.style.height.replace("px", "") *
            1) /
            2 -
          xyA[1] * 1
      )
      this.dragDivPos(
        {
          changeX,
          changeY
        },
        "click"
      )
    })
    this.dom.find(".bor").on("click", e => {
      this.event._dispatch("ThumbnailProgress.borClick", {
        x: 0,
        y: e.target.innerHTML == "-" ? -1 : 1
      })
      //this.scaleCanvas(0, (e.target.innerHTML == '-' ? -1 : 1))
    })

    this.dom.find("#myProgress").on("click", e => {
      this.event._dispatch("ThumbnailProgress.progress", e)
      // this.progressPos(e.pageY)
    })
  }
  //进度条
  progressPos(posY) {
    let pos =
      posY - document.getElementById("myProgress").getClientRects()[0].top
    let levelFenduan = nowRange / this.model._orginImgSizes.length
    let level = Math.floor((nowRange - pos) / levelFenduan)
    level =
      level > this.model._orginImgSizes.length
        ? level - 1 + "x"
        : level + 1 + "x"
    let pathSize =
      this.model._section +
      Math.floor(
        ((nowRange - pos) % levelFenduan) * (this.model._changeRange / 100)
      )
    let spos
    if (level != this.model.nowImageLevel) {
      let rate =
        1 -
        (this.model._orginImgSizes[level].colnum * pathSize) /
          (this.model._orginImgSizes[this.model.nowImageLevel].colnum *
            this.model._pathSize)
      spos = {
        moveX: (this.stage.mouseX - this.model.imageLeftPoint.x) * rate,
        moveY: (this.stage.mouseY - this.model.imageLeftPoint.y) * rate
      }
      // this.event._dispatch('ThumbnailProgress.changeImage', { spos, level, pathSize })
      this.setContainerPos(spos)
      this.model.nowImageLevel = level
      this.model.pathSize = pathSize
      this.handlerImageLoad()
    } else {
      let cr = this.getColRow(
        {
          x: this.model.imageLeftPoint.x,
          y: this.model.imageLeftPoint.y
        },
        {
          x: this.stage.mouseX,
          y: this.stage.mouseY
        }
      )
      spos = {
        moveX: -cr.col * (pathSize - this.model.pathSize),
        moveY: -cr.row * (pathSize - this.model.pathSize)
      }
      // this.event._dispatch('ThumbnailProgress.scaleImage', { spos, pathSize })
      this.setContainerPos(spos)
      this.model.pathSize = pathSize
      this.scaleBox()
    }
  }
  changProgress() {
    let levelFenduan = nowRange / this.model._orginImgSizes.length
    let jg =
      (0.5 *
        levelFenduan *
        (this.model.pathSize - this.model._section + this.model._changeRange)) /
      this.model._changeRange
    let h =
      (this.model.nowImageLevel.replace("x", "") * 1 - 1) * levelFenduan + jg
    h += "px"
    // this.dom.find('#').css({ height: h })
    this.dom.find(".progress_val").css({
      height: h
    })
    //document.querySelector(".progress_val").style.height = h
    //document.querySelector(".select_size").style.bottom = h
  }
  //缩略图
  dragDivPos(pos, eventType) {
    let xyA = this.returnXY()
    let dx = Math.floor(xyA[0] * 1 + pos.changeX)
    let dy = Math.floor(xyA[1] * 1 + pos.changeY)
    let translates = "translate(" + dx + "px," + dy + "px)"
    this.dom.find("#drag_div").css({
      transform: translates
    })
    let moveX = -pos.changeX / this.rate
    let moveY = -pos.changeY / this.rate
    if (eventType == "drag") {
      this.event._dispatch("ThumbnailProgress.dragThumbnail", {
        moveX,
        moveY
      })
    } else {
      this.event._dispatch("ThumbnailProgress.bgClick", {
        moveX,
        moveY
      })
    }

    //this.moveBoX({ moveX, moveY })
  }
  returnXY() {
    let transform = this.dom.find("#drag_div").dom[0].dom.style.transform
    let x = transform
      .split(",")[0]
      .split("(")[1]
      .split("px")[0]
    let y = transform
      .split(",")[1]
      .split(")")[0]
      .split("px")[0]
    return [x, y]
  }
  makeShowArea() {
    let nowscale = this.model._pathSize / this.model._section
    let rate = this.model.breviaryImg.width / (this.orginImg.width * nowscale) //(this.orginImg.colnum * this.model._pathSize)
    let ratex =
      this.model._vpCanvasInfo.width > this.orginImg.width * nowscale
        ? 1
        : this.model._vpCanvasInfo.width / (this.orginImg.width * nowscale)
    let ratey =
      this.model._vpCanvasInfo.height > this.orginImg.height * nowscale
        ? 1
        : this.model._vpCanvasInfo.height / (this.orginImg.height * nowscale)
    let dragDivCss = {}
    let dx =
      this.model.breviaryImg.left -
      (ratex == 1 ? 0 : this.model.imageLeftPoint.x * rate)
    let dy =
      this.model.breviaryImg.top -
      (ratey == 1 ? 0 : this.model.imageLeftPoint.y * rate)
    dragDivCss.width = this.model.breviaryImg.width * ratex
    dragDivCss.height = this.model.breviaryImg.height * ratey
    dragDivCss.transform = "translate(" + dx + "px," + dy + "px)"
    this.dom.find("#drag_div").css(dragDivCss)
  }
  getColRow(screen, boxpos) {
    let col = Math.floor((boxpos.x - screen.x) / this.model._pathSize)
    let row = Math.floor((boxpos.y - screen.y) / this.model._pathSize)
    return {
      col,
      row
    }
  }
}

//原型链一定要有的
module.exports = ThumbnailProgress
