class imagedataglmodel extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.categories = {
      fs: "RADIOLOGY",
      bl: 'PATHOLOGY',
      qt: "OTHER"
    }
    this.apiData = {
      page: 1,
      pageSize: 10,
      category: this.categories[app.parpam['type']],
      valid: app.parpam['type'] == 'fs' ? true : null
    }
    this.tablist = [{'id': 'fs', 'name': '放射科'}, {'id': 'bl', 'name': '病理科'}, {'id': 'qt', 'name': '其它'}]
    let config_fun = require("../../config/config_data.js")
    this.condition = new config_fun(app.constmap)
    this.tableconfig = {
      fs: {
        icon: {
          "seriesInstanceUID": {name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '11%', ww: '11%', n: "40"},
          "hospitalCode": {name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '7%', ww: '7%'},
          "bodyPart": {name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '4%', ww: '4%',},
          "modality": {name: '<span data-i18n="age" data-name="年龄">检查机型</span>', type: 'text', code: 'pname', w: '5%', ww: '5%'},
          "studyDate": {name: '<span data-i18n="age" data-name="年龄">检查时间</span>', type: 'text', code: 'psex', w: '7%', ww: '7%'},
          "studyInstanceUID": {name: '<span data-i18n="age" data-name="年龄">检查号</span>', type: 'text', code: 'age', w: '9%', ww: '9%'},
          "fileType": {name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '6%', ww: '6%'},
          "patientAge": {name: '<span data-i18n="handler" data-name="状态">年龄</span>', type: 'text', code: 'handler', w: '6%', ww: '6%',},
          "patientSex": {name: '<span data-i18n="action" data-name="操作">性别</span>', type: 'text', code: 'action', w: '5%', ww: '5%'},
          "importDate": {name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '6%', ww: '6%'},
          "valid": {name: '<span data-i18n="action" data-name="操作">序列是否有效</span>', type: 'text', code: 'action', w: '6%', ww: '6%'},
          "keyword": {name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '8%', ww: '8%'},
          "finding": {name: '<span data-i18n="action" data-name="操作">检查所见</span>', type: 'text', code: 'action', w: '10%', ww: '10%'},
          "conclusion": {name: '<span data-i18n="action" data-name="操作">诊断</span>', type: 'text', code: 'action', w: '10%', ww: '10%'}
        },
        actionicon: {
          "operation": {name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%'}
        },
        tablewidth: ES.selctorDoc('.imagedatagl').box().clientWidth - 140,
        type: 'center',
        minwidth: 2500
      },
      qt: {
        icon: {
          "seriesInstanceUID": {name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '20%', ww: '20%', n: "40"},
          "hospitalCode": {name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '10%', ww: '10%'},
          "bodyPart": {name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '10%', ww: '10%',},
          "modality": {name: '<span data-i18n="age" data-name="年龄">检查设备</span>', type: 'text', code: 'pname', w: '15%', ww: '15%'},
          "fileType": {name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '15%', ww: '15%'},
          "importDate": {name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '15%', ww: '15%'},
          "keyword": {name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '15%', ww: '15%'},
        },
        actionicon: {
          "operation": {name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%'}
        },
        tablewidth: ES.selctorDoc('.imagedatagl').box().clientWidth - 140,
        type: 'center'
      },
      bl: {
        icon: {
          "seriesInstanceUID": {name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '12%', ww: '12%', n: "40"},
          "hospitalCode": {name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '12%', ww: '12%'},
          "bodyPart": {name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '8%', ww: '8%',},
          "modality": {name: '<span data-i18n="age" data-name="年龄">检查设备</span>', type: 'text', code: 'pname', w: '8%', ww: '8%'},
          "fileType": {name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "stainingMethod": {name: '<span data-i18n="shebei" data-name="设备">染色方法</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "sampleClassification": {name: '<span data-i18n="shebei" data-name="设备">样本分类</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "sampleLocation": {name: '<span data-i18n="shebei" data-name="设备">采样位置</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "sampleMethod": {name: '<span data-i18n="shebei" data-name="设备">取样方法</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "importDate": {name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '10%', ww: '10%'},
          "keyword": {name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '10%', ww: '10%'},
        },
        actionicon: {
          "operation": {name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%'}
        },
        tablewidth: ES.selctorDoc('.imagedatagl').box().clientWidth - 140,
        type: 'center'
      }
    }
    this.listicon = {
      action: {
        view: {dis: 'inline', link: 'noLink', content: '查看详情'}
      }
    }
  }
}

module.exports = imagedataglmodel;
