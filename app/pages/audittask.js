class audittask extends DataBase {
  complete() {
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="audittask"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "CREATE":
            this.dom
              .find(".btnarea")
              .append('<a class="createbtn strokeBtn">' + v.name + "</a>")
            break
          case "START":
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case "EDIT":
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case "EDIT_INFO":
            this.model.listicon.action1.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action2.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case "EXPORT":
            this.model.listicon.action2.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action3.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case "VIEW_SERIES":
            this.model.listicon.action2.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action3.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          default:
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action1.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action2.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action3.config.content.push({
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
      ES.selctorDoc(".audittask").box().clientWidth - 240
    this.dom.find(".createbtn").on("click", () => {
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
    // 设置taskId放入taskIdList
    if (this.model.apiData.taskId) {
      this.model.apiData.taskIdList = this.model.apiData.taskIdList || []
      this.model.apiData.taskIdList.push(this.model.apiData.taskId)
    }
    delete this.model.apiData.taskId

    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.audit_task_search(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {
            id: val.id + "," + val.projectId + "," + val.status
          }
          switch (val.status) {
            case 1:
              val.status = "待发布"
              obj.operation = this.model.listicon.action
              break
            case 2:
              val.status = "进行中"
              if (val.isAssigned) {
                obj.operation = this.model.listicon.action2
              } else {
                obj.operation = this.model.listicon.action1
              }
              break
            case 3:
              val.status = "已完成"
              obj.operation = this.model.listicon.action3
              break
            case 4:
              val.status = "已终结"
              obj.operation = this.model.listicon.action3
              break
          }
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
  async listaction(value) {
    switch (value.classname) {
      case "COPY":
        this.app.alert.show({
          title: " ",
          msg: "确认复制吗？",
          close: true,
          sure: async () => {
            let copyRes = await this.api.audit_task_clone({
              taskId: value.id.split(",")[0] * 1
            })
            if (copyRes.code == 0) {
              this.search(true)
            } else {
              Tool.errorshow(copyRes.msg, this.app)
            }
          }
        })
        break
      case "READ":
        window.open(
           window.location.origin +
            "/#!/createaudittask1/view/" +
            value.id.split(",")[0] +
            "/" +
            value.id.split(",")[1] +
            "/" +
            value.id.split(",")[2]
        )
        // this.app.changePage('createaudittask1', { type: 'view', taskid: value.id.split(',')[0], projectid: value.id.split(',')[1], status: value.id.split(',')[2] })
        break
      case "EDIT":
        window.open(
           window.location.origin +
            "/#!/createaudittask1/edit/" +
            value.id.split(",")[0] +
            "/" +
            value.id.split(",")[1] +
            "/" +
            value.id.split(",")[2]
        )
        // this.app.changePage('createaudittask1', { type: 'edit', taskid: value.id.split(',')[0], projectid: value.id.split(',')[1], status: value.id.split(',')[2] })
        break
      case "EDIT_INFO":
        window.open(
           window.location.origin +
            "/#!/createaudittask1/edit/" +
            value.id.split(",")[0] +
            "/" +
            value.id.split(",")[1] +
            "/" +
            value.id.split(",")[2]
        )
        // this.app.changePage('createaudittask1', { type: 'edit', taskid: value.id.split(',')[0], projectid: value.id.split(',')[1], status: value.id.split(',')[2] })
        break
      case "START":
        this.app.loading.show()
        let res = await this.api.audit_task_series_needaudit_count({
          id: value.id.split(",")[0],
          submitTime: new Date().getTime()
        })
        this.app.loading.hide()
        if (res.code == 0) {
          let msg = ""
          switch (res.data.status) {
            case 1:
              msg = `正在计算可审核的序列数量，请等待计算结果`
              break
            case 2:
              msg = `是否确定开始任务，本次任务的需要审核的序列数量为${res.data.seriesNum}个，一旦开始序列数量即为锁定。`
              break
            case 3:
              msg = `计算失败`
              break
          }
          this.app.alert.show({
            title: " ",
            msg,
            close: true,
            sure: async () => {
              if (res.data.status == 2) {
                this.app.loading.show()
                let res1 = await this.api.audit_task_start({
                  id: value.id.split(",")[0]
                })
                this.app.loading.hide()
                if (res1.code == 0) {
                  this.model.apiData.page = 1
                  this.search(true)
                } else {
                  this.errorshow(res1.msg)
                }
              }
            }
          })
        } else {
          this.errorshow(res.msg)
        }
        break
      case "VIEW_SERIES":
        this.app.changePage("viewaudittask", { id: value.id.split(",")[0] })
        break
      case "EXPORT":
        let json = {
          taskId: value.id.split(",")[0]
        }
        let url =
          this.app.domain1 +
          "v1/audit/task/series/result/export?param=" +
          encodeURIComponent(JSON.stringify(json))
        // Tool.downfile(url, this.app)
        this.api.HttpRequest.downLoadFile(url, {
          key: "accessToken",
          val: this.app.local.get("accessToken")
        })
        break
    }
  }
  getapidata(value) {
    if (value) {
      switch (value.name) {
        case "projectIdList":
          this.chooseData.moduleobj.projectIdList.loading(true)
          this.audit_project_name_search(
            value.data.data ? value.data.data.trim() : ""
          )
          break
        case "taskIdList":
          this.chooseData.moduleobj.taskIdList.loading(true)
          this.task_like_query(value.data.data ? value.data.data.trim() : "")
          break
      }
    } else {
      this.chooseData.moduleobj.projectIdList.loading(true)
      this.chooseData.moduleobj.taskIdList.loading(true)
      this.audit_project_name_search("")
      this.task_like_query("")
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
    let projectNames = data.list.map(val => {
      return {
        idx: val.auditProjectId,
        val: val.auditProjectName
      }
    })
    this.chooseData.renderHtml(projectNames, "projectIdList")
  }
  async task_like_query(taskNameKey) {
    let json1 = {
      type: 2,
      taskNameKey
    }
    let { data } = await this.api.task_like_query(json1)
    this.chooseData.moduleobj.taskIdList.loading(false)
    let taskNames = data.list
      ? data.list.map(val => {
          return {
            idx: val.taskId,
            val: val.taskName
          }
        })
      : []
    this.chooseData.renderHtml(taskNames, "taskIdList")
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
module.exports = audittask
