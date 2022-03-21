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
class CanvasBase extends MarkBase {
  constructor(app, api, dom, model) {
    super(app, api, dom, model)
  }
  //接口调用，获取信息
  baseApi() {
    //获取项目信息
    this.app.loading.show()
    this.api
      .annoitem_task_read({
        taskId: this.app.parpam["taskId"]
      })
      .done(value => {
        this.app.loading.hide()
        this.api
          .task_read({
            id: this.app.parpam["taskId"]
          })
          .done(res => {
            this.dom
              .find(".task-name span")
              .eq(1)
              .html(res.data.name)
            this.model.taskInfo = res.data
            this.model.setData("projectInfo", value.data)
          })
      })
  }

  annotationIteminit() {
    let projectInfo = this.model.projectInfo
    let tool = {}
    //翻译所有的标注组件信息
    let nidusinfo = {
      all: {}
    }
    let xu1 = 0
    projectInfo.annotationItemList.map(item => {
      item.id = item.componentId
      item.sequence = xu1
      item.formComponentId = item.componentId
      xu1++
    })

    nidusinfo.all = this.translateData(projectInfo.annotationItemList)
    for (let i = 0; i < projectInfo.imageAnnotationList.length; i++) {
      let teampData = projectInfo.imageAnnotationList[i].annotationItemList
      let xu = 0
      projectInfo.imageAnnotationList[i].annotationItemList.splice(0, 0, {
        componentCode: "check_reslut",
        componentData: '[{"text":"对","code":"0"},{"text":"错","code":"1"}]',
        componentId: "check_reslut",
        componentName: "正确与否",
        componentParameter: '{"isdefault ":false}',
        componentType: "select",
        optional: true,
        sequence: xu
      })
      projectInfo.imageAnnotationList[i].annotationItemList.map(item => {
        item.sequence = xu
        item.id = item.componentId
        xu++
      })
      if (teampData.length != 0) {
        nidusinfo[projectInfo.imageAnnotationList[i].type] = this.translateData(
          projectInfo.imageAnnotationList[i].annotationItemList
        )
      }
    }
    this.cornerstoneContorl.model.nidusComponentInfo = Tool.clone(nidusinfo)
    nidusinfo = null
    //=========根据不同类型来拿series=============
    if (this.cornerstoneContorl) {
      this.cornerstoneContorl.close()
    }
    if (this.dicommenu) {
      this.dicommenu.resetAll()
    }

    if (
      this.app.parpam["type"] == "check_viewer" ||
      this.app.parpam["type"] == "check_viewer_taskdetail" ||
      this.app.parpam["type"] == "check_viewer_taskdetail_view"
    ) {
      let taskData = this.app.parpam["taskInfo"].split("$$")
      if (this.model.taskInfo.studyAnno) {
        this.api
          .task_study_result_read({
            userId: taskData[2],
            taskId: this.app.parpam["taskId"] * 1,
            studyUid: taskData[0]
          })
          .done(res => {
            let endInfo = {
              studyInstanceUid: taskData[0],
              seriesInstanceUids: []
            }
            for (let i = 0; i < res.data.list.length; i++) {
              endInfo.seriesInstanceUids.push({
                seriesAnnotationResultId: res.data.list[i].sarId,
                seriesInstanceUid: res.data.list[i].seriesUid
              })
            }
            endInfo.remark = res.data.remark
            this.model.setData("series_result_id", endInfo)
          })
      } else {
        let temp = {
          seriesAnnotationResultId: taskData[1],
          seriesInstanceUid: taskData[0]
        }
        let endInfo = {
          studyInstanceUid: taskData[0],
          seriesInstanceUids: [
            {
              seriesAnnotationResultId: taskData[1],
              seriesInstanceUid: taskData[0]
            }
          ]
        }
        endInfo.remark = taskData[2]
        this.model.setData("series_result_id", endInfo)
      }
      return
    } else {
      this.app.loading.show()
      this.api
        .series_result_next({
          index: this.app.parpam["taskInfo"].split("$$")[1] * 1,
          taskId: this.app.parpam["taskId"] * 1,
          userId: parseInt(this.app.parpam["uid"])
        })
        .done(item => {
          this.app.loading.hide()
          let temp = {
            seriesAnnotationResultId: item.data.sarId,
            seriesInstanceUid: item.data.series
          }
          let endInfo = {
            studyInstanceUid: item.data.series,
            seriesInstanceUids: [
              {
                seriesAnnotationResultId: item.data.sarId,
                seriesInstanceUid: item.data.series
              }
            ]
          }
          this.model.setData("series_result_id", endInfo)
        })
    }
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
    this.api
      .series_get({
        taskId: this.app.parpam["taskId"],
        userId: 5088
      })
      .done(value => {
        if (value.code == 1001) {
          window.location.href =
             window.location.origin +
            "/#!/viewaudittask/" +
            this.app.parpam["taskId"] //this.app.changePage('personalaccount')
          window.location.reload()
        }
        if (!value.data) {
          window.location.href =
             window.location.origin +
            "/#!/viewaudittask/" +
            this.app.parpam["taskId"]
          window.location.reload()
        }
        let temp = {
          seriesAnnotationResultId: value.data.seriesAnnotationResultId,
          seriesInstanceUid: value.data.seriesInstanceUid
        }
        let seriesInstanceUids = []
        for (let i = 0; i < value.data.sarIdList.length; i++) {
          seriesInstanceUids.push({
            seriesAnnotationResultId: value.data.sarIdList[i],
            seriesInstanceUid: value.data.seriesList[i]
          })
        }
        let endInfo = {
          studyInstanceUid: value.data.seriesList[0],
          seriesInstanceUids: seriesInstanceUids
        }
        this.model.setData("series_result_id", endInfo)
      })
  }
  start_series() {
    let data = this.model.series_result_id
    for (let i = 0; i < data.seriesInstanceUids.length; i++) {
      //let aa =typeof data.seriesInstanceUids[i].seriesInstanceUid=="object"?data.seriesInstanceUids[i].seriesInstanceUid// JSON.parse(JSON.stringify(data.seriesInstanceUids[i]))
      this.getSeriesAllImage(data.seriesInstanceUids[i])
      //this.getSeriesAllImage(data.seriesInstanceUids[i])
    }
    this.result_get_fromback()
  }

