//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class audittask extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.condition = [
      [
        {
          type: "text",
          name: "taskId",
          showname: "任务ID",
          datatype: "obj",
          data: [],
          key: "taskId",
          input: true
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
      ]
    ]
    this.apiData = { page: 1, pageSize: 10, isReleased: true }
    this.tableconfig = {
      icon: {
        id: {
          name: "<span>审核任务ID</span>",
          type: "text",
          code: "checkid",
          w: "15%",
          ww: "15%",
          n: "40"
        },
        name: {
          name: "<span>审核任务名称</span>",
          type: "text",
          code: "pid",
          w: "25%",
          ww: "25%"
        },
        projectName: {
          name: "<span>所属审核项目名称</span>",
          type: "text",
          code: "pname",
          w: "20%",
          ww: "20%"
        },
        status: {
          name: "<span>状态</span>",
          type: "text",
          code: "psex",
          w: "10%",
          ww: "10%"
        },
        seriesTotalNum: {
          name: "<span>序列总数</span>",
          type: "text",
          code: "age",
          w: "10%",
          ww: "10%"
        },
        seriesAuditNum: {
          name: "<span>已审核数量</span>",
          type: "text",
          code: "age",
          w: "10%",
          ww: "10%"
        },
        createUserName: {
          name: "<span>创建人</span>",
          type: "text",
          code: "age",
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
        //待发布
        config: { dis: "inline", link: "noLink", content: [] }
      },
      action1: {
        //进行中但没有已提交
        config: { dis: "inline", link: "noLink", content: [] }
      },
      action2: {
        //进行中有人已提交
        config: { dis: "inline", link: "noLink", content: [] }
      },
      action3: {
        //已完成、已终结
        config: { dis: "inline", link: "noLink", content: [] }
      }
    }
  }
}

module.exports = audittask
