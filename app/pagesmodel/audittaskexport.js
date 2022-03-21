//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class audittaskexport extends Interstellar.modelBase {
  constructor(app) {
    super(app)
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
          name: "taskIdList",
          showname: "选择审核任务名称",
          datatype: "obj",
          data: [],
          key: "taskIdList",
          out: true,
          input: true
        }
      ],
      [
        {
          type: "dobuledropdown",
          name: "projectIdList",
          showname: "选择审核项目名称",
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
    this.apiData = { page: 1, pageSize: 10, isReleased: false }
    this.tableconfig = {
      icon: {
        id: {
          name: "<span>审核任务ID</span>",
          type: "text",
          code: "checkid",
          w: "10%",
          ww: "10%"
        },
        name: {
          name: "<span>审核任务名称</span>",
          type: "text",
          code: "pid",
          w: "20%",
          ww: "20%"
        },
        groupName: {
          name: "<span>项目群组</span>",
          type: "text",
          code: "gid",
          w: "15%",
          ww: "15%"
        },
        auditChoose: {
          name: "<span>审核集</span>",
          type: "text",
          code: "pid",
          w: "12%",
          ww: "12%"
        },
        projectName: {
          name: "<span>所属审核项目名称</span>",
          type: "text",
          code: "pname",
          w: "25%",
          ww: "25%"
        },
        status: {
          name: "<span>状态</span>",
          type: "text",
          code: "psex",
          w: "7%",
          ww: "7%"
        },
        seriesTotalNum: {
          name: "<span>序列总数</span>",
          type: "text",
          code: "age",
          w: "7%",
          ww: "7%"
        },
        seriesAuditNum: {
          name: "<span>已审核数量</span>",
          type: "text",
          code: "age",
          w: "8%",
          ww: "8%"
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
        //待发布
        config: { dis: "inline", link: "noLink", content: [] }
      }
    }
  }
}

module.exports = audittaskexport
