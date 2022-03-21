require("./sequencelist.less")

/**/
class sequencelist extends Interstellar.moduleBase {
  constructor(app, dom, value, addMore) {
    ES.selctorDoc("#content #right-content").css({ margin: 0 })
    super(app, dom, value, addMore)
    this.html = require("./tpl.html")
    this.cornerstoneArray = {}
    this.myScrollgood = null
    this.deferred = ES.Deferred()
    this.chooseData = {}
    this.loadAll = {}
    this.loadId = 0
    this.nowplayData = null
    this.listData = null
    this.sequencelistData = []
    this.currentSid = ''
    this.ClipboardJS = require("../../../libs/clipboard.min.js")
    this.isShowSequenceStatistics = false // 是否显示统计图层
    this.drawInfo = require("../../modules/ctcornerstone/manager.js")
  }
  complete() {
    // this.dom.find('.sequencelist').html('')
    const that = this
    this.dom.find('.sequence-sort-btn').on('click',function () {
      // 根据dom排序
      that.sortByDom()
    })
  }
  showNowData(sId) {
    this.currentSid = sId
    if (!sId) {
      this.dom.find(".nodeInfo")
    } else {
      this.dom.find(".nodeInfo .nodeInfolist>div").hide()
      if (!this.dom.find(".nodeInfo .nodeInfolist>div").dom) {
        return
      }
      let sidA = sId.split("_")
      this.dom.find(".nodeInfo .nodeInfolist>div").dom.map(item => {
        let indexA = sidA.lastIndexOf(item.attr("sid"))
        if (indexA != -1) {
          item.show()
        }
      })
      //  this.dom.find('.nodeInfo .nodeInfolist>div[sid="' + sId + '"]').show()
      this.initscrollgood()

      // 显示统计图层
      this.showMarkCount(sId)

    }
  }
  upCal(value) {
    let classname = "one_" + value.id //.layerNumber
    let li = this.chooseData.element.find(
      ".nodeInfo ." + classname + " .socre_cal"
    )
    if (li.dom) {
      li.html(value.cal)
    }
  }
  updateSequencelistSid(value) {
    this.dom.find('div[bid="' + value.id + '"]').attr("sid", value.sId)
  }
  // 列表排序
  sortSequenceList(list) {
    list.sort((a, b) => {
      if (b.layerNumber === a.layerNumber) {
        if (a.type === b.type) {
          return a.backId - b.backId
        } else {
          return b.type === 'imagetag' ? 1 : -1
        }
      } else {
        return a.layerNumber - b.layerNumber
      }
    })
  }

  sortByDom() {
    setTimeout(() => {
      const sid = this.currentSid
      const listDom = $(`.sequencelist .nodeInfolist div[sid="${sid}"]`).get()
      listDom.sort((doma, domb) => {
        const a = $(doma)
        const b = $(domb)
        const layerDiff = Number(a.attr('layerinfo')) - Number(b.attr('layerinfo'))
        if (layerDiff === 0) {
          if (a.attr('tooltype') === b.attr('tooltype') || (b.attr('tooltype') !== 'IMAGE_TAG' && a.attr('tooltype') !== 'IMAGE_TAG')) {
            return Number(a.attr('bid')) - Number(b.attr('bid'))
          } else {
            return b.attr('tooltype') === 'IMAGE_TAG' ? 1 : -1
          }
        } else {
          return layerDiff
        }
      })
      $(".sequencelist .nodeInfolist").append(listDom);
      this.initscrollgood()
      this.scrollToChooseItem()
    }, 300);
  }

  setData(value, childrens, isShowSequenceStatistics) {
    let data = (this.listData = value) // this.initDate.data
    this.sequencelistData = childrens
    this.dom.find(".sequencelist").html("")
    this.myScrollgood = null // 多序列场景刚进来不能滚动，setData会被调用多次，第一次以后就一直有值需清空
    for (let i = 0, j = data.length; i < j; i++) {
      this.initsingle(i, data[i])
    }

    // 排序
    childrens.length && this.sortSequenceList(childrens)

    for (let i = 0, j = childrens.length; i < j; i++) {
      const imageAnnotation = childrens[i]
      this.addNode(imageAnnotation)
    }

    // 用于判断是否显示统计图层
    this.isShowSequenceStatistics = isShowSequenceStatistics
  }

