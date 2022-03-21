require("./ctcornerstone.less")

/**/
class ctcornerstone_base extends Interstellar.moduleBase {
  constructor(app, dom, value, addMore) {
    super(app, dom, value, addMore)
    this.sceen = 0
    this.choosescreen = 0
    this.cornerstoneArray = []
    this.nowWWC = []
    this.html = require("./tpl.html")
    this.makeStudy = true
    this.nidusSigle = false
    //获取配置
    this.cornerstoneTools_config = require("../../../config/cornerstoneTool_config.js")
    this.drawInfo = require("./manager.js")
    this.ctProgress = require("../ctprogress/ctprogress.js")
    this.brushManage = require("./brush_manager.js")
    this.setoolconfig = require("./setcomfig_tool.js")
    this.baseLine = require("../../utils/baselinebak.js")
    this.crossLine = require("../../utils/baseline.js")
    require("./ctcornerstoneload.js")
    this.clearLayer = []
    this.nodeInfo = {}
    this.initFrist = {}
    this.brushC = []
    let model = require("./ctcornerstone_model.js")
    this.nodeShow = true //是否显示影像标注，如果是true就要显示，如果是false就不显示
    this.model = new model(this.app)
    this.modelData = {};
    this.crossline = require("../crossline/crossline.js")
  }
  complete() {
    //进行工具配置
    cornerstoneTools.toolColors.setToolColor("#fbb03b")
    //重写了画椭球型，矩形，长度，放大镜的功能
    require("../../libs/cornerstoneTools/rectangleRoi.js")
    require("../../libs/cornerstoneTools/length.js")
    require("../../libs/cornerstoneTools/magnify.js")
    require("../../libs/cornerstoneTools/brush.js")
    require("../../libs/cornerstoneTools/simpleAngle.js")
    require("../../libs/cornerstoneTools/ellipticalRoi.js")
    //cornerstoneTools.ellipticalRoi.setConfiguration(this.cornerstoneTools_config.ellipticalRoi_config);
    let that = this
    this.setoolconfig.setconfig(
      "ellipticalRoiFan",
      this.cornerstoneTools_config.ellipticalRoi_config
    )
    this.setoolconfig.setconfig(
      "rectangleRoiFan",
      this.cornerstoneTools_config.rectangleRoi_config
    )
    cornerstoneTools.magnify.setConfiguration(
      this.cornerstoneTools_config.magnify_config
    )
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone
    //cornerstone.registerImageLoader('myImageLoader', loadImage);
    this.mprClass = require("../../modules/mpr/mpr")
    this.moduleLoad()
  }
  moduleLoad() {
    let sequenceC = require("../sequencelist/sequencelist.js")
    this.ctmenu(sequenceC)
    let sequenceList = require("../serieslist/serieslist.js")
    this.initSeriesLists(sequenceList)

    this.deferred = ES.Deferred()
    let that = this
    require.ensure("../../utils/cornerstone_class.js", function() {
      that.class_c = require("../../utils/cornerstone_class.js")
      that.deferred.resolve({})
    })
    let nidusinfo = require("../nidusinfo/nidusinfo.js")
    this.nidusControl = this.app.loadModule(
      nidusinfo,
      this.dom.find(".ctcornerstone .nidus_content")
    )

    this.nidusControl.event._addEvent("nidusinfo.finish", function(value) {
      if (!that.model.nidusChoose) {
        return
      }
      for (var i in that.nidusControl.chooseData) {
        //console.log(that.model.nidusComponentData[that.nidusControl.backId],that.model.nidusComponentData)
        that.model.nidusComponentData[that.nidusControl.backId] = that.model
          .nidusComponentData[that.nidusControl.backId]
          ? that.model.nidusComponentData[that.nidusControl.backId]
          : {}
        that.model.nidusComponentData[that.nidusControl.backId][i] =
          that.nidusControl.chooseData[i]
      }
      //console.log(that.model.nidusChoose)
      //that.model.nidusComponentData[that.nidusControl.backId] = that.nidusControl.chooseData
      that.event._dispatch("ctcornerstone.editNodeItem", {
        chooseData: that.nidusControl.chooseData,
        backId: that.nidusControl.backId,
        sId: that.model.nidusChoose.sId,
        jiangui: value
      })
    })
    this.nidusControl.event._addEvent("nidusinfo.remarkFinish", function(
      value
    ) {
      if (!that.model.nidusChoose) {
        return
      }
      for (var i in that.nidusControl.chooseData) {
        //console.log(that.model.nidusComponentData[that.nidusControl.backId],that.model.nidusComponentData)
        that.model.nidusComponentData[that.nidusControl.backId] = that.model
          .nidusComponentData[that.nidusControl.backId]
          ? that.model.nidusComponentData[that.nidusControl.backId]
          : {}
        that.model.nidusComponentData[that.nidusControl.backId][i] =
          that.nidusControl.chooseData[i]
      }
      //console.log(that.model.nidusChoose)
      //that.model.nidusComponentData[that.nidusControl.backId] = that.nidusControl.chooseData
      that.model.nidusComponentData[that.nidusControl.backId].imageRemark =
        that.nidusControl.remarkRes
      that.event._dispatch("ctcornerstone.NodeRemark", {
        chooseData: that.nidusControl.chooseData,
        remarkRes: that.nidusControl.remarkRes,
        backId: that.nidusControl.backId,
        sId: that.model.nidusChoose.sId,
        jiangui: value
      })
    })
    this.nidusControlAll = this.app.loadModule(
      nidusinfo,
      this.dom.find(".ctcornerstone .info")
    )
    this.nidusControlAll.show()
    this.nidusControlAll.event._addEvent("nidusinfo.finish", function(value) {
      const [imageTagChooseData, otherChooseData] = [{}, {}]
      for (let key in that.nidusControlAll.chooseData) {
        const { isImageTag, formComponentId, result } = that.nidusControlAll.chooseData[key]
        // if (!result) continue 大小征象的各种标注信息组件都要支持清空操作
        const chooseDataItem = { formComponentId, result }
        isImageTag ? imageTagChooseData[key] = chooseDataItem : otherChooseData[key] = chooseDataItem
      }
      if (value) { // 新增或者修改图层标记的标注信息
        that.event._dispatch(
          "ctcornerstone.saveLayerMarkInfo",
          imageTagChooseData
        )
      } else { // 修改序列的标注信息
        that.event._dispatch(
          "ctcornerstone.Allthing",
          otherChooseData
        )
      }
    })
    this.nidusControlAll.event._addEvent("nidusinfo.remarkFinish", function() {
      that.event._dispatch(
        "ctcornerstone.AllRemark",
        that.nidusControlAll.remarkRes
      )
    })
  }
  openmpr() {
    if (this.cornerstoneArray[this.choosescreen]) {
      this.app.loading.show()
      let sId = this.cornerstoneArray[this.choosescreen].sId
      let serinfo = this.model.seriesInfo[sId]
      this.nowmpr = this.app.loadModule(
        this.mprClass,
        this.dom.find(".ctcornerstone .mpr"),
        {
          info: serinfo
        }
      )
      this.nowmpr.openS(
        this.cornerstoneArray[this.choosescreen].axialStack1.imageIds,
        this.nodeInfo,
        this.brushManage
      )
      this.nowmpr.sId = sId
      this.nowmpr.event._addEvent("mpr.closeAll", () => {
        this.nowmpr = null
        this.dom.find(".ctcornerstone .mpr").hide()
        this.dom.find(".ctcornerstone .mpr").html("")
        this.mpr = false
      })
    } else {
      this.app.alert.show({
        title: " ",
        msg: "请先选择一个序列",
        close: true,
        sure: function() {
          window.location.reload()
        }
      })
    }
  }
  groupMakeSame(value) {
    let gid = value.backId.split("_")[0] * 1 + "_"
    for (let i in this.model.nidusComponentData) {
      if (i.lastIndexOf(gid) != -1 && i != value.backId) {
        for (let j in value.chooseData) {
          this.model.nidusComponentData[i][j] = value.chooseData[j]
        }
      }
    }
  }
  baseLineSt(value, type) {
    if (type == "cross") {
      this.crossOpen = value
      this.baseLineOpen = false
      for (let i = 0; i < this.sceen; i++) {
        if (this.cornerstoneArray[i]) {
          this.gotoLayer(null, this.cornerstoneArray[i].sId)
        }
      }
      this.creatCrossLine()
      //this.gotoLayer()
    } else {
      this.baseLineOpen = value
      this.crossOpen = false
      this.removeCrossLine()
    }
    //    this.baseLineOpen = value
  }
  creatCrossLine() {
    this.crossArray = []
    for (var i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        let id = i
        let box = this.dom.find("#ct" + id).box()
        this.crossArray[id] = this.app.loadModule(
          this.crossline,
          this.dom.find(".ct" + id + " .line")
        )
        this.crossArray[id].type = "z"
        let screenPoint = this.model.returnScreenPoint(
          {
            x: box.clientWidth / 2,
            y: box.clientHeight / 2
          },
          id,
          this.sceen,
          {
            w: box.clientWidth,
            h: box.clientHeight
          }
        )
        this.crossArray[id].setPos(screenPoint)
        this.crossArray[id].setXYLinePos({
          x: box.clientWidth / 2,
          y: box.clientHeight / 2
        })
        this.crossArray[id].setYHeight(box.clientHeight)
        let point = this.crossArray[id].nowpos
        point = this.model.returnRealPoint(point, id, this.sceen, {
          w: box.clientWidth,
          h: box.clientHeight
        })
        this.crossArray[id].setXYLinePos(point)
        let getViewport = this.cornerstoneArray[id].getViewport()
        let stPos = this.getStartPos(getViewport, box)
        let x = (point.x - stPos.x) / getViewport.scale
        let y = (point.y - stPos.y) / getViewport.scale
        this.crossArray[id].imagePoint = {
          x,
          y
        }
        this.crossArray[id].event._addEvent("crossline.move", () => {
          this.crossmove = true
          if (this.cornerstoneArray[id]) {
            this.changePOint(id, box)
          }
        })
        this.crossArray[id].event._addEvent("crossline.mouseup", () => {
          this.crossmove = false
        })
      }
    }
  }
  changePOint(id, box) {
    let getViewport = this.cornerstoneArray[id].getViewport()
    let point = this.crossArray[id].nowpos
    point = this.model.returnRealPoint(point, id, this.sceen, {
      w: box.clientWidth,
      h: box.clientHeight
    })
    this.crossArray[id].setXYLinePos(point)
    let stPos = this.getStartPos(getViewport, box)
    let x = (point.x - stPos.x) / getViewport.scale
    let y = (point.y - stPos.y) / getViewport.scale
    this.crossArray[id].imagePoint = {
      x,
      y
    }
    let z = this.nowLayNum(id)
    for (let i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i] && i != id) {
        this.calCrossLine(
          {
            x,
            y,
            z
          },
          this.cornerstoneArray[id].sId,
          i
        )
      }
    }
  }
  calflow(sort) {
    let box = this.dom.find("#ct" + sort).box()
    if (this.crossArray[sort]) {
      let point = this.crossArray[sort].imagePoint
      let newXY = this.returnXY(
        point,
        this.cornerstoneArray[sort].getViewport(),
        box
      )
      let screenPoint1 = this.model.returnScreenPoint(newXY, sort, this.sceen, {
        w: box.clientWidth,
        h: box.clientHeight
      })
      this.crossArray[sort].setPos(screenPoint1)
      this.crossArray[sort].setXYLinePos(newXY)
    }
    //let screenPoint1 = this.model.returnScreenPoint(newxy, sort, this.sceen, { w: box.clientWidth, h: box.clientHeight })
    //this.crossArray[sort].setPos(screenPoint1)
    //this.crossArray[sort].setXYLinePos(newxy)
  }
  calCrossLine(point, nowSid, sort) {
    let box = this.dom.find("#ct" + sort).box()
    let getViewport = this.cornerstoneArray[sort].getViewport()
    let endXYZ = {}
    if (nowSid == this.cornerstoneArray[sort].sId) {
      endXYZ.z = point.z
      let newxy1 = this.returnXY(point, getViewport, box)
      endXYZ.x = newxy1.x
      endXYZ.y = newxy1.y
      //this.crossArray[sort].setPos(newxy1)
    } else {
      let sId = this.cornerstoneArray[sort].sId
      let disInfo = null
      for (let i = 1; i < this.model.seriesInfo[sId].people.length; i++) {
        let data = {
          referent: {
            imageOrientationPatient: this.model.seriesInfo[nowSid].people[
              point.z
            ].ImageOrientationPatient.toString(), //"1,0,0,0,1,0",
            imagePositionPatient: this.model.seriesInfo[nowSid].people[
              point.z
            ].imagePositionPatient.toString(), // "-178.689453125,-335.189453125,113.5",
            pixelSpacing: this.model.seriesInfo[
              nowSid
            ].info.data.pixelSpacing.toString(), // "0.62109375,0.62109375",
            x: Math.round(point.x),
            y: Math.round(point.y),
            z: point.z
          },
          convert: {
            imageOrientationPatient: this.model.seriesInfo[sId].people[
              i
            ].ImageOrientationPatient.toString(),
            imagePositionPatient: this.model.seriesInfo[sId].people[
              i
            ].imagePositionPatient.toString(),
            pixelSpacing: this.model.seriesInfo[
              sId
            ].info.data.pixelSpacing.toString(),
            width: this.model.seriesInfo[sId].info.data.column,
            height: this.model.seriesInfo[sId].info.data.row
          }
        }
        if (!disInfo) {
          disInfo = {
            data: new this.crossLine(data),
            num: i
          }
        } else {
          let newDis = new this.crossLine(data)
          if (newDis.dis < disInfo.data.dis) {
            disInfo = {
              data: newDis,
              num: i
            }
          }
        }
      }
      let endData = new this.crossLine()
      let xy = endData.getSagPoint(disInfo.data)
      //this.crossmove = true
      //this.cornerstoneArray[sort].funcNodule(disInfo.num)
      endXYZ.z = disInfo.num
      //this.crossmove = false
      let newxy = this.returnXY(
        {
          x: xy.x,
          y: xy.y
        },
        getViewport,
        box
      )
      endXYZ.x = newxy.x
      endXYZ.y = newxy.y
    }
    let screenPoint1 = this.model.returnScreenPoint(endXYZ, sort, this.sceen, {
      w: box.clientWidth,
      h: box.clientHeight
    })
    this.crossArray[sort].setPos(screenPoint1)
    this.crossArray[sort].setXYLinePos(endXYZ)
    let stPos = this.getStartPos(getViewport, box)
    let x = (endXYZ.x - stPos.x) / getViewport.scale
    let y = (endXYZ.y - stPos.y) / getViewport.scale
    this.crossArray[sort].imagePoint = {
      x,
      y
    }
    this.cornerstoneArray[sort].funcNodule(endXYZ.z)
  }
  getStartPos(getViewport, box) {
    let orw = getViewport.displayedArea.brhc.x
    let orh = getViewport.displayedArea.brhc.y
    let x = 0
    let y = 0
    if (orw / orh > box.clientWidth / box.clientHeight) {
      y = (box.clientHeight - (box.clientWidth * orh) / orw) / 2
    } else {
      x = (box.clientWidth - (box.clientHeight * orw) / orh) / 2
    }
    return {
      x,
      y
    }
  }
  returnXY(point, getViewport, box) {
    let stPos = this.getStartPos(getViewport, box)
    let x = Math.floor(
      stPos.x + (getViewport.translation.x + point.x) * getViewport.scale
    )
    let y = Math.floor(
      stPos.y + (getViewport.translation.y + point.y) * getViewport.scale
    )
    stPos = null
    return {
      x,
      y
    }
  }
  removeCrossLine() {
    for (var i = 0; i < this.sceen; i++) {
      this.dom.find(".ct" + i + " .line").html("")
    }
  }

  //********************************************征象部分****************************************
  //对于每个节点进行赋值
  //设置每个病症在后台保存的组件值
  setSeriesNidusData(value, report, markdoctor) {
    let tt = {}
    value.map(item => {
      tt[item.annotationItemId] = item
    })
    this.model.allresult = markdoctor
    this.model.nidusComponentInfo.all.annotationItemResultList = tt
    let doctorNidduleAll = null
    for (let i in markdoctor) {
      if (!doctorNidduleAll) {
        doctorNidduleAll = markdoctor[i].data.doctorNidduleAll
      } else {
        doctorNidduleAll = Object.assign(
          doctorNidduleAll,
          markdoctor[i].data.doctorNidduleAll
        )
      }
      report.seriesRemark = markdoctor[i].data.auditResult
        ? markdoctor[i].data.auditResult.seriesRemark
        : ""
    }
    if (report.remark && (report.remark == 2 || report.remark == 3)) {
      this.nidusSigle = true
    }
    if (report.remark && (report.remark == 1 || report.remark == 3)) {
      report.remark = true
    } else {
      report.remark = false
    }
    const nidusComponentInfo = this.model.nidusComponentInfo
    // 对于标注模块，如有图片标记类型的标注信息，则绘画出相应的组件并和序列的标注信息放在一起（审核模块就不必）
    const { imageAnnotation } = this.model.layerMarkImageAnnotation || {}
    if (imageAnnotation) {
      const imageTagComponentData = nidusComponentInfo[imageAnnotation]
      imageTagComponentData && this.nidusControlAll.setLayerMarkData(imageTagComponentData) // 说明该项目配置了图层标记工具，去绘制图层标记组件信息
    }
    // 把序列的标注信息对应的组件绘画出来
    this.nidusControlAll.setData(
      nidusComponentInfo.all,
      "序列标注信息",
      report,
      doctorNidduleAll
    )

    //设置报告
    let sId = this.cornerstoneArray[this.choosescreen]
      ? this.cornerstoneArray[this.choosescreen].sId
      : null
    if (sId) {
      let finding = this.model.seriesInfo[sId].info.data.finding
      let conclusion = this.model.seriesInfo[sId].info.data.conclusion
      this.nidusControlAll.updataReport(finding, conclusion)
    }
  }
  //根据当前滚动的序列来做基准线
  makeBaseLine(sId, layer) {
    this.nowLine = {}
    for (let i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        if (this.cornerstoneArray[i].sId != sId) {
          let convertData = this.model.seriesInfo[sId]
          let referent = this.model.seriesInfo[this.cornerstoneArray[i].sId]
          let referentLay = this.nowLayNum(i)
          let data = {
            referent: {
              imageOrientationPatient: referent.people[
                referentLay
              ].ImageOrientationPatient.toString(),
              imagePositionPatient: referent.people[
                referentLay
              ].imagePositionPatient.toString(),
              pixelSpacing:
                referent.info.data.columnPixelSpacing +
                "," +
                referent.info.data.rowPixelSpacing,
              width: referent.info.data.column,
              height: referent.info.data.row
            },
            convert: {
              imageOrientationPatient: convertData.people[
                layer
              ].ImageOrientationPatient.toString(),
              imagePositionPatient: convertData.people[
                layer
              ].imagePositionPatient.toString(),
              pixelSpacing:
                convertData.info.data.columnPixelSpacing +
                "," +
                convertData.info.data.rowPixelSpacing,
              width: convertData.info.data.column,
              height: convertData.info.data.row
            }
          }
          this.nowLine[this.cornerstoneArray[i].sId] = new this.baseLine(data)
          this.gotoLayer(referentLay, this.cornerstoneArray[i].sId)
        }
      }
    }
  }

  // 绘制最右边的标注信息（包括序列、病灶和图片标记的标注信息）
  makeInfo(value, bid, layer, toolType) {
    // 标注时IMAGE_TAG选择项放在序列标注信息同一个面板，而审核时没有放在一起，故需单独弹出面板展示
    if ((value && toolType !== 'IMAGE_TAG') || (toolType === 'IMAGE_TAG' && value.check_reslut)) {
      this.nidusControl.show()
      this.nidusControl.showClose()
      this.nidusControl.backId = bid
      const title = `${toolType === 'IMAGE_TAG' ? '图层' : '病症'}标注信息` + (layer > 0 ? `（${layer}）` : '')
      this.nidusControl.setData(value, title, {
        remark: this.nidusSigle,
        seriesRemark: value.annotationItemResultList
          ? value.annotationItemResultList.imageRemark
          : null
      })
    } else {
      this.nidusControl.isShow() && this.nidusControl.hide() // 关闭病灶弹窗
      toolType === 'IMAGE_TAG' && this.nidusControlAll.setLayerMarkData(value) // 设置imageTag类型的组件数据
    }
  }

  //********************************************征象部分****************************************
  //********************************************多序列部分****************************************
  initSeriesLists(classValue) {
    this.sequencelists = this.app.loadModule(
      classValue,
      this.dom.find(".ctcornerstone .slist")
    )
    this.sequencelists.event._addEvent("serieslist.clcik", value => {
      let data = this.model.seriesInfo[value.sid]

      // 设置当前的CurrentSeriesInfo
      this.model.setCurrentSeriesInfo({
        seriesAnnotationResultId: data.sarId,
        seriesInstanceUid: value.sid
      })

      if (this.choosescreen <= this.sceen) {
        this.initsingle(this.choosescreen, data.imgs, {
          length: data.imgsTotal,
          major: "master",
          sId: value.sid
        })
        this.sequencelist.showNowData(value.sid)
      }
      let sId = this.cornerstoneArray[this.choosescreen]
        ? this.cornerstoneArray[this.choosescreen].sId
        : null
      if (sId) {
        let finding = this.model.seriesInfo[sId].info.data.finding
        let conclusion = this.model.seriesInfo[sId].info.data.conclusion
        this.nidusControlAll.updataReport(finding, conclusion)
      }

      // 这里有点鸡肋，but暂无他法(切换序列时查询当前序列大征象的标注信息以便回显)
      const studyInfo = this.model.currentSeriesInfo
      ES.ajax({
        url: `${this.app.domain1}v1/anno/series_result/read`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        questring: {
          id: studyInfo.seriesAnnotationResultId
        }
      }).then((res) => {
        if (!this.app.apiresult(res)) {
          return
        }
        const { showReport, inspectSee, diagnosisIncome } = this.model.projectInfo || {}
        //studyInfo.showReport = showReport
        studyInfo.inspectSee = inspectSee
        studyInfo.diagnosisIncome = diagnosisIncome
        this.setSeriesNidusData(
          res.data.annotationItemResultList,
          studyInfo,
          {} // 标注医生信息(只在审核时才需要展示，太麻烦暂时不做)
        )
      })

      this.hideMarkInfoClearNidusChoose()

      // 显示右边IMAGE_TAG的选项值
      const layer = this.model.currentLayer
      this.updateImageTagComponentData(layer || 1)
    })
  }
  closeSequenceLists() {
    this.makeStudy = false
    //this.dom.find('.ctcornerstone .slist').hide()
    this.dom.find(".ctcornerstone .slist").remove()
    this.resize()
  }
  clearRemark(value) {
    this.nidusControl.clearRemark(value)
  }
  setSequenceLists(value, type) {
    this.sequencelists.setData(value, type)
  }
  //********************************************多序列部分****************************************

  //********************************************列表部分****************************************
  //初始化病兆列表
  ctmenu(classValue) {
    let that = this
    this.sequencelist = this.app.loadModule(
      classValue,
      this.dom.find(".ctcornerstone .xulielist")
    )
    this.sequencelist.event._addEvent("sequencelist.choose", function() {
      let changeD = that.sequencelist.chooseData
      that.initsingle(0, changeD.imageAddress, {
        length: changeD.axialImageIdss.length,
        major: changeD.major
      })
    })
    this.sequencelist.event._addEvent("sequencelist.fillWho", function(value) {
      that.brushManage.restSignleIdFill(value)
      let rSId = that.brushManage.getInfo(value).sId
      //that.brushManage.allrest((that.model.nidusChoose ? that.model.nidusChoose : {}), 1, null, value)
      that.brushManage.doneSingleChange(
        that.model.nidusChoose ? that.model.nidusChoose : {},
        value,
        "fill"
      )
      //that.brushManage.doneSingleChange((that.model.nidusChoose ? that.model.nidusChoose : {}), value, 'color')
      for (let i = 0; i < that.sceen; i++) {
        let sIdA = rSId.split("_")
        if (
          that.cornerstoneArray[i] &&
          sIdA.lastIndexOf(that.cornerstoneArray[i].sId) != -1
        ) {
          let layerid = that.nowLayNum(i)
          //that.brushManage.allrest((that.model.nidusChoose ? that.model.nidusChoose : {}), layerid,null,value)
          that.gotoLayer(layerid, that.cornerstoneArray[i].sId)
        }
      }
    })
    this.sequencelist.event._addEvent("sequencelist.changeColor", function(
      value
    ) {
      //let changeD = that.sequencelist.chooseData
      that.brushManage.restSignleId(value)
      let rSId = that.brushManage.getInfo(value).sId
      //that.brushManage.allrest((that.model.nidusChoose ? that.model.nidusChoose : {}), 1, null, value)
      that.brushManage.doneSingleChange(
        that.model.nidusChoose ? that.model.nidusChoose : {},
        value,
        "color"
      )
      //that.brushManage.doneSingleChange((that.model.nidusChoose ? that.model.nidusChoose : {}), 1, null, value)
      for (let i = 0; i < that.sceen; i++) {
        let sIdA = rSId.split("_")
        if (
          that.cornerstoneArray[i] &&
          sIdA.lastIndexOf(that.cornerstoneArray[i].sId) != -1
        ) {
          let layerid = that.nowLayNum(i)
          that.gotoLayer(layerid, that.cornerstoneArray[i].sId)
        }
      }
      //that.restNowImageOnLayer(that.sequencelist.chooseData)
      //let layernum=that.nowLayNum(value.sId)
      //that.gotoLayer(layernum,value.sId)
    })
    this.sequencelist.event._addEvent("sequencelist.closeWho", function(value) {
      that.brushManage.restSignleIdShow(value)
      let data
      if (that.nodeInfo) {
        for (let i in that.nodeInfo) {
          for (let j = 0; j < that.nodeInfo[i].length; j++) {
            if (
              that.nodeInfo[i][j].nodeInfo.uuid == value.uuid ||
              that.nodeInfo[i][j].nodeInfo.id == value.uuid
            ) {
              data = that.nodeInfo[i][j]
              that.nodeInfo[i][j].show = value.show
            }
          }
        }
      }
      if (data && window.location.hash.lastIndexOf("drapCanvas") != -1) {
        that.drawNode(true)
        that.renderStage()
        return
      }
      let rSId = that.brushManage.getInfo(value)
        ? that.brushManage.getInfo(value).sId
        : value.sId
      for (let i = 0; i < that.sceen; i++) {
        let sIdA = rSId.split("_")
        if (
          that.cornerstoneArray[i] &&
          sIdA.lastIndexOf(that.cornerstoneArray[i].sId) != -1
        ) {
          let layerid = that.nowLayNum(i)
          //that.brushManage.allrest((that.model.nidusChoose ? that.model.nidusChoose : {}), layerid)
          if (
            data &&
            window.location.hash.lastIndexOf("markview") == -1 &&
            window.location.hash.lastIndexOf("markaudit") == -1
          ) {
            let toolData = that.cornerstoneArray[i].getAllState()
            toolData.map(function(item) {
              if (
                item.uuid &&
                item.tooltype != "alignment" &&
                item.uuid == data.nodeInfo.uuid
              ) {
                that.cornerstoneArray[i].clearSigleData(
                  item.tooltype,
                  item,
                  true
                )
              }
            })
            // that.cornerstoneArray[i].clearSigleData(data.type, data.nodeInfo, true)
          }
          that.gotoLayer(layerid, that.cornerstoneArray[i].sId)
        }
      }
      //that.restNowImageOnLayer(that.sequencelist.chooseData)
      //let layernum=that.nowLayNum(value.sId)
      //that.gotoLayer(layernum,value.sId)
    })

    this.sequencelist.event._addEvent("sequencelist.niddclick", function(
      dom
    ) {
      let value = {
        toolType: dom.attr("toolType"),
        type: dom.attr("brushtype") || 'nobrush',
        sId: dom.attr("sId"),
        niddtype: dom.attr("niddtype"),
        uuid: dom.hasClass("choose") ? dom.attr("uuid") : "",
        layerNumber: dom.attr("layerInfo"),
        bid: dom.hasClass("choose") ? dom.attr("bid") : ""
      }

      // that.model.imageAnnotationResultId = value.bid
      let info1 = that.model.nidusComponentInfo[value.niddtype]
        ? Tool.objetClone(that.model.nidusComponentInfo[value.niddtype])
        : null
      let layerNum = value.layerNumber
      let cancel = that.model.nidusChoose
        ? Tool.clone(that.model.nidusChoose)
        : null
      if (!value.bid || !value.uuid) {
        // that.brushManage.allrest(value, layerNum)
        that.brushManage.restChooseColor(null, cancel)
        that.gotoLayer(null, value.sId)
        that.model.nidusChoose = null
        if (window.location.hash.lastIndexOf("markpreview") != -1) {
          that.makeInfo(info1, value.bid, layerNum)
        } else {
          that.makeInfo(null, value.bid, layerNum)
        }
        let orginFileType = that.model.seriesInfo[value.sId].info.data.fileType
        if (
          !that.model.seriesInfo[value.sId].infoAll &&
          orginFileType != "DCM" &&
          orginFileType != "NII"
        ) {
          that.drawNode(true)
          that.renderStage()
        }
        return
      }
      let data
      let tt = value.toolType
      if (isNaN(layerNum) || !layerNum) {
        layerNum = null
      }
      that.app.loading.show()
      let rSId = that.brushManage.getInfo(value)
        ? that.brushManage.getInfo(value).sId
        : value.sId
      if (value.type == "nobrush" && cancel && cancel.type == "brush") {
        that.brushManage.restChooseColor(null, cancel)
      }
      switch (tt) {
        case "MAGIC_STICK_SINGLE":
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          if (layerNum) {
            that.brushManage.restChooseColor(data, cancel)
            //that.brushManage.allrest(data, layerNum)
            that.gotoLayer(null, rSId)
          } else {
            that.restNowImageOnLayer(data, cancel)
          }
          break
        case "POLYGON":
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          if (layerNum) {
            that.brushManage.restChooseColor(data, cancel)
            //that.brushManage.allrest(data, layerNum)
            //that.gotoLayer(null, rSId)
            that.gotoLayer(layerNum, value.sId)
          } else {
            that.restNowImageOnLayer(data, cancel)
          }
          break
        case "FREEHAND":
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          if (layerNum) {
            that.brushManage.restChooseColor(data, cancel)
            //that.brushManage.allrest(data, layerNum)
            //that.gotoLayer(null, rSId)
            that.gotoLayer(layerNum, value.sId)
          } else {
            that.restNowImageOnLayer(data, cancel)
          }
          break
        case "QSELECT":
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          if (layerNum) {
            that.brushManage.restChooseColor(data, cancel)
            //that.brushManage.allrest(data, layerNum)
            //that.gotoLayer(null, rSId)
            that.gotoLayer(layerNum, value.sId)
          } else {
            that.restNowImageOnLayer(data, cancel)
          }
          break
        case "REGION_PAINT":
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          if (layerNum) {
            that.brushManage.restChooseColor(data, cancel)
            //that.brushManage.allrest(data, layerNum)
            //that.gotoLayer(null, rSId)
            that.gotoLayer(layerNum, value.sId)
          } else {
            that.restNowImageOnLayer(data, cancel)
          }
          break
        case "FREEHANDLINE": // 自由画笔
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          that.drawNode(true)
          that.renderStage()
          break
        case "PEN":
          // that.gotoLayer(value.layerNumber, value.sId)
          that.model.nidusChoose = data = that.brushManage.getInfo(value)
          data.toolType = value.toolType
          break
        case "IMAGE_TAG":
          that.model.nidusChoose = data = value
          data.toolType = {
            imageAnnotation: value.niddtype,
            imageAnnotationToolType: tt
          }
          that.gotoLayer(value.layerNumber, value.sId)
          break
        default:
          that.gotoLayer(value.layerNumber, value.sId)
          that.model.nidusChoose = data = that.drawInfo.getInfo(value)
          break
      }
      let info = that.model.nidusComponentInfo[data.toolType.imageAnnotation]
        ? Tool.objetClone(
            that.model.nidusComponentInfo[data.toolType.imageAnnotation]
          )
        : null
      if (that.nowmpr) {
        that.nowmpr.nidusChoose(that.model.nidusChoose)
      }
      if (info) {
        info.annotationItemResultList = that.model.nidusComponentData[value.bid]
      }
      that.app.loading.hide()
      that.makeInfo(info, value.bid, layerNum, tt)
    })
    this.sequencelist.event._addEvent("sequencelist.allShowControl", function(
      value
    ) {
      that.brushManage.allShow(value)
      if (that.nodeInfo) {
        for (let i in that.nodeInfo) {
          for (let j = 0; j < that.nodeInfo[i].length; j++) {
            that.nodeInfo[i][j].show = value.show
          }
        }
      }
      if (window.location.hash.lastIndexOf("drapCanvas") != -1) {
        that.drawNode(true)
        that.renderStage()
        return
      }
      for (let i = 0; i < that.sceen; i++) {
        if (that.cornerstoneArray[i]) {
          let layerid = that.nowLayNum(i)
          //that.brushManage.allrest({}, layerid)
          if (
            window.location.hash.lastIndexOf("markview") == -1 &&
            window.location.hash.lastIndexOf("markaudit") == -1
          ) {
            let toolData = that.cornerstoneArray[i].getAllState()
            toolData.map(function(item) {
              if (item.uuid && item.tooltype != "alignment") {
                that.cornerstoneArray[i].clearSigleData(
                  item.tooltype,
                  item,
                  true
                )
              }
            })
          }
          that.gotoLayer(layerid, that.cornerstoneArray[i].sId)
        }
      }
    })
    this.sequencelist.event._addEvent("sequencelist.del", function(value) {
      that.dom.find(".cal").html("")
      let data
      if (value.type == "nobrush") {
        data = that.drawInfo.getInfo(value)
        that.gotoLayer(value.layerNumber, value.sId)
      } else {
        data = value
        value.backId = value.bid
      }
      setTimeout(function() {
        that.deleteNode(false, data, value.type)
      }, 10)
    })
  }
  updateSequencelistSid(value) {
    this.sequencelist.updateSequencelistSid(value)
  }
  setNname(id, num) {
    switch (num * 1) {
      case 1:
        this.sequencelist.setNname(id, "左心室_" + id)
        break
      case 2:
        this.sequencelist.setNname(id, "左心房_" + id)
        break
      case 3:
        this.sequencelist.setNname(id, "右心室_" + id)
        break
      case 4:
        this.sequencelist.setNname(id, "右心房_" + id)
        break
      case 5:
        this.sequencelist.setNname(id, "主动脉_" + id)
        break
      case 6:
        this.sequencelist.setNname(id, "左心肌_" + id)
        break
      case 7:
        this.sequencelist.setNname(id, "冠脉_" + id)
        break
    }
  }
  returnListAnno(value) {
    return this.sequencelist.returnAnno(value)
  }
  restNowImageOnLayer(value, cancel) {
    for (let i = 0; i < this.sceen; i++) {
      if (
        this.cornerstoneArray[i] &&
        this.cornerstoneArray[i].sId == value.sId
      ) {
        let layerid = this.nowLayNum(i)
        this.brushManage.changeColorById(value, cancel)
        // this.brushManage.allrest(value, layerid)
        this.gotoLayer(layerid, value.sId)
      }
    }
  }
  setSequence(value, childrens) {
    this.nodeInfo = childrens.length != 0 ? {} : null
    let sData = value
    childrens.map(item => {
      if (!this.nodeInfo[item.layerNumber]) {
        this.nodeInfo[item.layerNumber] = []
      }
      if (!this.model.nidusComponentData[item.id]) {
        this.model.nidusComponentData[item.id] = {}
      }
      if (
        item.tooltype != "magicStickSingle" &&
        item.tooltype != "polygon" &&
        item.tooltype != "quickselect" &&
        item.tooltype != "regionpaint" &&
        item.tooltype != "freehand"
      ) {
        let daa = {}
        if (
          item.type != "cobb" &&
          item.type != "alignment" &&
          item.type != "imagetag"
        ) {
          let tempD = {
            currentPoints: {
              image: item.result.point1
            },
            uuid: item.uuid
          }
          daa.nodeInfo = cornerstoneTools[item.type].getMeasurement(tempD)
        }
        if (item.type == "alignment") {
          daa.nodeInfo = {
            pointA: [],
            uuid: item.uuid
          }
          item.result.pointA.map(linItem => {
            daa.nodeInfo.pointA.push({
              start: linItem.point1
            })
          })
        }
        if (item.type == "cobb") {
          daa.nodeInfo = {
            lineA: [],
            uuid: item.uuid
          }
          item.result.lineA.map(linItem => {
            let tempD = {
              currentPoints: {
                image: linItem.point1
              },
              uuid: item.uuid
            }
            daa.nodeInfo.lineA.push(
              cornerstoneTools["length"].getMeasurement(tempD)
            )
          })
        }

        if (item.tooltype == "cobb") {
          for (let i = 0; i < daa.nodeInfo.lineA.length; i++) {
            daa.nodeInfo.lineA[i].handles.end = item.result.lineA[i].point2
          }
        } else if (item.tooltype == "simpleAngle") {
          daa.nodeInfo.handles.middle = item.result.point2
          daa.nodeInfo.handles.end = item.result.point3
        } else if (item.tooltype == "imagetag") {
          const { annotationItemResultList } = item
          daa.nodeInfo = {
            uuid: item.uuid,
            annotationItemResultList
          }
        } else if (
          item.tooltype == "alignment"
        ) {
        } else {
          daa.nodeInfo.handles.end = item.result.point2
        }
        //daa.nodeInfo.uuid = item.uuid
        daa.layerNumber = item.layerNumber ? item.layerNumber : 1
        daa.sId = item.sId
        daa.type = item.type
        daa.show = true
        this.nodeInfo[item.layerNumber].push(daa)
        this.drawInfo.setInfo(item)
      } else {
      }
      if (item.annotationItemResultList) {
        item.annotationItemResultList.map(res => {
          this.model.nidusComponentData[item.id][res.annotationItemId] = res
        })
      }
      if (item.orginannotationItemResultList) {
        this.model.nidusComponentData[item.id].orginannotationItemResultList =
          item.orginannotationItemResultList
      }
      this.model.nidusComponentData[item.id].doctorName = item.doctorName
      this.model.nidusComponentData[item.id].doctorId = item.doctorId
      this.model.nidusComponentData[item.id].imageRemark = item.imageRemark
    })
    const isShowSequenceStatistics = !!this.model.layerMarkImageAnnotation
    this.sequencelist.setData(sData, childrens, isShowSequenceStatistics)
    this.sequencelist.showNowData(this.cornerstoneArray[0].sId)
    // 显示右边IMAGE_TAG的选项值
    const layer = this.model.currentLayer
    this.updateImageTagComponentData(layer || 1)
  }

  // 更新this.nodeInfo
  // updateNodeInfo(layerNumber, annotationItemId, newNode) {
  //   !this.nodeInfo && (this.nodeInfo = {})
  //   const nodeInfo = this.nodeInfo
  //   if (!nodeInfo[layerNumber]) nodeInfo[layerNumber] = []
  //   const layerDatas = nodeInfo[layerNumber]
  //   const { seriesInstanceUid: sId } = this.model.currentSeriesInfo
  //   const typeDataIndex = layerDatas.findIndex(v => {
  //     return v.sId === sId && v.nodeInfo.annotationItemResultList && v.nodeInfo.annotationItemResultList.find(item => item.annotationItemId === annotationItemId)
  //   })
  //   // 删除
  //   if (newNode === null) {
  //     typeDataIndex >=0 && layerDatas.splice(typeDataIndex, 1)
  //     return
  //   }

  //   // 没有则新增
  //   let typeData = null
  //   if (typeDataIndex < 0) {
  //     layerDatas.push({
  //       layerNumber,
  //       nodeInfo: {uuid: newNode.imageAnnotationResultId, annotationItemResultList: []},
  //       sId,
  //       show: true,
  //       type: newNode.type
  //     })
  //     typeData = layerDatas[layerDatas.length - 1]
  //   } else {
  //     typeData = layerDatas[typeDataIndex]
  //   }

  //   // 新增或修改
  //   if (typeData.type === 'imagetag') {
  //     const { annotationItemResultList: list } = typeData.nodeInfo
  //     if (!list || list.length === 0) {
  //       typeData.nodeInfo.annotationItemResultList = [newNode]

  //     } else {
  //       const data = list.find(v => v.annotationItemId === annotationItemId)
  //       data && (data.result = newNode.result)
  //       !data && list.push(newD)
  //     }
  //   }
  // }

  updataSequencelist(value) {
    if (!value.brush) {
      let data = this.drawInfo.getInfo(value)
      this.sequencelist.setBackId(data)
      if (this.cornerstoneArray[0]) {
        let toolData = this.cornerstoneArray[0].getAllState()
        toolData.map(item => {
          if (item.uuid == value.uuid) {
            item.backId = value.backId
          }
        })
      }
    } else {
      this.sequencelist.setBackId(value)
    }
    // 左边图层和病灶列表排序
    this.sequencelist.sortByDom()
  }
  updataMaskInfo() {
    this.brushManage.doneSingleChange(
      this.model.nidusChoose ? this.model.nidusChoose : {},
      this.model.nidusChoose ? this.model.nidusChoose : {},
      "fill"
    )
    for (let i = 0; i < this.sceen; i++) {
      if (
        this.cornerstoneArray[i] &&
        this.cornerstoneArray[i].sId == this.model.nidusChoose.sId
      ) {
        let layerid = this.nowLayNum(i)
        //this.brushManage.changeColorById(value, cancel)
        //this.brushManage.allrest(value, layerid)
        this.gotoLayer(layerid, this.model.nidusChoose.sId)
      }
    }
  }
  removeSequencelist(value) {
    this.sequencelist.removeNode(value)
  }
  getSequence() {
    return this.sequencelist.nowplayData
  }
  openSequenceNode(value) {
    this.sequencelist.openNode(value)
  }

  //********************************************列表部分****************************************
  //初始化画图的部分
  initCT(totalImage, imageAddress, data) {
    let that = this
    this.initFrist[0] = false
    this.totalImage = totalImage
    for (var j = 0; j < this.totalImage; j++) {
      this.clearLayer.push(true)
    }

    this.baseData = data
    this.timeLoad = 0
    this.setScreen(1)
    this.dom.find(".ct0").css({
      border: "1px solid #0a2634"
    })

    //console.log(data, this.class_c)
    if (this.class_c) {
      this.initsingle(0, imageAddress, {
        length: this.totalImage,
        major: "master",
        sId: data.data.seriesInstanceUID
      })
      this.renderThumb();
    } else {
      this.deferred.done(function(value) {
        that.initsingle(0, imageAddress, {
          length: that.totalImage,
          major: "master",
          sId: data.data.seriesInstanceUID
        })
      })
    }
    ES.selctorDoc(window).on("keydown", function(e) {
      if (that.cornerstoneArray[that.choosescreen]) {
        let con = that.cornerstoneArray[that.choosescreen]
        //console.log(con,'aaaaaaaaaaa')
        let layers = that.nowLayNum(that.choosescreen)
        let index = con.getIndex(layers)
        //console.log(index, con.imageAddress)
        if (e.keyCode == 38) {
          if (index > 0) {
            index--
          }
          that.gotoLayer(con.getLayerNum(index), con.sId)
        }
        if (e.keyCode == 40) {
          if (index < con.imageAddress.length - 1) {
            index++
          }
          //console.log(con.getLayerNum(index), index)
          that.gotoLayer(con.getLayerNum(index), con.sId)
        }
      }
      /*if (that.controlename != 'alignmentFan'&&that.controlename != 'quickselectFan') {
          return
      }*/
      if (that.controlename == "alignmentFan") {
        if (e.keyCode == 87) {
          let id = that.choosescreen
          if (!that.model.nidusChoose) {
            that.alignmentAdd({}, id)
            that.dom.find(".ct" + id + " .cal").html("前上缘")
            return
          }
          if (
            that.model.nidusChoose &&
            that.model.nidusChoose.type != "alignment"
          ) {
            that.alignmentAdd({}, id)
            hat.dom.find(".ct" + id + " .cal").html("前上缘")
            return
          }
          if (that.model.nidusChoose) {
            let data = that.drawInfo.getInfo(that.model.nidusChoose)
            if (data.pointA.length == 4) {
              that.alignmentAdd({}, id)
              hat.dom.find(".ct" + id + " .cal").html("前上缘")
              that.gotoLayer(null, that.cornerstoneArray[id].sId)
              return
            }
            if (data.pointA.length < 4) {
              data.pointA.push({})
              data.setDataType = "number"
              let name = that.model.returnBodyName(data.pointA.length)
              that.dom.find(".ct" + id + " .cal").html(name)
              that.gotoLayer(null, that.cornerstoneArray[id].sId)
              that.event._dispatch("ctcornerstone.editNode", data)
              return
            }
          }
        }
        return
      }
      if (that.controlename == "quickselectFan") {
        if (e.keyCode == 65) {
          that.cornerstoneTools_config.quickselect_config.deviation =
            that.cornerstoneTools_config.quickselect_config.deviation + 2
        }
        if (e.keyCode == 68) {
          that.cornerstoneTools_config.quickselect_config.deviation =
            that.cornerstoneTools_config.quickselect_config.deviation - 2
        }
      }
      that.makeCicle()
    })
  }
  makeCicle() {}
  resetAllData(id) {
    if (this.cornerstoneArray[id]) {
      this.clearLayer = []
      this.brushC = []
      this.cornerstoneArray[id].progress.close()
      this.cornerstoneArray[id].close()
      this.cornerstoneArray[id] = null
    }
    this.initFrist[id] = false
    this.dom.find("#ct" + id).remove()
    this.dom.find(".c" + id).prepend('<div id="ct' + id + '"></div>')
  }
  initsingle(id, imageAddress, data) {
    let cid = id
    let that = this
    let baseData = this.baseData
    //console.log(this.cornerstoneArray[id], id, data)
    //console.log('=============')
    this.resetAllData(id)
    this.resize()
    //console.log('initsingle')
    //let name=imageAddress[0].split('?')[0].match(/(\/0*\d.jpg$){1,}/g)[0]||null
    let index =
      Tool.changeToName(imageAddress[0]) != null &&
      Tool.changeToName(imageAddress[0]) != undefined
        ? Tool.changeToName(imageAddress[0])
        : 1

    this.cornerstoneArray[id] = new this.class_c({
      element: this.dom.find("#ct" + id).dom[0].dom,
      totalImage: data.length,
      imageAddress: imageAddress,
      index: index - 1,
      type: this.imageType.toLowerCase() || "dcm"
    })
    this.cornerstoneArray[id].sId = data.sId
    this.cornerstoneArray[id].imageIndex = 0
    let progress = this.app.loadModule(
      this.ctProgress,
      this.dom.find(".ct" + id + " .image_progress")
    )
    let newArray = []
    imageAddress.map(item => {
      let urlA = item.split("?")[0].split("/")
      newArray.push(urlA[urlA.length - 1].split(".")[0] * 1)
    })
    //console.log(data.length, newArray)
    //progress.setImageData(data.length,newArray)
    progress.setImageData(newArray)
    this.changeLayeIdTime = null
    progress.event._addEvent("ctprogress.stopDrag", () => {
      if (this.changeLayeIdTime != null) {
        clearInterval(this.changeLayeIdTime)
      }
      this.changeLayeIdTime = null
    })
    progress.event._addEvent("ctprogress.click", () => {
      this.changeLayeIdTime = 0
      let layserId = Math.floor(progress.getRate())
      that.cornerstoneArray[id].funcNodule(layserId)
    })
    progress.event._addEvent("ctprogress.startDrag", () => {
      this.changeLayeIdTime = setInterval(() => {
        let layserId = Math.floor(progress.getRate())
        that.cornerstoneArray[id].funcNodule(layserId)
      }, 500)
    })
    console.log("==============")
    this.cornerstoneArray[id].progress = progress
    //图片渲染
    let total = data.length // Tool.changeToName(imageAddress[imageAddress.length - 1], 'jpg')
    //console.log(imageAddress[data.length - 1], total, imageAddress)
    this.cornerstoneArray[id].event._addEvent(
      "Cornerstone_Class.cornerstonetoolsmousemove",
      function(value) {
        let data = JSON.parse(
          JSON.stringify(that.model.getDicomValue(value.detail))
        )
        data.sId = that.cornerstoneArray[id].sId
        data.id = id
        that.event._dispatch("ctcornerstone.HUShow", data)
        //console.log(allData)
      }
    )
    this.cornerstoneArray[id].event._addEvent(
      "Cornerstone_Class.wlChange",
      () => {}
    )
    let tempData = null
    this.cornerstoneArray[id].event._addEvent(
      "Cornerstone_Class.cornerstonetoolsmousewheel",
      function(e) {
        if (!that.crossmove && that.crossOpen) {
          that.changePOint(id, that.dom.find("#ct" + id).box())
        }
      }
    )

    this.cornerstoneArray[id].event._addEvent(
      "Cornerstone_Class.updateImageTagComponentData",
      function(layerId) {
        that.updateImageTagComponentData(layerId)
      }
    )

    this.ctEvent(id, imageAddress, data, total)
  }
  endDone(value, num) {
    //console.log(value, 'valuevaluevaluevaluevaluevaluevalue')
    value.uuid = value.id
    let aaa = this.drawInfo.getInfo(value)
    //console.log(aaa.backId)
    let that = this
    if (aaa.backId) {
      value = this.drawInfo.removeInfo(value)
      if (this.nodeInfo) {
        if (this.nodeInfo[value.layerNumber]) {
          for (let i = 0; i < this.nodeInfo[value.layerNumber].length; i++) {
            if (
              this.nodeInfo[value.layerNumber][i].nodeInfo.uuid == value.id ||
              this.nodeInfo[value.layerNumber][i].nodeInfo.id == value.id
            ) {
              this.nodeInfo[value.layerNumber].splice(i, 1)
            }
          }
        }
      }
      this.sequencelist.removeNode(value)

      this.hideMarkInfoClearNidusChoose()

      this.event._dispatch("ctcornerstone.deleteNode", {
        backId: value.backId
      })
    } else {
      setTimeout(() => {
        num++
        if (num < 200) {
          this.endDone(value, num)
        }
      }, 30)
    }
  }

  //控制分屏
  setScreen(value) {
    if (value > this.sceen) {
      for (let i = this.sceen; i < value; i++) {
        let html =
          `<div class="c_fbb03b ct` +
          i +
          `" pos="` +
          i +
          `">
            <div class="fl w50_ pr c` +
          i +
          `">
                <div id="ct` +
          i +
          `"></div>
            </div>
            <div class="wc-ww"> 
              <p class="sc"></p>
              <p class="wwc"></p>
              <p class="layer"></p>
            </div>
            <p class="infoXYZ"></p>
            <p class="cal"></p>
            <div class="line"></div>
            <div class="image_progress"></div>
            <div class="slideContainer"></div>
            </div>`
        this.dom.find(".dicom_content").append(html)
      }
    }
    if (value < this.sceen) {
      for (let i = value; i < this.sceen; i++) {
        if (this.cornerstoneArray[i]) {
          this.cornerstoneArray[i].close()
          this.cornerstoneArray[i] = null
        }
        this.dom.find(".dicom_content .ct" + i).remove()
      }
    }
    let that = this
    this.dom.find(".c0").off("click")
    this.dom.find(".c0").on("click", function() {
      that.dom.find(".c_fbb03b").css({
        border: "1px solid #fff"
      })
      let dom = ES.selctorDoc(this)
      dom.css({
        border: "1px solid #448e97"
      })
      that.choosescreen = dom.attr("pos")
      const curLayInfo = that.cornerstoneArray[that.choosescreen]
      let sId = curLayInfo ? curLayInfo.sId : null
      if (sId) {
        let finding = that.model.seriesInfo[sId].info.data.finding
        let conclusion = that.model.seriesInfo[sId].info.data.conclusion
        that.nidusControlAll.updataReport(finding, conclusion)

        // 跳转到对应的图层
        that.gotoLayer(null, sId)
      }
      that.sequencelist.showNowData(sId)
    })
    this.sceen = value
    this.resize()
  }
  getImgsAnsNumbers(){
    let imgs = [], numbers = [];
    let studyInstanceUid = this.modelData.series_result_id.studyInstanceUid;
    for( let key in this.modelData.seriesInfo ){
      if( key === studyInstanceUid ){
        imgs = this.modelData.seriesInfo[key].imgs;
        numbers = this.modelData.seriesInfo[key].numbers;
      }
    }
    return {
      imgs,
      numbers
    };
  }
  appendHtml(imgs,numbers){
    let _this = this;
    let html = '';
    imgs.forEach((img,index)=>{
      let id = "slideImg"+index;
      let number = numbers[index];
      html += '<li id="'+id+'" number="'+number+'"  class="'+id+'"  src="'+img+'"  index="'+index+'" ></li>';
    })
    $(".slideContainer").append(html);
    $(".slideContainer ").on('click', 'li', function(){
      let number = Number($(this).attr("number"));
      let id = _this.modelData.series_result_id.studyInstanceUid;
      _this.gotoLayer(number, id);
    })
  }

  gotoLayer(layerid, nid) {
    //this.shownowid = nid
    let nidA = nid.split("_")
    for (var i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        if (nid.lastIndexOf(this.cornerstoneArray[i].sId) != -1) {
          if (!layerid || layerid == "undefined") {
            layerid = this.nowLayNum(i)
          }
          this.cornerstoneArray[i].funcNodule(layerid)
        }
      }
    }
  }

  renderThumb(){
    const imgsAnsNumbers = this.getImgsAnsNumbers();
    let imgs = imgsAnsNumbers.imgs;
    let numbers = imgsAnsNumbers.numbers;
    this.appendHtml(imgs,numbers);
    imgs.forEach((img,index)=>{
      const element = this.dom.find("#slideImg" + index).dom[0].dom;
      cornerstone.enable(element);
      cornerstone.loadImage(img).then((image) => {
          var viewport = cornerstone.getDefaultViewportForImage(element, image);
          viewport.voiLUT = undefined; // 解决DR片子打开窗宽床位显示不对, 且无法调整
          cornerstone.displayImage(element, image, viewport);
      });
    })
  }

  changeWWCImage(imgs) {
    if (!imgs) {
      return
    }
    if (
      imgs[0] ==
      this.cornerstoneArray[this.choosescreen].axialStack1.imageIds[0]
    ) {
      return
    }
    this.cornerstoneArray[this.choosescreen].imageAddress = imgs
    this.cornerstoneArray[this.choosescreen].axialStack1.imageIds = imgs
    let layerid = this.nowLayNum(this.choosescreen)
    setTimeout(() => {
      this.cornerstoneArray[this.choosescreen].funcNodule(layerid)
    }, 10)
  }

  //进行特殊id的赋值
  setSpliceId(value, type) {
    //if (!value.uuid) {
    let nowData = this.cornerstoneArray[0].geSiglneState(type)
    if (nowData) {
      nowData.data.map(function(item) {
        if (item.id == value.id) {
          value.uuid = item.uuid = value.id
        }
      })
    }
  }
  setSpliceUUID(value, type, uuid, cid) {
    //if (!value.uuid) {
    let nowData = this.cornerstoneArray[cid].geSiglneState(type)
    if (nowData) {
      nowData.data.map(function(item) {
        if (item.id == value.id) {
          value.uuid = item.uuid = uuid
        }
      })
    }
  }
  getAlllayer(value) {
    let layarr = []
    for (var i = 0; i < this.cornerstoneArray.length; i++) {
      if (this.cornerstoneArray[i]) {
        if (
          this.cornerstoneArray[i].axialStack1.currentImageIdIndex ==
          this.cornerstoneArray[value].axialStack1.currentImageIdIndex
        ) {
          layarr.push(i)
        }
      }
    }
    return layarr
  }
  setbrush(value) {
    if (value.imglist.length == 0) {
      this.event._dispatch("ctcornerstone.brushfirstload")
      return
    }
    let that = this
    let allload = 0
    let length = value.imglist.filter(item => {
      return item
    }).length
    let num = 0
    //console.log(value.imglist)
    if (length == 0) {
      this.event._dispatch("ctcornerstone.brushfirstload")
      return
    }
    for (let i = 0; i < value.imglist.length; i++) {
      if (value.imglist[i]) {
        if (num == 0) {
          num = i
        }
        //console.log(num)
        //console.log(Tool.changeToName(value.imglist[i]), 'Tool.changeToName(value.imglist[i])Tool.changeToName(value.imglist[i])')
        let img = new Image()
        img.id = i
        img.crossOrigin = ""
        img.onload = function() {
          allload++
          that.brushManage.creatNewImage(
            this,
            value,
            {
              width: this.width,
              height: this.height
            },
            this.id,
            that.model.nidusChoose ? that.model.nidusChoose.bid : ""
          )
          if (allload >= length) {
            setTimeout(function() {
              let dataVol = Math.floor(
                that.brushManage.getPixTotal(value.id) *
                  that.model.seriesInfo[value.sId].volumeCal *
                  100
              )
              let calData = {
                id: value.id,
                cal: "出血量:" + dataVol / 100 + "mm<sup>3</sup>"
              }
              that.sequencelist.upCal(calData)

              if (that.cornerstoneArray[0]) {
                that.cornerstoneArray[0].brushFan()
                that.cornerstoneArray[0].disableAllTools(true)
              }

              that.event._dispatch("ctcornerstone.brushfirstload")
            }, 300)
          }
        }
        img.onerror = function() {
          allload++
          if (allload >= length) {
            setTimeout(function() {
              if (that.cornerstoneArray[0]) {
                that.cornerstoneArray[0].brushFan()
                that.cornerstoneArray[0].disableAllTools(true)
              }
              //that.cornerstoneArray[0].brushFan()
              //that.cornerstoneArray[0].disableAllTools(true)
              that.event._dispatch("ctcornerstone.brushfirstload")
            }, 300)
          }
        }
        img.src = value.imglist[i]
      }
    }
    this.sequencelist.setLayerInfo(value, num)
    //this.addVlaue = value
    // 左边图层和病灶列表排序
    this.sequencelist.sortByDom()
  }
  nowLayNum(sId) {
    return (
      String(this.dom.find(".ct" + sId + " .layer").html()).split("/")[0] * 1
    )
  }

  //删除标注
  deleteNode(key, value, type) {
    let that = this
    this.model.controlStauts.delete = true
    this.app.alert.show({
      title: " ",
      msg: "确认删除将清除该影像标注的图形和信息？",
      close: true,
      sure: function() {
        // 获取下一个病灶的dom
        const nextNode =$(`.nodeInfolist div[uuid='${value.uuid}']`).next('div:visible')

        if (type == "nobrush" && value.type !== 'imagetag') {
          that.doneDelete(key, value)
        } else {
          that.drawInfo.removeInfo(value)

          if (that.nodeInfo && that.nodeInfo[value.layerNumber]) {
            for (let i = 0, j = that.nodeInfo[value.layerNumber].length; i < j; i++) {
              const nodeInfoObj = that.nodeInfo[value.layerNumber][i]
              if (!nodeInfoObj) continue
              const nodeInfoItem = nodeInfoObj.nodeInfo
              if (
                nodeInfoItem.uuid == value.uuid ||
                nodeInfoItem.id == value.uuid ||
                nodeInfoItem.uuid == value.backId // 兼容imagetag
              ) {
                that.nodeInfo[value.layerNumber].splice(i, 1)
                that.gotoLayer(value.layerNumber, value.sId)
              }
            }
          }
          that.brushManage.delbrush(value)
          that.gotoLayer(value.layerNumber, value.sId) //that.nowLayNum()
          that.sequencelist.removeNode(value)
          that.hideMarkInfoClearNidusChoose()
          if (that.model.nidusChoose) {
            if (that.model.nidusChoose.uuid == value.uuid) {
              that.model.nidusChoose = null
            }
          }

          that.event._dispatch("ctcornerstone.deleteNode", {
            backId: value.backId
          })
        }

        // 删除后，选中下一个病灶
        if (nextNode.length) {
          nextNode.find('.nname').click()
        }
      }
    })
  }
  //提示以后确认要删除的
  doneDelete(key, value) {
    let that = this
    if (!key) {
      if (this.nodeInfo) {
        const nodeInfoData = this.nodeInfo[value.layerNumber]
        if (this.nodeInfo[value.layerNumber]) {
          const valueId = value.id
          for (let i = 0; i < this.nodeInfo[value.layerNumber].length; i++) {
            const nodeInfo = this.nodeInfo[value.layerNumber][i].nodeInfo
            if (!nodeInfo) continue
            if (nodeInfo.uuid === valueId || nodeInfo.id === valueId) {
              this.nodeInfo[value.layerNumber].splice(i, 1)
            }
          }
        }
      }
      this.sequencelist.removeNode(value)
    }
    //console.log(toolData, 'deleteNode')
    let arr = []
    let ctArray = []
    let haveScreen = false
    for (let i = 0; i < this.sceen; i++) {
      //console.log(value.sId, this.cornerstoneArray[i].sId, key)
      if (this.cornerstoneArray[i]) {
        if (this.cornerstoneArray[i].sId == value.sId) {
          ctArray = i
          let toolData = this.cornerstoneArray[i].getAllState()
          //console.log(JSON.stringify(toolData), 'toolDatatoolDatatoolDatatoolDatatoolData')
          toolData.map(function(item) {
            if (key) {
              if (item.active && item.uuid) {
                item.layerNumber = String(
                  that.dom.find(".ct" + i + " .layer").html()
                ).split("/")[0]
                for (
                  let i = 0;
                  i < that.nodeInfo[item.layerNumber].length;
                  i++
                ) {
                  if (
                    that.nodeInfo[item.layerNumber][i].nodeInfo.id == item.id
                  ) {
                    that.nodeInfo[item.layerNumber].splice(i, 1)
                  }
                }
                if (item.tooltype != "alignment") {
                  let data = that.drawInfo.getInfo(item)
                  that.cornerstoneArray[i].clearSigleData(item.tooltype, item)
                }
              }
            } else {
              if (item.tooltype != "alignment") {
                if (item.id == value.id || item.uuid == value.uuid) {
                  that.cornerstoneArray[i].clearSigleData(item.tooltype, item)
                }
              }
            }
          })
          haveScreen = true
        }
      }
    }
    if (!haveScreen) {
      this.hideMarkInfoClearNidusChoose()
    }
    //this.sequencelist.setLayerInfo(value, num)
    //this.addVlaue = value
  }

  //控制影像标注信息显示还是不显示
  controlNodeShowHide(value) {
    this.nodeShow = value.stauts
    this.model.controlStauts.delete = false
    //let dom=this.dom.find('.layer')
    //let layer = this.dom.find('.layer').html().split('/')[0]
    if (!this.nodeShow) {
      this.clearData("biao")
    }
    for (let i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        let layer = this.dom
          .find(".layer")
          .eq(i)
          .html()
          .split("/")[0]
        this.gotoLayer(layer, this.cornerstoneArray[i].sId) // this.shownowid)
      }
    }
  }

  //跳转到对应的层
  gotoLayer(layerid, nid) {
    //this.shownowid = nid
    let nidA = nid.split("_")
    for (var i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        if (nid.lastIndexOf(this.cornerstoneArray[i].sId) != -1) {
          if (!layerid || layerid == "undefined") {
            layerid = this.nowLayNum(i)
          }
          this.cornerstoneArray[i].funcNodule(layerid)
        }
      }
    }
  }

  //设置一些参数，以方便处理
  setConfigByDicommeun(value) {
    switch (value.type) {
      case "bradius":
        this.cornerstoneTools_config.brush_config.radius = value.value
        break
      case "lineWidth":
        this.cornerstoneTools_config.freehand_config.lineWidth = value.value
        break
      case "pdistance":
        this.cornerstoneTools_config.polygon_config.distance = value.value
        break
      case "pdeviation":
        this.cornerstoneTools_config.polygon_config.deviation = value.value
        break
      case "qdeviation":
        this.cornerstoneTools_config.quickselect_config.deviation = value.value
        break
    }
  }

  //调用各种方法
  defaultFunction(funName, tooltype) {
    if (tooltype) {
      this.tooltype = tooltype
    }
    for (var j = 0; j < this.sceen; j++) {
      if (this.cornerstoneArray[j]) {
        this.cornerstoneArray[j].moveAllElementData = null
      }
    }
    if (
      funName != "restFan" &&
      funName != "clearFan" &&
      funName != "resizeCon"
    ) {
      this.controlename = funName
    }
    if (
      funName == "regionpaintFan" ||
      funName == "freehandFan" ||
      funName == "polygonFan" ||
      funName == "quickselectFan"
    ) {
      if (this.model.nidusChoose) {
        this.sequencelist.clickById(this.model.nidusChoose)
      }
    }
    if (funName == "undefinedFan") {
      this.controlename = null
      this.disableAllTools(true)
      return
    }
    if (!funName) {
      this.disableAllTools(true)
      return
    }
    if (
      funName == "polygonFan" ||
      funName == "quickselectFan" ||
      funName == "regionpaintFan" ||
      funName == "freehandFan"
    ) {
      //this.dom.find('.submit_data').show()
    }
    let now_config = {}
    if (this.cornerstoneTools_config) {
      let key = funName.replace("Fan", "_config")
      now_config = this.cornerstoneTools_config[key]
        ? this.cornerstoneTools_config[key]
        : {}
    }
    if (funName == "earseFan") {
      funName = "brushFan"
    }
    if (funName == "rectangle_textFan") {
      funName = "rectangleRoiFan"
    }
    if (funName == "lineFan") {
      funName = "lengthFan"
    }
    //console.log(now_config)
    this.setoolconfig.setconfig(funName, now_config)
    if (this.nowmpr) {
      this.nowmpr.defaultFunction(funName)
    }
    for (var i = 0; i < this.sceen; i++) {
      //console.log(this.cornerstoneArray[i].sId)
      if (this.cornerstoneArray[i] && this.cornerstoneArray[i].getViewport()) {
        this.nowWWC[i] = {
          c: this.cornerstoneArray[i].getViewport().voi.windowCenter,
          w: this.cornerstoneArray[i].getViewport().voi.windowWidth
        }
        if (
          funName != "zoomFan" &&
          funName != "wlFan" &&
          funName != "brushFanTe" &&
          funName != "restFan" &&
          funName != "resizeCon" &&
          funName != "clearFan"
        ) {
          let sid = this.cornerstoneArray[i].sId
          if (!this.model.seriesInfo[sid].needAnno) {
            return
          } else {
            eval("this.cornerstoneArray[i]." + funName + "()")
          }
        } else {
          eval("this.cornerstoneArray[i]." + funName + "()")
        }
      }
    }
  }
  disableAllTools() {
    for (var i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        this.cornerstoneArray[i].disableAllTools(true)
      }
    }
  }
  lungWindown(c, w, imgs) {
    //console.log(imgs)
    if (c == null || w == null) {
      c = 128 //this.cornerstoneArray[this.choosescreen].colcDefault
      w = 256 //this.cornerstoneArray[this.choosescreen].colwDefault
    }
    this.nowWWC[this.choosescreen] = {
      c: c,
      w: w
    }
    this.changeWWCImage(imgs)
    // console.log(this.nowWWC, 'this.nowWWCthis.nowWWCthis.nowWWC')
    if (!this.cornerstoneArray[this.choosescreen]) {
      return
    }

    this.cornerstoneArray[this.choosescreen].lungWindown(c, w)
    this.nowWWC[this.choosescreen] = {
      c: this.cornerstoneArray[this.choosescreen].getViewport().voi
        .windowCenter,
      w: this.cornerstoneArray[this.choosescreen].getViewport().voi.windowWidth
    } //this.cornerstoneArray[this.choosescreen].getViewport()
  }
  getSid() {
    return this.cornerstoneArray[this.choosescreen].sId
  }
  showWWC(value, sId, id) {
    // console.log(value,this.model.seriesInfo[sId].info.wwc)
    let max = value.windowCenter + value.windowWidth / 2
    let min = value.windowCenter - value.windowWidth / 2
    if (this.imageType != "DCM") {
      let mindata = this.model.seriesInfo[sId].info.wwc.low * 1
      let range =
        this.model.seriesInfo[sId].info.wwc.hight * 1 -
        this.model.seriesInfo[sId].info.wwc.low * 1
      max = (range * max) / 255 + mindata
      min = (range * min) / 255 + mindata
      // this.getMMCImage()
      if (
        this.dom.find(".ct" + id + " .wwc").html() !=
        "wc:" + Math.round((max + min) / 2) + " ww:" + Math.round(max - min)
      ) {
        let data = {}
        data.sId = this.cornerstoneArray[id].sId
        data.wwc = {
          c: Math.round((max + min) / 2),
          w: Math.round(max - min)
        }
        this.event._dispatch("ctcornerstone.wlChange", data)
      }
    }
    this.dom
      .find(".ct" + id + " .wwc")
      .html(
        "wc:" + Math.round((max + min) / 2) + " ww:" + Math.round(max - min)
      )
  }

  huValue(value) {
    //console.log(value)
    let xyinfo =
      "X:" + value.point.x.toFixed(2) + "<br/>Y:" + value.point.y.toFixed(2)
    let HU = value.hu ? "<br />CT值:" + value.hu.toFixed(2) : ""
    this.dom.find(".ct" + value.id + " .infoXYZ").html(xyinfo + HU)
  }
  clearData(type) {
    let probe = this.cornerstoneArray[0].geSiglneState("probe")
    let length = this.cornerstoneArray[0].geSiglneState("length")
    let rectangleRoi = this.cornerstoneArray[0].geSiglneState("rectangleRoi")
    let ellipticalRoi = this.cornerstoneArray[0].geSiglneState("ellipticalRoi")
    let simpleAngle = this.cornerstoneArray[0].geSiglneState("simpleAngle")
    //console.log(rectangleRoi, length)
    if (probe) {
      this.toolDataClear(probe.data, "probe", type)
    }
    if (simpleAngle) {
      this.toolDataClear(probe.data, "simpleAngle", type)
    }
    if (length) {
      this.toolDataClear(length.data, "length", type)
    }
    if (rectangleRoi) {
      this.toolDataClear(rectangleRoi.data, "rectangleRoi", type)
    }
    if (ellipticalRoi) {
      this.toolDataClear(ellipticalRoi.data, "ellipticalRoi", type)
    }
  }
  toolDataClear(dataArray, type, who) {
    dataArray.map(item => {
      if (who == "meas") {
        if (!item.uuid) {
          this.cornerstoneArray[0].clearSigleData(type, item)
          this.toolDataClear(dataArray, type, who)
          return
        }
      } else {
        if (item.uuid) {
          this.cornerstoneArray[0].clearSigleData(type, item)
          this.toolDataClear(dataArray, type, who)
          return
        }
      }
    })
  }
  clearSigleFan(name) {
    this.cornerstoneArray[0].clearSigleFan(name)
  }
  claerAll() {
    this.drawInfo.removeAll()
    this.clearLayer = []
  }
  close() {
    for (var i = 0; i < this.sceen; i++) {
      if (this.cornerstoneArray[i]) {
        this.cornerstoneArray[i].close()
      }
    }
    this.nodeShow = true
    this.hideMarkInfoClearNidusChoose()
    this.brushManage.deleteAll()
    this.cornerstoneArray = []
  }
  // 显示右边IMAGE_TAG的选项值
  updateImageTagComponentData(layer) {
    // 之前选中的选项
    const preChoosedDom = $(`.sequencelist .nodeInfolist .choose`)
    const preChoosedDomIsImageTag = preChoosedDom.length && (preChoosedDom.attr('tooltype') === 'IMAGE_TAG')

    if (!this.model.layerMarkImageAnnotation) return // 项目未配置图层标记工具

    // 确保左边病灶列表已经渲染完成，否则下面的this.sequencelist.findNidusFromList(sId, layer, 'IMAGE_TAG')会找不到的
    const sequenceDom = this.dom.find('.sequencelist .sequence-wrapper')
    if (!sequenceDom || !sequenceDom.html()) {
      setTimeout(() => {
        this.updateImageTagComponentData(layer)
      }, 1000);
      return
    }

    this.model.imageAnnotationResultId = ''
    const { seriesInstanceUid: sId } = this.model.currentSeriesInfo

    // 设置层数
    const layernumberDom = this.dom.find('.layer-mark-title .layer-mark-layernumber')
    layernumberDom.dom && layernumberDom.html(layer)
    // 查找当前层的图层标注
    const imageLayerDom = this.sequencelist.findNidusFromList(sId, layer, 'IMAGE_TAG')
    // 当前层不存在图层标注
    if (!imageLayerDom || !imageLayerDom.attr('bid')) {
      this.nidusControlAll.clearAllLayerMarkChoosed() // 清空图层标注的值
      preChoosedDomIsImageTag && this.sequencelist.clearChoosed() // 类型是IMAGE_TAG的将其不选中
      return
    }

    // 设置当前的标注图层的bid，也就是其他很多地方用到的backId
    this.model.imageAnnotationResultId = imageLayerDom.attr('bid')

    // 点击对应的图层标注
    // 没选 || (之前选的是图层标记 && 不是同一层) 点击
    if (preChoosedDom.length === 0 || (preChoosedDomIsImageTag && preChoosedDom.attr('layerinfo') != layer)) {
      imageLayerDom.find('.nname').click()
      this.sequencelist.scrollToChooseItem()
    } else {
      // 不需要点击图层标记项，则只赋值不选中左侧列表项（点击左侧图层标注项进来时，也会触发，需要以下条件过滤掉）
      !(preChoosedDomIsImageTag && preChoosedDom.attr('layerinfo') == layer) && this.setImageTagData(imageLayerDom)
    }
  }

  // 给imagetag赋值
  setImageTagData(dom) {
    let value = {
      toolType: dom.attr("toolType"),
      type: dom.attr("brushtype") || 'nobrush',
      sId: dom.attr("sId"),
      niddtype: dom.attr("niddtype"),
      uuid: dom.attr("uuid"),
      layerNumber: dom.attr("layerInfo"),
      bid: dom.attr("bid")
    }
    let info = this.model.nidusComponentInfo[value.niddtype]
        ? Tool.objetClone(this.model.nidusComponentInfo[value.niddtype])
      : null
    if (info) {
      info.annotationItemResultList = this.model.nidusComponentData[value.bid]
    }
    this.nidusControlAll.setLayerMarkData(info) // 设置imageTag类型的组件数据
  }

  // 关闭最右边病灶标注信息的弹窗，同时清除最左边病灶列表中的病灶选中状态
  hideMarkInfoClearNidusChoose() {
    if (this.nidusControl) {
      this.nidusControl.isShow() && this.nidusControl.hide()
    }
    this.sequencelist.clearChoosed()
  }

  // 选中对应图层在左侧的图层标记
  // chooseSequenceImagetagItem(layer) {
  //   const { seriesInstanceUid: sId } = this.model.currentSeriesInfo
  //   const choosedDom = $(`.sequencelist .nodeInfolist .choose`)
  //   // 类型不是IMAGE_TAG的不处理
  //   if (choosedDom.length && (choosedDom.attr('tooltype') !== 'IMAGE_TAG' || Number(choosedDom.attr('layerinfo')) === layer)) return
  //   // 删除其他选中项并选中对应图层的图层标注
  //   choosedDom.length && choosedDom.removeClass('choose')
  //   $(`.sequencelist .nodeInfolist div[sid="${sId}"][layerinfo="${layer}"][tooltype="IMAGE_TAG"]`).addClass('choose')
  //   // 滚动到对应位置
  //   this.sequencelist.scrollToChooseItem()
  // }

  resize() {
    let cw = ES.selctorDoc(window).box().clientWidth
    let ch = ES.selctorDoc(window).box().clientHeight - 60 - 64
    this.dom.find(".ctcornerstone").css({
      width: cw
    })
    this.dom.find(".ctcornerstone .dicom_content").css({
      width: cw - 290 - 180,
      height: ch - 105
    })
    this.dom.find(".ctcornerstone .mpr").css({
      width: cw - 290 - 180,
      height: ch
    })
    this.dom.find(".ctcornerstone .slist").css({
      width: cw - 290 - 180
    })
    this.dom.find(".ctcornerstone .slist .sequence-body-parent").css({
      width: cw - 290 - 180
    })
    this.dom.find(".ctcornerstone .xulielist").css({
      height: ch
    })
    this.dom.find(".ctcornerstone .info").css({
      height: ch
    })
    this.dom.find(".ctcornerstone .nidus_content").css({
      height: ch
    })
    if (this.sceen) {
      let layout = this.model.getLayout(this.sceen)
      let w = (cw - 290 - 180) * layout.w
      let h
      if (this.makeStudy) {
        h = (ch - 105) * layout.h
      } else {
        h = ch * layout.h
      }
      //console.log(w, h)
      for (var i = 0; i < this.sceen; i++) {
        this.dom.find("#ct" + i).css({
          width: w,
          height: h
        })
        this.dom.find(".ct" + i).css({
          top: layout.t == 0 ? 0 : i >= this.sceen / 2 ? h : 0,
          left:
            layout.t == 0
              ? i * w
              : i >= this.sceen / 2
              ? (i - this.sceen / 2) * w
              : i * w
        })
        this.dom.find(".ct" + i + " .image_progress").css({
          height: ch
        })
        if (this.cornerstoneArray[i]) {
          //console.log(i, 'iiiiiiiiiiiii')
          this.defaultFunction("resizeCon")
          if (this.crossOpen) {
            this.calflow(i)
            if (this.crossArray[i]) {
              this.crossArray[i].setYHeight(h)
            }
          }
          this.cornerstoneArray[i].progress.resize(this.nowLayNum(i))
        }
      }
    }
    if (this.nowmpr) {
      this.nowmpr.resize(cw - 290 - 180, ch)
    }
    /*if (this.cornerstoneArray[0]) {
      this.defaultFunction('resizeCon')
    }*/
    if (this.nidusControl) {
      this.nidusControl.resize()
    }
    if (this.nidusControlAll) {
      this.nidusControlAll.resize()
    }
  }
}

//原型链一定要有的
//window.ctcornerstone_base = window.ctcornerstone_base || {}
window.ctcornerstone_base = window.ctcornerstone_base || ctcornerstone_base
module.exports = ctcornerstone_base
