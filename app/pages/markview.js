//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class mark extends MarkBase {
  constructor(app, api, dom, model) {
    super(app, api, dom, model)
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
      })
  }

  //关闭菜单功能，生成病症的选项
  annotationIteminit() {
    let projectInfo = this.model.projectInfo
    let tool = {}
    //翻译所有的标注组件信息
    let nidusinfo = {
      all: {}
    }
    nidusinfo.all = this.translateData(projectInfo.annotationItemList)
    const tempImageAnnotationList = projectInfo.imageAnnotationList
    const tempToolList = [] // 用来装tempImageAnnotationList中的所有toolList
    for (let i = 0, j = tempImageAnnotationList.length; i < j; i++) {
      const { annotationItemList = [], type: imageAnnotation, toolList = [] } = tempImageAnnotationList[i]
      tempToolList.push({
        imageAnnotation,
        toolList
      })
      if (annotationItemList.length) {
        nidusinfo[imageAnnotation] = this.translateData(annotationItemList)
      }
    }
    for (let i = 0, j = tempToolList.length; i < j; i++) {
      const tempTool = tempToolList[i]
      const imageTagTool = tempTool.toolList.find(({ type }) => type === "IMAGE_TAG")
      if (imageTagTool) {
        imageTagTool.imageAnnotation = tempTool.imageAnnotation
        this.handleLayerMarkImageAnnotation(imageTagTool)
        break
      }
    }

    this.cornerstoneContorl.model.nidusComponentInfo = Tool.clone(nidusinfo)
    nidusinfo = null
    if (this.app.parpam["type"] != "viewer_all") {
      this.series_get(this.app.parpam["sid"])
    } else {
      this.model.frompage = {
        taskId: this.app.parpam["taskId"],
        userId: this.app.parpam["uid"],
        page: this.app.parpam["sid"],
        pageSize: 1
      }
      this.api.task_user_series_search(this.model.frompage).done(value => {
        if (value.data.list.length != 0) {
          this.series_get(value.data.list[0].serialNumber)
        } else {
          window.location.href =
             window.location.origin +
            "/#!/ytjtaskdetail/" +
            this.app.parpam["taskId"] +
            "/" +
            this.app.parpam["taskType"]
          //this.app.changePage('ytjtaskdetail', { taskid: this.app.parpam['taskId'] })
        }
      })
    }
  }

  //************************影像数据列表************************
  //初始化标注结果，当前序列
  /*creatOnePoint(imgs, data) {
      let postData = {}
      postData.result = imgs.id
      postData.seriesAnnotationResultId = this.model.seriesResult.data.id //.info.data.seriesInstanceUID
      postData.imageAnnotationId = data.toolType.imageAnnotationId
      postData.imageAnnotationToolId = data.toolType.id
      //return
      let newdata = {
          imglist: this.model.getImages(imgs.images, this.model.seriesInfo.info.wwc.flag, this.model.seriesInfo.imgsTotal),
          id: data.backId,
          rid: imgs.id
      }
  }*/
  needApiAll(data, apineed, newdata, postData) {
    this.cornerstoneContorl.setbrush(newdata)
  }
  //************************影像数据列表************************
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
    this.api
      .series_result_search({
        type: "TASK",
        id: this.app.parpam["taskId"],
        serialNumber: sid, // this.app.parpam['sid'],
        userId: this.app.parpam["uid"]
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

  //标注基础信息准备完成，进入这一轮标注的起始点
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

  //************************标注相关*************************
  //影像区加载
  cornerstoneContorlOther() {
    let that = this

    //对于图片上面的影像标注操作
    this.cornerstoneContorl.event._addEvent("ctcornerstone.addNode", function(
      value
    ) {})
    this.cornerstoneContorl.event._addEvent("ctcornerstone.editNode", function(
      value
    ) {})
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.deleteNode",
      function(value) {}
    )
    //获取整个序列的征象信息
    this.cornerstoneContorl.event._addEvent("ctcornerstone.Allthing", function(
      value
    ) {})
    //获取某一个病症的征象信息
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.editNodeItem",
      function(value) {}
    )
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
  }

  //************************弹框区*************************
  //弹窗加载
  // modalLoad() {
  //   let progressClass = require("../modal/progress/progress.js")
  //   this.progress = this.app.loadModal(progressClass, { adv: true })
  //   this.progress.hide()
  // }
  discaseToDone(value, dom) {
    this.api
      .series_discard({
        projectId: this.app.parpam.projectId,
        seriesInstanceUid: this.model.seriesInfo.info.data.seriesInstanceUID,
        discardReason: value
      })
      .done(value => {
        this.series_submit()
        //this.submitSeries()
        if (dom) {
          dom.close()
        }
      })
  }

  //************************弹框区*************************
  //提交整个序列事件
  btnEvent() {
    this.dom.find(".back-icon").on("click", () => {
      if (this.app.parpam["type"] != "viewer") {
        // window.location.href =  window.location.origin + '/#!/ytjtaskdetail/' + this.app.parpam['taskId'] + '/' + this.app.parpam['taskType']
        // window.location.reload()
        this.app.changePage("ytjtaskdetail", {
          taskid: this.app.parpam["taskId"],
          taskType: this.app.parpam["taskType"]
        })
        return
      } else {
        // window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/' + this.app.parpam['rid']
        // window.location.reload()
        this.app.changePage("taskdetail", {
          taskId: this.app.parpam["taskId"],
          type: this.app.parpam["rid"]
        })
        return
      }
    })
    let that = this
    if (this.app.parpam.type == "viewer_all") {
      this.dom.find(".cotrol-btn .btn-submit").on("click", () => {
        // window.location.href =  window.location.origin + '/#!/markview/' + this.app.parpam['taskId'] + '/' + this.app.parpam['projectId'] + '/' + this.app.parpam['type'] + '/' + this.app.parpam['uid'] + '/' + (this.app.parpam['sid'] * 1 + 1) + '//' + this.app.parpam['taskType']
        // window.location.reload()
        this.app.changePage("markview", {
          taskId: this.app.parpam["taskId"],
          projectId: this.app.parpam["projectId"],
          type: this.app.parpam["type"],
          uid: this.app.parpam["uid"],
          sid: this.app.parpam["sid"] * 1 + 1,
          taskType: this.app.parpam["taskType"]
        })
      })
      this.dom.find(".cotrol-btn .btn-submit1").on("click", () => {
        if (this.app.parpam["sid"] * 1 - 1 == 0) {
          this.alerError("没有上一个序列了！")
          return
        }
        this.app.changePage("markview", {
          taskId: this.app.parpam["taskId"],
          projectId: this.app.parpam["projectId"],
          type: this.app.parpam["type"],
          uid: this.app.parpam["uid"],
          sid: this.app.parpam["sid"] * 1 - 1,
          taskType: this.app.parpam["taskType"]
        })
        // window.location.href =  window.location.origin + '/#!/markview/' + this.app.parpam['taskId'] + '/' + this.app.parpam['projectId'] + '/' + this.app.parpam['type'] + '/' + this.app.parpam['uid'] + '/' + (this.app.parpam['sid'] * 1 - 1) + '//' + this.app.parpam['taskType']
        //   window.location.reload()
      })
      this.dom.find(".cotrol-btn .btn-submit2").remove()
      return
    }
    if (this.app.parpam.type == "editor") {
      this.dom.find(".cotrol-btn .btn-submit2").on("click", () => {
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
      this.dom.find(".cotrol-btn .btn-submit1").remove()
      this.dom.find(".cotrol-btn .btn-submit").remove()
    } else {
      this.dom.find(".cotrol-btn .btn-submit").remove()
      this.dom.find(".cotrol-btn .btn-submit1").remove()
      this.dom.find(".cotrol-btn .btn-submit2").remove()
    }
  }

  //经过检查能够进行提交了
  series_submit() {
    this.api
      .series_result_submit({
        id: this.model.series_result_id.seriesAnnotationResultId
      })
      .done(() => {
        if (this.model.doneNum > this.model.cachelist.length) {
          this.submitFinish()
          return
        }
        this.series_get()
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
        this.app.loading.hide()
        if (value.code == 400) {
          window.location.href =
             window.location.origin + "/#!/personalaccount"
          window.location.reload()
          return
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
        if (
          data.imageAnnotationResultList.length == 0 &&
          data.annotationItemResultList.length == 0
        ) {
          this.needSub[vid] = true
          this.alerError("请检查你是否进行了标注")
          return true
        }
        this.startSubmit()
      })
  }
  startSubmit() {
    let aaa = null
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
module.exports = mark