  async getSeriesAllImage(data) {
    let ssId =
      typeof data.seriesInstanceUid == "object"
        ? data.seriesInstanceUid.series
        : data.seriesInstanceUid
    ssId = ssId.split("-")[0]
    this.model.seriesInfo[ssId] = {}
    this.app.loading.show()
    let value = await this.api.sys_transfer({
      service: "DR",
      method: "/v1/series/read",
      params: JSON.stringify({
        seriesInstanceUID: ssId
      })
      //this.api.series_read({
      //seriesInstanceUID: data.seriesInstanceUid
    })
    this.model.imageCacheList = {}
    for (var tt in value.data.segmentationInfo) {
      if (tt != "thumbnail") {
        let imageList = await this.api.sys_transfer({
          service: "DR",
          method: "/v1/image/query",
          params: JSON.stringify({
            seriesInstanceUID: ssId,
            fileType: "BIG_IMAGE",
            windowType: tt
          })
        })

        // test....
        // imageList.data.list && imageList.data.list.forEach(v => {
        //   v.urlWAN = v.urlLAN
        // })
        this.model.imageCacheList[tt] = imageList.data.list
      }
    }
    this.app.loading.hide()
    this.model.seriesInfo[ssId].info = value
    if (!this.model.taskInfo) {
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
    this.formatOrigin(value.data.segmentationInfo)
    this.model.seriesInfo[ssId].imgs = [] //res.data.list
    this.model.seriesInfo[ssId].orginImgSizes = JSON.parse(
      JSON.stringify(this.model._orginImgSizes)
    )
    this.model.orginImgSizes = null
    /*this.getimage({
      "group": data.seriesInstanceUid,
      "fileType": this.imageType,
      'windowType': "1x",
      "numberList": numlist.split(',')
    }, true)*/
    this.model.series_result_id.conclusion = value.data.conclusion
    this.model.series_result_id.finding = value.data.finding
    this.model.setData("seriesInfo", this.model.seriesInfo)
  }
  async getimage(data) {
    let res = {
      data: {
        list: []
      }
    }
    if (!this.model.imageCacheList[data.windowType]) {
      res = await this.api.sys_transfer({
        service: "DR",
        method: "/v1/image/query",
        params: JSON.stringify(data)
      })

      // test....
      // res.data.list && res.data.list.forEach(v => {
      //     v.urlWAN = v.urlLAN
      // })
    } else {
      data.numberList.map(item => {
        res.data.list.push(this.model.imageCacheList[data.windowType][item - 1])
      })
    }
    this.cornerstoneContorl.makeImage(res)
  }
  cornerstoneContorlOther() {
    let that = this
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.loadImage",
      value => {
        this.getimage(value)
      }
    )
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

    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.brushfirstload",
      function(value) {}
    )
    this.cornerstoneContorl.event._addEvent("ctcornerstone.Allthing", function(
      value
    ) {})

