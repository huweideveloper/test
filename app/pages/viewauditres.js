//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class viewauditres extends Interstellar.pagesBase {
  complete() {
    this.styleModel(1)
    this.id = this.app.parpam.id
    this.total = 0
    this.render();
    this.resize()

    this.auditproject_read()
    this.model._event._addEvent('querylist.change', async () => {
      let temp = this.model.getData('querylist').reset
      this.app.loading.show()
      let res = await this.api.series_result_search(this.model.getData('querylist'))
      this.app.loading.hide()
        if (res.code == 0) {
          this.dom.find('.series span').html(parseInt(res.data.auditResultSeriesCount))
          let html = ""
          res.data.importProjectNameList.forEach(function (val, idx) {
            html += val + '&nbsp;&nbsp;&nbsp;&nbsp;'
          })
          this.dom.find('.project span').html(html)
          this.setMain(res, temp);
        }else {
          Tool.errorshow(res.msg,this.app)
        }
      })

  }

  render() {
    let that = this;
    this.dom.find('.result').on('click', () => {
      let page = this.largeFigure ? 'drapCanvasPro':'markauditprojectview'
      window.location.href =  window.location.origin + '/#!/'+page+'/' + this.app.parpam['id'] + '/' + this.total + '_0_' + encodeURIComponent(JSON.stringify(this.model.querylist)) + '/check_viewer_all'
      window.location.reload()
    })
    this.dom.find('.export').on('click', () => {
      let json = {
        projectId: this.id
      }
      let url = this.app.domain1 + 'v1/audit/project/series/result/export?param=' + encodeURIComponent(JSON.stringify(json));
      Tool.downfile(url, this.app)
    })
    this.dom.find('.search').on('click', () => {
      if (this.model.querylist['compareSymbol'] && !(/^[0-9]\d*$/.test(this.model.querylist['imageTotalCount']))) {
        this.dom.find('.number').css({
          'border': '1px solid red'
        })
      } else if (!this.model.querylist['compareSymbol'] && this.model.querylist['imageTotalCount']) {
        this.model.querylist.imageTotalCount = null;
        this.dom.find('.number').val('')
      } else {
        this.dom.find('.number').css({
          'border': '1px solid #e8e8e8'
        })
        this.model.setData('querylist', this.model.querylist)
      }
    })
    this.dom.find('.number').on('change', function(){
      that.model.querylist['imageTotalCount'] = ES.selctorDoc(this).val() == '' ? null : ES.selctorDoc(this).val();
    })
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      this.symbol = this.app.loadModule(dropdown, this.dom.find('.symbol'), {
        className: 'xlk',
        firstSelect: {
          val: '',
          idx: ''
        },
        data: [{
          val: '大于',
          idx: '2'
        }, {
          val: '等于',
          idx: '1'
        }, {
          val: '小于',
          idx: '3'
        }]
      })
      this.symbol.event._addEvent('option.click', (value) => {
        this.model.querylist['compareSymbol'] = parseInt(value.idx);
      })
      this.symbol.event._addEvent('dropDown.clear', (value) => {
        delete this.model.querylist['compareSymbol'];
        this.dom.find('.number').val('')
        delete this.model.querylist['imageTotalCount'];
      })
    })
  }
  // /viewauditres/778
  setTitle() {
    let obj = {}
    this.model.listheader.tablewidth = ES.selctorDoc('.viewauditres').box().clientWidth - 40
    let page = this.largeFigure ? 'drapCanvasPro':'markauditprojectview'
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table")
      this.table = this.app.loadModule(cont_table, this.dom.find('.tablearea'), {
        id: 'tablearea',
        header: this.model.listheader
      });
      // taskId
      this.table.event._addEvent('table.action', (value) => {
        window.location.href =  window.location.origin + '/#!/'+page+'/' + this.app.parpam['id'] + '/' + value.id + '/check_viewer'
        window.location.reload()
      });
      this.table.event._addEvent('table.pagenumber', (value) => {
        let json = this.model.getData('querylist')
        json.reset = false
        json.page = parseInt(value);
        this.model.setData('querylist', json)
      });
      this.table.event._addEvent('table.pagesize', (value) => {
        let json = this.model.getData('querylist')
        json.page = 1;
        json.pageSize = value.num;
        json.reset = true;
        this.model.setData('querylist', json)
      });
      this.dom.find('.list-content').removeClass('hide');
      this.model.setData('querylist', {
        projectId: parseInt(this.id),
        page: 1,
        pageSize: 10,
        reset: true
      })
      this.resize()
    })
  }

  setMain(res, bool) {
    let data2 = []
    if (res.code == 0) {
      if (res.data.list) {
        this.total = res.data.total
        res.data.list.forEach((val, idx) => {
          for (let i in val) {
            val[i] = val[i] == null ? '' : val[i]
          }
          val.id = val.seriesInstanceUid + '_' + val.sarId;
          val.operation = this.model.listicon.action;
        })
        this.table.setData(res.data.list)
      } else {
        this.table.noData();
      }
    }else {
      Tool.errorshow(res.msg,this.app)
    }
    if (bool) {
      this.table.getTotal(res.data.pages, 2, res.data.total)
    }
    this.initscroll();
  }

  async auditproject_read(){
    let res = await this.api.auditproject_read({auditProjectId:this.id})
    this.largeFigure = res.data.largeFigure
    this.setTitle()
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.viewauditres .maintable').attr('id', rid)
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
    let ch = ES.selctorDoc(window).box().clientHeight
    let cw = ES.selctorDoc(window).box().clientWidth - 40
    ES.selctorDoc('.viewauditres').css({
      'height': ch - 100,
      'width': cw
    });
    this.dom.find('.viewauditres .maintable').css({'height': ch - 350, 'width': cw});
  }

}

module.exports = viewauditres;
