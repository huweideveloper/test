//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class seriesdetail extends Interstellar.pagesBase {
  complete() {
    this.seriesId = this.app.parpam.seriesId
    this.dom.find('.back').on('click', () => {
      this.app.changePage('imagedatagl')
    })
    this.dom.find('.studydetail').on('click', () => {
      console.log(this.studyId, 'this.studyId')
      this.app.changePage('studydetail', {seriesId: this.seriesId, studyId: this.studyId})
    })
    this.dom.find('.origindetail').on('click', async () => {
      this.app.loading.show()
      let res = await this.api.series_origin_detail({seriesInstanceUID: this.seriesId})
        this.app.loading.hide()
        if (res.code == 0) {
          let seriesorigin = require("../modal/seriesorigin/seriesorigin")
          this.app.loadModal(seriesorigin, {adv: true}, {data: res})
        }
      })
    this.action = {
      copylan: {dis: 'inline', link: 'noLink', titleText: '编辑', content: '复制内网链接'}
    }
    this.resize()
    this.styleModel(1)
    this.type = 'doctor';
    this.loadMoudel();
  }

  //加载列表组件
  loadMoudel() {
    let obj = {}
    obj['icon'] = {
      "group": {
        name: '<span data-i18n="date" data-name="检查时间">影像UID</span>',
        type: 'text',
        code: 'date',
        w: '25%',
        ww: '25%',
        n: 40
      },
      "path": {
        name: '<span data-i18n="action" data-name="操作">文件路径</span>',
        type: 'text',
        code: 'action',
        w: '25%',
        ww: '25%'
      },
      "urlLAN": {
        name: '<span data-i18n="action" data-name="操作">ucloud的内网下载链接</span>',
        type: 'text',
        code: 'action',
        w: '25%',
        ww: '25%'
      },
      "operation": {
        name: '<span data-i18n="action" data-name="操作">操作</span>',
        type: 'action',
        code: 'action',
        w: '25%',
        ww: '25%'
      }
    };
    obj['tablewidth'] = ES.selctorDoc('.imagetable').box().clientWidth;
    obj['initPagina'] = false;
    obj['pagesizeSet'] = false;
    obj['type'] = 'center';
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table")
      this.table = this.app.loadModule(cont_table, this.dom.find('.imagetable'), {
        id: 'seriestable',
        header: obj
      });
      this.table.event._addEvent('table.action', (value) => {
        if (value.classname == 'copylan') {
          this.copyurl(this.listdata1[value.position].urlLAN)
        } else if (value.classname == 'copywan') {
          this.copyurl(this.listdata1[value.position].urlWAN)
        }
      });
      this.getalldata();
    })
  }

  copyurl(value) {
    let oInput = document.createElement('input');
    oInput.value = value;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    document.body.removeChild(oInput)
    alert('复制成功！')
  }

  //请求接口
  async getalldata() {
    let json = {
      seriesInstanceUID: this.seriesId
    }
    this.app.loading.show()
    let res = await this.api.series_detail(json)
    this.app.loading.hide()
      if (res.code == 0) {
        this.setData(res.data);
        this.listdata1 = res.data.imagelist
        this.listdata(res.data.imagelist);
        this.initscroll();
      }
  }

  setData(value) {
    let studyhtml = '';
    let serieshtml = '';
    for (let i in value.study) {
      if (i == 'attribute' || i == 'attachment') {
        if (value.study[i] !== null) {
          Object.keys(value.study[i]).forEach(function (key) {
            studyhtml += '<p class="infoitem"><span class="smalltitle">' + key + ':</span>' + value.study[i][key] + '</p>'
          })
        } else {
          studyhtml += '<p class="infoitem"><span class="smalltitle">' + i + ':</span>' + value.study[i] + '</p>'
        }
      } else if (i !== 'customInfo') {
        studyhtml += '<p class="infoitem"><span class="smalltitle">' + i + ':</span>' + value.study[i] + '</p>'
      }
    }
    this.studyId = value.study.studyInstanceUID
    this.dom.find('.studydetail').removeClass('hide')
    this.dom.find('.studyinfo .infoarea').html(studyhtml)
    for (let i in value.series) {
      if (i == 'attribute' || i == 'attachment') {
        if (value.series[i] !== null) {
          Object.keys(value.series[i]).forEach(function (key) {
            serieshtml += '<p class="infoitem"><span class="smalltitle">' + key + ':</span>' + value.series[i][key] + '</p>'
          })
        } else {
          serieshtml += '<p class="infoitem"><span class="smalltitle">' + i + ':</span>' + value.series[i] + '</p>'
        }
      } else if (i !== 'customInfo') {
        serieshtml += '<p class="infoitem"><span class="smalltitle">' + i + ':</span>' + value.series[i] + '</p>'
      }

    }
    this.dom.find('.seriesinfo .infoarea').html(serieshtml)
  }

  listdata(value) {
    if (value.length > 0) {
      value.forEach((val,idx) => {
        for (let i in val) {
          val[i] = val[i] == null ? '' : val[i]
        }
        val.id = idx
        val.operation = this.action
      })
      this.table.setData(value)
    } else {
      this.table.noData();
    }
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.infoscorll').attr('id', rid)
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
    ES.selctorDoc('.infoscorll').css({'height': ch - 100});
  }

}

module.exports = seriesdetail;
