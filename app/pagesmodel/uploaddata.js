//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class uploaddata extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.categories = {
      fs: "RADIOLOGY",
      bl: 'PATHOLOGY',
      qt: "OTHER"
    }
    this.apiData={page:1,pageSize:10,category:this.categories[app.parpam['type']]}
    this.tablist = [{ 'id': 'fs', 'name': '放射科' }, { 'id': 'bl', 'name': '病理科' }, { 'id': 'qt', 'name': '其它' }]
    this.condition = {
      fs:[
        [{ "type": "dropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "data": [], "key": "hospitalCode", "out": true, "input": true }],
        [{ "type": "dropdown", "name": "bodyPart", "showname": "部位名称", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['BODY_PART']), "key": "bodyPart", "out": true, "input": false }],
        [{ "type": "dropdown", "name": "type", "showname": "上传类型", "datatype": "obj", "data": [{val: '影像文件', idx: 'IMPORT_IMAGE'}, {val: '报告数据', idx: 'IMPORT_REPORT'}], "key": "type", "out": true, "input": false}],
        [{ "type": "time", "name": "inspectTime", "showname": "", "datatype": "obj", "data": null, "key": "inspectTime", "out": true }],
      ],
      qt:[
        [{ "type": "dropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "data": [], "key": "hospitalCode", "out": true, "input": true }],
        [{ "type": "dropdown", "name": "bodyPart", "showname": "部位名称", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['BODY_PART']), "key": "bodyPart", "out": true, "input": false }],
        [{ "type": "dropdown", "name": "modality", "showname": "检查设备", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['MODALITY']), "key": "modality", "out": true, "input": false }],
        [{ "type": "time", "name": "inspectTime", "showname": "", "datatype": "obj", "data": null, "key": "inspectTime", "out": true }],
      ],
      bl:[
        [{ "type": "dropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "data": [], "key": "hospitalCode", "out": true, "input": true }],
        [{ "type": "dropdown", "name": "bodyPart", "showname": "部位名称", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['BODY_PART']), "key": "bodyPart", "out": true, "input": false }],
        [{ "type": "dropdown", "name": "modality", "showname": "检查设备", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['MODALITY']), "key": "modality", "out": true, "input": false }],
        [{ "type": "time", "name": "inspectTime", "showname": "", "datatype": "obj", "data": null, "key": "inspectTime", "out": true }],
      ]
    }
    this.tableconfig = {
      fs:{
        icon: {
          "taskId": {
            name: '<span data-i18n="age" data-name="年龄">任务ID</span>',
            type: 'text',
            code: 'checkid',
            w: '10%',
            ww: '10%',
            n: "40"
          },
          "hospitalCode": {
            name: '<span data-i18n="age" data-name="年龄">医院名称</span>',
            type: 'text',
            code: 'checkid',
            w: '13%',
            ww: '13%'
          },
          "bodyPart": {
            name: '<span data-i18n="age" data-name="年龄">部位</span>',
            type: 'text',
            code: 'pid',
            w: '10%',
            ww: '10%',
          },
          "localPath": {
            name: '<span data-i18n="age" data-name="年龄">指定影像目录</span>',
            type: 'text',
            code: 'pname',
            w: '14%',
            ww: '14%'
          },
          "keyword": {
            name: '<span data-i18n="age" data-name="年龄">关键字</span>',
            type: 'text',
            code: 'pname',
            w: '15%',
            ww: '15%'
          },
          "type": {
            name: '<span data-i18n="age" data-name="年龄">上传类型</span>',
            type: 'text',
            code: 'psex',
            w: '13%',
            ww: '13%'
          },
          "createTime": {
            name: '<span data-i18n="age" data-name="年龄">上传时间</span>',
            type: 'text',
            code: 'age',
            w: '13%',
            ww: '13%'
          },
          "status": {
            name: '<span data-i18n="aidiag" data-name="智能诊断">处理状态</span>',
            type: 'text',
            code: 'positive',
            w: '12%',
            ww: '12%'
          },
        },
        actionicon: {
          "operation": {
            name: '<span data-i18n="action" data-name="操作">操作</span>',
            type: 'action',
            code: 'action',
            w: '100%',
            ww: '100%'
          }
        },
        tablewidth: ES.selctorDoc('.uploaddata').box().clientWidth - 240,
        actionulwidth:200,
        type: 'center'
      },
      qt: {
        icon:{
          "taskId": {
            name: '<span data-i18n="age" data-name="年龄">任务ID</span>',
            type: 'text',
            code: 'checkid',
            w: '10%',
            ww: '10%',
            n: "40"
          },
          "hospitalCode": {
            name: '<span data-i18n="age" data-name="年龄">医院名称</span>',
            type: 'text',
            code: 'checkid',
            w: '13%',
            ww: '13%',
            n: "40"
          },
          "modality": {
            name: '<span data-i18n="age" data-name="年龄">检查设备</span>',
            type: 'text',
            code: 'pid',
            w: '10%',
            ww: '10%',
          },
          "bodyPart": {
            name: '<span data-i18n="age" data-name="年龄">一级部位</span>',
            type: 'text',
            code: 'pid',
            w: '12%',
            ww: '12%',
          },
          "localPath": {
            name: '<span data-i18n="age" data-name="年龄">指定影像目录</span>',
            type: 'text',
            code: 'pname',
            w: '14%',
            ww: '14%'
          },
          "keyword": {
            name: '<span data-i18n="age" data-name="年龄">关键字</span>',
            type: 'text',
            code: 'pname',
            w: '15%',
            ww: '15%'
          },
          "createTime": {
            name: '<span data-i18n="age" data-name="年龄">上传时间</span>',
            type: 'text',
            code: 'age',
            w: '13%',
            ww: '13%'
          },
          "status": {
            name: '<span data-i18n="aidiag" data-name="智能诊断">处理状态</span>',
            type: 'text',
            code: 'positive',
            w: '13%',
            ww: '13%'
          },
        },
        actionicon: {
          "operation": {
            name: '<span data-i18n="action" data-name="操作">操作</span>',
            type: 'action',
            code: 'action',
            w: '100%',
            ww: '100%'
          }
        },
        tablewidth: ES.selctorDoc('.uploaddata').box().clientWidth - 240,
        actionulwidth:200,
        type: 'center'
      },
      bl: {
        icon:{
          "taskId": {
            name: '<span data-i18n="age" data-name="年龄">任务ID</span>',
            type: 'text',
            code: 'checkid',
            w: '10%',
            ww: '10%',
            n: "40"
          },
          "hospitalCode": {
            name: '<span data-i18n="age" data-name="年龄">医院名称</span>',
            type: 'text',
            code: 'checkid',
            w: '13%',
            ww: '13%',
            n: "40"
          },
          "modality": {
            name: '<span data-i18n="age" data-name="年龄">检查设备</span>',
            type: 'text',
            code: 'pid',
            w: '10%',
            ww: '10%',
          },
          "bodyPart": {
            name: '<span data-i18n="age" data-name="年龄">一级部位</span>',
            type: 'text',
            code: 'pid',
            w: '12%',
            ww: '12%',
          },
          "localPath": {
            name: '<span data-i18n="age" data-name="年龄">指定影像目录</span>',
            type: 'text',
            code: 'pname',
            w: '14%',
            ww: '14%'
          },
          "keyword": {
            name: '<span data-i18n="age" data-name="年龄">关键字</span>',
            type: 'text',
            code: 'pname',
            w: '15%',
            ww: '15%'
          },
          "createTime": {
            name: '<span data-i18n="age" data-name="年龄">上传时间</span>',
            type: 'text',
            code: 'age',
            w: '13%',
            ww: '13%'
          },
          "status": {
            name: '<span data-i18n="aidiag" data-name="智能诊断">处理状态</span>',
            type: 'text',
            code: 'positive',
            w: '13%',
            ww: '13%'
          },
        },
        actionicon: {
          "operation": {
            name: '<span data-i18n="action" data-name="操作">操作</span>',
            type: 'action',
            code: 'action',
            w: '100%',
            ww: '100%'
          }
        },
        tablewidth: ES.selctorDoc('.uploaddata').box().clientWidth - 240,
        actionulwidth:200,
        type: 'center'
      }
    }
    this.listicon = {
      action: {
        radio: {
          config: {
            dis: 'inline',
            link: 'noLink',
            content: [{text: '查看详情', key: 'view'}, {text: '查看JPG化进度', key: 'jpg'}, {
              text: '导出csv',
              key: 'export'
            }, {text: '导入序列信息', key: 'seriesinfo'}, {text: '导入检查信息', key: 'studyinfo'}, {text: '查看入库详情', key: 'detail'}]
          }
        },
        other: {
          config: {
            dis: 'inline',
            link: 'noLink',
            content: [{text: '查看详情', key: 'view'}, {text: '导出csv', key: 'export'}, {
              text: '导入序列信息',
              key: 'seriesinfo'
            }, {text: '导入检查信息', key: 'studyinfo'}, {text: '查看入库详情', key: 'detail'}]
          }
        }
      },
      action1:{
        radio: {
          config: {
            dis: 'inline',
            link: 'noLink',
            content: [{text: '查看当前进度', key: 'view'}, {text: '查看JPG化进度', key: 'jpg'}, {
              text: '导入序列信息',
              key: 'seriesinfo'
            }, {text: '导入检查信息', key: 'studyinfo'}, {text: '查看入库详情', key: 'detail'}]
          },
        },
        other: {
          config: {
            dis: 'inline',
            link: 'noLink',
            content: [{text: '查看当前进度', key: 'view'}, {text: '导入序列信息', key: 'seriesinfo'}, {
              text: '导入检查信息',
              key: 'studyinfo'
            }, {text: '查看入库详情', key: 'detail'}]
          }
        }
      },
      action2:{
        radio: {
          config: {
            dis: 'inline',
            link: 'noLink',
            content: [{text: '查看详情', key: 'view'}, {text: '查看JPG化进度', key: 'jpg'}, {
              text: '导入序列信息',
              key: 'seriesinfo'
            }, {text: '导入检查信息', key: 'studyinfo'}, {text: '查看入库详情', key: 'detail'}]
          }
        },
        other: {
          config: {
            dis: 'inline',
            link: 'noLink',
            content: [{text: '查看详情', key: 'view'}, {text: '导入序列信息', key: 'seriesinfo'}, {
              text: '导入检查信息',
              key: 'studyinfo'
            }, {text: '查看入库详情', key: 'detail'}]
          }
        }
      }
    }
  }
}

module.exports = uploaddata;
