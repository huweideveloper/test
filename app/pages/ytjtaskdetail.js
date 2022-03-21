//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class ytjtaskdetail extends Interstellar.pagesBase {
  complete() {
    this.styleModel(1)
    this.type = this.app.parpam.type
    this.taskId = this.app.parpam.taskid * 1
    this.taskType = this.app.parpam.taskType
    this.model._event._addEvent("taskid.change", () => {
      this.settaskdata()
    })

    this.action = {
      viewmark: { dis: 'inline', link: 'noLink', content: '查看标注结果' }
    }
    this.action1 = {
      viewseries: { dis: "inline", link: "noLink", content: "查看序列" }
    }
    this.render()
    this.setTitle()
    this.task_read()
    this.dom.find(".breadcrumb .lastlink").on("click", () => {
      this.app.model.del("ytjtaskdetail")
      this.app.changePage(this.taskType == 1 ? "taskmanage" : "backflowtask", {
        type: "fs"
      })
    })
    this.model._event._addEvent("querylist.change", async () => {
      let temp = this.model.getData("querylist").reset
      // this.app.loading.show()
      let res = await this.api.getuserseries(this.model.getData("querylist"))
      // this.app.loading.hide()
      if (res.code == 0) {
        this.dom
          .find('label[api="seriesEndNum"]')
          .html(parseInt(res.data.total) - parseInt(this.doingnum))
        this.setMain(res, temp)
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    })
  }

  render() {
    require.ensure("../moduleslibs/menutree/menutree.js", () => {
      let menu = require("../moduleslibs/menutree/menutree.js")
      this.menutree = this.app.loadModule(
        menu,
        this.dom.find(".personarea .left"),
        { config: ["venderName", "mobile_phone", "discardNum", "workNum", "imageNumber"] }
      )
      this.model.setData("taskid", this.taskId)
      this.menutree.event._addEvent("navFirst.choosed", value => {
        this.doingnum = value.config.split(",")[3]
        this.dom
          .find('label[api="venderName"]')
          .html(
            value.config.split(",")[0] !== "null"
              ? value.config.split(",")[0]
              : ""
          )
        this.dom.find('label[api="username"]').html(value.config.split(",")[1])
        this.dom
          .find('label[api="discardNum"]')
          .html(value.config.split(",")[2])
        this.dom.find('label[api="workNum"]').html(value.config.split(",")[3])
        this.dom.find('label[api="imageNumber"]').html(value.config.split(",")[4])
        // this.dom.find('input[api="serialNumber"]').val('')
        this.model.querylist.reset = true
        this.model.querylist.page = 1
        this.model.querylist.userId = parseInt(value.id)
        this.model.querylist.serialNumber = this.dom
          .find('input[api="serialNumber"]')
          .val()
        this.model.setData("querylist", this.model.querylist)
        // this.model.setData('querylist', {
        //   taskId: parseInt(this.taskId),
        //   userId: parseInt(value.id),
        //   page: 1,
        //   pageSize: 10,
        //   reset: true,
        // })
      })
    })
    this.dom.find(".biaozhubtn").on("click", () => {
      const tempSeriesImgFileType = this.seriesImgFileType
      if (tempSeriesImgFileType !== 1 && tempSeriesImgFileType !== 2) {
        // 跳转到C端
        Tool.goToC(this.app, {
          taskId: this.taskId,
          userId: this.model.querylist.userId,
          seriesImgFileType: tempSeriesImgFileType,
          type: 3,
          projectId: this.projectId,
        })
        return
      }
      this.model.querylist.reset = true
      this.app.model.set("ytjtaskdetail", this.model.querylist)
      this.app.changePage(this.largeFigure ? "drapCanvasCheck" : "markview", {
        taskId: this.app.parpam["taskid"],
        projectId: this.projectId,
        type: "viewer_all",
        uid: this.model.querylist.userId,
        sid: 1,
        taskType: this.taskType
      })
      // let page = this.largeFigure ? 'drapCanvasCheck':'markview'
      // let url =  window.location.origin + '/#!/'+page+'/' + this.app.parpam['taskid'] + '/' + this.projectId + '/viewer_all/' + this.model.querylist.userId + '/1//'+this.taskType
      // let link = document.createElement('a')
      // link.target = "_blank";
      // link.href = url;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    })
    this.dom.find(".taskdetail .export").on("click", () => {
      let url =
        this.app.domain1 +
        "v1/task/series/discard/export/?taskId=" +
        this.taskId
      Tool.downfile(url, this.app)
    })
    this.dom.find(".sequencearea .search").on("click", () => {
      this.model.setData("querylist", {
        taskId: parseInt(this.taskId),
        userId: parseInt(this.dom.find(".choosedks").attr("did")),
        page: 1,
        pageSize: 10,
        reset: true,
        serialNumber: this.dom.find('input[api="serialNumber"]').val()
      })
    })
  }

  setTitle() {
    let obj = {}
    obj["icon"] = {
      serialNumber: {
        name: '<span data-name="序号">序号</span>',
        type: "text",
        w: "35%",
        ww: "35%"
      },
      discarded: {
        name: '<span data-name="是否废片">是否废片</span>',
        type: "text",
        w: "8%",
        ww: "8%"
      },
      status: {
        name: '<span data-name="标注状态">标注状态</span>',
        type: "text",
        w: "10%",
        ww: "10%"
      },
      imageAnnoNum: {
        name: '<span data-name="病灶数量">病灶数量</span>',
        type: "text",
        w: "8%",
        ww: "8%"
      },
      submitTime: {
        name: '<span data-name="提交时间">提交时间</span>',
        type: "text",
        w: "10%",
        ww: "10%"
      },
      auditStatus: {
        name: '<span data-name="审核状态">审核状态</span>',
        type: "text",
        w: "10%",
        ww: "10%"
      },
      annoUpdateStatus: {
        name: '<span data-name="标注是否更新">标注是否更新</span>',
        type: "text",
        w: "10%",
        ww: "10%"
      },
      annoLastUpdateTime: {
        name: '<span data-name="标注最后更新时间">标注最后更新时间</span>',
        type: "text",
        w: "14%",
        ww: "14%"
      }
    }
    obj["actionulwidth"] = 200
    obj["tablewidth"] = ES.selctorDoc(".ytjtaskdetail").box().clientWidth - 471
    obj["type"] = "center"
    obj["actionicon"] = {
      operation: {
        name: '<span data-i18n="action" data-name="操作">操作</span>',
        type: "action",
        code: "action",
        w: "100%",
        ww: "100%"
      }
    }
    require.ensure("../moduleslibs/table_group/table_group", () => {
      let cont_table = require("../moduleslibs/table_group/table_group")
      this.table = this.app.loadModule(
        cont_table,
        this.dom.find(".serieslist"),
        {
          id: "serieslist",
          header: obj
        }
      )
      this.table.event._addEvent("table.action", value => {
        const taskId = this.app.parpam['taskid']
        // 跳转到数据统计
        if (value.classname == 'viewstatistical') {
          const sid = value.id
          window.open(`${window.location.origin}/#!/ytjtaskstatistical/${sid}/${taskId}`)
          return
        }
        // 下载
        if (value.classname === "down") {
          const url = `${window.location.origin}/aaa/v1/pdf/lung/nodules?taskId=${taskId}&studyInstanceUid=${value.id}&clearDicom=true`
          this.api.HttpRequest.downLoadFile(url, {
            key: 'accessToken',
            val: this.app.local.get('accessToken')
          })
          return
        }
        let page = this.largeFigure ? "drapCanvasCheck" : "markview"
        const tempSeriesImgFileType = this.seriesImgFileType
        if (tempSeriesImgFileType !== 1 && tempSeriesImgFileType !== 2) {
          // 跳转到C端
          Tool.goToC(this.app, {
            taskId: this.taskId,
            userId: this.model.querylist.userId,
            seriesImgFileType: tempSeriesImgFileType,
            type: 2,
            serialNumber: value.id,
            projectId: this.projectId,
          })
          return
        }
        if (value.classname == "viewmark") {
          // let url =  window.location.origin + '/#!/'+page+'/' + this.app.parpam['taskid'] + '/' + this.projectId + '/viewer_admin/' + this.model.querylist.userId + '/' + value.id+'//'+this.taskType
          // let link = document.createElement('a');
          // link.target = "_blank";
          // link.href = url;
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
          this.model.querylist.reset = true
          this.app.model.set("ytjtaskdetail", this.model.querylist)
          this.app.changePage(
            this.largeFigure ? "drapCanvasCheck" : "markview",
            {
              taskId: this.app.parpam["taskid"],
              projectId: this.projectId,
              type: "viewer_admin",
              uid: this.model.querylist.userId,
              sid: value.id,
              taskType: this.taskType
            }
          )
        } else if (value.classname == "viewseries") {
          // let url =  window.location.origin + '/#!/'+page+'/' + this.app.parpam['taskid'] + '/' + this.projectId + '/viewer_admin/' + this.model.querylist.userId + '/' + value.id+'//'+this.taskType
          // let link = document.createElement('a');
          // link.target = "_blank";
          // link.href = url;
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
          this.model.querylist.reset = true
          this.app.model.set("ytjtaskdetail", this.model.querylist)
          this.app.changePage(
            this.largeFigure ? "drapCanvasCheck" : "markview",
            {
              taskId: this.app.parpam["taskid"],
              projectId: this.projectId,
              type: "viewer_admin",
              uid: this.model.querylist.userId,
              sid: value.id,
              taskType: this.taskType
            }
          )
        }
      })
      this.table.event._addEvent("table.pagenumber", value => {
        let json = this.model.getData("querylist")
        json.reset = false
        json.page = parseInt(value)
        this.table.changenum(parseInt(value))
        this.model.setData("querylist", json)
      })
      this.table.event._addEvent("table.pagesize", value => {
        let json = this.model.getData("querylist")
        json.page = 1
        json.pageSize = value.num
        json.reset = true
        this.model.setData("querylist", json)
      })
      this.dom.find(".list-content").removeClass("hide")
    })
  }

  setMain(res, bool) {
    // 根据配置判断是否显示统计结果 放到此处，因为要在constmap获取数据之后
    const visibleStatistical = Tool.configobjformatremark(this.app.constmap['SINGLE_CONFIG']).MASK_PROPERTIES_WEB_ONOFF
    visibleStatistical === '1' && (this.action.viewstatistical = { dis: 'inline', link: 'noLink', content: '统计结果' })

    let data2 = []
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          let obj = {}
          val.id = val.serialNumber
          obj.id = val.id
          if (val.discarded == true) {
            obj.operation = this.action1
            val.discarded = "是"
          } else {
            obj.operation = this.action
            val.discarded = "否"
          }
          if (this.studyAnno) {
            val.imageTotalNum = ""
          }
          data2.push(obj)
          if (String(val.status) == "2" || String(val.status) == "1") {
            val.status = "标注进行中"
          } else {
            val.status = "已提交"
          }
          val.submitTime = val.submitTime ? Tool.time(val.submitTime, "yyyy-mm-dd HH:MM") : "无"
          if (typeof val.auditStatus === 'number') {
            const auditStatusList = ['待审核', '', '审核通过', '审核未通过'] //（0-待审核，2-审核通过，3-审核未通过）
            val.auditStatus = auditStatusList[val.auditStatus]
          } else {
            val.auditStatus = ''
          }
          val.annoUpdateStatus = typeof val.annoUpdateStatus === 'boolean' ? (val.annoUpdateStatus ? '是' : '否') : ''
          val.annoLastUpdateTime = val.annoLastUpdateTime ? Tool.time(val.annoLastUpdateTime, "yyyy-mm-dd HH:MM") : ''
        })
        this.table.setData(res.data.list, data2)
      } else {
        this.table.noData()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.table.getTotal(res.data.pages, 2, res.data.total)
      this.table.changenum(
        this.model.querylist.page,
        this.model.querylist.pageSize
      )
    }
  }

  async settaskdata() {
    let json = {
      id: this.taskId
    }
    let temp = [
      "name",
      "projectName",
      "startTime",
      "endTime",
      "algPreAnnotation",
      "seriesTotalNum",
      "seriesSubmittedNum",
      "seriesDiscardNum",
      "seriesProcessNum",
      "discardNum",
      "workNum",
      "imageNumber"
    ]
    let res = await this.api.gettask(json)
    if (res.code == 0) {
      res.data.startTime = Tool.time(res.data.startTime, "yyyy-mm-dd")
      res.data.endTime = Tool.time(res.data.endTime, "yyyy-mm-dd")
      if (res.data.studyAnno) {
        this.studyAnno = true
        res.data.algPreAnnotation = res.data.algPreAnnotation
          ? "算法标注（以检查号为维度）"
          : "人工标注（以检查号为维度）"
      } else {
        res.data.algPreAnnotation = res.data.algPreAnnotation
          ? "算法标注"
          : "人工标注"
      }
      if (res.data.seriesDiscardNum > 0) {
        this.dom.find(".taskdetail .export").removeClass("hide")
      }
      let num = res.data.crossMarkNum ? res.data.crossMarkNum : 1
      temp.forEach((val, idx) => {
        if (val == "seriesTotalNum") {
          let temp = `${res.data[val] / num}(*${num})`
          this.dom.find('label[apidata="' + val + '"]').html(temp)
        } else {
          this.dom.find('label[apidata="' + val + '"]').html(res.data[val])
        }
      })
      this.projectId = res.data.projectId
      this.menutree.changeMenu(res.data.userList, "single")
      this.dom
        .find(".treeArea .navFirst")
        .eq(0)
        .click()
      if (this.app.model.get("ytjtaskdetail")) {
        this.model.setData("querylist", this.app.model.get("ytjtaskdetail"))
        if (this.app.model.get("ytjtaskdetail").serialNumber) {
          this.dom
            .find('.filterarea input[api="serialNumber"]')
            .val(this.app.model.get("ytjtaskdetail").serialNumber)
        }
        if (this.app.model.get("ytjtaskdetail").userId) {
          this.dom
            .find(
              '.treeArea .navFirst[did="' +
              this.app.model.get("ytjtaskdetail").userId +
              '"]'
            )
            .click()
        }
      } else {
        this.dom
          .find(".treeArea .navFirst")
          .eq(0)
          .click()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  async task_read() {
    this.app.loading.show()
    let res = await this.api.task_read({ id: this.taskId })
    this.app.loading.hide()
    if (res.code == 0) {
      this.seriesImgFileType = res.data.seriesImgFileType
      this.projectId = res.data.projectId
      this.largeFigure = res.data.largeFigure
      // 根据isLungPdf=true添加下载
      if (res.data.isLungPdf) {
        const download = {
          dis: "inline",
          link: "noLink",
          content: "下载"
        }
        this.action.down = download
        this.action1.down = download
      }
      // 9 随访配准项目隐藏按钮-查看所有标注结果
      if (this.seriesImgFileType === 9) {
        this.dom.find('.viewall').addClass('hide')
      } else {
        this.dom.find('.viewall').removeClass('hide')
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
}

module.exports = ytjtaskdetail
