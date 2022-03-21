//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class filterNeed extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = { page: 1, pageSize: 10 }
    this.condition = [
      [
        {
          type: "texts",
          name: "name",
          showname: "需求名称",
          datatype: "obj",
          key: "name",
          out: true
        }
      ],
      [
        {
          type: "dropdown",
          name: "sicknessType",
          showname: "项目标签",
          datatype: "obj",
          data: Tool.configxlkformat(this.app.constmap["SICKNESS_TYPE"])
        }
      ]
    ]
    this.tableconfig = {
      icon: {
        id: {
          name: '<span data-i18n="pname">序号</span>',
          type: "text",
          w: "20%",
          ww: "20%"
        },
        name: {
          name: '<span data-i18n="zj">需求名称</span>',
          type: "text",
          w: "20%",
          ww: "20%"
        },
        sicknessType: {
          name: '<span data-i18n="zj">项目标签</span>',
          type: "text",
          w: "20%",
          ww: "20%"
        },
        mode: {
          name: '<span data-i18n="gh">数据筛选类型</span>',
          type: "text",
          w: "20%",
          ww: "20%"
        },
        createUserName: {
          name: '<span data-i18n="yymc">创建人</span>',
          type: "text",
          w: "10%",
          ww: "10%"
        },
        createTime: {
          name: '<span data-i18n="yymc">创建时间</span>',
          type: "text",
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
        //待发布
        config: { dis: "inline", link: "noLink", content: [] }
      }
    }
  }
}

module.exports = filterNeed