  // 设置已经审核过的node高亮，并更新统计数据
  setHasAuditedNode({sId, backId}) {
    const currentNidusEl = $('.ctcornerstone .xulielist .sequencelist .nodeInfolist').find(`div[sid='${sId}'][bid='${backId}']`)
    !currentNidusEl.hasClass('audited') && currentNidusEl.addClass('audited')
    this.showMarkCount()
  }

  // 显示统计图层
  showMarkCount(sId) {
    const url = window.location.hash
    const isShowAudit = url.includes('markaudit/') || url.includes('markauditview/')
    sId = sId || this.currentSid
    // 根据左边dom节点统计
    let [layerMarkCount, nidusMarkCount, auditLayerMarkCount, auditNidusMarkCount] = [0, 0, 0, 0]
    const list = $(`.sequencelist .nodeInfolist div[sid="${sId}"]`)
    for (let i = 0; i < list.length; i++) {
      const dom = list[i];
      const type = $(dom).attr('tooltype')
      const hasAudit = $(dom).hasClass('audited')
      if (type === 'IMAGE_TAG') {
        layerMarkCount++
        hasAudit && auditLayerMarkCount++
      } else {
        nidusMarkCount++
        hasAudit && auditNidusMarkCount++
      }
    }

    this.dom.find("#layerMarkCount").html(layerMarkCount)
    this.dom.find("#nidusMarkCount").html(nidusMarkCount)
    this.dom.find("#auditLayerMarkCount").html(auditLayerMarkCount)
    this.dom.find("#auditNidusMarkCount").html(auditNidusMarkCount)

    const counterDom = this.dom.find(".sequence-statistics-wrapper")
    counterDom.removeClass('audit-wrapper')
    isShowAudit && counterDom.addClass('audit-wrapper') // 审核页面显示审核数统计
    counterDom.css({ display: 'block' }) // 显示整个统计
  }


