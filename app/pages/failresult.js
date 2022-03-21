class failresult extends Interstellar.pagesBase {
  complete() {
    this.setTitle();
    this.resize();
    this.apidata = {page: 1, pageSize: 10}
  }

  setTitle() {
    let obj = {}
    obj['icon'] = {
      "seriesInstanceUID": {
        name: '<span data-i18n="age" data-name="年龄">序列号</span>',
        type: 'text',
        code: 'checkid',
        w: '20%',
        ww: '20%',
        n: "40"
      },
      "algType": {
        name: '<span data-i18n="age" data-name="年龄">算法类型</span>',
        type: 'text',
        code: 'pid',
        w: '10%',
        ww: '10%',
      },
      "code": {
        name: '<span data-i18n="age" data-name="年龄">返回码</span>',
        type: 'text',
        code: 'pname',
        w: '10%',
        ww: '10%'
      },
      "info": {
        name: '<span data-i18n="age" data-name="年龄">信息</span>',
        type: 'text',
        code: 'pname',
        w: '25%',
        ww: '25%'
      },
      "detail": {
        name: '<span data-i18n="age" data-name="年龄">详情</span>',
        type: 'text',
        code: 'pname',
        w: '20%',
        ww: '20%'
      },
      "errorTime": {
        name: '<span data-i18n="age" data-name="年龄">错误生成时间</span>',
        type: 'text',
        code: 'psex',
        w: '15%',
        ww: '15%'
      },
    };
    obj['tablewidth'] = ES.selctorDoc('.datatable').box().clientWidth - 40;
    obj['type'] = 'center';
    this.tableevent(obj)
  }

  tableevent(obj) {
    require.ensure("../moduleslibs/table/table", () => {
      this.myScroll = null;
      let cont_table = require("../moduleslibs/table/table")
      this.table = this.app.loadModule(cont_table, this.dom.find('.datatable'), {
        id: 'datatable',
        header: obj
      });
      this.table.event._addEvent('table.pagenumber', (value) => {
        this.apidata.page = parseInt(value);
        this.table.changenum(this.apidata.page);
        this.setMain();
      });
      this.table.event._addEvent('table.pagesize', (value) => {
        this.apidata.pageSize = value.num;
        this.apidata.page = 1;
        this.setMain(true);
      });
      this.resize()
      this.setMain(true);
    })
  }

  async setMain(bool) {
    this.table.showloading()
    let res = await this.api.error_search(this.apidata)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val) => {
          for (let i in val) {
            val[i] = val[i] == null ? '' : val[i]
          }
        })
        this.table.setData(res.data.list)
      } else {
        this.table.noData();
      }
      this.initscroll();
    }
    if (bool) {
      this.table.getTotal(res.data.pages, 2, res.data.total)
    }
  }

  initscroll() {
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

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc('.failresult').css({'height': ch});
    ES.selctorDoc('.failresult').css({'width': cw});
    ES.selctorDoc('.maintable').css({'height': ch - 150});
  }
}

module.exports = failresult;
