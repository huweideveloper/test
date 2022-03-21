//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class permission extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = {page: 1, pageSize: 10}
    this.condition =[]
    this.tableconfig = {
      icon: {
        "name": {name: '<span data-i18n="pname">权限名称</span>', type: 'text', w: '25%', ww: '25%', n: '40'},
        "mobilePhone": {name: '<span data-i18n="gh">权限内容</span>', type: 'text', w: '75%', ww: '75%'},
      },
      onofftype:{0: '关', 1: '开'},
      type: 'center'
    }
    this.listicon = {
      action: {//待发布
        config: { dis: 'inline', link: 'noLink', content: [{ text: '查看', key: 'view' }, { text: '修改', key: 'edit' }] }
      }
    }
  }
}

module.exports = permission;
