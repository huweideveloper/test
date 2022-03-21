//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。


class MarkBase extends Interstellar.pagesBase {
  constructor(app, api, dom, model) {
    super(app, api, dom, model)
  }

  //初始化
  complete() {
    this.useinfo = JSON.parse(this.app.local.get("all"))
    this.nowTaskOver = false
    this.type = "doctor"
    //this.imageType = "DCM"
    this.imageType = "JPG"
    this.imageDataType = "orgin"
    require("../../modules/ctcornerstone/ctcornerstone_base")
    this.cornerstoneLoad() //主要是添加 影像区的dom结构，并且监听片子相关的事件
    this.styleModel(1)    //设置样式，主要是隐藏左侧菜单，并且设置一些样式
    this.dicommenuLoad()  // 添加 cornerstone 相关操作菜单，并设置相关的监听事件 
    this.modalLoad()
    this.baseApi()        //调api，获取数据
    this.btnEvent()       //注册点击事件,注意：这是实际上会调用./app/pages/markview.js 文件里的btnEvent方法
    this.resize()

    this.drawInfo = require("../../modules/ctcornerstone/manager.js")
  }

  //---------------------------------会自动允许---------------------------------
  //获取序列结果id之后自动运行的方法
  series_result_id() {
    this.start_series()
  }

  //获取项目信息之后自动运行的方法
  projectInfo() {
    this.annotationIteminit()
    this.setWWC()
  }

  //设置默认窗宽窗位
  setWWC() {
    if (this.model.projectInfo.window) {
      this.dicommenu.defaultWWC(this.model.projectInfo.window)
    }
  }

  //获取序列结果以后自动运行的方法
  seriesResult() {
    this.seriesInfo()
  }

  //数据都准备好了，结果值拿好了，序列对应的信息也拿好了。全部进入这个方法，开始初始化序列，结果什么乱起八糟的东西了
  seriesInfo() {
    let seriesInfoNum = 0
    let seriesResultNum = 0
    for (let i in this.model.seriesInfo) {
      if (this.model.seriesInfo[i].imgs) {
        seriesInfoNum++
      }
    }
    for (let j in this.model.seriesResult) {
      seriesResultNum++
    }
    if (
      seriesInfoNum == seriesResultNum &&
      seriesResultNum != 0 &&
      seriesInfoNum != 0
    ) {
      this.cornerstoneStart() //cornerstone初始化
      setTimeout(() => {
        this.listInit()
      }, 500)
    }
  }

  