    //获取某一个病症的征象信息
    this.cornerstoneContorl.event._addEvent(
      "ctcornerstone.editNodeItem",
      function(value) {}
    )
  }

  // 格式化原图数据
  formatOrigin(data) {
    data.length = 1
    for (let i in data) {
      if (i != "thumbnail" && i != "length") {
        data[i] = JSON.parse(data[i])
        data[i].row = data[i].rows
        data[i].colnum = data[i].columns
        data[i].height = data[i].hieght || data[i].height
        if (i.replace("x", "") * 1 > data.length) {
          data.length = i.replace("x", "") * 1
        }
      }
    }
    this.model.orginImgSizes = data
  }

  //************************弹框区*************************

  //************************弹框区*************************
  //提交整个序列事件
  btnEvent() {
    this.dom.find(".back-icon").on("click", () => {
      if (this.app.parpam["type"] == "check_viewer_taskdetail") {
        // window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/editor'
        // window.location.reload()
        this.app.changePage("taskdetail", {
          taskId: this.app.parpam["taskId"],
          type: "editor"
        })
        return
      }
      if (this.app.parpam["type"] == "check_viewer_taskdetail_view") {
        // window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/view'
        // window.location.reload()
        this.app.changePage("taskdetail", {
          taskId: this.app.parpam["taskId"],
          type: "view"
        })
        return
      }
      // window.location.href =  window.location.origin + '/#!/viewaudittask/' + this.app.parpam['taskId']
      // window.location.reload()
      this.app.changePage("viewaudittask", { id: this.app.parpam["taskId"] })
    })
    let that = this
    if (this.app.parpam["type"].lastIndexOf("viewer_all") == -1) {
      this.dom.find(".cotrol-btn .btn-submit1").remove()
      this.dom.find(".cotrol-btn .btn-submit2").remove()
    } else {
      let ti = this.app.parpam["taskInfo"].split("$$")
      this.dom.find(".cotrol-btn .btn-submit1").on("click", () => {
        if (ti[1] * 1 > 0) {
          let nowtaksInfod = ti[0] + "_" + (ti[1] - 1)
          window.location.href =
             window.location.origin +
            "/#!/drapCanvasAud/" +
            this.app.parpam["taskId"] +
            "/" +
            nowtaksInfod +
            "/check_viewer_all"
          window.location.reload()
        } else {
          this.alerError("没有上一个序列了！")
        }
      })
      this.dom.find(".cotrol-btn .btn-submit2").on("click", () => {
        if (ti[1] * 1 < ti[0] - 1) {
          let nowtaksInfod = ti[0] + "_" + (ti[1] * 1 + 1)
          window.location.href =
             window.location.origin +
            "/#!/drapCanvasAud/" +
            this.app.parpam["taskId"] +
            "/" +
            nowtaksInfod +
            "/check_viewer_all"
          window.location.reload()
        } else {
          this.dom.find(".back-icon").click()
        }
      })
    }
  }
}

module.exports = CanvasBase
