class TaskAdmin extends Interstellar.modelBase {
  constructor (app) {
    super(app)
    this.apiData = { page: 1, pageSize: 10 }
    this.condition = [
      [{ "type": "dobuledropdown", "name": "taskIdList", "showname": "任务名称", "datatype": "obj", "data": [], "key": "taskIdList", "out": true, "input": true }],
      [{ "type": "dropdown", "name": "method", "showname": "任务方式", "datatype": "obj", "data": [{ val: '承包式', idx: 1 }, { val: '开放式', idx: 2 }], "key": "method", "out": true, "input": false }],
      [{ "type": "dobuledropdown", "name": "vendorIdList", "showname": "所属公司", "datatype": "obj", "data": [], "key": "vendorIdList", "out": true, "input": true }],
      [{ "type": "dobuledropdown", "name": "projectIdList", "showname": "所属项目", "datatype": "obj", "data": [], "key": "projectIdList", "out": true, "input": true }],
      [{ "type": "dropdown", "name": "algPreAnnotation", "showname": "任务类型", "datatype": "obj", "data": [{ val: '人工标注', idx: 0 }, { val: '算法标注', idx: 1 }], "key": "algPreAnnotation", "out": true }],
      [{ "type": "dropdown", "name": "status", "showname": "任务状态", "datatype": "obj", "data": [{ val: '待发布', idx: '1' }, { val: '进行中', idx: '2' }, { val: '已完成', idx: '3' }, { val: '已终结', idx: '4' }], "key": "status", "out": true }],
      [{ "type": "time", "name": "inspectTime", "showname": "", "datatype": "obj", "data": null, "key": "inspectTime", "out": true }],
    ]
  }
}
module.exports = TaskAdmin;