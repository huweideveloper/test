//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class viewauditres extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.tempquery = {}
    this.apidata = { page: 1, pageSize: 10 }
    this.listheader = {
      icon: {
        seriesInstanceUid: {
          name: "<span>序列名称</span>",
          type: "text",
          code: "checkid",
          w: "25%",
          ww: "25%",
          n: "40"
        },
        imageTotalCount: {
          name: "<span>病灶数量</span>",
          type: "text",
          code: "pid",
          w: "15%",
          ww: "15%"
        },
        isTrueImageTotalCount: {
          name: "<span>正确病灶数</span>",
          type: "text",
          code: "pname",
          w: "20%",
          ww: "20%"
        },
        isFalseImageTotalCount: {
          name: "<span>错误病灶数</span>",
          type: "text",
          code: "psex",
          w: "20%",
          ww: "20%"
        },
        operation: {
          name: "<span>操作</span>",
          type: "action",
          code: "action",
          w: "20%",
          ww: "20%"
        }
      },
      type: "center"
    }
    this.listicon = {
      action: {
        view: { dis: "inline", link: "noLink", content: "查看" }
      }
    }
  }
}

module.exports = viewauditres
