class markdataexport extends DataBase {
  complete() {
    let url_page = window.location.href.split("#!/")[1].split("/")[0]
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="' + url_page + '"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "EXPORT":
            this.model.listicon.action = {
              danchuchuangkou: {
                dis: "inline",
                link: "noLink",
                titleText: "导出全部标注提交结果"
              }
            }
            break
        }
      })
    }
    this.changeAll(this.model.condition)
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".markdataexport").box().clientWidth - 140
    this.loadlist("group")
    this.dom.find(".searchbtn").on("click", () => {
      this.model.condition.forEach(val => {
        if (val[0].name == "inspectTime") {
          this.model.apiData.startCreateTime = this.getfiltercondition()[
            val[0].name
          ][0].startTime
          this.model.apiData.endCreateTime = this.getfiltercondition()[
            val[0].name
          ][0].endTime
        } else {
          this.model.apiData[val[0].name] =
            this.getfiltercondition()[val[0].name].toString() == ""
              ? null
              : this.getfiltercondition()[val[0].name].toString()
        }
      })
      this.model.apiData.projectIdList = this.model.apiData.projectIdList
        ? this.model.apiData.projectIdList.split(",").map(Number)
        : null
      if (this.model.apiData.algPreAnnotation) {
        this.model.apiData.algPreAnnotation =
          this.model.apiData.algPreAnnotation == 1 ? true : false
      }
      this.model.apiData.taskIdList = this.model.apiData.taskIdList
        ? this.model.apiData.taskIdList.split(",").map(Number)
        : null
      this.model.apiData.page = 1
      this.search(true)
    })
  }
  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    // 设置taskId放入taskIdList
    if (this.model.apiData.taskId) {
      this.model.apiData.taskIdList = this.model.apiData.taskIdList || []
      this.model.apiData.taskIdList.push(+this.model.apiData.taskId)
    }
    delete this.model.apiData.taskId

    let res = await this.api.getlist(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          switch (val.algPreAnnotation) {
            case true:
              val.algPreAnnotation = "算法标注"
              break
            case false:
              val.algPreAnnotation = "人工标注"
              break
          }
          Tool.configxlkformat(this.app.constmap["MODALITY"]).forEach(function(
            a,
            b
          ) {
            if (a.idx == val.projectModality) {
              val.projectModality = a.val
            }
          })
          if (val.startTime)
            val.startTime = Tool.time(val.startTime, "yyyy-mm-dd")
          if (val.endTime) val.endTime = Tool.time(val.endTime, "yyyy-mm-dd")
          let obj = {}
          obj.id =
            val.id + "," + val.seriesSubmittedNum + "," + val.seriesDiscardNum
          obj.operation = this.model.listicon.action
          data2.push(obj)
          val.newTaskId = val.id
          val.id = val.id + "," + val.projectId
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData()
      }
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
  }

  listaction(value) {
    switch (value.classname) {
      case "danchuchuangkou":
        if (value.id.split(",")[1] * 1 > 0) {
          if (value.id.split(",")[1] * 1 > value.id.split(",")[2] * 1) {
            let url =
              this.app.domain1 +
              "v1/anno/series_result/export/csv?id=" +
              value.id.split(",")[0] +
              "&type=TASK"
            // Tool.downfile(url, this.app)
            // let url = this.app.domain1 + 'v1/tagneed/exportSeries?tagNeedId=' + value.id*1 + '&accessToken=' + window.localStorage.accessToken;
            //let token = this.app.local.get('accessToken')
            this.api.HttpRequest.downLoadFile(url, {
              key: "accessToken",
              val: this.app.local.get("accessToken")
            })
          } else {
            this.app.alert.show({
              title: " ",
              msg: "所属任务下皆为废片，不支持导出。",
              close: true,
              sure: function() {}
            })
          }
        } else {
          this.app.alert.show({
            title: " ",
            msg: "无已提交序列，不支持导出。",
            close: true,
            sure: function() {}
          })
        }
        break
    }
  }
  async listlink(value) {
    this.app.loading.show()
    let res = await this.api.queryproject({ id: value.id.split(",")[1] })
    this.app.loading.hide()
    if (res.code == 0) {
      let modal = require("../modal/projectdetail/projectdetail")
      this.app.loadModal(modal, { adv: true }, { data: res.data })
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  getapidata(value) {
    const tempModuleobj = this.chooseData.moduleobj
    if (value) {
      let keyword = value.data.data
      keyword = keyword ? keyword.trim() : ""
      switch (value.name) {
        case "taskIdList":
          tempModuleobj.taskIdList.loading(true)
          this.task_name_search(keyword)
          break
        case "projectIdList":
          tempModuleobj.projectIdList.loading(true)
          this.project_name_search(keyword)
          break
        case "groupId":
          tempModuleobj.groupId.loading(true)
          this.queryProjectGroupList(keyword)
          break
      }
    } else {
      tempModuleobj.projectIdList.loading(true)
      tempModuleobj.taskIdList.loading(true)
      tempModuleobj.groupId.loading(true)
      this.project_name_search("")
      this.task_name_search("")
      this.queryProjectGroupList("")
    }
  }

  async project_name_search(projectName) {
    let { data } = await this.api.project_name_search({ projectName })
    this.chooseData.moduleobj.projectIdList.loading(false)
    let projectNames = data.list.map(val => {
      return {
        idx: val["projectId"],
        val: val["projectName"]
      }
    })
    this.chooseData.renderHtml(projectNames, "projectIdList")
  }
  async task_name_search(taskName) {
    let json1 = {
      releaseOfTask: false,
      taskName,
      type: window.location.hash.indexOf("markdataexport") !== -1 ? 1 : 3
    }
    let { data } = await this.api.task_name_search(json1)
    this.chooseData.moduleobj.taskIdList.loading(false)
    let taskNames = data.list.map(item => {
      return {
        idx: item.taskId,
        val: item.taskName
      }
    })
    this.chooseData.renderHtml(taskNames, "taskIdList")
  }
  async queryProjectGroupList(groupName) {
    let { data } = await this.api.queryProjectGroupList({
      name: groupName,
      page: 1
    })
    this.chooseData.moduleobj.groupId.loading(false)
    let temparr = data.list.map(val => {
      return {
        idx: val.id,
        val: val.name
      }
    })
    this.chooseData.renderHtml(temparr, "groupId")
  }
  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc(".markdatatable").css({ width: cw })
    ES.selctorDoc(".scrolltable").css({ height: ch - 220 })
  }
}

module.exports = markdataexport
