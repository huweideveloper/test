//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markview extends MarkBase {
  constructor(app, api, dom, model) {
    super(app, api, dom, model)
    ES.selctorDoc("#content").css({
      marginTop: "unset"
    })
  }
  //接口调用，获取信息
  apiload() {
    this.api
      .task_read({
        id: this.app.parpam["taskId"]
      })
      .done(value => {
        this.dom
          .find(".task-name span")
          .eq(1)
          .html(value.data.name)
        this.model.taskInfo = value.data
        this.model.taskInfo.studyAnno = value.data.studyAnno
      })
    document.getElementById("header").style.display = "none"
  }

  //************************标注相关*************************
  //获取需要标注的序列
  series_get(sid) {
    if (this.cornerstoneContorl) {
      this.cornerstoneContorl.close()
    }
    if (this.dicommenu) {
      this.dicommenu.resetAll()
    }
    this.app.loading.show()
    let taskData = this.app.parpam['sid'].split('$$')
    
    this.api
      .series_result_search({
        type: "TASK",
        id: this.app.parpam["taskId"],
        serialNumber: taskData[0], //this.app.parpam['sid'],
        userId: this.app.parpam["uid"]
      })
      .done(value => {
        //console.log(value.data,'==============')
        this.app.loading.hide()
        if (value.data.list[0] && value.data.list[0].discardCode) {
          let str = ""
          str += value.data.list[0].discardReason
            ? value.data.list[0].discardReason
            : ""
          this.dom
            .find(".discard_info")
            .html("<span>当前序列被标为废片，原因：" + str + "</span>")
        }
        if (value.data.list.length != 0) {
          let temp = {}
          let seriesInstanceUids = []
          for (let i = 0; i < value.data.list.length; i++) {
            let data = value.data.list[i]
            temp.studyInstanceUid = data.studyInstanceUid
            seriesInstanceUids.push({
              seriesAnnotationResultId: data.id,
              seriesInstanceUid: data.seriesInstanceUid,
              needAnno: true,
              imageList: data.imageIdList
            })
          }
          temp.seriesInstanceUids = seriesInstanceUids
          if (!this.model.taskInfo.studyAnno) {
            temp.studyInstanceUid = temp.seriesInstanceUids[0].seriesInstanceUid
          }
          //let temp = { studyInstanceUid: value.data.studyInstanceUid, seriesInstanceUids: seriesInstanceUids }
          //let temp = { seriesAnnotationResultId: value.data.list[0].id, seriesInstanceUid: value.data.list[0].seriesInstanceUid }
          this.model.setData("series_result_id", temp)
          const { seriesAnnotationResultId, seriesInstanceUid } = temp.seriesInstanceUids[0]
          this.cornerstoneContorl.model.setCurrentSeriesInfo({ seriesAnnotationResultId, seriesInstanceUid })
        } else {
          this.dom.find(".back-icon").click()
        }
      })
  }
  // 编辑
  editTask() {
    this.api
      .series_result_search({
        type: "TASK",
        id: this.app.parpam.taskId,
        serialNumber: this.app.parpam.sid, // this.app.parpam['sid'],
        userId: this.useinfo.userId
      })
      .done(value => {
        this.app.loading.hide()
        if (value.data.list[0].discardCode) {
          let str = ""
          str += value.data.list[0].discardReason
            ? value.data.list[0].discardReason
            : ""
          this.dom
            .find(".discard_info")
            .html("<span>当前序列被标为废片，原因：" + str + "</span>")
        }
        if (value.data.list.length != 0) {
          let temp = {}
          let seriesInstanceUids = []
          for (let i = 0; i < value.data.list.length; i++) {
            let data = value.data.list[i]
            temp.studyInstanceUid = data.studyInstanceUid
            seriesInstanceUids.push({
              seriesAnnotationResultId: data.id,
              seriesInstanceUid: data.seriesInstanceUid,
              needAnno: value.data.seriesList[i].needAnno
            })
          }
          temp.seriesInstanceUids = seriesInstanceUids
          temp.studyInstanceUid = temp.seriesInstanceUids[0].seriesInstanceUid
          this.model.setData("series_result_id", temp)
        } else {
          this.dom.find(".back-icon").click()
        }
      })
  }

  // 开始任务
  startTask() {
    this.api
      .series_get({
        taskId: this.app.parpam["taskId"],
        userId: this.useinfo.userId
      })
      .done(value => {
        this.app.loading.hide()
        if (value.code == 1001) {
          window.location.href =
             window.location.origin + "/#!/personalaccount" //this.app.changePage('personalaccount')
          window.location.reload()
        }
        if (!value.data) {
          window.location.href =
             window.location.origin + "/#!/personalaccount"
          window.location.reload()
        }
        if (value.data.taskStatus == 3 || value.data.taskStatus == 4) {
          window.location.href =
             window.location.origin + "/#!/personalaccount"
          window.location.reload()
        }
        let serLength = value.data.sarIdList.length
        let seriesInstanceUids = []
        for (let i = 0; i < serLength; i++) {
          seriesInstanceUids.push({
            seriesAnnotationResultId: value.data.sarIdList[i],
            seriesInstanceUid: value.data.seriesList[i].series,
            needAnno: value.data.seriesList[i].needAnno
          })
        }
        let endInfo = {
          studyInstanceUid: value.data.studyInstanceUid,
          seriesInstanceUids: seriesInstanceUids
        }
        if (!this.model.taskInfo.studyAnno) {
          endInfo.studyInstanceUid =
            endInfo.seriesInstanceUids[0].seriesInstanceUid
        }
        this.model.setData("series_result_id", endInfo)
      })
  }

  // 获取所有序列
  result_get_fromback() {
    let lists = this.model.series_result_id.seriesInstanceUids
    for (let i = 0; i < lists.length; i++) {
      this.api
        .series_result_read({
          id: lists[i].seriesAnnotationResultId
        })
        .done(res => {
          this.model.seriesResult[lists[i].seriesAnnotationResultId] = res
          this.model.setData("seriesResult", this.model.seriesResult)
        })
    }
  }
  //影像区加载
  cornerstoneContorlOther() {
    let that = this
    //对于图片上面的影像标注操作
    this.cornerstoneContorl.event._addEvent("ctcornerstone.addNode", function(
      value
    ) {
      let handles = value.handles
        ? JSON.parse(JSON.stringify(value.handles))
        : {
            start: {},
            end: {}
          }
      handles.end.z = handles.start.z = value.layerNumber
      let postData = {}
      postData.seriesAnnotationResultId = that.model.seriesInfo[value.sId].sarId // that.model.seriesResult.data.id //.info.data.seriesInstanceUID
      postData.imageAnnotationId = value.toolType.imageAnnotationId
      postData.imageAnnotationToolId = value.toolType.id
      //console.log(value)
      let seriesInfoData = that.model.seriesInfo[value.sId].info.data
      let nee = false
      if (
        seriesInfoData.fileType == "DCM" &&
        (seriesInfoData.modality == "DX" ||
          seriesInfoData.modality == "DR" ||
          seriesInfoData.modality == "CR")
      ) {
        nee = true
      }
      if (value.toolType.type == "ALIGNMENT") {
        value.pointA.map(item => {
          item.start.z = value.layerNumber
        })
        postData.result = that.model.makeJsonToBackend(
          {
            type: value.toolType.type,
            sId: value.sId
          },
          value.pointA,
          nee
        )
      } else if (value.toolType.type == "COBB") {
        value.lineA.map(item => {
          item.end.z = item.start.z = value.layerNumber
        })
        postData.result = that.model.makeJsonToBackend(
          {
            type: value.toolType.type,
            sId: value.sId
          },
          value.lineA,
          nee
        )
      } else {
        postData.result = that.model.makeJsonToBackend(
          {
            type: value.toolType.type,
            sId: value.sId
          },
          handles,
          nee
        )
      }

      that.app.loading.show()
      that.api.image_result_create(postData).done(function(res) {
        that.app.loading.hide()
        value.backId = res.data.id
        that.cornerstoneContorl.updataSequencelist(value)
      })
    })

    this.cornerstoneContorl.event._addEvent("ctcornerstone.editNode", function(
      value
    ) {
      let postData = {}
      let handles = value.handles
        ? JSON.parse(JSON.stringify(value.handles))
        : {
            start: {},
            end: {}
          }
      handles.end.z = handles.start.z = value.layerNumber
      postData.id = value.backId
      postData.imageAnnotationId = value.imageAnnotationId
      postData.imageAnnotationToolId = value.imageAnnotationToolId
      let seriesInfoData = that.model.seriesInfo[value.sId].info.data
      let nee = false
      if (
        seriesInfoData.fileType == "DCM" &&
        (seriesInfoData.modality == "DX" ||
          seriesInfoData.modality == "DR" ||
          seriesInfoData.modality == "CR")
      ) {
        nee = true
      }
      if (value.toolType.type == "ALIGNMENT") {
        value.pointA.map(item => {
          item.start.z = value.layerNumber
        })
        postData.result = that.model.makeJsonToBackend(
          {
            type: value.toolType.type,
            sId: value.sId
          },
          value.pointA,
          nee
        )
      } else if (value.toolType.type == "COBB") {
        value.lineA.map(item => {
          item.end.z = item.start.z = value.layerNumber
        })
        postData.result = that.model.makeJsonToBackend(
          {
            type: value.toolType.type,
            sId: value.sId
          },
          value.lineA,
          nee
        )
      } else {
        postData.result = that.model.makeJsonToBackend(
          {
            type: value.toolType.type,
            sId: value.sId
          },
          handles,
          nee
        )
      }
      /*postData.result = that.model.makeJsonToBackend({
                    type: value.imageAnnotationToolType,
                    sId: value.sId
                }, handles, nee)*/
      that.app.loading.show()
      that.api.image_result_update(postData).done(function(res) {
        that.app.loading.hide()
      })
    })
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.deleteNode",
      function(value) {
        that.app.loading.show()
        that.api
          .image_result_delete({
            id: value.backId
          })
          .done(function(res) {
            that.app.loading.hide()
          })
      }
    )
    //获取整个序列的征象信息
    this.cornerstoneContorl.event._addEvent("ctcornerstone.Allthing", function(
      value
    ) {
      that.app.loading.show()
      let data = that.model.changeItemDataToBackend(
        that.model.taskInfo.id,
        value
      )
      //data.taskId = that.model.taskInfo.id
      //data.studyInstanceUid = that.model.series_result_id.studyInstanceUid
      data.sarIdList = that.getCurrentSeriesSarId()
      that.api.series_result_item_edit(data).done(function() {
        that.app.loading.hide()
      })
    })
    //获取某一个病症的征象信息
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.editNodeItem",
      function(value) {
        that.app.loading.show()
        that.api
          .image_result_item_edit(
            that.model.changeItemDataToBackend(value.backId, value.chooseData)
          )
          .done(function() {
            that.app.loading.hide()
          })
      }
    )

    //------------------------提交为图形元素的---------------------------
    /*this.cornerstoneContorl.event._addEvent('ctcornerstone.addImageResult', function(value) {
                let postData = {}
                postData.seriesAnnotationResultId = that.model.seriesResult.data.id //.info.data.seriesInstanceUID
                postData.imageAnnotationId = value.toolType.imageAnnotationId
                postData.imageAnnotationToolId = value.toolType.id
                    //console.log(value)
                postData.result = that.model.makeJsonToBackend({
                    type: value.toolType.type
                }, handles)
                that.app.loading.show()
                that.api.image_result_create(postData).done(function(res) {
                    that.app.loading.hide()
                    value.backId = res.data.id
                    that.cornerstoneContorl.updataSequencelist(value)
                })
            })*/

    //-------------------------------魔法棒的处理-------------------------------
    //魔法棒点击去调用接口进行后续处理
    this.cornerstoneContorl.event._addEvent("ctcornerstone.makeMagic", function(
      value
    ) {
      console.log(value)
      //console.log(that.dicommenu.chooseData)
      let sId = value.sId
      let dataToolType = that.dicommenu.chooseData.data
      let infoData = that.model.seriesInfo[sId]
      value.ct.hu =
        ((infoData.info.wwc.hight * 1 - infoData.info.wwc.low * 1) *
          value.ct.hu) /
          255 +
        infoData.info.wwc.low * 1
      if (dataToolType.imageAnnotation == "ANNO4") {
        if (value.ct.hu < 130) {
          that.app.alert.show({
            title: " ",
            msg: "提交的点CT值不符合要求，请重新选择CT值大于130的点位。",
            close: true
          })
          that.cornerstoneContorl.removeSequencelist(value)
          return
        }
      }
      //return
      that.app.alert.show({
        title: " ",
        msg:
          '确认提交影像标注的标注位置？提交后将自动生成影像标注区域，请耐心等待。<br />请填写CT差值：<input class="ct_d" type="text" value="200" style="width: 60px;">',
        close: true,
        closeSure: function() {
          that.cornerstoneContorl.removeSequencelist(value)
        },
        sure: async function() {
          //console.log(that.app.alert.dom.find('.ct_d').val())
          //return
          let ctVal = isNaN(that.app.alert.dom.find(".ct_d").val())
            ? 0
            : that.app.alert.dom.find(".ct_d").val() * 1
          that.model.loadData = {
            total: 1,
            num: 0
          }
          let points = value.e.detail.currentPoints.image
          if (that.model.seriesInfo[value.sId].info.wwc.flag * 1 == 1) {
            value.layerNumber = infoData.imgsTotal - value.layerNumber + 1
          }
          //value.ct.hu = (that.model.seriesInfo.info.wwc.hight * 1 - that.model.seriesInfo.info.wwc.low * 1) * value.ct.hu / 255 + that.model.seriesInfo.info.wwc.low * 1
          let backData = {
            points: that.model.getpoints(
              {
                points: value.points,
                z: value.layerNumber,
                sId: value.sId
              },
              dataToolType.imageAnnotation
            ),
            threshUp: value.ct.hu * 1 + ctVal, // that.dicommenu.chooseData.ctVal * 1, //value.toolType.userChoose ? value.toolType.userChoose.yzmax * 1 : 130,
            threshDown: value.ct.hu * 1 - ctVal // that.dicommenu.chooseData.ctVal * 1 //value.toolType.userChoose ? value.toolType.userChoose.yzmin * 1 : 4000
          }
          if (dataToolType.imageAnnotation == "ANNO4") {
            backData.threshDown =
              backData.threshDown < 130 ? 130 : backData.threshDown
          }
          let magicloadingClass = require("../modal/magicloading/magicloading.js")
          that.magicloading = that.app.loadModal(magicloadingClass, {
            adv: true
          })
          for (var i in that.model.seriesResult) {
            for (var j in that.model.seriesInfo) {
              if (
                that.model.seriesInfo[j].sarId * 1 == i * 1 &&
                that.model.seriesInfo[j].needAnno
              ) {
                try {
                  let resCreate = await that.api.magicToolCerate({
                    sarId: i,
                    param: JSON.stringify(backData),
                    imgToolId: value.toolType.id
                  })
                  if (resCreate.code == 0) {
                    let resRead = await that.api.magicToolRead({
                      id: resCreate.data.iarId
                    })
                    console.log(value, "wishing第三")
                    that.baseMagicTranData(
                      resCreate.data.iarId,
                      resRead,
                      value,
                      true,
                      i
                    )
                  } else {
                    that.app.alert.show({
                      title: " ",
                      msg: resCreate.msg,
                      close: true,
                      footer: true
                    })
                  }
                } catch (err) {}
                that.magicloading.hide()
              }
            }
          }
        }
      })
    })

    //点完魔法棒拿算法返回的所有图片以后触发的事件
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.brushfirstload",
      function(value) {
        that.model.loadData.num++
        if (
          that.magicloading &&
          that.model.loadData.num >= that.model.loadData.total
        ) {
          that.magicloading.hide()
        }
      }
    )

    //编辑魔法棒
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.editBrush",
      async function(value) {
        console.log(value)
        let infoData = that.model.seriesInfo[value.sId]
        if (
          value.toolType.type == "POLYGON" ||
          value.toolType.type == "QSELECT" ||
          value.toolType.type == "REGION_PAINT" ||
          value.toolType.type == "FREEHAND"
        ) {
          //console.log(value.orginimage.src)
          that.app.loading.show()
          let base64 = value.image.src.replace("data:image/png;base64,", "")
          if (
            infoData.info.data.fileType == "DCM" &&
            (infoData.info.data.modality == "DX" ||
              infoData.info.data.modality == "DR" ||
              infoData.info.data.modality == "CR")
          ) {
            //base64 = that.changeImage(value.image.src)
            that.changeImage(value.image.src).then(value => {
              base64 = value
            })
          }
          setTimeout(() => {
            that.api
              .anno_iar_update({
                id: value.backId * 1,
                imageList: [
                  {
                    number: value.layerNumber,
                    imageData: base64
                  }
                ]
              })
              .done(function(res) {
                that.app.loading.hide()
              })
          }, 500)

          return
        }
        let base64 = Tool.changeImageToBase64(value.image)
        console.log(infoData, "infoDatainfoDatainfoDatainfoDatainfoData")
        if (infoData.info.wwc.flag * 1 == 1) {
          value.layerNumber = infoData.imgsTotal - value.layerNumber + 1
        }
        let submitData = {
          id: value.rid || value.backId,
          itemList: [
            {
              number: value.layerNumber * 1,
              imageData: base64.replace("data:image/png;base64,", "")
            }
          ]
        }
        that.app.loading.show()
        let res = await that.api.sys_transfer({
          service: "DR",
          method: "/v1/image_process/item/edit",
          params: JSON.stringify(submitData)
        })
        that.app.loading.hide()
        //that.api.anno_iar_update
      }
    )

    //-------------------------------魔法棒的处理-------------------------------
    //----------------图像工具添加--------------------------
    //添加画图工具
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.addImageResult",
      function(value) {
        //console.log(value.image)
        //let base64 = value.image.src // Tool.changeImageToBase64(value.image)
        //console.log(base64)
        //return
        that.app.loading.show()
        let base64 = value.image.src.replace("data:image/png;base64,", "")
        let infoData = that.model.seriesInfo[value.sId]
        if (
          infoData.info.data.fileType == "DCM" &&
          (infoData.info.data.modality == "DX" ||
            infoData.info.data.modality == "DR" ||
            infoData.info.data.modality == "CR")
        ) {
          that.changeImage(value.image.src).then(value => {
            base64 = value
          })
          //base64 = that.changeImage(value.image.src)
        }
        console.log("=============wqeqwewqe", that.model.seriesResult)
        let rid
        for (let i in that.model.seriesResult) {
          if (that.model.seriesResult[i].data.seriesInstanceUid == value.sId) {
            rid = i
          }
        }
        setTimeout(() => {
          that.api
            .anno_iar_create({
              seriesAnnotationResultId: rid, // that.model.seriesResult.data.id,
              imageAnnotationId: value.imageAnnotationId,
              imageAnnotationToolId: value.imageAnnotationToolId,
              imageList: [
                {
                  number: value.layerNumber,
                  imageData: base64
                }
              ]
            })
            .done(function(res) {
              that.app.loading.hide()
              value.backId = res.data.id
              value.brush = true
              //console.log('==========', value)
              that.cornerstoneContorl.updataSequencelist(value)
            })
        })
      }
    )
  }
  // 返回后台的图片变大 只有x光可以适用
  changeImage(value) {
    let x1 = document.createElement("CANVAS")
    let tempI = new Image()
    var deferred = ES.Deferred()
    tempI.onload = function() {
      let rate = 0.5
      let width = Math.floor(this.width * 2)
      let height = Math.floor(this.height * 2)
      console.log(width, height)
      x1.setAttribute("width", width)
      x1.setAttribute("height", height)
      let ctx = x1.getContext("2d")
      ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, width, height)
      deferred.resolve(
        x1.toDataURL("image/png").replace("data:image/png;base64,", "")
      )
    }
    tempI.src = value
    return deferred
  }
  needApiAll(data, apineed, newdata, postData) {
    if (apineed) {
      this.app.loading.show()
      this.api.image_result_create(postData).done(res => {
        this.app.loading.hide()
        newdata.id = data.backId = res.data.id
        data.brush = true
        console.log(data, "data")
        this.cornerstoneContorl.updataSequencelist(data)
        newdata.id = res.data.id
        this.cornerstoneContorl.setbrush(newdata)
      })
    } else {
      // this.cornerstoneContorl.updataSequencelist(data)
      console.log(newdata)
      //从后台读回来的mask根据情况进行处理，只有x光可以适用
      this.cornerstoneContorl.setbrush(newdata)
    }
  }
  //************************废片区*************************
  discaseToDone(value, dom) {
    let ids = this.getSarIds()
    let that = this
    this.alertSubmit.show({
      title: " ",
      msg: "确认提交该序列？提交后该序列将不再修改",
      closeSure: function() {
        that.app.loading.show()
        that.api
          .series_discard({
            sarIdList: ids,
            //taskId: that.model.taskInfo.id,
            //studyInstanceUid: that.model.series_result_id.studyInstanceUid,
            //id: that.model.series_result_id.seriesAnnotationResultId,
            discardCode: value.type,
            discardReason: value.des
          })
          .done(value => {
            that.app.loading.hide()
            window.location.href =
               window.location.origin + "/#!/personalaccount"
            window.location.reload()
            // that.app.changePage('personalaccount')
          })
      },
      sure: function() {
        that.app.loading.show()
        that.api
          .series_discard({
            sarIdList: ids,
            //taskId: that.model.taskInfo.id,
            //studyInstanceUid: that.model.series_result_id.studyInstanceUid,
            //id: that.model.series_result_id.seriesAnnotationResultId,
            discardCode: value.type,
            discardReason: value.des
          })
          .done(value => {
            that.app.loading.hide()
            window.location.reload()
            //that.series_get()
          })
      }
    })
  }
  //************************废片区*************************
  //************************弹框区*************************
  //提交整个序列事件
  btnEvent() {
    this.dom.find(".back-icon").on("click", () => {
      window.location.href =
         window.location.origin +
        "/#!/taskdetail/" +
        this.app.parpam["taskId"] +
        "/" +
        this.app.parpam["rid"]
      window.location.reload()
      return
    })
    let that = this
    this.dom.find(".cotrol-btn .btn-submit").on("click", () => {
      //this.model.doneNum += 1
      this.needSub = {}
      this.alertSubmit.show({
        title: " ",
        msg: "确认提交该序列？提交后该序列将不再修改",
        closeSure: function() {
          that.model.doneNum = -1
          that.alertSubmit.hide()
          that.app.loading.show()
          let xi = ""
          for (var i in that.model.seriesResult) {
            xi = i
            for (var j in that.model.seriesInfo) {
              if (
                that.model.seriesInfo[j].sarId * 1 == i * 1 &&
                that.model.seriesInfo[j].needAnno
              ) {
                that.needSub[i] = null
                that.submitSeries(i)
              }
            }
          }
          if (JSON.stringify(that.needSub) == "{}") {
            that.needSub[xi] = false
            that.submitSeries(xi)
          }
        },
        sure: function() {
          that.model.doneNum = 3
          that.alertSubmit.hide()
          that.app.loading.show()
          let xi = ""
          for (var i in that.model.seriesResult) {
            xi = i
            for (var j in that.model.seriesInfo) {
              if (
                that.model.seriesInfo[j].sarId * 1 == i * 1 &&
                that.model.seriesInfo[j].needAnno
              ) {
                that.needSub[i] = null
                that.submitSeries(i)
              }
            }
          }
          if (JSON.stringify(that.needSub) == "{}") {
            that.needSub[xi] = false
            that.submitSeries(xi)
          }
        }
      })
    })
  }
  //提交当前在标注的序列
  submitSeries(id, pading) {
    let vid = id
    this.api
      .series_result_read({
        id: id //this.model.series_result_id.seriesAnnotationResultId
      })
      .done(value => {
        //console.log(value, 'valuevaluevaluevalue', value.data.yayAttributes, this.model.projectInfo)
        this.app.loading.hide()
        if (value.code == 400) {
          window.location.href =
             window.location.origin + "/#!/personalaccount"
          window.location.reload()
        }
        this.needSub[vid] = false
        if (value.data.yayAttributes) {
          if (this.model.projectInfo.yayAttributes * 1 == 4) {
            this.startSubmit()
            return false
          }
          if (
            this.model.projectInfo.yayAttributes * 1 == 3 &&
            value.data.yayAttributes * 1 == 1
          ) {
            this.startSubmit()
            return false
          }
          if (
            this.model.projectInfo.yayAttributes * 1 == 1 &&
            value.data.yayAttributes * 1 == 2
          ) {
            this.startSubmit()
            return false
          }
        }
        let data = value.data
        let conmponentInfo = this.cornerstoneContorl.model.nidusComponentInfo
        //判断大征象是否完成了
        let allnid = this.allnidussubmit(data)
        if (!allnid) {
          return true
        }
        this.needSub[vid] = false
        for (let i = 0; i < data.imageAnnotationResultList.length; i++) {
          let item = data.imageAnnotationResultList[i]
          let optionLength = 0
          for (let wn in conmponentInfo[item.imageAnnotationType]) {
            if (conmponentInfo[item.imageAnnotationType][wn].optional) {
              optionLength++
            }
          }
          if (item.annotationItemResultList == null && optionLength != 0) {
            for (let w in conmponentInfo[item.imageAnnotationType]) {
              if (conmponentInfo[item.imageAnnotationType][w].optional) {
                this.errorShow(
                  item,
                  conmponentInfo[item.imageAnnotationType][w]
                )
                this.needSub[vid] = true
                return true
              }
            }
          }
          console.log(item.annotationItemResultList)
          if (item.annotationItemResultList) {
            //后台记录的必填项数据比真实必填项个数不一致
            if (optionLength) {
              let idsAll = ","
              for (let j = 0; j < item.annotationItemResultList.length; j++) {
                let res = item.annotationItemResultList[j]
                if (res.result) {
                  idsAll += res.annotationItemId + ","
                }
              }
              for (let w in conmponentInfo[item.imageAnnotationType]) {
                if (
                  idsAll.lastIndexOf("," + w + ",") == -1 &&
                  conmponentInfo[item.imageAnnotationType][w].optional
                ) {
                  this.errorShow(
                    item,
                    conmponentInfo[item.imageAnnotationType][w]
                  )
                  this.needSub[vid] = true
                  return true
                }
              }
            }
            //后台记录的必填项数据跟真实必填项个数不一致，判断哪个必填项值为空
            for (let j = 0; j < item.annotationItemResultList.length; j++) {
              let res = item.annotationItemResultList[j]
              if (
                !res.result &&
                conmponentInfo[item.imageAnnotationType][res.annotationItemId]
                  .optional
              ) {
                this.needSub[vid] = true
                this.errorShow(
                  item,
                  conmponentInfo[item.imageAnnotationType][res.annotationItemId]
                )
                return true
              }
            }
          }
        }
        // if (data.imageAnnotationResultList.length == 0 && data.annotationItemResultList.length == 0) {
        //   this.needSub[vid] = true
        //   this.alerError('请检查你是否进行了标注')
        //   return true
        // }
        this.startSubmit()
        //return now
        //console.log(now, 'now')
        //return
      })
  }
  startSubmit() {
    let aaa = null
    console.log(this.needSub)
    for (var i in this.needSub) {
      if (this.needSub[i] == null) {
        return
      }
      aaa = aaa == null ? this.needSub[i] : aaa || this.needSub[i]
    }
    if (aaa) {
      return
    }
    this.series_submit()
  }
  allnidussubmit(data) {
    let conmponentInfo = this.cornerstoneContorl.model.nidusComponentInfo
    let now = false
    //console.log(conmponentInfo.all)
    for (let i in conmponentInfo.all) {
      if (i != "annotationItemResultList") {
        let allitem = conmponentInfo.all[i]
        if (allitem.optional) {
          let nowS = false
          data.annotationItemResultList.map(item => {
            if (item.annotationItemId == i && item.result) {
              nowS = true
            }
          })
          if (!nowS) {
            this.alerError(
              "“序列整体标注信息”的“" +
                allitem.componentName +
                "”为必填项，请填写完整。"
            )
            return false
          }
        }
      }
    }
    if (data.annotationItemResultList.length == 0) {
      for (let ww in conmponentInfo.all.annotationItemResultList) {
        console.log(conmponentInfo.all)
        if (conmponentInfo.all.annotationItemResultList[ww].optional) {
          this.alerError(
            "“序列整体标注信息”的“" +
              conmponentInfo.all.annotationItemResultList[ww].componentName +
              "”为必填项，请填写完整。"
          )
          return false
        }
      }
    }
    return true
  }

  //经过检查能够进行提交了
  series_submit() {
    let ids = this.getSarIds()
    this.app.loading.show()
    this.api
      .series_result_submit({
        sarIdList: ids
        //taskId: this.model.taskInfo.id,
        //studyInstanceUid: this.model.series_result_id.studyInstanceUid
        //id: this.model.series_result_id.seriesAnnotationResultId
      })
      .done(() => {
        this.app.loading.hide()
        console.log(this.model.doneNum)
        window.location.href =
           window.location.origin +
          "/#!/taskdetail/" +
          this.app.parpam["taskId"] +
          "/" +
          this.app.parpam["rid"]
        window.location.reload()
        return
        //return
        if (this.model.doneNum == -1) {
          window.location.href =
             window.location.origin + "/#!/personalaccount"
          window.location.reload()
          //this.app.changePage('personalaccount')
          return
        }
        window.location.reload()
        /*if (this.model.doneNum > this.model.cachelist.length) {
                this.submitFinish()
                return
            }
            this.series_get()*/
      })
  }

  //检查报错部分并且要显示的部分
  errorShow(item, node) {
    this.cornerstoneContorl.openSequenceNode(item)
    //let msg = this.app.disease[item.imageAnnotationType] + '_' + item.id
    let temp = Tool.configobjformat(this.app.constmap.LESION)
    let msg = temp[item.imageAnnotationType] + "_" + item.id
    msg += "的“" + node.componentName + "”为必填项，请填写完整。"
    this.alerError(msg)
  }
  //缓存里面的序列用完了以后的事情
  submitFinish(data) {
    this.app.alert.show({
      title: " ",
      msg: "需要加载新一批标注，请耐心等待",
      close: true,
      sure: function() {
        window.location.reload()
      }
    })
  }
}
module.exports = markview
