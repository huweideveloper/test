class TaskAdmin extends DataBase {
  complete() {
    this.changeAll(this.model.condition)
    this.loadlist("group")
  }

  // 头部筛选框渲染完调用
  getapidata() {
    this.task_name_search()
  }

  async task_name_search() {
    let { data } = await this.api.task_name_search({ projectName: "" })
    // this.chooseData.moduleobj[projectName].loading(false)
    this.chooseData.renderHtml(
      data.list.map(item => {
        return { idx: item.projectId, val: item.projectName }
      }),
      "taskIdList"
    )
  }
}

module.exports = TaskAdmin
