import Papa from 'papaparse'
import { MessageBox } from 'element-ui'

class taskmanage extends DataBase {
  complete() {
    let url_page = window.location.href.split("#!/")[1].split("/")[0]
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="' + url_page + '"]')
        .parent()
        .attr("id")
    ]
    var a = ES.selctorDoc('.menu .twolink[link="' + url_page + '"]')
    .parent()
    .attr("id")
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
        case "STOP":
          this.model.listicon.action2.config.content.push({
            text: v.name,
            key: v.type
          })
          break
        case "END":
          this.model.listicon.action1.config.content.push({
            text: v.name,
            key: v.type
          })
          this.model.listicon.action3.config.content.push({
            text: v.name,
            key: v.type
          })
          break
        case "VIEW_SERIES":
          this.model.listicon.action3.config.content.push({
            text: v.name,
            key: v.type
          })
          this.model.listicon.action4.config.content.push({
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
          this.model.listicon.action4.config.content.push({
            text: v.name,
            key: v.type
          })
          this.model.listicon.action5.config.content.push({
            text: v.name,
            key: v.type
          })
          break
      }
    })
    this.taskType = window.location.hash.indexOf("taskmanage") !== -1 ? 1 : 3
    this.changeAll(this.model.condition)
    this.addli(this.model.condition)
    this.model.dataList = []  // 表格数据
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".taskmanage").box().clientWidth - 240
    this.loadlist("group")
    this.dom.find(".strokeBtn").on("click", () => {
      this.app.session.set("ischanged", false)
      if (this.taskType == 1) {
        this.app.changePage("createtask", { type: "new" })
      } else {
        this.app.changePage("createbackflowtask1", { type: "new" })
      }
    })
    this.dom.find(".fillBtn").on("click", () => {
      this.model.condition.forEach((val, idx) => {
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
      this.model.apiData.vendorIdList = this.model.apiData.vendorIdList
        ? this.model.apiData.vendorIdList.split(",").map(Number)
        : null
      this.model.apiData.page = 1
      this.model.apiData.type = 1
      this.search(true)
    })
  }
  async search(bool) {
    let data2 = []
    this.model.apiData.type = this.taskType
    // 设置taskId放入taskIdList
    if (this.model.apiData.taskId) {
      this.model.apiData.taskIdList = this.model.apiData.taskIdList || []
      this.model.apiData.taskIdList.push(this.model.apiData.taskId)
    }
    delete this.model.apiData.taskId

    let res = await this.api.queryTask(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val, i) => {
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
            val.seriesTotalNum / (val.crossMarkNum ? val.crossMarkNum : 1) +
            "," +
            val.projectId +
            "," +
            val.status
          val.assignVendors =
            val.assignVendors.length > 0 ? val.assignVendors.toString() : ""
          val.remark = JSON.parse('"' + val.remark + '"')
          switch (val.status) {
            case 1:
              val.status = "待发布"
              obj.operation = this.model.listicon.action
              break
            case 2:
              val.status = "进行中"
              if (val.seriesAvailableNum === val.seriesTotalNum) {
                obj.operation = this.model.listicon.action1
              } else {
                obj.operation = this.model.listicon.action3
              }
              break
            case 3:
              val.status = "已完成"
              if (val.seriesAvailableNum === val.seriesTotalNum) {
                obj.operation = this.model.listicon.action5
              } else {
                obj.operation = this.model.listicon.action4
              }
              break
            case 4:
              val.status = "已终结"
              if (val.seriesAvailableNum === val.seriesTotalNum) {
                obj.operation = this.model.listicon.action5
              } else {
                obj.operation = this.model.listicon.action4
              }
              break
          }
          data2.push(obj)
          val.method = val.method == 1 ? "承包式" : "开放式"
          val.algPreAnnotation = val.algPreAnnotation ? "算法标注" : "人工标注"
          val.projectStatus = val.projectStatus == 1 ? "未启用" : "已启用"
          val.crossMarkNum = val.assignMethod == 2 ? 1 : val.crossMarkNum
          val.seriesTotalNum = val.crossMarkNum
            ? val.seriesTotalNum / val.crossMarkNum +
              "(*" +
              val.crossMarkNum +
              ")"
            : val.seriesTotalNum + "(*1)"
          if (val.createTime)
            val.createTime = Tool.time(val.createTime, "yyyy-mm-dd")
          if (val.startTime)
            val.startTime = Tool.time(val.startTime, "yyyy-mm-dd")
          if (val.endTime) val.endTime = Tool.time(val.endTime, "yyyy-mm-dd")
          val.isassign = ""
        })
        this.tablecont.setData(res.data.list, data2)
        this.model.dataList = res.data.list || [] // 表格数据
      } else {
        this.tablecont.noData()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
  }

  async listaction(value) {
    const id = value.id.split(',')[0]
    const curData = this.model.dataList.find(v => v.id === Number(id))
    let page = this.taskType === 1 ? "createtask" : "createbackflowtask1"

    switch (value.classname) {
      case "READ":
        // this.app.changePage(this.taskType===1?'createtask':'createbackflowtask1', {
        //   type: 'view',
        //   taskid: value.id.split(',')[0],
        //   status:value.id.split(',')[4]
        //   // taskid: value.id.split(',')[0]
        // })
        window.open(
           window.location.origin +
            "/#!/" +
            page +
            "/view/" +
            value.id.split(",")[0] +
            "//" +
            value.id.split(",")[4]
        )
        break
      case "EDIT":
        // this.app.changePage(this.taskType===1?'createtask':'createbackflowtask1', {
        //   type: 'edit',
        //   taskid: value.id.split(',')[0],
        //   projectid: value.id.split(',')[3],
        //   status:value.id.split(',')[4]
        // })
        window.open(
           window.location.origin +
            "/#!/" +
            page +
            "/edit/" +
            value.id.split(",")[0] +
            "/" +
            value.id.split(",")[3] +
            "/" +
            value.id.split(",")[4]
        )
        break
      case "COPY":
        if (curData && curData.projectSeriesImgFileType === 9) { // 9随访配准
          this.app.alert.show({
            title: '提示',
            msg: "随访配准的项目任务不支持复制！",
            close: false,
            sure() {
              this.app.alert.hide();
            }
          })
          return
        }
        this.app.alert.show({
          title: " ",
          msg: "确认复制吗？",
          close: true,
          sure: async () => {
            let copyRes = await this.api.task_clone({
              taskId: value.id.split(",")[0]
            })
            if (copyRes.code == 0) {
              this.model.apiData.page = 1
              this.search(true)
            } else {
              Tool.errorshow(copyRes.msg, this.app)
            }
          }
        })
        break
      case "START":
        if (value.id.split(",")[1] == 1) {
          this.app.alert.show({
            title: " ",
            msg: "此任务中引用的项目未启动，请先启动项目。",
            close: true
          })
        } else {
          this.app.alert.show({
            title: " ",
            msg:
              "是否确定开始任务，本次任务的需要标注的序列数量为" +
              value.id.split(",")[2] +
              "个，一旦开始序列数量即为锁定。",
            close: true,
            sure: async () => {
              this.app.loading.show()
              let res = await this.api.startTask(
                parseInt(value.id.split(",")[0])
              )
              this.app.loading.hide()
              if (res.code === 0) {
                const resData = res.data
                if (resData) {
                  const seriesInstanceUidList = resData.map(seriesInstanceUid => {
                    return {
                      '序列号': seriesInstanceUid
                    }
                  })
                  const csvData = Papa.unparse(seriesInstanceUidList)
                  Tool.exportCSVFile(csvData, '序列号.csv')
                  MessageBox.alert('存在序列未跑mha或mha2,请查看已下载的文件')
                } else {
                  this.model.apiData.page = 1
                  this.search(true)
                }
              } else {
                this.app.alert.show({
                  title: "提醒",
                  msg: res.msg,
                  close: true
                })
              }
            }
          })
        }
        break
      case "END":
        this.app.alert.show({
          title: " ",
          msg:
            "是否确定要终结任务，一旦终结外部医生的任务即结束，本次任务也无法再次发布。",
          close: true,
          sure: async () => {
            let res = await this.api.task_end({
              taskId: value.id.split(",")[0]
            })
            if (res.code == 0) {
              this.model.apiData.page = 1
              this.search(true)
            } else {
              Tool.errorshow(res.msg, this.app)
            }
          }
        })
        break
      case "VIEW_SERIES":
        window.open(
           window.location.origin +
            "/#!/ytjtaskdetail/" +
            value.id.split(",")[0] +
            "/" +
            this.taskType
        )
        break
    }
  }
  toggletab(value) {
    this.app.changePage(this.taskType == 1 ? "taskmanage" : "backflowtask", {
      type: value.id
    })
  }
  getapidata(value) {
    if (value) {
      switch (value.name) {
        case "userId":
          this.chooseData.moduleobj.userId.loading(true)
          this.userIdListSearch(value.data.data ? value.data.data.trim() : "")
          break
        case "taskIdList":
          this.chooseData.moduleobj.taskIdList.loading(true)
          this.taskNameSearch(value.data.data ? value.data.data.trim() : "")
          break
        case "projectIdList":
          this.chooseData.moduleobj.projectIdList.loading(true)
          this.projectNameSearch(value.data.data ? value.data.data.trim() : "")
          break
        case "vendorIdList":
          this.chooseData.moduleobj.vendorIdList.loading(true)
          this.taskVendorNameSearch(
            value.data.data ? value.data.data.trim() : ""
          )
          break
      }
    } else {
      this.chooseData.moduleobj.userId &&
        this.chooseData.moduleobj.userId.loading(true)
      this.chooseData.moduleobj.projectIdList &&
        this.chooseData.moduleobj.projectIdList.loading(true)
      this.chooseData.moduleobj.taskIdList &&
        this.chooseData.moduleobj.taskIdList.loading(true)
      this.chooseData.moduleobj.vendorIdList &&
        this.chooseData.moduleobj.vendorIdList.loading(true)

      this.userIdListSearch("") // 查询医生列表
      this.taskNameSearch("")
      this.taskVendorNameSearch("")
      this.projectNameSearch("")
    }
  }
  async projectNameSearch(projectName) {
    let { data } = await this.api.projectNameSearch({
      projectName,
      type: window.location.hash.indexOf("taskmanage") !== -1 ? 1 : 3
    })
    this.chooseData.moduleobj.projectIdList.loading(false)
    let projectNames = data.list.map(item => {
      return {
        idx: item.projectId,
        val: item.projectName
      }
    })
    this.chooseData.renderHtml(projectNames, "projectIdList")
  }

  // 医生姓名ID查询
  async userIdListSearch(name) {
    let { data } = await this.api.userListSearch({
      name,
      type: window.location.hash.indexOf("taskmanage") !== -1 ? 1 : 3
    })
    this.chooseData.moduleobj.userId.loading(false)
    let userIDs = data.map(item => {
      return {
        idx: item.userId,
        val: `${item.name}（${item.userId}）`
      }
    })
    this.chooseData.renderHtml(userIDs, "userId")
  }

  async taskNameSearch(taskName) {
    let { data } = await this.api.taskNameSearch({
      taskName,
      type: window.location.hash.indexOf("taskmanage") !== -1 ? 1 : 3
    })
    this.chooseData.moduleobj.taskIdList.loading(false)
    let taskNames = data.list.map(item => {
      return {
        idx: item.taskId,
        val: item.taskName
      }
    })
    this.chooseData.renderHtml(taskNames, "taskIdList")
  }
  async taskVendorNameSearch(name) {
    let { data } = await this.api.taskVendorNameSearch({ name })
    this.chooseData.moduleobj.vendorIdList.loading(false)
    let taskVendorNames = data.list.map(item => {
      return {
        idx: item.id,
        val: item.name
      }
    })
    this.chooseData.renderHtml(taskVendorNames, "vendorIdList")
  }
}

module.exports = taskmanage
