class releasetask extends DataBase {
  complete() {
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="releasetask"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "RELEASE":
            this.model.listicon.action = {
              release: { dis: "inline", link: "noLink", content: "释放任务" }
            }
            break
        }
      })
    }
    this.changeAll(this.model.condition)
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".releasetask").box().clientWidth - 240
    this.loadlist("group")
    this.dom.find(".create").on("click", () => {
      this.app.changePage("createtask", { type: "new" })
    })
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
        ? this.model.apiData.projectIdList.split(",")
        : null
      this.model.apiData.taskIdList = this.model.apiData.taskIdList
        ? this.model.apiData.taskIdList.split(",")
        : null
      this.model.apiData.vendorIdList = this.model.apiData.vendorIdList
        ? this.model.apiData.vendorIdList.split(",")
        : null
      this.model.apiData.page = 1
      this.search(true)
    })
  }

  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.querytask(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {}
          val.vendors = ""
          obj.id =
            val.id +
            "," +
            val.projectStatus +
            "," +
            val.seriesTotalNum +
            "," +
            val.projectId
          if (val.assignVendors.length > 0) {
            val.assignVendors.forEach(function(val1) {
              val.vendors += val1
            })
          } else {
            val.vendors = ""
          }
          obj.operation = this.model.listicon.action
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
          switch (val.method) {
            case 1:
              val.assignMethod = "承包式"
              break
            case 2:
              val.assignMethod = "开放式"
              break
          }
          if (val.type == 2) {
            val.algPreAnnotation = "审核任务"
          } else {
            switch (val.algPreAnnotation) {
              case true:
                val.algPreAnnotation = "算法标注"
                break
              case false:
                val.algPreAnnotation = "人工标注"
                break
            }
          }
          data2.push(obj)
          switch (val.projectStatus) {
            case 1:
              val.projectStatus = "未启用"
              break
            case 2:
              val.projectStatus = "已启用"
              break
          }
          if (val.createTime)
            val.createTime = Tool.time(val.createTime, "yyyy-mm-dd")
          if (val.startTime)
            val.startTime = Tool.time(val.startTime, "yyyy-mm-dd")
          if (val.endTime) val.endTime = Tool.time(val.endTime, "yyyy-mm-dd")
          val.gongsi = ""
          val.isassign = ""
          val.handler = "否"
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

  async listaction(value) {
    let taskuser = require("../modal/taskuser/taskuser")
    switch (value.classname) {
      case "release":
        this.app.loading.show()
        let res = await this.api.task_belongsUserList({
          taskId: value.id.split(",")[0]
        })
        if (res.code == 0) {
          this.app.loading.hide()
          let modal = this.app.loadModal(taskuser, { adv: true }, { data: res })
          modal.event._addEvent("taskuser.adddata", async value1 => {
            this.app.loading.show()
            let res1 = await this.api.task_release({
              taskId: value.id.split(",")[0],
              userIdList: value1.data
            })
            this.app.loading.hide()
            if (res1.code == 0) {
              modal.close()
              this.model.apiData.page = 1
              this.search(true)
            } else {
              console.log(res1.msg)
              Tool.errorshow(res1.msg, this.app)
            }
          })
        }
        break
    }
  }

  getapidata(value) {
    if (value) {
      switch (value.name) {
        case "taskIdList":
          this.chooseData.moduleobj.taskIdList.loading(true)
          this.task_name_search(value.data.data ? value.data.data.trim() : "")
          break
        case "projectIdList":
          this.chooseData.moduleobj.projectIdList.loading(true)
          this.project_name_search(
            value.data.data ? value.data.data.trim() : ""
          )
          break
        case "vendorIdList":
          this.chooseData.moduleobj.vendorIdList.loading(true)
          this.task_vendorName_search(
            value.data.data ? value.data.data.trim() : ""
          )
          break
      }
    } else {
      this.chooseData.moduleobj.taskIdList.loading(true)
      this.chooseData.moduleobj.projectIdList.loading(true)
      this.chooseData.moduleobj.vendorIdList.loading(true)
      this.project_name_search("")
      this.task_name_search("")
      this.task_vendorName_search("")
    }
  }

  async project_name_search(projectName) {
    let json1 = {
      releaseOfTask: true,
      projectName
    }
    let { data } = await this.api.project_name_search(json1)
    this.chooseData.moduleobj.projectIdList.loading(false)
    let temparr = data.list.map(item => {
      return {
        idx: item.projectId,
        val: item.projectName
      }
    })
    this.chooseData.renderHtml(temparr, "projectIdList")
  }

  async task_name_search(taskName) {
    let json1 = {
      releaseOfTask: true,
      taskName
    }
    let { data } = await this.api.task_name_search(json1)
    this.chooseData.moduleobj.taskIdList.loading(false)
    let temparr = data.list.map(item => {
      return {
        idx: item.taskId,
        val: item.taskName
      }
    })
    this.chooseData.renderHtml(temparr, "taskIdList")
  }

  async task_vendorName_search(vendorName) {
    let { data } = await this.api.task_vendorName_search({ vendorName })
    this.chooseData.moduleobj.vendorIdList.loading(false)
    let temparr = data.list.map(function(item) {
      return {
        idx: item.id,
        val: item.name
      }
    })
    this.chooseData.renderHtml(temparr, "vendorIdList")
  }
  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc(".scrolltable").css({ height: ch - 200 })
  }
}

module.exports = releasetask
