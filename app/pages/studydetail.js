//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class studydetail extends Interstellar.pagesBase {
  complete() {
    this.seriesId = this.app.parpam.seriesId
    this.studyId = this.app.parpam.studyId
    this.dom.find('.back').on('click', () => {
      this.app.changePage('seriesdetail', {seriesId: this.seriesId})
    })
    this.resize()
    this.styleModel(1)
    this.type = 'doctor';
    this.loadMoudel();
  }

  //加载列表组件
  loadMoudel() {
    let obj = {}
    obj['icon'] = {
      "seriesInstanceUID": {
        name: '<span data-i18n="date" data-name="检查时间">序列号</span>',
        type: 'text',
        code: 'date',
        w: '5%',
        ww: '5%',
        n: 40
      },
      "hospitalCode": {
        name: '<span data-i18n="action" data-name="操作">医院code</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "bodyPart": {
        name: '<span data-i18n="action" data-name="操作">检查部位</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "modality": {
        name: '<span data-i18n="action" data-name="操作">检查类型</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "studyDate": {
        name: '<span data-i18n="action" data-name="操作">检查日期</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "accessionNumber": {
        name: '<span data-i18n="action" data-name="操作">检查号</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "fileType": {
        name: '<span data-i18n="action" data-name="操作">文件类型</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "patientAge": {
        name: '<span data-i18n="action" data-name="操作">病人年龄</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "patientSex": {
        name: '<span data-i18n="action" data-name="操作">病人性别</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "finding": {
        name: '<span data-i18n="action" data-name="操作">检查信息</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "conclusion": {
        name: '<span data-i18n="action" data-name="操作">诊断信息</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "convolutionKernel": {
        name: '<span data-i18n="action" data-name="操作">重建核</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "convolutionKernelNum": {
        name: '<span data-i18n="action" data-name="操作">重建核数值</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "pixelSpacing": {
        name: '<span data-i18n="action" data-name="操作">像素间隔</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "keyword": {
        name: '<span data-i18n="action" data-name="操作">关键字</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "sliceThickness": {
        name: '<span data-i18n="action" data-name="操作">层厚</span>',
        type: 'text',
        code: 'action',
        w: '4%',
        ww: '4%'
      },
      "model": {
        name: '<span data-i18n="action" data-name="操作">机器型号</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "layerCount": {
        name: '<span data-i18n="action" data-name="操作">层数/序列里的影像文件总数</span>',
        type: 'text',
        code: 'action',
        w: '8%',
        ww: '8%'
      },
      "kvp": {
        name: '<span data-i18n="action" data-name="操作">电压</span>',
        type: 'text',
        code: 'action',
        w: '3%',
        ww: '3%'
      },
      "studyInstanceUID": {
        name: '<span data-i18n="action" data-name="操作">检查UID</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "importDate": {
        name: '<span data-i18n="action" data-name="操作">导入时间</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "createDate": {
        name: '<span data-i18n="action" data-name="操作">创建日期</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "valid": {
        name: '<span data-i18n="action" data-name="操作">是否有效</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      }
    };
    obj['tablewidth'] = ES.selctorDoc('.seriestable').box().clientWidth;
    obj['minwidth'] = 2500;
    obj['initPagina'] = false;
    obj['pagesizeSet'] = false;
    obj['type'] = 'center';
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table")
      this.table = this.app.loadModule(cont_table, this.dom.find('.seriestable'), {
        id: 'seriestable',
        header: obj
      });
      this.inittable()
      this.getalldata();
    })
  }

  //请求接口
  async getalldata() {
    let json = {
      studyInstanceUID: this.studyId
    }
    this.app.loading.show()
    let res = await this.api.study_detail(json)
    this.app.loading.hide()
      if (res.code == 0) {
        this.setData(res.data);
        this.listdata(res.data.seriesList);
        this.initscroll();
      }
  }

  setData(value) {
    let studyhtml = '';
    let serieshtml = '';
    for (let i in value.study) {
      studyhtml += '<p class="infoitem"><span class="smalltitle">' + i + ':</span>' + value.study[i] + '</p>'
    }
    this.dom.find('.studyinfo .infoarea').html(studyhtml)
    for (let i in value.series) {
      serieshtml += '<p class="infoitem"><span class="smalltitle">' + i + ':</span>' + value.series[i] + '</p>'
    }
    this.dom.find('.seriesinfo .infoarea').html(serieshtml)
  }

  listdata(value) {
    if (value.length > 0) {
      value.forEach(function (val, idx) {
        for (let i in val) {
          val[i] = val[i] == null ? '' : val[i]
        }
        // val.createDate = Tool.time(val.createDate, 'yyyy-mm-dd')
        // val.importDate = Tool.time(val.importDate, 'yyyy-mm-dd')
        // val.studyDate = Tool.time(val.studyDate, 'yyyy-mm-dd')
        val.valid = val.valid ? '是' : '否'
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

  inittable() {
    if (this.myScroll1) {
      this.myScroll1.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.maintable').attr('id', rid)
    this.myScroll1 = new IScroll('#' + rid, {
      scrollbars: true,
      mouseWheel: true,
      scrollX: true,
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

module.exports = studydetail;