  setLayerInfo(value, layer) {
    this.dom.find('div[bid="' + value.id + '"]').attr("layerinfo", layer)
    this.dom
      .find('div[bid="' + value.id + '"] .edit_color ul')
      .attr("layerinfo", layer)
  }
  setBackId(value) {
    let dom = this.dom.find("div[uuid='" + value.uuid + "']")
    //value.uuid = value.backId
    dom.attr("bid", value.backId)
    dom.addClass("one_" + value.backId)
    if (dom.find(".cul").dom) {
      dom.find(".cul").attr("bid", value.backId)
    }
    //dom.find('.cul').attr('bid', value.backId)
    // dom.attr('uuid', value.backId)
    dom.find(".nname").click()
    let temp = Tool.configobjformat(this.app.constmap.LESION)
    dom
      .find(".nname")
      .html(temp[value.toolType.imageAnnotation] + "_" + value.backId)
  }
  openNode(value) {
    this.dom.find("div[bid='" + value.id + "'] .nname").click()
  }
  findNidusFromList(sId, layerNumber, toolType) {
    const currentLayerImageTag = $(`.sequencelist .nodeInfolist div[sid="${sId}"][layerinfo="${layerNumber}"][tooltype="${toolType}"]`)
    if (!currentLayerImageTag.length) return
    return currentLayerImageTag
  }
  addNode(value, isAddNew = false) {
    switch (value.type) {
      case "length":
      case "freehandline":
      case "rectangleRoi":
      case "ellipticalRoi":
      case "simpleAngle":
      case "cobb":
      case "imagetag":
        this.addNormal(value, "nobrush", isAddNew)
        break
      case "brush":
      case "alignment":
      case "magicStickSingle":
      case "polygon":
      case "freehand":
      case "quickselect":
      case "regionpaint":
        this.addNormal(value, "brush", isAddNew)
        break
    }
    isAddNew && this.sortByDom()
    isAddNew && this.showMarkCount()
  }
  returnAnno(value) {
    return this.dom.find('div[bid="' + value.backId + '"]').attr("niddtype")
  }
  removeNode(value) {
    let dom = this.chooseData.element
    let classname = "one_" + (value.backId || value.uuid)
    dom.find(".nodeInfo .nodeInfolist ." + classname).remove()
    this.showMarkCount(this.currentSid)
    this.initscrollgood()
  }
  setNname(id, name) {
    this.dom.find('div[bid="' + id + '"] .nname').html(name)
  }
  addNormal(value, brushtype, isAddNew) {
    let dom = this.chooseData.element
    let classname = "one_" + value.uuid //.layerNumber
    let li = dom.find(".nodeInfo ." + classname)
    let that = this
    let temp = Tool.configobjformat(this.app.constmap.LESION)
    //'AA1113', 'F5A623', 'F8E71C', '7ED321', '4A90E2', '50E3C2', '8B572A', '417505', 'B8E986', 'BD10E0'
    const toolType = value.imageAnnotationToolType || value.tooltype
    let colorArray = [
      "AA1113",
      "F5A623",
      "F8E71C",
      "7ED321",
      "4A90E2",
      "50E3C2",
      "8B572A",
      "417505",
      "B8E986",
      "BD10E0"
    ]
    if (!li.dom) {
      const isAudited = value.auditResult !== null && typeof value.auditResult !== 'undefined'
      const auditedNidusCls = window.location.hash.lastIndexOf("markaudit") !== -1 && isAudited ? 'audited' : ''
      let htmlstr =
        `<div sId="` +
        value.sId +
        `" bid="` +
        (value.backId ? value.backId : "") +
        `" niddtype="` +
        value.toolType.imageAnnotation +
        `" uuid="` +
        value.uuid +
        `" toolType="` +
        toolType +
        `" layerInfo="` +
        value.layerNumber +
        `" class="${classname} ${isAddNew && toolType === 'IMAGE_TAG' ? 'choose' : ''} ${auditedNidusCls}"><div>`
      if (brushtype == "brush") {
        htmlstr += `<div class="edit_color"><span class="color_c c1"></span><ul class="cul" sId="${
          value.sId
        }" bid="${value.backId ? value.backId : ""}" uuid="${
          value.uuid
        }" layerInfo="${value.layerNumber}">`
        for (var i = 0; i < colorArray.length; i++) {
          htmlstr += `<li class="color_li" name="${colorArray[i]}" data="${
            colorArray[i]
          }">
          <span class="cc c${i + 1}"></span>
          <span class="textc">${colorArray[i]}</span>
          </li>`
        }
        htmlstr += `</ul></div><span class='fillcon iconfont icon-danxinggoumian1' title="去除填充" cc="fill"></span>`
      }
      htmlstr += `<p class="nname">${temp[value.toolType.imageAnnotation]}_${
        value.uuid
        }</p>${value.type !== 'imagetag' ?
        "<span class='showHide chooseIcon iconfont icon-biyan1'></span>" :
        "<span class='layer-number-tip'>" + value.layerNumber + "</span>"
      }`
      if (
        this.app.parpam["type"].lastIndexOf("viewer") == -1 &&
        this.app.parpam["type"].lastIndexOf("check") == -1
      ) {
        htmlstr += `<span class="del"><i class="iconfont icon-shanchu" enable="enable"></i></span>`
      }
      if (temp[value.toolType.imageAnnotation] != "脑出血") {
        htmlstr += `</div></div>`
      } else {
        htmlstr +=
          `</div><div class="socre_cal">出血量:` +
          (value.cal || 0) +
          `mm<sup>3</sup></div>`
      }
      that.clearChoosed()
      dom.find(".nodeInfolist").append(htmlstr)

      dom.find("." + classname + " .nname").on("click", function() {
        that.btnClick(
          ES.selctorDoc(this)
            .parent()
            .parent(),
          brushtype
        )
      })
      dom.find("." + classname + " .showHide").on("click", function() {
        let childrenDom = ES.selctorDoc(this)
        let targetA = childrenDom.parent().parent()
        let cc = true
        if (childrenDom.hasClass("icon-biyan1")) {
          childrenDom.removeClass("icon-biyan1")
          childrenDom.addClass("icon-biyan")
          cc = false
        } else {
          childrenDom.addClass("icon-biyan1")
          childrenDom.removeClass("icon-biyan")
          cc = true
        }
        that.event._dispatch("sequencelist.closeWho", {
          show: cc,
          uuid: targetA.attr("uuid"),
          sId: targetA.attr("sId"),
          bid: targetA.attr("bid"),
          tooltype: targetA.attr("toolType"),
          layerNumber: targetA.attr("layerInfo")
        })
      })
      dom.find("." + classname + " .fillcon").on("click", function() {
        let childrenDom = ES.selctorDoc(this)
        let targetA = childrenDom.parent().parent()
        let cc = true
        if (childrenDom.attr("cc") == "fill") {
          childrenDom.removeClass("icon-danxinggoumian1")
          childrenDom.addClass("icon-danxinggoumian")
          childrenDom.attr("cc", "none")
          cc = false
        } else {
          childrenDom.attr("cc", "fill")
          childrenDom.removeClass("icon-danxinggoumian")
          childrenDom.addClass("icon-danxinggoumian1")
          cc = true
        }
        that.event._dispatch("sequencelist.fillWho", {
          fill: cc,
          uuid: targetA.attr("uuid"),
          sId: targetA.attr("sId"),
          bid: targetA.attr("bid"),
          tooltype: targetA.attr("toolType"),
          layerNumber: targetA.attr("layerInfo")
        })
      })
      dom.find("." + classname + " .color_c").on("click", function() {
        const colorListEl = $("." + classname + " .cul")
        const colorListHeight = colorListEl.outerHeight() // 颜色选择列表区域需占据的总高度
        const currentRowEl = $(this).parent().parent().parent() // 点击区域所在行
        const distance = $(window).height() - currentRowEl[0].getBoundingClientRect().bottom - 50 // 点击区域所在行距离底部统计区域上边缘的距离(统计区域的高度为50)
        if (colorListHeight > distance) {
          colorListEl.css({ top: 'unset', bottom: 20 })
        } else {
          colorListEl.css({ top: 30, bottom: 'unset' })
        }
        colorListEl.show()
      })
      dom.find("." + classname + " .cul .color_li").on("click", function() {
        dom.find("." + classname + " .cul").hide()
        let nowTarget = ES.selctorDoc(this)
        let targetA = nowTarget.parent()
        let cc = nowTarget.attr("data")
        dom.find("." + classname + " .color_c").css({
          background: "#" + cc
        })
        that.event._dispatch("sequencelist.changeColor", {
          color: cc,
          uuid: targetA.attr("uuid"),
          sId: targetA.attr("sId"),
          bid: targetA.attr("bid"),
          layerNumber: targetA.attr("layerInfo")
        })
      })
      dom.find("." + classname + " .del").on("click", function() {
        let domA = ES.selctorDoc(this)
          .parent()
          .parent()
        that.event._dispatch("sequencelist.del", {
          toolType: dom.attr("toolType"),
          type: brushtype,
          uuid: domA.attr("uuid"),
          sId: domA.attr("sId"),
          layerNumber: domA.attr("layerInfo"),
          bid: domA.attr("bid")
        })
      })
      dom.find("." + classname + " .edit").on("click", function() {
        that.btnClick(
          ES.selctorDoc(this)
            .parent()
            .parent(),
          brushtype
        )
      })
    } else {
      //li.addClass('choose')
    }
    this.initscrollgood()
  }

