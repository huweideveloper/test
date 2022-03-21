//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import commonApi from '@/api/common.api.js'

class taskmanage extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.categories = {
      fs: 1,
      bl: 2,
      qt: 0,
      cs: 3,
      sjk: 4,
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
          type: 'text',
          name: 'taskId',
          showname: '任务ID',
          datatype: 'obj',
          data: [],
          key: 'taskId',
          input: true,
        },
      ],
      // [
      //   {
      //     type: "dobuledropdown",
      //     name: "taskIdList",
      //     showname: "任务名称",
      //     datatype: "obj",
      //     data: [],
      //     key: "taskIdList",
      //     out: true,
      //     input: true
      //   }
      // ],
      [
        {
          type: 'selectTablePage',
          name: 'taskIdList',
          showname: '任务名称',
          datatype: 'obj',
          data: [],
          key: 'taskIdList',
          searchApi: commonApi.taskNamePageSearch,
          keywordName: 'taskName',
          params: { projectType: window.location.hash.indexOf('taskmanage') !== -1 ? 1 : 3 }, // projectType: 1是标注 2是审核 3是算法
          keyName: 'taskId',
          valueName: 'taskName',
          multiple: true,
          out: true,
          input: true,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'algPreAnnotation',
          showname: '任务类型',
          datatype: 'obj',
          data: [
            { val: '人工标注', idx: 0 },
            { val: '算法标注', idx: 1 },
          ],
          key: 'algPreAnnotation',
          out: true,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'method',
          showname: '任务方式',
          datatype: 'obj',
          data: [
            { val: '承包式', idx: 1 },
            { val: '开放式', idx: 2 },
          ],
          key: 'method',
          out: true,
          input: false,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'status',
          showname: '任务状态',
          datatype: 'obj',
          data: [
            { val: '待发布', idx: '1' },
            { val: '进行中', idx: '2' },
            { val: '已完成', idx: '3' },
            { val: '已终结', idx: '4' },
          ],
          key: 'status',
          out: true,
        },
      ],
      [
        {
          type: 'dobuledropdown',
          name: 'vendorIdList',
          showname: '所属公司',
          datatype: 'obj',
          data: [],
          key: 'vendorIdList',
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
          key: 'status',
          out: true,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'projectFunction',
          showname: '项目目标',
          datatype: 'obj',
          data: Tool.configxlkformat(app.constmap['PROJECT_FUNCTION']),
          key: 'status',
          out: true,
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
          type: 'dobuledropdown',
          name: 'projectIdList',
          showname: '所属项目',
          datatype: 'obj',
          data: [],
          key: 'projectIdList',
          out: true,
          input: true,
        },
      ],
      [
        {
          type: 'dropdown',
          name: 'userId',
          showname: '医生姓名',
          datatype: 'obj',
          data: [],
          key: 'userId',
          out: true,
          input: true,
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
    ]
    this.tableconfig = {
      icon: {
        id: {
          name: '<span>任务ID</span>',
          type: 'text',
          code: 'checkid',
          w: '2%',
          ww: '2%',
          n: '22',
        },
        name: {
          name: '<span>任务名称</span>',
          type: 'text',
          code: 'pid',
          w: '10%',
          ww: '10%',
          n: '22',
        },
        assignVendors: {
          name: '<span>所属公司</span>',
          type: 'text',
          code: 'age',
          w: '5%',
          ww: '5%',
        },
        sicknessType: {
          name: '<span>项目标签</span>',
          type: 'text',
          code: 'age',
          w: '3%',
          ww: '3%',
        },
        seriesTotalNum: {
          name: '<span style="line-height: 20px;">序列总量<br>(*交叉次数)</span>',
          type: 'text',
          code: 'date',
          w: '3%',
          ww: '3%',
        },
        imageAnnoNum: {
          name: '<span>病灶数量</span>',
          type: 'text',
          code: 'nidusCount',
          w: '2%',
          ww: '2%',
        },
        seriesAvailableNum: {
          name: '<span style="line-height: 20px;">未标注序列数量<br>(包含交叉次数)</span>',
          type: 'text',
          code: 'date',
          w: '4%',
          ww: '4%',
        },
        seriesSubmittedNum: {
          name: '<span style="line-height: 20px;">已提交序列数量<br>(包含交叉次数)</span>',
          type: 'text',
          code: 'date',
          w: '4%',
          ww: '4%',
        },
        method: {
          name: '<span>任务方式</span>',
          type: 'text',
          code: 'pname',
          w: '4%',
          ww: '4%',
        },
        algPreAnnotation: {
          name: '<span>任务类型</span>',
          type: 'text',
          code: 'psex',
          w: '6%',
          ww: '6%',
        },
        projectName: {
          name: '<span>所属项目</span>',
          type: 'text',
          code: 'age',
          w: '6%',
          ww: '6%',
        },
        projectFunction: {
          name: '<span>项目目标</span>',
          type: 'text',
          code: 'age',
          w: '4%',
          ww: '4%',
        },
        projectTarget: {
          name: '<span>项目用途</span>',
          type: 'text',
          code: 'age',
          w: '6%',
          ww: '6%',
        },
        projectStatus: {
          name: '<span>项目状态</span>',
          type: 'text',
          code: 'age',
          w: '4%',
          ww: '4%',
        },
        status: {
          name: '<span>任务状态</span>',
          type: 'text',
          code: 'age',
          w: '4%',
          ww: '4%',
        },
        remark: {
          name: '<span>任务备注</span>',
          type: 'text',
          code: 'age',
          w: '5%',
          ww: '5%',
        },
        startTime: {
          name: '<span>开始日期</span>',
          type: 'text',
          code: 'positive',
          w: '5%',
          ww: '5%',
        },
        endTime: {
          name: '<span>结束日期</span>',
          type: 'text',
          code: 'shebei',
          w: '5%',
          ww: '5%',
        },
        createUserName: {
          name: '<span>创建人</span>',
          type: 'text',
          code: 'action',
          w: '5%',
          ww: '5%',
        },
        createTime: {
          name: '<span>创建日期</span>',
          type: 'text',
          code: 'action',
          w: '5%',
          ww: '5%',
        },
      },
      actionulwidth: 200,
      minwidth: 2800,
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
        //待发布
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action1: {
        //进行中且有人已标注但未提交
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action2: {
        //进行中但未被标注
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action3: {
        //进行中有人已提交
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action4: {
        //已完成、已终结
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
      action5: {
        //已完成、已终结未提交
        config: { dis: 'inline', link: 'noLink', content: [] },
      },
    }
  }
}

module.exports = taskmanage
