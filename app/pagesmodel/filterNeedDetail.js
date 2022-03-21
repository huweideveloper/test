//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class filterNeedDetail extends Interstellar.modelBase {
  constructor(app) {
    super(app)
    this.tempquery={}
    this.apiData={}
    this.listheader={
      new:{
        icon:{
          "tagTransferId": { name: '<span>序名</span>', type: 'text',code:'checkid', w: '35%', ww: '35%',n:"40" },
          "id": { name: '<span>获取Id</span>', type: 'text',code:'pid', w: '35%', ww: '35%', },
          "operation": { name: '<span>操作</span>', type: 'action',code:'action', w: '30%', ww: '30%' }
        },
        initPagina : false,
        pagesizeSet : false,
        type:'center',
        chose:'all',
        chosew:'30px'
      },
      edit:{
        icon:{
          "id": { name: '<span>序名</span>', type: 'text',code:'checkid', w: '10%', ww: '10%',n:"40" },
          "gainId": { name: '<span>获取编号</span>', type: 'text',code:'pid', w: '25%', ww: '25%', },
          "status": { name: '<span>筛选状态</span>', type: 'text',code:'pname', w: '10%', ww: '10%' },
          // "successNum": { name: '<span>成功序列数</span>', type: 'text',code:'psex', w: '15%', ww: '15%' },
          // "failNum": { name: '<span>失败序列数</span>', type: 'text',code:'psex', w: '10%', ww: '10%' },
          "totalNum": { name: '<span>序列总数</span>', type: 'text',code:'psex', w: '10%', ww: '10%' },
          "subStatusDesList": { name: '<span>结果描述</span>', type: 'text',code:'psex', w: '35%', ww: '35%' },
          "operation": { name: '<span>操作</span>', type: 'action',code:'action', w: '10%', ww: '10%' }
        },
        type:'center',
        chose:'all',
        chosew:'30px'
      },
      view:{
        icon:{
          "id": { name: '<span>序名</span>', type: 'text',code:'checkid', w: '15%', ww: '15%',n:"40" },
          "gainId": { name: '<span>获取编号</span>', type: 'text',code:'pid', w: '25%', ww: '25%', },
          "status": { name: '<span>筛选状态</span>', type: 'text',code:'pname', w: '10%', ww: '10%' },
          // "successNum": { name: '<span>成功序列数</span>', type: 'text',code:'psex', w: '20%', ww: '20%' },
          // "failNum": { name: '<span>失败序列数</span>', type: 'text',code:'psex', w: '20%', ww: '20%' },
          "totalNum": { name: '<span>序列总数</span>', type: 'text',code:'psex', w: '10%', ww: '10%' },
          "subStatusDesList": { name: '<span>结果描述</span>', type: 'text',code:'psex', w: '40%', ww: '40%' },
        },
        initPagina : true,
        pagesizeSet : true,
        type:'center',
      }
    }
    this.listicon={
      new:{
        action:{
          delete: { dis: 'inline', link: 'noLink',content: '删除' }
        }
      },
      edit:{
        action:{
          start: { dis: 'inline', link: 'noLink',content: '执行' },
          delete: { dis: 'inline', link: 'noLink',content: '删除' }
        },
        action1:{
          export: { dis: 'inline', link: 'noLink',content: '导出' }
        },
        action2:{
          restart: { dis: 'inline', link: 'noLink',content: '重跑' },
          export: { dis: 'inline', link: 'noLink',content: '导出' }
        },
        // action1:{
        //   continue: { dis: 'inline', link: 'noLink',content: '继续执行' },
        //   export: { dis: 'inline', link: 'noLink',content: '导出' }
        // },
        // action2:{
        //   continue: { dis: 'inline', link: 'noLink',content: '继续执行' },
        // },
        // action3:{
        //   restart: { dis: 'inline', link: 'noLink',content: '重跑' },
        //   export: { dis: 'inline', link: 'noLink',content: '导出' }
        // },
        // action4:{
        //   export: { dis: 'inline', link: 'noLink',content: '导出' }
        // },
        // action5:{
        //   stop: { dis: 'inline', link: 'noLink',content: '暂停' }
        // },
        // action6:{
        //   restart: { dis: 'inline', link: 'noLink',content: '重跑' }
        // },
        // action7:{
        //   stop: { dis: 'inline', link: 'noLink',content: '暂停' },
        //   export: { dis: 'inline', link: 'noLink',content: '导出' }
        // },
        action8:{}
      },
      view:{
        action:{}
      }
    }
  }
}
module.exports = filterNeedDetail;
