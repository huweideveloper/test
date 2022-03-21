//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class accountmanage extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = { page: 1, pageSize: 10 }
    this.condition = [
      [
        {
          type: "texts",
          name: "name",
          showname: "用户姓名",
          datatype: "obj",
          key: "name",
          out: true
        }
      ],
      [
        {
          type: "texts",
          name: "mobile",
          showname: "手机账号",
          datatype: "obj",
          key: "mobile",
          out: true
        }
      ]
    ]
    this.tableconfig = {
      icon: {
        name: {
          name: '<span data-i18n="pname">用户姓名</span>',
          type: "text",
          w: "25%",
          ww: "25%"
        },
        mobile: {
          name: '<span data-i18n="gh">手机账号</span>',
          type: "text",
          w: "20%",
          ww: "20%"
        },
        roleNameList: {
          name: '<span data-i18n="yymc">角色配置</span>',
          type: "text",
          w: "40%",
          ww: "40%"
        },
        annoStatus: {
          name: '<span data-i18n="gh">用户状态</span>',
          type: "onoff",
          w: "20%",
          ww: "20%",
          onofftype: "enable"
        }
      },
      onofftype: { 0: "关", 1: "开" },
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

module.exports = accountmanage
