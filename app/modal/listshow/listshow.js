require("./listshow.less");
class listshow extends Interstellar.modalBase {
  constructor(app, value, api, addMode) {
    super(app, value, api, addMode)
    this.html = require('./tpl.html')
    this.name = "listshow";
  }
  complete() {
    let that=this;
    console.log(this.api)
    this.apidata={}
    this.dom.find('.icon-guanbi').on('click',function () {
      that.close();
    })
    this.dom.find('.upload').on('click',function () {
      that.event._dispatch('listshow.sure')
    })
    this.dom.find('.cancel').on('click',function () {
      that.close()
      that.event._dispatch('listshow.cancel')
    })

    that.render()
  }
  render(){
    this.dom.find('.modal-title').html(this.api.title)
    let width = this.api.headerconfig.tablewidth+60
    this.dom.find('.listshow').css({'width':width,'margin-left':-(width/2)})
    require.ensure("../../moduleslibs/table/table", () => {
      let cont_table = require("../../moduleslibs/table/table")
      this.table = this.app.loadModule(cont_table, this.dom.find('.list'), {
        id: 'biaozhutable',
        header: this.api.headerconfig
      });
      this.table.event._addEvent('table.pagenumber', (value) =>{
        this.apidata.page = parseInt(value);
        this.apidata.refreshPage = false;
        this.table.changenum(this.apidata.page);
        this.event._dispatch('listshow.change', this.apidata)
      });
      this.table.event._addEvent('table.pagesize', (value) =>{
        this.apidata.pageSize = value.num;
        this.apidata.page = 1;
        this.apidata.refreshPage = true;
        this.event._dispatch('listshow.change', this.apidata)
      });
      this.table.event._addEvent('table.action',  (value) => {
        this.event._dispatch('listshow.action',value)
      });
    })
    this.initscroll()
  }
  setMain(value,bool){
    if (value.data.list.length > 0) {
      value.data.list.forEach((val, i) => {
        for (let i in val) {
          val[i] = val[i] == null ? '' : val[i]
        }
        if (val.importTime) val.importTime = Tool.time(val.importTime, 'yyyy-mm-dd')
        val.action = this.api.headerconfig.operation
      })
      this.table.setData(value.data.list)
    } else {
      this.table.noData();
    }
    if (bool) {
      this.table.getTotal(value.data.pages, 2, value.data.total)
    }
    this.initscroll()
  }
  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.modal-content').attr('id', rid)
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
module.exports = listshow;