  updateStatisticsData(toolType, count) {
    if (toolType === "imagetag") {
      const layerMarkCountEl = this.dom.find("#layerMarkCount")
      layerMarkCountEl.html(+layerMarkCountEl.html() + count)
    } else {
      const nidusMarkCountEl = this.dom.find("#nidusMarkCount")
      nidusMarkCountEl.html(+nidusMarkCountEl.html() + count)
    }
  }
  clickById(value) {
    let dom = this.chooseData.element
    let classname = "one_" + value.uuid //.layerNumber
    let li = dom.find(".nodeInfo ." + classname)
    li.find(".nname").click()
    // 滚动到可视区域
    this.scrollToChooseItem()
  }

  // 清空所有选中的项
  clearChoosed() {
    $(".sequencelist .nodeInfo .choose").removeClass('choose')
  }

  btnClick(value, brushtype, childThis) {
    let dom = value
    let hasclass = dom.hasClass("choose")
    this.dom.find(".sequencelist .nodeInfo .choose").removeClass("choose")
    if (!hasclass) {
      dom.addClass("choose")
    }
    // let data = {
    //   toolType: dom.attr("toolType"),
    //   type: brushtype,
    //   sId: dom.attr("sId"),
    //   niddtype: dom.attr("niddtype"),
    //   uuid: dom.hasClass("choose") ? dom.attr("uuid") : "",
    //   layerNumber: dom.attr("layerInfo"),
    //   bid: dom.hasClass("choose") ? dom.attr("bid") : ""
    // }
    dom.attr('brushtype', brushtype)
    this.event._dispatch("sequencelist.niddclick", dom)
  }
  initsingle(id, imageAddress) {
    let that = this
    let rid = "cdd" + Math.floor(new Date().getTime() * Math.random())
    this.loadAll[rid] = false
    let str = ""
    if (id != 0) {
      str = "style='display:none'"
    } else {
      this.nowplayData = {
        data: imageAddress,
        num: 0
      }
    }
    let htmlstr = `<li ${str}  sid="${imageAddress.studyId}" datamain="${imageAddress.major}" class="wk" onmousemove="return false;" unselectable="on" onselectstart="return false;"><div class="head-name" data-num="${id}">
        <p title="${imageAddress.sequenceName}" class="sequence-wrapper" data-clipboard-text="${imageAddress.sequenceName}"><span class="sequenceName">${imageAddress.sequenceName}</span></p><span class='showHide chooseIcon iconfont icon-biyan1'></span></div>
        <div class="nodeInfo">
        <div class="nodeInfolist"></div>
        </div>
        <div class="cc" id="${rid}" oncontextmenu="return false" style="width: 110px;height: 110px; display:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;"></div>
        </li>`
    this.dom.find(".sequencelist").append(htmlstr)
    if (id == 0) {
      this.chooseData.element = this.dom.find(
        'li[sid="' + imageAddress.studyId + '"]'
      )
    }
    const clipboard = new this.ClipboardJS(".sequence-wrapper")
    clipboard.on("success", function(e) {
      that.app.alert.show({
        title: "提示",
        msg: "已复制到粘贴板",
        close: false
      })
      // that.dom.find(".modal-body .showalert").css({ padding: "40 10 40 160" })
    })
    this.dom
      .find(".sequencelist .head-name .showHide")
      .on("click", function(e) {
        let childrenDom = ES.selctorDoc(this)
        that.dom.find(".nodeInfolist .showHide").removeClass("icon-biyan1")
        let cc = true
        if (childrenDom.hasClass("icon-biyan1")) {
          childrenDom.removeClass("icon-biyan1")
          childrenDom.addClass("icon-biyan")
          that.dom.find(".nodeInfolist .showHide").removeClass("icon-biyan1")
          that.dom.find(".nodeInfolist .showHide").addClass("icon-biyan")
          cc = false
        } else {
          childrenDom.addClass("icon-biyan1")
          childrenDom.removeClass("icon-biyan")
          that.dom.find(".nodeInfolist .showHide").removeClass("icon-biyan")
          that.dom.find(".nodeInfolist .showHide").addClass("icon-biyan1")
          cc = true
        }
        that.event._dispatch("sequencelist.allShowControl", {
          show: cc
        })
      })
    this.dom
      .find(".sequencelist .head-name")
      .eq(0)
      .css({
        background: "#95d4e2",
        color: "#333"
      })
  }
  resize() {
    this.initscrollgood()
  }
  initscrollgood() {
    let ch = ES.selctorDoc(window).box().clientHeight - 220
    this.dom.find(".nodeInfo").css({
      height: ch
    })
    if (this.myScrollgood) {
      this.myScrollgood.refresh()
      return
    }
    var rid = "aaaww_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".nodeInfo").attr("id", rid)
    this.myScrollgood = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: "scale",
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    })
  }

  // 滚动到对应的选项
  scrollToChooseItem() {
    if (!this.myScrollgood) return
    const chooseDom = $('.sequencelist .nodeInfo .choose')
    if (!chooseDom.length) return
    const containerHeight = $('.nodeInfo').height()
    const top = chooseDom.offset().top
    // 在可视范围内不需滚动
    if (top >= 166 && top <= containerHeight + 166) return
    this.myScrollgood.scrollToElement('.sequencelist .nodeInfolist .choose', 100)
  }
}

//原型链一定要有的
module.exports = sequencelist
