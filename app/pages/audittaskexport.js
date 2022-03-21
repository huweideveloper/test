class audittaskexport extends DataBase {
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
          default:
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            break
        }
      })
    }
    this.changeAll(this.model.condition)
    this.app.menu.refreshmenu()
    this.resize()
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".audittaskexport").box().clientWidth - 240
    this.dom.find(".create").on("click", () => {
      this.app.changePage("createaudittask1", { type: "new" })
    })
    this.loadlist("group")
    this.dom.find(".searchbtn").on("click", () => {
      this.model.condition.forEach(val => {
        this.model.apiData[val[0].name] =
          this.getfiltercondition()[val[0].name].toString() == ""
            ? null
            : this.getfiltercondition()[val[0].name].toString()
      })
      this.model.apiData.projectIdList = this.model.apiData.projectIdList
        ? this.model.apiData.projectIdList.split(",").map(Number)
        : null
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

    let res = await this.api.audit_task_search(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {
            id: val.id + "," + val.seriesAuditNum
          }
          switch (val.status) {
            case 1:
              val.status = "待发布"
              break
            case 2:
              val.status = "进行中"
              break
            case 3:
              val.status = "已完成"
              break
            case 4:
              val.status = "已终结"
              break
          }
          switch (val.auditChoose) {
            case 1:
              val.auditChoose = "一致部分"
              break
            case 2:
              val.auditChoose = "不一致部分"
              break
            case 3:
              val.auditChoose = "全集"
              break
          }
          obj.operation = this.model.listicon.action
          data2.push(obj)
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
    this.initscroll("scrolltable")
  }

  listaction(value) {
    switch (value.classname) {
      case "EXPORT_DATA":
        if (value.id.split(",")[1] > 0) {
          let json = {
            taskId: value.id.split(",")[0]
          }
          let url =
            this.app.domain1 +
            "v1/audit/task/statistics/export?param=" +
            encodeURI(JSON.stringify(json))
          // Tool.downfile(url, this.app)
          this.api.HttpRequest.downLoadFile(url, {
            key: "accessToken",
            val: this.app.local.get("accessToken")
          })
        } else {
          this.app.alert.show({
            title: " ",
            msg: "无已审核序列，不支持导出。",
            close: true,
            sure: function() {}
          })
        }
        break
      case "EXPORT":
        if (value.id.split(",")[1] > 0) {
          let json = {
            taskId: value.id.split(",")[0]
          }
          let url =
            this.app.domain1 +
            "/v1/audit/task/series/result/export?param=" +
            encodeURIComponent(JSON.stringify(json))
          // Tool.downfile(url, this.app)
          this.api.HttpRequest.downLoadFile(url, {
            key: "accessToken",
            val: this.app.local.get("accessToken")
          })
        } else {
          this.app.alert.show({
            title: " ",
            msg: "无已审核序列，不支持导出。",
            close: true,
            sure: function() {}
          })
        }
        break
    }
  }

  getapidata(value) {
    const tempModuleobj = this.chooseData.moduleobj
    if (value) {
      let keyword = value.data.data
      keyword = keyword ? keyword.trim() : ""
      switch (value.name) {
        case "projectIdList":
          tempModuleobj.projectIdList.loading(true)
          this.audit_project_name_search(keyword)
          break
        case "taskIdList":
          tempModuleobj.taskIdList.loading(true)
          this.task_like_query(keyword)
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
      this.audit_project_name_search("")
      this.task_like_query("")
      this.queryProjectGroupList("")
    }
  }

  async audit_project_name_search(auditProjectName) {
    let json1 = {
      page: 1,
      pageSize: 10,
      auditProjectName
    }
    let { data } = await this.api.audit_project_name_search(json1)
    this.chooseData.moduleobj.projectIdList.loading(false)
    let temparr = data.list.map(item => {
      return {
        idx: item.auditProjectId,
        val: item.auditProjectName
      }
    })
    this.chooseData.renderHtml(temparr, "projectIdList")
  }

  async task_like_query(taskNameKey) {
    let json1 = {
      type: 2,
      taskNameKey
    }
    let { data } = await this.api.task_like_query(json1)
    this.chooseData.moduleobj.taskIdList.loading(false)
    let temparr = data.list
      ? data.list.map(item => {
          return {
            idx: item.taskId,
            val: item.taskName
          }
        })
      : []
    this.chooseData.renderHtml(temparr, "taskIdList")
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
  //报错弹窗
  errorshow(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: false
    })
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc(".scrolltable").css({ height: ch - 200 })
  }
}

module.exports = audittaskexport
