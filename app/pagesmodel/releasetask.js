//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class releasetask extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = { page: 1, pageSize: 10, releaseOfTask: true, type: 1 }
    this.condition = [
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
          name: "method",
          showname: "任务方式",
          datatype: "obj",
          data: [
            { val: "承包式", idx: 1 },
            { val: "开放式", idx: 2 }
          ],
          key: "method",
          out: true,
          input: false
        }
      ],
      [
        {
          type: "dobuledropdown",
          name: "vendorIdList",
          showname: "所属公司",
          datatype: "obj",
          data: [],
          key: "vendorIdList",
          out: true,
          input: true
        }
      ],
      [
        {
          type: "dobuledropdown",
          name: "projectIdList",
          showname: "所属项目",
          datatype: "obj",
          data: [],
          key: "projectIdList",
          out: true,
          input: true
        }
      ],
      [
        {
          type: "dropdown",
          name: "taskType",
          showname: "任务类型",
          datatype: "obj",
          data: [
            { val: "人工标注", idx: 1 },
            { val: "算法标注", idx: 2 },
            { val: "审核任务", idx: 3 }
          ],
          key: "taskType",
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
      ]
    ]
    this.tableconfig = {
      icon: {
        id: {
          name: "<span>任务ID</span>",
          type: "text",
          code: "checkid",
          w: "5%",
          ww: "5%"
        },
        name: {
          name: "<span>任务名称</span>",
          type: "text",
          code: "pid",
          w: "9%",
          ww: "9%"
        },
        assignMethod: {
          name: "<span>任务方式</span>",
          type: "text",
          code: "pname",
          w: "4%",
          ww: "4%"
        },
        algPreAnnotation: {
          name: "<span>任务类型</span>",
          type: "text",
          code: "psex",
          w: "6%",
          ww: "6%"
        },
        vendors: {
          name: "<span>所属公司</span>",
          type: "text",
          code: "age",
          w: "9%",
          ww: "9%"
        },
        projectName: {
          name: "<span>所属项目</span>",
          type: "text",
          code: "age",
          w: "9%",
          ww: "9%"
        },
        projectStatus: {
          name: "<span>项目状态</span>",
          type: "text",
          code: "age",
          w: "5%",
          ww: "5%"
        },
        status: {
          name: "<span>任务状态</span>",
          type: "text",
          code: "age",
          w: "5%",
          ww: "5%"
        },
        remark: {
          name: "<span>任务备注</span>",
          type: "text",
          code: "age",
          w: "8%",
          ww: "8%"
        },
        startTime: {
          name: "<span>开始日期</span>",
          type: "text",
          code: "positive",
          w: "5%",
          ww: "5%"
        },
        endTime: {
          name: "<span>结束日期</span>",
          type: "text",
          code: "shebei",
          w: "5%",
          ww: "5%"
        },
        seriesTotalNum: {
          name: "<span>序列总量</span>",
          type: "text",
          code: "date",
          w: "4%",
          ww: "4%"
        },
        seriesAvailableNum: {
          name: "<span>未标注序列数量</span>",
          type: "text",
          code: "date",
          w: "5%",
          ww: "5%"
        },
        seriesSubmittedNum: {
          name: "<span>已提交序列数量</span>",
          type: "text",
          code: "date",
          w: "5%",
          ww: "5%"
        },
        createTime: {
          name: "<span>创建日期</span>",
          type: "text",
          code: "action",
          w: "5%",
          ww: "5%"
        }
      },
      actionulwidth: 200,
      minwidth: 2500,
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
module.exports = releasetask
