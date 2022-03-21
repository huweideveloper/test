//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markdataexport extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = {
      page: 1,
      pageSize: 10,
      type: window.location.hash.indexOf("markdataexport") !== -1 ? 1 : 3
    }
    this.condition = [
      [
        {
          type: 'text',
          name: 'taskId',
          showname: '任务ID',
          datatype: 'obj',
          data: [],
          key: 'taskId',
          input: true,
        }
      ],
      [
        {
          type: "dobuledropdown",
          name: "projectIdList",
          showname: "项目名称",
          datatype: "obj",
          data: [],
          key: "projectIdList",
          out: true,
          input: true
        }
      ],
      [
        {
          type: "dobuledropdown",
          name: "taskIdList",
          showname: "任务名称",
          datatype: "obj",
          data: [],
          key: "taskIdList",
          out: true,
          input: true
        }
      ],
      [
        {
          type: "dropdown",
          name: "algPreAnnotation",
          showname: "任务类型",
          datatype: "obj",
          data: [
            { val: "人工标注", idx: 0 },
            { val: "算法标注", idx: 1 }
          ],
          key: "algPreAnnotation",
          out: true
        }
      ],
      [
        {
          type: "time",
          name: "inspectTime",
          showname: "",
          datatype: "obj",
          data: null,
          key: "inspectTime",
          out: true
        }
      ],
      [
        {
          type: "dropdown",
          name: "groupId",
          showname: "项目群组",
          datatype: "obj",
          data: [],
          key: "groupId",
          out: true,
          input: true
        }
      ]
    ]
    this.tableconfig = {
      icon: {
        newTaskId: {
          name: "<span>任务ID</span>",
          type: "text",
          code: "checkid",
          w: "5%",
          ww: "5%",
          n: "10"
        },
        projectName: {
          name: '<span data-i18n="age" data-name="年龄">项目名称</span>',
          type: "link",
          code: "checkname",
          w: "15%",
          ww: "15%"
        },
        groupName: {
          name: "<span>项目群组</span>",
          type: "text",
          code: "checkid",
          w: "8%",
          ww: "8%",
        },
        name: {
          name: '<span data-i18n="age" data-name="年龄">任务名称</span>',
          type: "text",
          code: "pid",
          w: "15%",
          ww: "15%"
        },
        algPreAnnotation: {
          name: '<span data-i18n="age" data-name="年龄">任务类型</span>',
          type: "text",
          code: "pname",
          w: "8%",
          ww: "8%"
        },
        remark: {
          name: '<span data-i18n="age" data-name="年龄">任务备注</span>',
          type: "text",
          code: "psex",
          w: "8%",
          ww: "8%"
        },
        startTime: {
          name: '<span data-i18n="age" data-name="年龄">任务发布时间</span>',
          type: "text",
          code: "age",
          w: "10%",
          ww: "10%"
        },
        endTime: {
          name: '<span data-i18n="age" data-name="年龄">任务到期时间</span>',
          type: "text",
          code: "age",
          w: "10%",
          ww: "10%"
        },
        projectModality: {
          name: '<span data-i18n="aidiag" data-name="智能诊断">样本类型</span>',
          type: "text",
          code: "positive",
          w: "7%",
          ww: "7%"
        },
        seriesTotalNum: {
          name:
            '<span data-i18n="aidiag" data-name="智能诊断">任务样本数量</span>',
          type: "text",
          code: "positive",
          w: "9%",
          ww: "9%"
        },
        seriesSubmittedNum: {
          name:
            '<span data-i18n="aidiag" data-name="智能诊断">已提交序列数</span>',
          type: "text",
          code: "positive",
          w: "9%",
          ww: "9%"
        }
      },
      type: "center",
      actionicon: {
        operation: {
          name: '<span data-i18n="action" data-name="操作">操作</span>',
          type: "action",
          code: "action",
          w: "100%",
          ww: "100%"
        }
      }
    }
    this.listicon = {
      action: {}
    }
  }
}

module.exports = markdataexport
