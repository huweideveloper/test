//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

require("../less/personalaccount.less")

class personalaccount extends Interstellar.pagesBase {
  complete() {
    // this.app.header.showcrube();
    this.styleModel(1)
    // this.type = 'doctor';
    this.useinfo = JSON.parse(this.app.local.get("all"))
    this.dom.find(".username").html(this.useinfo.name)
    this.dom.find(".usertime").html(this.useinfo.usedTime)
    this.model.data.userId = this.useinfo.userId
    this.app.loading.show()
    this.loadData()
  }

  async loadData() {
    let value = await this.api.task_current({
      userId: this.useinfo.userId
    })
    this.app.loading.hide()
    if (value.data.id) {
      if (
        value.data.seriesAnnotationResultId ||
        value.data.seriesAvailableNum * 1 != 0
      ) {
        this.dom.find(".jxztask").removeClass("hide")
        this.dom.find(".jxztask .taskname").html(value.data.name)
        let subName = value.data.seriesAnnotationResultId
          ? "<span style='color:#999;'> (名下存在未提交序列)</span>"
          : ""
        this.dom
          .find(".jxztask .starttime")
          .html("剩余可分配数量：" + value.data.seriesAvailableNum + subName)
        this.dom
          .find(".jxztask .endtime")
          .html("到期：" + Tool.time(value.data.endTime, "yyyy-mm-dd"))
        this.dom.find(".jxztask").on("click", () => {
          this.app.changePage("taskdetail", {
            taskId: value.data.id,
            type: "editor"
          })
        })
      } else {
        this.dom.find(".getnewtask").removeClass("hide")
        this.dom.find(".getnewtask").on("click", () => {
          this.app.changePage("alltasklist")
        })
      }
    } else {
      this.dom.find(".getnewtask").removeClass("hide")
      this.dom.find(".getnewtask").on("click", () => {
        this.app.changePage("alltasklist")
      })
    }
    let completedTasks = await this.api.task_completed(
      this.model.getData("data")
    )
    this.setData(completedTasks.data)
  }

  setData(value) {
    let donetask = require("../modules/donetask/donetask.js")
    let donetasklist = this.app.loadModule(
      donetask,
      this.dom.find(".donetasklist"),
      {
        selected: "account"
      }
    )
    donetasklist.setData(value)
    donetasklist.event._addEvent("donetask.click", res => {
      this.app.changePage("taskdetail", {
        taskId: res.taskId,
        type: "view"
      })
      //window.location.href='http://'+window.location.host+'/#!/mark/'+res.taskId+'/'+res.projectId+'/viewer'
    })
  }
}

module.exports = personalaccount
