require('./alglist.less')
// var html = require('./tpl.html')

class alglist extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = 'alglist'
  }
  complete() {
    let that = this
    this.action = {
      // view: {dis: 'inline', link: 'noLink', content: '删除'},
      viewfail: {dis: 'inline', link: 'noLink', content: '查看失败'}
    }
    this.action1 = {
      // view: {dis: 'inline', link: 'noLink', content: '删除'}
    }
    this.dom.find('.icon-guanbi').on('click',function () {
      that.close();
    })
    this.render()
    that.dom.find('.close').on('click',function () {
      that.close()
    })
  }
  render(){
    if(this.api.data){
      this.showlist(this.api.data,true)
    }
  }
  showlist(value,bool){
    let that=this;
      let obj={}
      obj['icon'] = {
        "resultType": { name: '<span>结果类型</span>', type: 'text',code:'checkid', w: '12%', ww: '12%',n:"40" },
        "toolType": { name: '<span>工具类型</span>', type: 'text',code:'pid', w: '13%', ww: '13%', },
        "transferNii": { name: '<span>是否转换成mask</span>', type: 'text',code:'pid', w: '12%', ww: '12%', },
        "totalSeriesNum": { name: '<span>总序列数</span>', type: 'text',code:'pid', w: '9%', ww: '9%', },
        "totalResultNum": { name: '<span>总结果数</span>', type: 'text',code:'pid', w: '9%', ww: '9%', },
        "successResultNum": { name: '<span>成功结果数</span>', type: 'text',code:'pid', w: '10%', ww: '10%', },
        "importTime": { name: '<span>导入时间</span>', type: 'text',code:'pid', w: '13%', ww: '13%', },
        "importUserId": { name: '<span>导入人ID</span>', type: 'text',code:'pid', w: '10%', ww: '10%', },
        "operation": { name: '<span>操作</span>', type: 'action',code:'pid', w: '12%', ww: '12%', },
      };
      obj['tablewidth']=ES.selctorDoc('.alglist').box().clientWidth-40;
      obj['type'] = 'center';
      obj['pagesizeSet']=false;
      require.ensure("../../moduleslibs/table/table", function() {
        that.myScroll = null;
        let cont_table = require("../../moduleslibs/table/table")
        that.table = that.app.loadModule(cont_table, that.dom.find('.tablearea'), {
          id: 'alglist',
          header: obj
        });
        that.table.event._addEvent('table.pagenumber', function(value) {
          let page = parseInt(value);
          that.event._dispatch('alglist.pagenumber',page)
        });
        that.table.event._addEvent('table.action', function (value) {
          that.event._dispatch('alglist.listaction',value)
        });
        that.setList(value,bool)
        that.initscrollmenu()
      })
  }
  setList(value,bool){
    if(value.list.length>0){
      value.list.forEach((val) => {
        val.id = val.id + ',' + val.fileResourceId
        if(val.successResultNum === val.totalResultNum){
          val.operation = this.action1
        }else{
          val.operation = this.action
        }
        this.app.toolList.forEach((item,idx) =>{
          if(val.toolType == item.idx){
            val.toolType = item.val
          }
        })
        val.resultType = val.resultType === 1 ? '序列标注' : '影像标注'
        val.transferNii = val.transferNii ? '是' : '否'
        if (val.importTime) val.importTime = Tool.time(val.importTime, 'yyyy-mm-dd')
      })
      this.table.setData(value.list)
    }else{
      this.table.noData('当前无已导入的结果!');
    }
    if(bool){
      this.table.getTotal(value.pages,2,value.total)
    }
  }
  initscrollmenu() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }

    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.maintable').attr('id', rid)
    this.myScroll = new IScroll('#' + rid, {
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    });
  }

}

//原型链一定要有的
module.exports = alglist;
