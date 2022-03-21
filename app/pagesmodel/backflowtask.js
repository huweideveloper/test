//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class backflowtask extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.categories = {
      fs: 1,
      bl: 2,
      qt: 0,
      cs: 3
    }
    this.apiData = {
      page: 1,
      pageSize: 10,
      type: 3,
      category: this.categories[app.parpam["type"]]
    }
    this.tablist = [
      { id: "fs", name: "放射科" },
      { id: "bl", name: "病理科" },
      { id: "qt", name: "其它" },
      { id: "cs", name: "测试" }
    ]
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
          type: "dropdown",
          name: "status",
          showname: "任务状态",
          datatype: "obj",
          data: [
            { val: "待发布", idx: "1" },
            { val: "进行中", idx: "2" },
            { val: "已完成", idx: "3" },
            { val: "已终结", idx: "4" }
          ],
          key: "status",
          out: true
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
          type: "dropdown",
          name: "sicknessType",
          showname: "项目标签",
          datatype: "obj",
          data: Tool.configxlkformat(app.constmap["SICKNESS_TYPE"]),
          key: "status",
          out: true
        }
      ],
      [
        {
          type: "dropdown",
          name: "projectFunction",
          showname: "项目目标",
          datatype: "obj",
          data: Tool.configxlkformat(app.constmap["PROJECT_FUNCTION"]),
          key: "status",
          out: true
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
          ww: "5%",
          n: "40"
        },
        name: {
          name: "<span>任务名称</span>",
          type: "text",
          code: "pid",
          w: "6%",
          ww: "6%"
        },
        method: {
          name: "<span>任务方式</span>",
          type: "text",
          code: "pname",
          w: "6%",
          ww: "6%"
        },
        algPreAnnotation: {
          name: "<span>任务类型</span>",
          type: "text",
          code: "psex",
          w: "6%",
          ww: "6%"
        },
        assignVendors: {
          name: "<span>所属公司</span>",
          type: "text",
          code: "age",
          w: "6%",
          ww: "6%"
        },
        projectName: {
          name: "<span>所属项目</span>",
          type: "text",
          code: "age",
          w: "6%",
          ww: "6%"
        },
        sicknessType: {
          name: "<span>项目标签</span>",
          type: "text",
          code: "age",
          w: "6%",
          ww: "6%"
        },
        projectFunction: {
          name: "<span>项目目标</span>",
          type: "text",
          code: "age",
          w: "7%",
          ww: "7%"
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
          w: "5%",
          ww: "5%"
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
          name: "<span>序列总量（*交叉次数）</span>",
          type: "text",
          code: "date",
          w: "6%",
          ww: "6%"
        },
        seriesAvailableNum: {
          name:
            '<span style="line-height: 20px;">&nbsp;未标注序列数量<br>（包含交叉次数）</span>',
          type: "text",
          code: "date",
          w: "5%",
          ww: "5%"
        },
        seriesSubmittedNum: {
          name:
            '<span style="line-height: 20px;">&nbsp;已提交序列数量<br>（包含交叉次数）</span>',
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
      minwidth: 2800,
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
      action: {
        //待发布
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "编辑", key: "edit" },
            { text: "复制", key: "copy" }
          ]
        }
      },
      action1: {
        //进行中且有人已标注但未提交
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "复制", key: "copy" }
          ]
        }
      },
      action2: {
        //进行中但未被标注
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "复制", key: "copy" }
          ]
        }
      },
      action3: {
        //进行中有人已提交
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "查阅已提交序列", key: "viewxl" },
            { text: "复制", key: "copy" }
          ]
        }
      },
      action4: {
        //已完成、已终结
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "查阅已提交序列", key: "viewxl" },
            { text: "复制", key: "copy" }
          ]
        }
      },
      action5: {
        //已完成、已终结
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "复制", key: "copy" }
          ]
        }
      }
    }
  }
}
module.exports = backflowtask
