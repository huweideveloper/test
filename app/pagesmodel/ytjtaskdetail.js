//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class ytjtaskdetail extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.taskid = {}
    this.userlist = {}
    this.querylist = {
      page: 1,
      pageSize: 10,
      taskId: parseInt(this.app.parpam["taskid"]),
      reset: true
    }
  }
}
module.exports = ytjtaskdetail
