//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class backflowproject extends Interstellar.modelBase {
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
          name: "sicknessType",
          showname: "项目标签",
          datatype: "obj",
          data: Tool.configxlkformat(app.constmap["SICKNESS_TYPE"]),
          key: "sicknessType",
          out: true,
          input: false
        }
      ],
      [
        {
          type: "dropdown",
          name: "projectFunction",
          showname: "项目目标",
          datatype: "obj",
          data: Tool.configxlkformat(app.constmap["PROJECT_FUNCTION"]),
          key: "projectFunction",
          out: true,
          input: false
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
      ]
    ]
    this.tableconfig = {
      icon: {
        id: {
          name: '<span data-i18n="age" data-name="年龄">项目ID</span>',
          type: "text",
          code: "checkid",
          w: "15%",
          ww: "15%",
          n: "40"
        },
        name: {
          name: '<span data-i18n="age" data-name="年龄">项目名称</span>',
          type: "text",
          code: "pid",
          w: "15%",
          ww: "15%"
        },
        modality: {
          name: '<span data-i18n="age" data-name="年龄">样本类型</span>',
          type: "text",
          code: "pname",
          w: "10%",
          ww: "10%"
        },
        sicknessType: {
          name: '<span data-i18n="age" data-name="年龄">项目标签</span>',
          type: "text",
          code: "pname",
          w: "15%",
          ww: "15%"
        },
        projectFunction: {
          name: '<span data-i18n="age" data-name="年龄">项目目标</span>',
          type: "text",
          code: "pname",
          w: "15%",
          ww: "15%"
        },
        taskCount: {
          name: '<span data-i18n="age" data-name="年龄">引入任务数量</span>',
          type: "text",
          code: "psex",
          w: "15%",
          ww: "15%"
        },
        createTime: {
          name: '<span data-i18n="aidiag" data-name="智能诊断">创建日期</span>',
          type: "text",
          code: "positive",
          w: "15%",
          ww: "15%"
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
      action: {
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
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            ,
            { text: "编辑", key: "edit" },
            { text: "复制", key: "copy" }
          ]
        }
      },
      action2: {
        config: {
          dis: "inline",
          link: "noLink",
          content: [
            { text: "查看详情", key: "view" },
            { text: "编辑", key: "edit" },
            { text: "复制", key: "copy" }
          ]
        }
      }
    }
  }
}

module.exports = backflowproject
