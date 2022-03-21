//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class auditproject extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = { page: 1, pageSize: 10 }
    this.condition = [
      [
        {
          type: "dropdown",
          name: "auditProjecId",
          showname: "审核项目名称",
          datatype: "obj",
          data: [],
          key: "auditProjecId",
          out: true,
          input: true
        }
      ],
      [
        {
          type: "dropdown",
          name: "importProjectId",
          showname: "所属项目名称",
          datatype: "obj",
          data: [],
          key: "importProjectId",
          out: true,
          input: true
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
          name: "<span>项目ID</span>",
          type: "text",
          code: "checkid",
          w: "10%",
          ww: "10%"
        },
        auditProjectName: {
          name: "<span>审核项目名称</span>",
          type: "text",
          code: "pid",
          w: "25%",
          ww: "25%"
        },
        groupName: {
          name: "<span>项目群组</span>",
          type: "text",
          code: "gid",
          w: "10%",
          ww: "10%"
        },
        importProjectList: {
          name: "<span>包含标注项目名称</span>",
          type: "text",
          code: "pname",
          w: "20%",
          ww: "20%"
        },
        taskCount: {
          name: "<span>审核源任务数量</span>",
          type: "text",
          code: "psex",
          w: "15%",
          ww: "15%"
        },
        status: {
          name: "<span>状态</span>",
          type: "text",
          code: "age",
          w: "5%",
          ww: "5%"
        },
        createUserName: {
          name: "<span>创建人</span>",
          type: "text",
          code: "action",
          w: "5%",
          ww: "5%"
        },
        createTime: {
          name: "<span>创建日期</span>",
          type: "text",
          code: "action",
          w: "15%",
          ww: "15%"
        }
      },
      actionulwidth: 200,
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
        //未启用
        config: { dis: "inline", link: "noLink", content: [] }
      },
      action1: {
        //已启用
        config: { dis: "inline", link: "noLink", content: [] }
      },
      action2: {
        //已启用没有结果
        config: { dis: "inline", link: "noLink", content: [] }
      }
    }

    this.searchconfig = [
      {
        type: "single",
        name: "name",
        showname: "审核项目名称",
        datatype: "obj",
        data: []
      },
      {
        type: "single",
        name: "method",

        showname: "所属项目名称",
        datatype: "obj",
        data: []
      },
      {
        type: "single",
        name: "status",
        showname: "状态类型",
        datatype: "obj",
        data: [
          {
            val: "未启用",
            idx: "M"
          },
          {
            val: "已启用",
            idx: "F"
          }
        ]
      }
    ]
  }
}

module.exports = auditproject
