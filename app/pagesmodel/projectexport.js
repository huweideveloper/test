//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class projectexport extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = { page: 1, pageSize: 10, type: 1 }
    this.condition = [
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
          type: "dropdown",
          name: "modality",
          showname: "样本类型",
          datatype: "obj",
          data: Tool.configxlkformat(app.constmap["MODALITY"]),
          key: "modality",
          out: true,
          input: false
        }
      ],
      [
        {
          type: "dropdown",
          name: "status",
          showname: "状态类型",
          datatype: "obj",
          data: [
            { val: "未启用", idx: "1" },
            { val: "已启用", idx: "2" }
          ],
          key: "status",
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
        id: {
          name: '<span data-i18n="age" data-name="年龄">项目ID</span>',
          type: "text",
          code: "checkid",
          w: "8%",
          ww: "8%"
        },
        name: {
          name: '<span data-i18n="age" data-name="年龄">项目名称</span>',
          type: "text",
          code: "pid",
          w: "22%",
          ww: "22%"
        },
        groupName: {
          name: '<span data-i18n="age" data-name="年龄">项目群组</span>',
          type: "text",
          code: "pname",
          w: "17%",
          ww: "17%"
        },
        modality: {
          name: '<span data-i18n="age" data-name="年龄">样本类型</span>',
          type: "text",
          code: "pname",
          w: "17%",
          ww: "17%"
        },
        taskCount: {
          name: '<span data-i18n="age" data-name="年龄">引入任务数量</span>',
          type: "text",
          code: "psex",
          w: "10%",
          ww: "10%"
        },
        status: {
          name: '<span data-i18n="age" data-name="年龄">状态</span>',
          type: "text",
          code: "age",
          w: "15%",
          ww: "15%"
        },
        createTime: {
          name: '<span data-i18n="aidiag" data-name="智能诊断">创建日期</span>',
          type: "text",
          code: "positive",
          w: "18%",
          ww: "18%"
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
module.exports = projectexport
