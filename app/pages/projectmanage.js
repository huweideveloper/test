
import Papa from 'papaparse'
import { MessageBox } from 'element-ui'

class projectmanage extends DataBase {
  complete() {
    let url_page = window.location.href.split("#!/")[1].split("/")[0]
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="' + url_page + '"]')
        .parent()
        .attr("id")
    ]
    this.permission = permission
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
        case "STOP":
          this.model.listicon.action1.config.content.push({
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
          break
      }
    })
    this.changeAll(this.model.condition)
    this.addli(this.model.condition)
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".projectmanage").box().clientWidth - 140
    this.loadlist("group")
    this.projectType =
      window.location.hash.indexOf("projectmanage") !== -1 ? 1 : 3
    this.dom.find(".createbtn").on("click", () => {
      this.app.session.set("ischanged", false)
      if (this.projectType == 1) {
        this.app.changePage("createproone", { type: "new" })
      } else {
        this.app.changePage("createbackflowpro1", { type: "new" })
      }
    })
    this.dom.find(".searchbtn").on("click", () => {
      this.model.condition.forEach(val => {
        if (val[0].name == "inspectTime") {
          this.model.apiData.startTime = this.getfiltercondition()[
            val[0].name
          ][0].startTime
          this.model.apiData.endTime = this.getfiltercondition()[
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
      this.model.apiData.page = 1
      this.search(true)
    })
  }
  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    this.model.apiData.type = this.projectType
    let res = await this.api.queryproject(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {}
          let temp =
            val.quotedByAuditProject || val.taskInProgressCount > 0 ? 2 : 1
          obj.id = val.id + "," + val.taskInProgressCount + "," + temp
          const { seriesImgFileType } = val
          switch (val.status) {
            case 1:
              val.status = "未启用"
              obj.operation = this.model.listicon.action
              break
            case 2:
              val.status = "已启用"
              const action1 = JSON.parse(JSON.stringify(this.model.listicon.action1))
              // 7: "冠脉狭窄", 8: "MASK跑算法" 也叫冠脉命名
              if ([7, 8].includes(seriesImgFileType)) {
                const hasCopyPermisstion = this.permission.find(v => v.type === 'COPY')
                hasCopyPermisstion && action1.config.content.push({text: '下载', key: 'DOWNLOAD'})
              }
              obj.operation = action1
              break
          }
          Tool.configxlkformat(this.app.constmap["MODALITY"]).forEach(function(
            a,
            b
          ) {
            if (a.idx == val.modality) {
              val.modality = a.val
            }
          })
          data2.push(obj)
          val.createTime = Tool.time(val.createTime, "yyyy-mm-dd")
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
  }
  async listaction(value) {
    switch (value.classname) {
      case "READ":
        if (this.projectType === 1) {

          window.open(
             window.location.origin +
              "/#!/createproone/view/" +
              value.id.split(",")[0]
          )
          // this.app.changePage('createproone', { type: 'view', projectid: value.id.split(',')[0] })
        } else {
          window.open(
             window.location.origin +
              "/#!/createbackflowpro1/view/" +
              value.id.split(",")[0]
          )
          // this.app.changePage('createbackflowpro1', { type: 'view', projectid: value.id.split(',')[0] })
        }
        break
      case "EDIT":
        if (this.projectType === 1) {
          window.open(
             window.location.origin +
              "/#!/createproone/edit/" +
              value.id.split(",")[0] +
              "/" +
              value.id.split(",")[2]
          )
          // this.app.changePage('createproone',  { type: 'edit', projectid: value.id.split(',')[0], status: value.id.split(',')[2] })
        } else {
          window.open(
             window.location.origin +
              "/#!/createbackflowpro1/edit/" +
              value.id.split(",")[0] +
              "/" +
              value.id.split(",")[2]
          )
          // this.app.changePage('createbackflowpro1',  { type: 'edit', projectid: value.id.split(',')[0], status: value.id.split(',')[2] })
        }
        break
      case "COPY":
        this.app.alert.show({
          title: " ",
          msg: "确认复制吗？",
          close: true,
          sure: async () => {
            let copyRes = await this.api.project_clone({
              projectId: value.id.split(",")[0]
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
        let json = {
          id: parseInt(value.id.split(",")[0]),
          status: 2
        }
        this.app.loading.show()
        let res = await this.api.startproject(json)
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
          Tool.errorshow(res.msg, this.app)
        }
        break
      case "STOP":
        if (value.id.split(",")[1] > 0) {
          this.app.alert.show({
            title: " ",
            msg: "有标注任务已引用此项目，请先把相关任务暂停后再进行此操作。",
            close: true
          })
        } else {
          this.app.alert.show({
            title: " ",
            msg: "确定需要暂停启用项目？",
            close: true,
            sure: async () => {
              let json = {
                id: parseInt(value.id.split(",")[0]),
                status: 1
              }
              this.app.loading.show()
              let res = await this.api.startproject(json)
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
                Tool.errorshow(res.msg, this.app)
              }
            }
          })
        }
        break
      case "DOWNLOAD":
        // 下载
        const projectId = parseInt(value.id.split(",")[0])
        const url = `${window.location.origin}/aaa/v1/alg/preprocess/result/export?projectId=${projectId}`
        this.api.HttpRequest.downLoadFile(url, {
          key: 'accessToken',
          val: this.app.local.get('accessToken')
        })
        break
    }
  }
  toggletab(value) {
    this.app.changePage(
      this.projectType == 1 ? "projectmanage" : "backflowproject",
      { type: value.id }
    )
  }
  getapidata(value) {
    const tempModuleobj = this.chooseData.moduleobj
    if (value) {
      let keyword = value.data.data
      keyword = keyword ? keyword.trim() : ""
      switch (value.name) {
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
      tempModuleobj.projectIdList && tempModuleobj.projectIdList.loading(true)
      this.project_name_search("")
      tempModuleobj.groupId && tempModuleobj.groupId.loading(true)
      this.queryProjectGroupList("")
    }
  }
  async project_name_search(projectName) {
    let { data } = await this.api.project_name_search({
      projectName,
      type: this.projectType
    })
    this.chooseData.moduleobj.projectIdList.loading(false)
    let temparr = data.list.map(val => {
      return {
        idx: val.projectId,
        val: val.projectName
      }
    })
    this.chooseData.renderHtml(temparr, "projectIdList")
  }
  async queryProjectGroupList(groupName) {
    let { data } = await this.api.queryProjectGroupList({
      category: this.model.apiData.category,
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
}

module.exports = projectmanage
