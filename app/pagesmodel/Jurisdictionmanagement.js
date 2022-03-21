//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class Jurisdictionmanagement extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.apiData = {name:null}
    this.tableconfig = {
      icon: {
        "name": {name: '<span data-i18n="pname">页面权限</span>', type: 'text', w: '25%', ww: '25%', n: '40'},
        "content": {name: '<span data-i18n="gh">权限内容</span>', type: 'text', w: '75%', ww: '75%'},
        // "role": {name: '<span data-i18n="gh">账号身份</span>', type: 'text', w: '25%', ww: '25%'},
        // "status": {name: '<span data-i18n="gh">账号状态</span>', type: 'onoff', w: '25%', ww: '25%', onofftype: 'enable'}
      },
      // onofftype:{0: '无效', 1: '有效'},
      type: 'center',
      // actionicon: {
      //   "operation": { name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%' }
      // }
    }
    this.listicon = {
      action: {//待发布
          bianji: {dis: 'inline', link: 'noLink', titleText: '编辑'}
      }
    }
  }
}

module.exports = Jurisdictionmanagement;
