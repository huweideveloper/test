//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import commonApi from '@/api/common.api.js'

class projectmanage extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.categories = {
      fs: 1,
      bl: 2,
      qt: 0,
      cs: 3,
      sjk: 4
    }
    this.apiData = {
      page: 1,
      pageSize: 10,
      type: 1,
      category: this.categories[app.parpam['type']],
    }
    this.tablist = [
      { id: 'fs', name: '放射科' },
      { id: 'bl', name: '病理科' },
      { id: 'qt', name: '其它' },
      { id: 'cs', name: '测试' },
      { id: 'sjk', name: '数据库' },
    ]
    this.condition = [
      [
        {
          type: 'selectTablePage',
          name: 'projectIdList',
          showname: '项目名称',
          datatype: 'obj',
          data: [],
          key: 'projectIdList',
          searchApi: commonApi.projectNamePageSearch,
          keywordName: 'projectName',
          params: { projectType: window.location.hash.indexOf('projectmanage') !== -1 ? 1 : 3 }, // projectType: 1是标注 2是审核 3是算法
          keyName: 'projectId',
          valueName: 'projectName',
          multiple: true,
          out: true,
          input: true,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'sicknessType',
          showname: '项目标签',
          datatype: 'obj',
          data: Tool.configxlkformat(app.constmap['SICKNESS_TYPE']),
          key: 'sicknessType',
          out: true,
          input: false,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'projectFunction',
          showname: '项目目标',
          datatype: 'obj',
          data: Tool.configxlkformat(app.constmap['PROJECT_FUNCTION']),
          key: 'projectFunction',
          out: true,
          input: false,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'projectTarget',
          showname: '项目用途',
          datatype: 'obj',
          data: Tool.configxlkformat(app.constmap['ANNO_PROJECT_TARGET']),
          key: 'projectTarget',
          out: true,
          input: false,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'modality',
          showname: '样本类型',
          datatype: 'obj',
          data: Tool.configxlkformat(app.constmap['MODALITY']),
          key: 'modality',
          out: true,
          input: false,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'status',
          showname: '状态类型',
          datatype: 'obj',
          data: [
            { val: '未启用', idx: '1' },
            { val: '已启用', idx: '2' },
          ],
          key: 'status',
          out: true,
        },
      ],
      [
        {
          type: 'time',
          name: 'inspectTime',
          showname: '',
          datatype: 'obj',
          data: null,
          key: 'inspectTime',
          out: true,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'groupId',
          showname: '项目群组',
          datatype: 'obj',
          data: [],
          key: 'groupId',
          out: true,
          input: true,
        },
      ],
    ]
    this.tableconfig = {
      icon: {
        id: {
          name: '<span data-i18n="age" data-name="年龄">项目ID</span>',
          type: 'text',
          code: 'checkid',
          w: '6%',
          ww: '6%',
          n: '22',
        },
        name: {
          name: '<span data-i18n="age" data-name="年龄">项目名称</span>',
          type: 'text',
          code: 'pid',
          w: '34%',
          ww: '34%',
          n: '22',
        },
        groupName: {
          name: '<span data-i18n="age" data-name="年龄">项目群组</span>',
          type: 'text',
          code: 'gid',
          w: '8%',
          ww: '8%',
        },
        modality: {
          name: '<span data-i18n="age" data-name="年龄">样本类型</span>',
          type: 'text',
          code: 'pname',
          w: '7%',
          ww: '7%',
        },
        sicknessType: {
          name: '<span data-i18n="age" data-name="年龄">项目标签</span>',
          type: 'text',
          code: 'pname',
          w: '7%',
          ww: '7%',
        },
        projectFunction: {
          name: '<span data-i18n="age" data-name="年龄">项目目标</span>',
          type: 'text',
          code: 'pname',
          w: '7%',
          ww: '7%',
        },
        projectTarget: {
          name: '<span data-i18n="age" data-name="项目用途">项目用途</span>',
          type: 'text',
          code: 'pname',
          w: '8%',
          ww: '8%',
        },
        taskCount: {
          name: '<span data-i18n="age" data-name="年龄">引入任务数量</span>',
          type: 'text',
          code: 'psex',
          w: '7%',
          ww: '7%',
        },
        status: {
          name: '<span data-i18n="age" data-name="年龄">状态</span>',
          type: 'text',
          code: 'age',
          w: '6%',
          ww: '6%',
        },
        createUserName: {
          name: '<span data-i18n="aidiag" data-name="智能诊断">创建人</span>',
          type: 'text',
          code: 'positive',
          w: '6%',
          ww: '6%',
        },
        createTime: {
          name: '<span data-i18n="aidiag" data-name="智能诊断">创建日期</span>',
          type: 'text',
          code: 'positive',
          w: '8%',
          ww: '8%',
        },
      },
      type: 'center',
      actionicon: {
        operation: {
          name: '<span data-i18n="action" data-name="操作">操作</span>',
          type: 'action',
          code: 'action',
          w: '100%',
          ww: '100%',
        },
      },
    }
    this.listicon = {
      action: {
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action1: {
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action2: {
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
    }
  }
}

module.exports = projectmanage