  //----------------------------各大模块初始化------------------------------
  //影像区加载初始化
  cornerstoneLoad() {
    let that = this
    let cornerstoneClass
    if (
      window.location.hash.lastIndexOf("markview") != -1 ||
      window.location.hash.lastIndexOf("markaudit") != -1
    ) {
      cornerstoneClass = require("../../modules/ctcornerstone/ctcornerstone_view")
    } else {
      if (window.location.hash.lastIndexOf("drapCanvas") == -1) {
        cornerstoneClass = require("../../modules/ctcornerstone/ctcornerstone")
      } else {
        cornerstoneClass = require("../../modules/cttool/cttool")
      }
    }
    // 把片子的dom结构添加到class mark-content 里面
    this.cornerstoneContorl = this.app.loadModule(
      cornerstoneClass,
      this.dom.find(".mark-content")
    )

    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.imgloadError",
      function(value) {
        if (that.progress) {
          that.progress.stopAll()
          that.progress.close()
        }
      }
    )
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.loadingfinish",
      function(value) {
        that.makeWwC(value.sId)
        if (that.progress) {
          that.progress.stopAll()
        }
      }
    )
    //HU的值显示
    this.cornerstoneContorl.event._addEvent("ctcornerstone.HUShow", value => {
      let infoData = this.model.seriesInfo[value.sId].info
      if (infoData.data.fileType == "DCM") {
        if (this.imageDataType != "orgin") {
          value.hu =
            ((infoData.wwc.hight * 1 - infoData.wwc.low * 1) * value.hu) / 255 +
            infoData.wwc.low * 1
        }
      } else {
        value.hu = ""
      }
      this.cornerstoneContorl.huValue(value)
    })

    this.cornerstoneContorl.event._addEvent("ctcornerstone.saveLayerMarkInfo", value => {
      const that = this
      that.app.loading.show()
      const cornerstoneModel = that.cornerstoneContorl.model

      const edit = (layerNumber) => {
        const annotationItemResultList = []
        for (var i in value) {
          const { formComponentId, result } = value[i]
          annotationItemResultList.push({
            annotationItemId: i,
            formComponentId,
            result
          })
        }
        that.api.image_result_item_edit({
          id: cornerstoneModel.imageAnnotationResultId,
          annotationItemResultList
        }).done(function() {
          that.app.loading.hide()
          // 更新cornerstoneContorl.model.nidusComponentData中的result值
          const imageAnnoId = cornerstoneModel.imageAnnotationResultId
          if (!cornerstoneModel.nidusComponentData[imageAnnoId]) {
            cornerstoneModel.nidusComponentData[imageAnnoId] = {}
          }
          let tempImageAnnotationResult = cornerstoneModel.nidusComponentData[imageAnnoId]
          annotationItemResultList.forEach(item => {
            const { annotationItemId, result} = item
            if (tempImageAnnotationResult[annotationItemId]) {
              tempImageAnnotationResult[annotationItemId].result = result
            } else {
              tempImageAnnotationResult[annotationItemId] = item
            }
          })
          // that.updateSequencelistData(layerNumber, annotationItemId, layerMarkVal)
        })
      }

      const layerNumber = cornerstoneModel.currentLayer
      if (cornerstoneModel.imageAnnotationResultId) {
        edit(layerNumber)
      } else {
        const { seriesAnnotationResultId, seriesInstanceUid } = cornerstoneModel.currentSeriesInfo
        const { imageAnnotationToolId, imageAnnotationToolType, imageAnnotationId, imageAnnotation } = cornerstoneModel.layerMarkImageAnnotation

        that.api.image_result_create({
          seriesAnnotationResultId, // 系列标注的id
          imageAnnotationId,
          imageAnnotationToolId,
          result: JSON.stringify({ z: layerNumber })
        }).done(function(res) {
          const imageAnnotationResultId = cornerstoneModel.imageAnnotationResultId = res.data.id // 此id就是其他很多地方用到的backId
          // 往左边的序列列表中添加一条记录
          const newNode = {
            uuid: imageAnnotationResultId,
            backId: imageAnnotationResultId,
            sId: seriesInstanceUid,
            type: "imagetag",
            layerNumber,
            toolType: {
              imageAnnotation
            },
            imageAnnotationToolType
          }
          that.drawInfo.setInfo(newNode)
          that.cornerstoneContorl.sequencelist.addNode(newNode, true)
          edit(layerNumber)
        })
      }
    })
    this.cornerstoneContorlOther()
  }
  cornerstoneContorlOther() {}
  //************************弹框区*************************

  //菜单加载
  dicommenuLoad() {
    let that = this
    let configTool = require("../../../config/toolmenu_config.js")
    let tool_user = configTool(1)
    let dicommenu = require("../../modules/dicommenu/dicommenu")
    this.dicommenu = this.app.loadModule(
      dicommenu,
      this.dom.find(".mark-menu"),
      tool_user
    )
    if (window.location.hash.lastIndexOf("view") != -1) {
      this.dicommenu.closeYY()
    }

    this.dicommenu.event._addEvent("dicommenu.choose", function(value) {
      //if(that.dicommenu.chooseData=='')
      if (JSON.stringify(that.dicommenu.chooseData) == "{}") {
        that.cornerstoneContorl.defaultFunction(null, null) 
        return
      }
      let menuChoose = that.dicommenu.chooseData
      let tooltype = that.dicommenu.chooseData.data
      that.cornerstoneContorl.defaultFunction(menuChoose.fun + "Fan", tooltype)
    })
    this.dicommenu.event._addEvent("dicommenu.wlchange", function(value) {
      let menuChoose = that.dicommenu.chooseData.wl
      let sId = that.cornerstoneContorl.getSid()
      //that.cornerstoneContorl.changeWWCImage()
      if (menuChoose.w != null && menuChoose.c != null) {
        /*let wwc = that.getwwc({
                    wc: menuChoose.c * 1,
                    ww: menuChoose.w * 1
                }, sId)*/
        let wwc =
          that.model.projectInfo.seriesImgFileType == 2
            ? {
                wc: menuChoose.c,
                ww: menuChoose.w
              }
            : that.getwwc(
                {
                  wc: menuChoose.c * 1,
                  ww: menuChoose.w * 1
                },
                sId
              )
        that.cornerstoneContorl.lungWindown(
          wwc.wc * 1,
          wwc.ww * 1,
          that.getMMCImage(menuChoose.w * 1, sId)
        )
      } else {
        let sinfo = that.model.seriesInfo[sId].info
        if (sinfo.data.windowCenterUpper && sinfo.data.windowWidthUpper) {
          /*let wwc1 = that.getwwc({
                        wc: sinfo.data.windowCenterUpper * 1,
                        ww: sinfo.data.windowWidthUpper * 1
                    }, sId)*/
          let wwc1 =
            that.model.projectInfo.seriesImgFileType == 2
              ? {
                  wc: sinfo.data.firstWindowCenter,
                  ww: sinfo.data.firstWindowWidth
                }
              : that.getwwc(
                  {
                    wc: sinfo.data.firstWindowCenter * 1,
                    ww: sinfo.data.firstWindowWidth * 1
                  },
                  sId,
                  "def"
                )
          that.cornerstoneContorl.lungWindown(
            wwc1.wc * 1,
            wwc1.ww * 1,
            that.getMMCImage(null, sId)
          )
          return
        }
        that.cornerstoneContorl.lungWindown(
          null,
          null,
          that.getMMCImage(null, sId)
        )
      }
    })
    this.dicommenu.event._addEvent("dicommenu.splitScreen", function(value) {
      that.cornerstoneContorl.setScreen(value)
    })

    // 获取copd的值
    this.dicommenu.event._addEvent("dicommenu.setCopdVal", async () => {
      // 由于每个页面都需要调用这个方法，但是api并没有抽出base
      if (!that.cornerstoneContorl.model.nidusChoose) {
        that.alerError("请选择病症")
        that.dom.find(".dicommenu .fun_btn_copd").removeClass("choose")
        that.dom.find(".chooseDate1").hide()
        return
      }
      try {
        let { data } = await this.api.HttpRequest.POST(
          "/anno/image_result/getSegThresholdByIarId",
          {
            iarId: that.cornerstoneContorl.model.nidusChoose.bid * 1
          }
        )
        that.dom.find('.chooseDate1 input[name="copdData"]').val(data)
      } catch (err) {}
    })
    this.dicommenu.event._addEvent("dicommenu.CTData", function(value) {
      if (value.value > -850) {
        that.alerError("阈值不能超过-850!")
        that.dom.find('.chooseDate1 input[name="copdData"]').val(-850)
        return
      }
      if (value.value < -1200) {
        that.alerError("阈值不能低于-1200!")
        that.dom.find('.chooseDate1 input[name="copdData"]').val(-1200)
        return
      }
      value.value = value.value * 1
      if (typeof value.value != "number" || value.value % 1 != 0) {
        that.alerError("请输入整数")
        return
      }

      let item = JSON.parse(
        JSON.stringify(that.cornerstoneContorl.model.nidusChoose)
      )
      item.backId = item.bid
      if (!that.cornerstoneContorl.model.nidusChoose.bid) {
        that.alerError("请选择copd类型")
        return
      }
      let data = {
        segThreshold: value.value * 1,
        iarId: that.cornerstoneContorl.model.nidusChoose.bid * 1
      }
      if (!that.api.alg_sar_reset_mask_image) return
      that.app.loading.show()
      that.api.alg_sar_reset_mask_image(data).done(function(res) {
        that.api
          .anno_iar_read({
            id: data.iarId * 1
          })
          .done(function(res) {
            that.app.loading.hide()
            let data = {
              id: item.result,
              images: res.data.imageList,
              sId: that.cornerstoneContorl.model.nidusChoose.sId
            }
            that.creatAllPoint(data, item, false, false)
          })
      })
    })
    this.dicommenu.event._addEvent("dicommenu.done", function() {
      let clickChoose = that.dicommenu.chooseData
      if (clickChoose.click.lastIndexOf("del") != -1) {
        that.cornerstoneContorl.clearData("meas")
      } else {
        that.openRemove()
      }
    })
    this.dicommenu.event._addEvent("dicommenu.mpr", function() {
      if (!that.cornerstoneContorl.mpr) {
        that.cornerstoneContorl.openmpr()
        that.cornerstoneContorl.mpr = true
      }
    })
    this.dicommenu.event._addEvent("dicommenu.yinyang", function(value) {
      that.api.series_result_yayAttributes({
        sarIdList: that.getSarIds(),
        yayAttributes: value.data
      })
    })
    this.dicommenu.event._addEvent("dicommenu.cal", function(value) {
      //return
      let sid =
        that.cornerstoneContorl.cornerstoneArray[
          that.cornerstoneContorl.choosescreen
        ].sId
      let data = {
        seriesInstanceUid: sid,
        sarId: that.model.seriesInfo[sid].sarId
      }
      that.app.loading.show()
      that.api.dcm_cerebralHemorrhage(data).done(function(res) {
        that.api
          .anno_iar_read({
            id: res.data.iarId * 1
          })
          .done(function(res1) {
            let data = {
              id: res.data.iarId,
              images: res1.data.imageList,
              sId: sid
            }
            res.data.toolType = {
              imageAnnotationId: res.data.imageAnnotationId,
              imageAnnotationToolId: res.data.imageAnnotationToolId,
              imageAnnotationToolType: res.data.imageAnnotationToolType,
              imageAnnotationType: res.data.imageAnnotationType,
              imageAnnotation: res.data.imageAnnotationType
            }
            res.data.type = that.model.translateWord(
              res.data.imageAnnotationToolType
            )
            res.data.sId = sid
            res.data.uuid = res.data.backId = res.data.iarId
            that.cornerstoneContorl.sequencelist.addNode(res.data)
            that.creatAllPoint(data, res.data, false, false)
            that.app.loading.hide()
          })
      })
    })
    this.dicommenu.event._addEvent("dicommenu.reset", function() {
      that.cornerstoneContorl.defaultFunction("resizeCon")
    })
    this.dicommenu.event._addEvent("dicommenu.shc", value => {
      this.cornerstoneContorl.controlNodeShowHide(value)
    })
    this.dicommenu.event._addEvent("dicommenu.setData", value => {
      this.cornerstoneContorl.setConfigByDicommeun(value)
    })
    this.dicommenu.event._addEvent("dicommenu.errorMSG", value => {
      this.alerError(value.msg)
    })
    this.dicommenu.event._addEvent("dicommenu.baseLine", value => {
      this.cornerstoneContorl.baseLineSt(value.st, "baseLine")
    })
    this.dicommenu.event._addEvent("dicommenu.cross", value => {
      this.cornerstoneContorl.baseLineSt(value.st, "cross")
    })
  }
  getMMCImage(ww, sId) {
    if (ww != null) {
      if (ww <= 200) {
        if (this.model.seriesInfo[sId].imagesAll.SMALL) {
          return this.model.seriesInfo[sId].imagesAll.SMALL.imgs
            .toString()
            .split(",")
        }
      }
      if (ww > 1000) {
        if (this.model.seriesInfo[sId].imagesAll.LARGE) {
          return this.model.seriesInfo[sId].imagesAll.LARGE.imgs
            .toString()
            .split(",")
        }
      }
      return this.model.seriesInfo[sId].imagesAll.default.imgs
        .toString()
        .split(",")
    }
    return this.model.seriesInfo[sId].imagesAll.default.imgs
      .toString()
      .split(",")
  }

  //弹窗加载
  modalLoad() {
    let progressClass = require("../../modal/progress/progress.js")
    this.progress = this.app.loadModal(progressClass, {
      adv: true
    })
    this.progress.hide()
    let alertS = require("../../modal/seriessubmit/seriessubmit.js")
    this.alertSubmit = this.app.loadModal(alertS, {
      adv: true
    })
    this.alertSubmit.hide()
  }

  //----------------------------各大模块初始化------------------------------
  //----------------------------调用接口开始流程------------------------------

  //接口调用，获取信息
  baseApi() {
    // console.log(this.app.parpam, 'this.app.parpam', this.app.model)
    //         // 获取项目信息
    // this.app.loading.show()
    // this.api.annoitem_task_read({
    //     taskId: this.app.parpam['taskId']
    // }).done((value) => {
    //     this.app.loading.hide()
    //     this.model.setData('projectInfo', value.data)
    // })
    //获取
    


    this.app.loading.show()
    this.apiload()
    this.api
      .project_anno_read({
        projectId: this.app.parpam["projectId"]
      })
      .done(value => {
        this.app.loading.hide()
        const projectInfo = value.data
        this.model.setData("projectInfo", projectInfo)
        this.cornerstoneContorl.model.projectInfo = projectInfo
        // if( location.hash.split("/")[1] === 'doctorAudEdit' ){
        //   this.api.task_read2({
        //       id: this.app.parpam['taskId']
        //   }).done((value) => {
        //       this.imageDataType = String(value.data.seriesImgFileType) == "2" ? "orgin" : "noneOrgin"
        //   })
        // } else {
           this.imageDataType = String(value.data.seriesImgFileType) == "2" ? "orgin" : "noneOrgin";
        // }
      })
  }
  apiload() {}

  //关闭菜单功能，生成病症的选项
  annotationIteminit() {
    let projectInfo = this.model.projectInfo
    let tool = {}
    projectInfo.imageAnnotationList.map(item => {
      item.toolList.map(res => {
        if (!tool[res.type]) {
          tool[res.type] = []
        }
        let tempD = JSON.parse(JSON.stringify(res))
        tempD.imageAnnotation = item.type
        tempD.imageAnnotationId = item.id
        tool[res.type].push(tempD)
      })
    })
    this.model.toolInfo = tool
    for (let i in tool) {
      switch (i) {
        case "ELLIPSE":
          this.dicommenu.openadd(tool[i], "ellipticalRoi")
          break
        case "RECTANGLE":
          this.dicommenu.openadd(tool[i], "rectangleRoi")
          //this.dicommenu.openadd(tool[i], "simpleAngle")
          break
        case "COBB":
          this.dicommenu.openadd(tool[i], "cobb")
          break
        case "ALIGNMENT":
          this.dicommenu.openadd(tool[i], "alignment")
          break
        case "PEN":
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "POINT":
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "ANGLE":
          this.dicommenu.openadd(tool[i], "simpleAngle")
          break
        case "LINE":
          this.dicommenu.openadd(tool[i], "length")
          break
        case "MAGIC_STICK_SINGLE":
          this.dicommenu.openadd(tool[i], "magicStickSingle")
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "FREEHAND":
          this.dicommenu.openadd(tool[i], "freehand")
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "FREEHANDLINE":
          this.dicommenu.openadd(tool[i], "freehand")
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "POLYGON":
          this.dicommenu.openadd(tool[i], "polygon")
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "QSELECT":
          this.dicommenu.openadd(tool[i], "quickselect")
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "REGION_PAINT":
          this.dicommenu.openadd(tool[i], "regionpaint")
          this.dicommenu.openadd(tool[i], "brush")
          this.dicommenu.openadd(tool[i], "earse")
          break
        case "IMAGE_TAG":
          this.handleLayerMarkImageAnnotation(tool[i][0])
          break
      }
    }
    //翻译所有的标注组件信息
    let nidusinfo = {
      all: {}
    }
    nidusinfo.all = this.translateData(projectInfo.annotationItemList)
    for (let i = 0; i < projectInfo.imageAnnotationList.length; i++) {
      let teampData = projectInfo.imageAnnotationList[i].annotationItemList
      if (teampData.length != 0) {
        nidusinfo[projectInfo.imageAnnotationList[i].type] = this.translateData(
          projectInfo.imageAnnotationList[i].annotationItemList
        )
      }
    }
    this.cornerstoneContorl.model.nidusComponentInfo = Tool.clone(nidusinfo)
    nidusinfo = null
    this.series_get()
  }

  handleLayerMarkImageAnnotation(imageTagTool) {
    if (!imageTagTool) return
    const { id: imageAnnotationToolId, type: imageAnnotationToolType, imageAnnotationId, imageAnnotation } = imageTagTool
    this.cornerstoneContorl.model.layerMarkImageAnnotation = {
      imageAnnotationToolId,
      imageAnnotationToolType,
      imageAnnotationId,
      imageAnnotation
    }
    // 显示图层标注组件
    // this.showLayerMark()
  }

  //************************标注相关*************************
  //获取需要标注的序列
  series_get() {}

  // showLayerMark() {
  //   const that = this
  //   const layerMarkRadioList = $(".ctcornerstone .info .nidusinfo .socrll > div:first").prepend(`
  //     <div class="layer-mark-title">图层标注 [<span class="layer-mark-layernumber">1</span>]</div>
  //     <ul class="layer-mark-wrapper">
  //       <li>
  //         <input type="radio" id="normalChoice" name="layerMarkInfo" value="1">
  //         <label for="normalChoice">正常</label>
  //       </li>
  //       <li>
  //         <input type="radio" id="isomerismChoice" name="layerMarkInfo" value="2">
  //         <label for="isomerismChoice">异性</label>
  //       </li>
  //       <li>
  //         <input type="radio" id="malignancyChoice" name="layerMarkInfo" value="3">
  //         <label for="malignancyChoice">恶性</label>
  //       </li>
  //     </ul>`).find('input:radio[name="layerMarkInfo"]')
  //     const currentRouterHash = window.location.hash
  //     // /#!/markpreview/1/1238/preview/2/1页面仅供演示，无需调用接口，但可以点击选择图层标注
  //     if (currentRouterHash.indexOf('markpreview') !== -1) return false

  //     layerMarkRadioList.on('click', function(e) {
  //       if (currentRouterHash.indexOf('markview') !== -1) { // 预览页面不能点击选择图层标注，使用disabled属性会导致默认选中的样式不明显
  //         e.preventDefault()
  //         return false
  //       }
  //       that.saveLayerMarkInfo($(this).val())
  //       $(this).blur() // 禁用键盘上下键默认触发的切换radio事件
  //     })
  // }

  // updateSequencelistData(layerNumber, annotationItemId, result) {
  //   const that = this
  //   const cornerstoneModel = that.cornerstoneContorl.model
  //   // 更新this.cornerstoneContorl.model.nidusComponentData中存储的值
  //   const newNode = {
  //     // id: cornerstoneModel.imageAnnotationResultId,
  //     type: 'imagetag',
  //     annotationItemId,
  //     formComponentId: 1000,
  //     imageAnnotationResultId: cornerstoneModel.imageAnnotationResultId,
  //     result,
  //     seriesAnnotationResultId: cornerstoneModel.currentSeriesInfo.seriesAnnotationResultId
  //   }
  //   that.cornerstoneContorl.updateNodeInfo(layerNumber, annotationItemId, newNode)
  // }

  //标注基础信息准备完成，进入这一轮标注的起始点
  start_series() {
    let data = this.model.series_result_id
    for (let i = 0; i < data.seriesInstanceUids.length; i++) {
      this.getSeriesAllImage(data.seriesInstanceUids[i])
    }
    this.result_get_fromback()
  }
  async getSeriesAllImage(data) {
    let seriesInstanceUID =
      typeof data.seriesInstanceUid == "object"
        ? data.seriesInstanceUid.series
        : data.seriesInstanceUid
    this.model.seriesInfo[seriesInstanceUID] = {}
    this.model.seriesInfo[seriesInstanceUID].needAnno =
      typeof data.seriesInstanceUid == "object"
        ? data.seriesInstanceUid.needAnno
        : data.needAnno
    this.app.loading.show()
    if (seriesInstanceUID.lastIndexOf("-") != -1) {
      seriesInstanceUID = seriesInstanceUID.split("-")[0]
    }
    let value = await this.api.sys_transfer({
      service: "DR",
      method: "/v1/series/read",
      params: JSON.stringify({
        seriesInstanceUID: seriesInstanceUID
      })
    })
    this.app.loading.hide()
    this.model.seriesInfo[seriesInstanceUID].info = value
    if (
      value.data.fileType == "DCM" &&
      value.data.modality != "DR" &&
      value.data.modality != "CX" &&
      value.data.modality != "CR" &&
      value.data.modality != "DX"
    ) {
      this.dicommenu.openadd([], "mpr")
      this.dicommenu.openadd([], "add")
      this.dicommenu.openadd([], "sub")
      //this.dicommenu.openadd([], "copd")
    }
    //this.imageType = value.data.fileType
    switch (value.data.fileType) {
      case "DCM":
        if (this.imageDataType == "noneOrgin") {
          this.imageType = "JPG"
        } else {
          this.imageType = "DCM"
        }
        break
      case "NII":
        this.imageType = "JPG"
        break
      case "JPG":
        if (this.imageDataType == "noneOrgin") {
          this.imageType = "JPG_COMPRESS"
        } else {
          this.imageType = "JPG"
        }
        break
      case "BIG_IMAGE":
        this.imageType = "BIG_IMAGE"
        break
      default:
        this.imageType = "JPG"
        break
    }
    /* if (this.imageDataType == 'noneOrgin') {
             if (value.data.fileType == "JPG") {
                 this.imageType = "JPG_COMPRESS"
             } else {
                 this.imageType = "JPG"
             }
         } else {
             this.imageType = value.data.fileType
         }
         if (value.data.fileType == "JPG") {
             this.imageType = "JPG"
         }*/
    if (
      !value.data.jpgInfo &&
      value.data.fileType == "DCM" &&
      !this.model.taskInfo
    ) {
      this.app.alert.show({
        title: " ",
        msg: "数据异常,点击确认进入下一个序列",
        close: false,
        sure: function() {
          that.discaseToDone({
            type: 98,
            des: "序列加载异常"
          })
        }
      })
      return
    }
    let tdata = JSON.parse(value.data.jpgInfo)
    this.model.seriesInfo[seriesInstanceUID].info.wwc = value.data.jpgInfo
      ? tdata
      : {
          low: 0,
          hight: 255,
          flag: 0
        }
    this.model.series_result_id.conclusion = value.data.conclusion
    this.model.series_result_id.finding = value.data.finding
    let temp = this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing
      ? this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing.split(
          "\\"
        )
      : [1, 1]
    this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing = temp // this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing ? temp[0] * 1 : 1
    this.model.seriesInfo[seriesInstanceUID].info.data.columnPixelSpacing =
      temp[0]
    this.model.seriesInfo[seriesInstanceUID].info.data.rowPixelSpacing = temp[1]
    this.model.setData("seriesInfo", this.model.seriesInfo)
    let res = await this.api.sys_transfer({
      service: "DR",
      method: "/v1/image/query",
      params: JSON.stringify({
        seriesInstanceUID: seriesInstanceUID,
        fileType: this.imageType
      })
    })

    // test....
    // res.data.list && res.data.list.forEach(v => {
    //   v.urlWAN = v.urlLAN
    // })

    //this.model.seriesInfo[data.seriesInstanceUid].imgs = []
    if (!this.model.seriesInfo[seriesInstanceUID]) {
      this.model.seriesInfo[seriesInstanceUID] = {}
    }
    this.model.seriesInfo[seriesInstanceUID].imagesAll = {}
    let imagesAll = this.model.seriesInfo[seriesInstanceUID].imagesAll
    if (this.imageType != "DCM") {
      this.model.seriesInfo[seriesInstanceUID].infoAll = {}
      this.model.seriesInfo[seriesInstanceUID].infoAll.large = res.data
        .jpgInfoLarge
        ? res.data.jpgInfoLarge
        : null
      this.model.seriesInfo[seriesInstanceUID].infoAll.small = res.data
        .jpgInfoSmall
        ? res.data.jpgInfoSmall
        : null
      this.model.seriesInfo[seriesInstanceUID].infoAll.default = res.data
        .jpgInfo
        ? res.data.jpgInfo
        : '{"low": 0,"hight": 255,"flag": 0}'
      if (!this.model.seriesInfo[seriesInstanceUID].info) {
        this.model.seriesInfo[seriesInstanceUID].info = {}
      }
      this.model.seriesInfo[seriesInstanceUID].info.wwc = JSON.parse(
        this.model.seriesInfo[seriesInstanceUID].infoAll.default
      )
    }
    await this.getPeoplePostion(seriesInstanceUID, data.imageList) // 执行完这个在执行下边的吗
    this.model.seriesInfo[seriesInstanceUID].imgsTotal = null
    if (res.data.list) {
      for (var j = 0; j < res.data.list.length; j++) {
        let urlPath
        let item = res.data.list[j]
        if (this.imageType != "DCM") {
          urlPath = "myImageLoader:" + item.urlWAN //.replace('proximatest.cn-sh2.ufileos.com', window.location.host + '/img')
        } else {
          //urlPath = 'niiImage:' + item.urlWAN
          urlPath = "wadouri:" + item.urlWAN //.replace('proximatest.cn-sh2.ufileos.com', window.location.host + '/img')
        }
        //let posArr = item.path.split('/')
        let posNum = item.number // Tool.changeToName(item.path) //posArr[posArr.length - 1].replace('.' + this.imageType.toLowerCase(), '') * 1 - 1
        if (!this.model.seriesInfo[seriesInstanceUID].imgsTotal) {
          this.model.seriesInfo[seriesInstanceUID].imgsTotal = item.number * 1
        } else if (
          this.model.seriesInfo[seriesInstanceUID].imgsTotal <
          item.number * 1
        ) {
          this.model.seriesInfo[seriesInstanceUID].imgsTotal = item.number * 1
        }
        if (item.windowType) {
          if (!imagesAll[item.windowType]) {
            imagesAll[item.windowType] = {}
            imagesAll[item.windowType].imgs = []
          }
          imagesAll[item.windowType].imgs[posNum] = urlPath
        } else {
          if (!imagesAll["default"]) {
            imagesAll["default"] = {}
            imagesAll["default"].imgs = []
          }
          imagesAll["default"].imgs[posNum] = urlPath
        }
      }
    }

    if (!res.data.list || res.data.list.length == 0) {
      imagesAll["default"] = {}
      imagesAll["default"].imgs = []
    }
    for (let i in imagesAll) {
      if (data.imageList) {
        let aa = []
        for (let w = 0; w < data.imageList.length; w++) {
          let imageId = data.imageList[w]
          let url = imagesAll[i].imgs[imageId]
            ? imagesAll[i].imgs[imageId]
            : null
          aa.push(url)
        }
        imagesAll[i].imgs = JSON.parse(JSON.stringify(aa))
        aa = null
      }
      imagesAll[i].imgs = imagesAll[i].imgs.filter(item => {
        return item
      })
    }
    this.model.seriesInfo[seriesInstanceUID].imgs = this.model.seriesInfo[
      seriesInstanceUID
    ].imagesAll["default"].imgs
      .toString()
      .split(",")
    this.model.seriesInfo[seriesInstanceUID].imgs = this.model.seriesInfo[
      seriesInstanceUID
    ].imgs.filter(item => {
      return item
    })
    this.model.imagesInfo = res.data; 
    this.model.seriesInfo[seriesInstanceUID].numbers = res.data.list.map(item=> item.number)
    this.model.setData("seriesInfo", this.model.seriesInfo)
  }
  async getPeoplePostion(seriesInstanceUID, imglist) {
    let res = await this.api.sys_transfer({
      service: "DR",
      method: "/v1/image/query",
      params: JSON.stringify({
        seriesInstanceUID: seriesInstanceUID,
        fileType: "DCM"
      })
      /*this.api.image_query({
                group: data.seriesInstanceUid,
                'fileType': this.imageType*/
    })

    // test....
    // res.data.list && res.data.list.forEach(v => {
    //   v.urlWAN = v.urlLAN
    // })


    if (!this.model.seriesInfo[seriesInstanceUID].people) {
      this.model.seriesInfo[seriesInstanceUID].people = []
    }
    for (var j = 0; j < res.data.list.length; j++) {
      let item = res.data.list[j]
      if (item.imageOrientationPatient || item.imagePositionPatient) {
        item.info = item.info ? item.info : {}
        item.info.imagePositionPatient = item.imagePositionPatient.split("\\")
        item.info.ImageOrientationPatient = item.imageOrientationPatient.split(
          "\\"
        )
        this.model.seriesInfo[seriesInstanceUID].people[item.number] = {
          imagePositionPatient: item.info.imagePositionPatient,
          ImageOrientationPatient: item.info.ImageOrientationPatient
        }
      } else {
        this.model.seriesInfo[seriesInstanceUID].people.push(null)
      }
    }
    if (imglist) {
      let aa = []
      for (let w = 0; w < imglist.length; w++) {
        let imageId = imglist[w]
        let url = this.model.seriesInfo[seriesInstanceUID].people[imageId]
          ? this.model.seriesInfo[seriesInstanceUID].people[imageId]
          : null
        aa.push(url)
      }
      this.model.seriesInfo[seriesInstanceUID].people = JSON.parse(
        JSON.stringify(aa)
      )
      aa = null
    }
    if (
      this.model.seriesInfo[seriesInstanceUID].people[1] &&
      this.model.seriesInfo[seriesInstanceUID].people[2]
    ) {
      let p1 = this.model.seriesInfo[seriesInstanceUID].people[1]
        .imagePositionPatient
      let p2 = this.model.seriesInfo[seriesInstanceUID].people[2]
        .imagePositionPatient
      let z = Math.abs(p1[2] * 1 - p2[2] * 1)
      let x = Math.abs(p1[0] * 1 - p2[0] * 1)
      let y = Math.abs(p1[1] * 1 - p2[1] * 1)
      let d = Math.pow(x * x + y * y + z * z, 0.5)
      this.model.seriesInfo[seriesInstanceUID].volumeCal =
        d *
        this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing[0] *
        this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing[1]
    } else {
      this.model.seriesInfo[seriesInstanceUID].volumeCal =
        this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing[0] *
        this.model.seriesInfo[seriesInstanceUID].info.data.pixelSpacing[1]
    }
  }
  result_get_fromback() {
    if (
      window.location.hash.lastIndexOf("markaudit") != -1 ||
      window.location.hash.lastIndexOf("drapCanvasAud") != -1 ||
      window.location.hash.lastIndexOf("drapCanvsPro") != -1
    ) {
      this.audito_result_get_fromback()
    }
  }
  audito_result_get_fromback() {
    if (this.model.taskInfo) {
      if (this.model.taskInfo.hasYay * 1 == 1) {
        this.dicommenu.openYY()
      }
    }
    let need = "all"
    if (this.model.taskInfo.studyAnno) {
      need = "study"
    }
    for (
      let i = 0;
      i < this.model.series_result_id.seriesInstanceUids.length;
      i++
    ) {
      this.api
        .series_result_read({
          sarId: this.model.series_result_id.seriesInstanceUids[i]
            .seriesAnnotationResultId //this.model.series_result_id.seriesAnnotationResultId
        })
        .done(value => {
          this.model.translateBackData(
            value,
            this.model.projectInfo.annotationItemList
          )
          let sIdcon = this.model.series_result_id.seriesInstanceUids[i]
            .seriesInstanceUid
          let seriesInstanceUID =
            typeof sIdcon == "object" ? sIdcon.series : sIdcon.seriesInstanceUid
          value.data.seriesInstanceUid = value.data.seriesUid //seriesInstanceUID
          this.model.seriesResult[value.data.seriesUid] = value
          this.model.series_result_id.remark = value.data.remark
          if (need == "all" || need == "study") {
            for (let w = 0; w < value.data.annoResultList.length; w++) {
              this.dicommenu.addDoctorSocre(
                value.data.annoResultList[w].doctorId,
                value.data.annoResultList[w].hasYay
                  ? value.data.annoResultList[w].yayAttributes
                  : "无"
              )
            }
            if (need == "study") {
              need = "close"
            }
          }

          if (value.data.yayAttributes) {
            this.dicommenu.openYY()
            this.dicommenu.setYY(value.data.yayAttributes)
          }
          this.model.setData("seriesResult", this.model.seriesResult)
          if (window.location.hash.lastIndexOf("view") != -1) {
            this.dicommenu.closeYY()
            return
          }
          if (i == this.model.series_result_id.seriesInstanceUids.length - 1) {
            this.api
              .audit_annoitem_update({
                sarIdList: this.model.series_result_id.sarIdList.join(), //this.getSarIds(),
                type: "ANNOITEM",
                resultList: this.model.changeItemDataToBackendCheck(
                  value.data.annotationItemResultList
                )
              })
              .done(() => {})
          }
        })
    }
  }

  //************************标注相关*************************
  //************************影像数据列表************************
  //影像信息获得数据后进行加载内容
  cornerstoneStart() {
    if (this.model.projectInfo.isYayAttributes) {
      this.dicommenu.openYY()
    }
    this.dicommenu.setYY(this.model.seriesResult)
    for (let i in this.model.seriesInfo) {
      let data = this.model.seriesInfo[i]
      window.fileTypeName = data.info.data.fileType
      this.cornerstoneContorl.imageType = this.imageType
      if (this.model.taskInfo.studyAnno) {
        this.dicommenu.openadd([], "screen")
      }
      this.cornerstoneContorl.penRealy = false
      this.cornerstoneContorl.modelData = this.model;
      this.cornerstoneContorl.initCT(data.imgsTotal, data.imgs, data.info)
      this.cornerstoneContorl.event._addEvent(
        "ctcornerstone.wlChange",
        value => {
          let menuChoose = {
            c: value.wwc.c,
            w: value.wwc.w
          }
          let wwc =
            this.model.projectInfo.seriesImgFileType == 2
              ? {
                  wc: menuChoose.c,
                  ww: menuChoose.w
                }
              : this.getwwc(
                  {
                    wc: menuChoose.c * 1,
                    ww: menuChoose.w * 1
                  },
                  value.sId
                )
          this.cornerstoneContorl.lungWindown(
            wwc.wc * 1,
            wwc.ww * 1,
            this.getMMCImage(wwc.ww * 1, value.sId)
          )
        }
      )
      return
    }
  }
  getWidth(url) {
    return new Promise(function(resolve, reject) {
      let images = new Image()
      images.src = url
      images.onload = function() {
        if (this.width > 2000 || this.height > 2000) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  }

  //初始化标注结果，当前序列
  async listInit() {
    //let seriesInfo = this.model.seriesInfo.info.data
    let seriesResult = this.model.seriesResult
    let studyInfo = this.model.series_result_id
    let data = {
      studyId: studyInfo.studyInstanceUid,
      sequenceName: studyInfo.studyInstanceUid,
      major: "major",
      id: studyInfo.studyInstanceUid
    }
    let reslutData = []
    let annotationItemResultList = null
    for (let i in seriesResult) {
      let seriesUid =
        seriesResult[i].data.seriesInstanceUid || seriesResult[i].data.seriesUid
      let seriesInfo = this.model.seriesInfo[seriesUid]
        ? this.model.seriesInfo[seriesUid].info.data
        : {
            modality: null,
            fileType: "JPG"
          }
      let nee = false
      if (
        seriesInfo.fileType == "DCM" &&
        (seriesInfo.modality == "DX" ||
          seriesInfo.modality == "DR" ||
          seriesInfo.modality == "CR")
      ) {
        nee = true
      }
      this.model.translateDataReslut(
        seriesResult[i].data.imageAnnotationResultList,
        seriesUid,
        nee
      )
      reslutData = reslutData.concat(
        seriesResult[i].data.imageAnnotationResultList
      )
      this.model.seriesInfo[seriesUid].sarId = i
      if (!annotationItemResultList) {
        annotationItemResultList = seriesResult[i].data.annotationItemResultList
      }
      this.cornerstoneContorl.fileTypeName = seriesInfo.fileType
    }
    this.cornerstoneContorl.model.seriesInfo = this.model.seriesInfo
    this.model.projectInfo.largeFigure =
      this.model.taskInfo.largeFigure != undefined &&
      this.model.taskInfo.largeFigure != null
        ? this.model.taskInfo.largeFigure
        : this.model.projectInfo.largeFigure
    if (
      this.model.taskInfo.studyAnno != undefined &&
      this.model.taskInfo.studyAnno != null &&
      this.model.projectInfo.largeFigure != null &&
      this.model.projectInfo.largeFigure != undefined
    ) {
      if (
        this.model.taskInfo.studyAnno &&
        !this.model.projectInfo.largeFigure
      ) {
        this.cornerstoneContorl.setSequenceLists(
          this.model.seriesInfo,
          this.imageType
        )
      } else {
        this.cornerstoneContorl.closeSequenceLists()
      }
    }
    this.cornerstoneContorl.setSequence([data], reslutData)
    //studyInfo.showReport = this.model.projectInfo.showReport //doctorNidduleAll
    studyInfo.inspectSee = this.model.projectInfo.inspectSee
    studyInfo.diagnosisIncome = this.model.projectInfo.diagnosisIncome
    this.cornerstoneContorl.setSeriesNidusData(
      annotationItemResultList,
      studyInfo,
      seriesResult
    )
    this.getAllimageData(reslutData)
  }
  getAllimageData(imageAnnotationResultList) {
    let seriesResultData = imageAnnotationResultList // this.model.seriesResult.data.imageAnnotationResultList
    let that = this
    let open = false
    this.model.loadData = {
      total: 0,
      num: 0
    }
    seriesResultData.map(async item => {
      let anId =
        String(item.id).lastIndexOf("_") != -1 ? item.id.split("_")[1] : item.id
      if (item.imageAnnotationToolType == "MAGIC_STICK_SINGLE") {
        item.brush = true
        let resRead = await that.api.magicToolRead({
          id: anId
        })
        that.baseMagicTranData(item.id, resRead, item, false)
        this.model.loadData.total++
      }
      if (
        item.imageAnnotationToolType == "POLYGON" ||
        item.imageAnnotationToolType == "QSELECT" ||
        item.imageAnnotationToolType == "REGION_PAINT" ||
        item.imageAnnotationToolType == "FREEHAND"
      ) {
        this.model.loadData.total++
        item.brush = true
        //let anId = String(item.id).lastIndexOf('_') != -1 ? item.id.split('_')[1] : item.id
        this.api
          .anno_iar_read({
            id: anId * 1
          })
          .done(function(res) {
            if (!res.data) {
              that.model.loadData.total--
            }
            let data = {
              id: item.result,
              images: res.data.imageList,
              sId: item.sId
            }
            let LESION = Tool.configxlkformat(that.app.constmap.LESION)

            let who = LESION.find(res => {
              return res.idx == item.imageAnnotationType
            })
            let needFlag = false

            if (who && who.val == "心脏分割") {
              needFlag = true
              let numPos = res.data.imageList[0].urlWan.split("?")[0].split("/")
              that.cornerstoneContorl.setNname(
                anId * 1,
                numPos[numPos.length - 2] * 1
              )
            }
            let cloneData = false
            if (who && who.val == "MCA供血分区") {
              cloneData = true
            }
            that.creatAllPoint(data, item, false, needFlag, cloneData)
            //that.creatAllPoint(data, item, false, needFlag)
          })
      }
    })
    if (open) {
      this.cornerstoneContorl.updataSequencelist(seriesResultData[0])
      let magicloadingClass = require("../../modal/magicloading/magicloading.js")
      that.magicloading = that.app.loadModal(magicloadingClass, {
        adv: true,
        title: "正在加载标注过的病症数据，请耐心等待"
      })
    }
  }

  //接口统一由标注平台封包的结果
  creatAllPoint(imgs, data, apineed, whichModel, cloneData) {
    let postData = {}
    postData.result = imgs.id
    let rid
    let otherSid
    for (let i in this.model.seriesResult) {
      if (this.model.seriesResult[i].data.seriesInstanceUid == data.sId) {
        rid = i
      } else {
        otherSid = this.model.seriesResult[i].data.seriesInstanceUid
      }
    }

    postData.seriesAnnotationResultId = rid // this.model.seriesResult.data.id //.info.data.seriesInstanceUID
    postData.imageAnnotationId = data.toolType.imageAnnotationId
    postData.imageAnnotationToolId = data.toolType.id
    let serInfo = this.model.seriesInfo[data.sId]
    let newdata = {
      imglist: this.model.getImagesBack(
        imgs.images,
        serInfo.info.wwc.flag,
        serInfo.imgsTotal
      ),
      id: data.backId,
      rid: data.backId,
      sId: data.sId
    }
    if (cloneData) {
      //let newdataClone = Tool.clone(newdata)
      newdata.sId += "_" + otherSid
      this.cornerstoneContorl.updateSequencelistSid(newdata)
      //this.needApiAll(data, apineed, newdataClone, postData)
    }

    if (whichModel) {
      newdata.imglist = this.model.getImages(
        imgs.images,
        serInfo.info.wwc.flag,
        serInfo.imgsTotal
      )
    }
    newdata.needScale = this.model.judgeX(
      serInfo.info.data.fileType,
      serInfo.info.data.modality
    )
    this.needApiAll(data, apineed, newdata, postData)
  }

  //创造一个钙化灶
  creatOnePoint(imgs, data, apineed) {
    let seriesResultId
    for (var i in this.model.seriesResult) {
      if (this.model.seriesResult[i].data.seriesInstanceUid == data.sId) {
        seriesResultId = i
      }
    }
    let postData = {}
    postData.result = imgs.id
    postData.seriesAnnotationResultId = seriesResultId
    postData.imageAnnotationId = data.toolType.imageAnnotationId
    postData.imageAnnotationToolId = data.toolType.id
    let serInfo = this.model.seriesInfo[data.sId]
    let newdata = {
      imglist: this.model.getImages(
        imgs.images,
        serInfo.info.wwc.flag,
        serInfo.imgsTotal
      ),
      id: data.backId,
      rid: imgs.id,
      sId: data.sId
    }
    newdata.needScale = this.model.judgeX(
      this.model.seriesInfo[data.sId].info.data.fileType,
      this.model.seriesInfo[data.sId].info.data.modality
    )
    /*if (this.model.seriesInfo[data.sId].info.data.fileType == "DCM" && (this.model.seriesInfo[data.sId].info.data.modality == 'DX' || this.model.seriesInfo[data.sId].info.data.modality == 'DR' || this.model.seriesInfo[data.sId].info.data.modality == 'CR')) {
                //true
            }*/
    this.needApiAll(data, apineed, newdata, postData)
  }

  /**
   * 魔法棒 数据转换
   * @param createId 创建返回的id
   * @param resRead 读取创建返回的数据
   * @param data 选择的数据
   * @param apineed 布尔值
   */
  baseMagicTranData(createId, resRead, data, apineed, seriesResultId) {
    let serInfo = this.model.seriesInfo[data.sId]
    let newdata = {
      imglist: this.model.getImages(
        resRead.data.imageList,
        serInfo.info.wwc.flag,
        serInfo.imgsTotal
      ),
      id: createId,
      rid: createId,
      sId: data.sId,
      needScale: this.model.judgeX(
        serInfo.info.data.fileType,
        serInfo.info.data.modality
      )
    }
    data.id = createId
    data.backId = createId
    if (apineed) {
      data.brush = true
      this.cornerstoneContorl.updataSequencelist(data)
    }
    this.cornerstoneContorl.setbrush(newdata)
    // this.needApiAll(data, apineed, newdata, postData)
  }

  needApiAll(data, apineed, newdata, postData) {}

  //---------------------------------------
  //获取窗宽窗位
  getwwc(orignwc, sId, def) {
    let all = [orignwc.wc - orignwc.ww / 2, orignwc.ww / 2 + orignwc.wc]
    if (this.imageType == "DCM") {
      return orignwc
    }
    this.model.seriesInfo[sId].info.wwc = JSON.parse(
      this.model.seriesInfo[sId].infoAll.default
    )
    if (!def) {
      if (orignwc.ww <= 200) {
        if (this.model.seriesInfo[sId].infoAll.small) {
          this.model.seriesInfo[sId].info.wwc = JSON.parse(
            this.model.seriesInfo[sId].infoAll.small
          )
        }
      }
      if (orignwc.ww > 1000) {
        if (this.model.seriesInfo[sId].infoAll.large) {
          this.model.seriesInfo[sId].info.wwc = JSON.parse(
            this.model.seriesInfo[sId].infoAll.large
          )
        }
      }
    }
    if (this.model.seriesInfo[sId].info.wwc) {
      let mindata = this.model.seriesInfo[sId].info.wwc.low * 1
      let range =
        this.model.seriesInfo[sId].info.wwc.hight * 1 -
        this.model.seriesInfo[sId].info.wwc.low * 1
      let minS = (255 * (all[0] - mindata)) / range
      let maxS = (255 * (all[1] - mindata)) / range
      //minS = minS < 0 ? 0 : minS
      //maxS = maxS > 255 ? 255 : maxS
      return {
        wc: (minS + maxS) / 2,
        ww: maxS - minS
      }
    } else {
      return orignwc
    }
  }

  makeWwC(sId) {
    //sId为序列号
    if (this.dicommenu.chooseData) {
      let menuChoose = this.dicommenu.chooseData.wl
        ? this.dicommenu.chooseData.wl
        : {
            c: null,
            w: null
          }
      if (menuChoose.c == null && menuChoose.w == null) {
        let sinfo = this.model.seriesInfo[sId].info
        //if(menuChoose.w)
        if (
          sinfo.data.firstWindowCenter &&
          sinfo.data.firstWindowWidth &&
          sinfo.data.jpgInfo != "{}"
        ) {
          /*let wwc1 = this.getwwc({
                        wc: sinfo.data.windowCenterUpper * 1,
                        ww: sinfo.data.windowWidthUpper * 1
                    }, sId)*/
          let wwc1 =
            this.model.projectInfo.seriesImgFileType == 2
              ? {
                  wc: sinfo.data.firstWindowCenter,
                  ww: sinfo.data.firstWindowWidth
                }
              : this.getwwc(
                  {
                    wc: sinfo.data.firstWindowCenter * 1,
                    ww: sinfo.data.firstWindowWidth * 1
                  },
                  sId,
                  "def"
                )
          this.cornerstoneContorl.lungWindown(
            wwc1.wc * 1,
            wwc1.ww * 1,
            this.getMMCImage(wwc1.ww, sId)
          )
        } else if (
          sinfo.data.firstWindowCenter &&
          sinfo.data.firstWindowWidth &&
          this.imageType == "DCM"
        ) {
          let wwc1 =
            this.model.projectInfo.seriesImgFileType == 2
              ? {
                  wc: sinfo.data.firstWindowCenter,
                  ww: sinfo.data.firstWindowWidth
                }
              : this.getwwc(
                  {
                    wc: sinfo.data.firstWindowCenter * 1,
                    ww: sinfo.data.firstWindowWidth * 1
                  },
                  sId,
                  "def"
                )
          this.cornerstoneContorl.lungWindown(
            wwc1.wc * 1,
            wwc1.ww * 1,
            this.getMMCImage(wwc1.ww, sId)
          )
        } else {
          this.cornerstoneContorl.lungWindown(
            null,
            null,
            this.getMMCImage(null, sId)
          )
        }
      } else {
        /*let wwc = this.getwwc({
                    wc: menuChoose.c * 1,
                    ww: menuChoose.w * 1
                }, sId)*/
        let wwc =
          this.model.projectInfo.seriesImgFileType == 2
            ? {
                wc: menuChoose.c,
                ww: menuChoose.w
              }
            : this.getwwc(
                {
                  wc: menuChoose.c * 1,
                  ww: menuChoose.w * 1
                },
                sId
              )
        this.cornerstoneContorl.lungWindown(
          wwc.wc * 1,
          wwc.ww * 1,
          this.getMMCImage(menuChoose.w * 1, sId)
        )
      }
    } else {
      this.cornerstoneContorl.lungWindown(
        null,
        null,
        this.getMMCImage(null, sId)
      )
    }
  }

  //--------------------------废片处理
  openRemove() {
    let removeseries = require("../../modal/removeseries/removeseries.js")
    let discardList = this.model.projectInfo.discardList
      ? this.model.projectInfo.discardList
      : null
    let remove_s = this.app.loadModal(removeseries, {
      adv: false,
      class: "xs",
      title: "请选择该序列标为废片的原因",
      data: discardList
    })
    remove_s.event._addEvent("modal.confirm", () => {
      let sorce = JSON.parse(JSON.stringify(remove_s.res))
      if (JSON.stringify(remove_s.res) == "{}") {
        remove_s.showError(0)
        return
      }
      if ((remove_s.res.type = "99" && !remove_s.res.des)) {
        remove_s.showError(1)
        return
      }

      this.discaseToDone(sorce, remove_s)
      remove_s.close()
    })
  }
  //----------------------------------------一些通用方法不牵扯流程---------------------------------
  //翻译组件的信息为渲染和扩展准备
  translateData(list) {
    let obj = {}
    for (let i = 0; i < list.length; i++) {
      let teampData = list[i]
      let key = teampData.id //teampData.componentName
      obj[key] = list[i]
      obj[key].id = teampData.id
      obj[key].type = teampData.componentType
      obj[key].name = teampData.componentName
      if (teampData.componentParameter) {
        if (typeof JSON.parse(teampData.componentParameter) == "object") {
          if (JSON.parse(teampData.componentParameter).hasnull) {
            teampData.type = "checkbox-sp"
          }
        } else {
          teampData.componentParameter = null
        }
      }
      if (teampData.componentData) {
        obj[key].data = {}
        if (teampData.type == "checkbox-sp") {
          obj[key].data["-1"] = "无"
        }
        if (typeof JSON.parse(teampData.componentParameter) == "object") {
          JSON.parse(teampData.componentData).map(item => {
            obj[key].data[item.code] = item.text
          })
        } else {
          teampData.componentData = null
        }
      }
    }
    return obj
  }
  //获取的序列的总张数
  getSericesTotal(array) {
    //sid为序列sericesId
    let len = array.length - 1
    //let len = this.model.seriesInfo[sId].imgs.length - 1
    let total = Tool.changeToName(array[len])
    return total
  }

  //************************废片区*************************
  discaseToDone(value, dom) {}
  //************************废片区*************************

  //提交整个序列事件
  btnEvent() {}

  //提交当前在标注的序列
  submitSeries() {}

  //经过检查能够进行提交了
  series_submit() {}

  //检查报错部分并且要显示的部分
  errorShow(item, node) {}
  alerError(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: true
    })
  }

  //缓存里面的序列用完了以后的事情
  submitFinish(data) {}

  //页面切换的需要清空的
  dispose() {
    if (this.cornerstoneContorl) {
      this.cornerstoneContorl.close()
    }
    if (this.progress) {
      this.progress.close()
    }
    if (this.alertSubmit) {
      this.alertSubmit.close()
    }
    ES.selctorDoc(window).off("keydown")
    ES.selctorDoc(window).off("mousemove")
    this.app.alert.hide()
  }

  //系统自适应
  resize() {
    if (this.cornerstoneContorl) {
      this.cornerstoneContorl.resize()
    }
  }
  // 获取当前所有序列的sarId
  getSarIds() {
    const sarIds = []
    for (let i in this.model.seriesResult) {
      sarIds.push(i)
    }
    return sarIds.toString()
  }
  // 获取当前选中序列的sarId
  getCurrentSeriesSarId() {
    return this.cornerstoneContorl.model.currentSeriesInfo.seriesAnnotationResultId
  }
}

window.MarkBase = window.MarkBase || MarkBase
module.exports = MarkBase
