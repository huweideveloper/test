require("./addimage.less");

class addimage extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = 'addimage';
  }

  complete() {
    let that = this;
    this.apidata = {page: 1, pageSize: 10, valid: true, category: 'RADIOLOGY'};
    this.finaldata = this.apidata
    this.refreshPage = true;
    this.yymcdata = [{
      val: '',
      idx: ''
    }]
    this.bodypart = Tool.configxlkformat(this.app.constmap['BODY_PART'])
    this.hospital = [];
    this.duoxuanobj = {};
    if (this.api.type == 'view') {
      this.dom.find('.filterarea').addClass('hide');
      this.dom.find('.sjandjl').addClass('hide');
      this.dom.find('.timefilter').addClass('hide');
      this.dom.find('.topchoose').addClass('hide');
      this.dom.find('.viewbtn').removeClass('hide');
    } else {
      this.render();
    }
    this.setTitle_radio();
    this.dom.find('.topchoose a').on('click', function () {
      if (!ES.selctorDoc(this).hasClass('choosed')) {
        that.dom.find('.topchoose a').removeClass('choosed');
        ES.selctorDoc(this).addClass('choosed')
        if (ES.selctorDoc(this).hasClass('fsk')) {
          that.imagetype = 'radio'
        } else {
          that.imagetype = 'other'
        }
        that.toggleimagetype()
      }
    })
    this.dom.find('.filterarea input').on('change', function () {
      if (ES.selctorDoc(this).attr('check') == 'num') {
        that.apidata[ES.selctorDoc(this).attr('class')] = parseInt(ES.selctorDoc(this).val());
      } else {
        that.apidata[ES.selctorDoc(this).attr('class')] = ES.selctorDoc(this).val();
      }
    })
    this.dom.find('.icon-guanbi').on('click', function () {
      that.close();
      that.duoxuanobj = {}
    })
    this.dom.find('.downloadall').on('click', function () {
      that.event._dispatch('addimage.download', 1);
    })
    this.dom.find('.downloadpart').on('click', function () {
      that.event._dispatch('addimage.download', 2);
    })
    this.dom.find('.sjandjl .liinput').on('change', function () {
      that.resetjctj();
    })
    this.dom.find('.addnew').on('click', function () {
      if (that.listdata.list.length == 0) {
        that.app.alert.show({
          title: ' ',
          msg: '????????????????????????<br>????????????????????????????????????????????????',
          close: true,
          sure: function () {
            that.event._dispatch('addimage.new', {data: that.finaldata})
          }
        })
      } else {
        that.event._dispatch('addimage.new', {data: that.finaldata})
      }
    })
    this.dom.find('.addall').on('click', function () {
      that.event._dispatch('addimage.all', {data: that.finaldata})
    })
    this.dom.find('.searchbtn').on('click', function () {
      that.refreshPage = true;
      that.apidata.page = 1;
      that.apidata.createDate = Tool.GetDateStr(0) + " 23:59:59"
      that.finaldata = that.apidata
      that.event._dispatch('addimage.search', {data: that.apidata})
    })
  }

  toggleimagetype() {
    let that = this;
    for (let i in that.duoxuanobj) {
      that.duoxuanobj[i].reset()
    }
    for (let i in that.singleobj) {
      that.singleobj[i].reset()
    }
    that.apidata = {page: 1, pageSize: 10, valid: true}
    that.dom.find('.showData .Timers').html('???????????????')
    that.dom.find('input').val('')
    if (that.imagetype == 'radio') {
      that.apidata.category = 'RADIOLOGY'
      that.dom.find('.radioonly').removeClass('hide')
      this.setTitle_radio();
    } else {
      delete that.apidata.valid
      that.apidata.category = 'OTHER'
      that.dom.find('.radioonly').addClass('hide')
      this.setTitle_other();
    }
    that.finaldata = that.apidata
    that.event._dispatch('addimage.search', {data: that.apidata})
  }

  getxlvalue(type) {
    let that = this;
    let json1 = {};
    json1['name'] = that.apidata[type] == undefined ? '' : that.apidata[type]
    // let json={
    //     hospitalName:that.apidata.hospitalName==undefined?'':that.apidata.hospitalName
    //     eval(val):that.apidata.val==undefined?'':that.apidata.val
    // }
    that.api[type](json1).done(function (value) {
      let temparr = [];
      value.result.list.forEach(function (val, idx) {
        if (val['name']) {
          let obj = {}
          obj.idx = val['code'];
          obj.val = val['name'];
          temparr.push(obj)
        } else {
          temparr.push(val)
        }
        // that.hospital.push(val.hospitalName)
        // that.duoxuanobj.hospitalName.setData(that.hospital)
      })
      console.log(temparr, 'temparr')
      that.duoxuanobj[type].renderHtml(temparr)
    })
  }

  render() {
    let that = this;
    let duoxuanconfig = [{
      name: 'hospitalCode',
      showname: '????????????',
      datatype: 'obj',
      input: true,
      data: that.api.hospital,
    }, {
      name: 'bodyPart',
      showname: '??????',
      data: Tool.configxlkformat(that.app.constmap['BODY_PART'])
    }, {
      name: 'modality',
      showname: '????????????',
      datatype: 'obj',
      data: Tool.configxlkformat(that.app.constmap['MODALITY'])
    }, {
      name: 'fileType',
      showname: '????????????',
      datatype: 'arr',
      data: ['DCM', 'JPG']
    }, {
      name: 'kernelCapital',
      showname: '????????????Kernel?????????',
      datatype: 'arr',
      data: ['H', 'B', 'C', 'S', 'T', 'K', 'I']
    }, {
      name: 'row',
      showname: '????????????',
      datatype: 'arr',
      data: [16, 32, 64, 128, 256]
    }]
    let andor = [{val: '??????', idx: 'AND'}, {val: '??????', idx: 'OR'}]
    let contains = [{val: '??????', idx: 'CONTAIN'}, {val: '?????????', idx: 'NOT_CONTAIN'}]
    let firstselect = {val: '?????????', idx: ''}
    let singleconfig = [{
      name: 'patientSex',
      showname: '??????',
      data: [{val: '???', idx: 'M'}, {val: '???', idx: 'F'}]
    }, {
      name: 'patientAgeType',
      showname: '????????????',
      data: [{val: '???', idx: 'year'}, {val: '???', idx: 'month'}]
    }, {
      name: 'isValid',
      showname: '??????????????????',
      data: [{val: '???', idx: 1}]
    }]
    that.singleobj = {}
    require.ensure("../../moduleslibs/dropdown1/drop.js", function () {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      singleconfig.forEach(function (val, idx) {
        that.singleobj[val.name] = that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
          className: 'xlk',
          firstSelect: {val: val.showname, idx: ''},
          data: val.data
        })
        that.singleobj[val.name].event._addEvent('option.click', function (value) {
          that.apidata[val.name] = value.idx
        })
        that.singleobj[val.name].event._addEvent('dropDown.clear', function (value) {
          that.apidata[val.name] = ''
        })
      })
      that.apidata.patientAgeType = 'year'
      that.singleobj['patientAgeType'].event._addEvent('dropDown.clear', function (value) {
        that.apidata.patientAgeType = 'year';
      })
      that.singleobj['isValid'].event._addEvent('option.click', function (value) {
        that.apidata.valid = value.idx == 1 ? true : false;
      })
      that.dom.find('.isValid .option[data-idx="1"]').click()
      that.singleobj['isValid'].event._addEvent('dropDown.clear', function (value) {
        that.apidata.valid = '';
      })
      that.apidata.jpgValid = true
      let name = [];
      let inputs = []
      that.dom.find('.bhxlk').dom.forEach(function (val, idx) {
        let obj = {};
        inputs[idx] = that.app.loadModule(dropdown, val, {
          className: 'xlk bh' + idx,
          firstSelect: {val: '??????', idx: 'CONTAIN'},
          data: contains
        })
        inputs[idx].event._addEvent('option.click', function (value) {
          name.push(value)
          that.resetjctj();
        })
        inputs[idx].event._addEvent('dropDown.clear', function () {
          name.push('')
          that.resetjctj();
        })
        that.resetjctj();
      })
      that.dom.find('.andor').dom.forEach(function (val, idx) {
        let obj = {};
        inputs[idx] = that.app.loadModule(dropdown, val, {
          className: 'xlk andor' + idx,
          firstSelect: {val: '??????', idx: 'AND'},
          data: andor
        })
        inputs[idx].event._addEvent('option.click', function (value) {
          name.push(value)
          that.resetjctj();
        })
        inputs[idx].event._addEvent('dropDown.clear', function (value) {
          name.push('')
          that.resetjctj();
        })
        that.resetjctj();
      })
      that.initscroll()
    })
    require.ensure("../../moduleslibs/duoxuanxlk/duoxuanxlk.js", function () {
      let dropdown = require("../../moduleslibs/duoxuanxlk/duoxuanxlk.js")
      duoxuanconfig.forEach(function (val, idx) {
        let myname = that.string_to_name(val.name)
        //console.log(myname, 'myname')
        myname = that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
          showname: val.showname,
          data: val.data,
          datatype: val.datatype,
          input: val.input
        })
        myname.event._addEvent('duoxuan.select', function (value) {
          that.apidata[val.name] = value.name
          console.log(that.apidata, 'apidata')
        })
        myname.event._addEvent('duoxuanxlk.clear', function (value) {
          that.apidata[val.name] = ''
          console.log(that.apidata, 'apidata')
        })
        myname.event._addEvent('duoxuan.input', function (value) {
          that.apidata[value.classname] = value.data
          console.log(that.apidata)
          setTimeout(function () {
            that.event._dispatch('hospital.input', {data: value.data})
          }, 1500)
        })
        that.duoxuanobj[val.name] = myname
        that.duoxuanobj['hospitalCode'].event._addEvent('duoxuanxlk.clear', function () {
          that.apidata['hospitalCode'] = ''
          that.event._dispatch('hospital.input', {data: ''})
        })
      })
      that.initscroll();
    })
    require.ensure('../../moduleslibs/times_double/times.js', function () {
      let calendar = require('../../moduleslibs/times_double/times.js')
      let todayTime = new Date()
      let Month = todayTime.getMonth() + 1 < 10 ? '0' + (todayTime.getMonth() + 1) : (todayTime.getMonth() + 1)
      let today = todayTime.getFullYear() + '-' + Month + '-' + todayTime.getDate()
      that.startTime = that.app.loadModule(calendar, that.dom.find('.timefiltercont'), {
        titleShow: false,
        defaultword: '???????????????'
      })
      that.startTime.event._addEvent('times1.day', function (value) {
        that.apidata.studyDateBegin = value.st ? value.st + " 00:00:00" : ''
        that.apidata.studyDateEnd = value.et ? value.et + " 23:59:59" : ''
        console.log(that.apidata)
      })
      that.startTime.event._addEvent('times.dele', function (value) {
        if (value.dom.hasClass('day_left')) {
          that.apidata.studyDateBegin = ''
        } else {
          that.apidata.studyDateEnd = '';
        }
      })
      that.startTime1 = that.app.loadModule(calendar, that.dom.find('.timefiltercont1'), {
        titleShow: false,
        defaultword: '???????????????'
      })
      that.startTime1.event._addEvent('times1.day', function (value) {
        that.apidata.importDateBegin = value.st ? value.st + " 00:00:00" : ''
        that.apidata.importDateEnd = value.et ? value.et + " 23:59:59" : ''
        console.log(that.apidata)
      })
      that.startTime1.event._addEvent('times.dele', function (value) {
        if (value.dom.hasClass('day_left')) {
          that.apidata.importDateBegin = ''
        } else {
          that.apidata.importDateEnd = '';
        }
      })
    })
  }

  setxlk(value) {
    let that = this;
    console.log(that.duoxuanobj['hospitalCode'])
    that.duoxuanobj['hospitalCode'].renderHtml(value)
  }

  setTitle_radio() {
    let obj = {}
    let that = this;
    that.obj = {}
    that.obj['icon'] = {
      "seriesInstanceUID": {
        name: '<span data-i18n="date" data-name="????????????">?????????</span>',
        type: 'text',
        code: 'date',
        w: '9%',
        ww: '9%',
        n: "40"
      },
      "hospitalName": {
        name: '<span data-i18n="age" data-name="??????">????????????</span>',
        type: 'text',
        code: 'checkid',
        w: '8%',
        ww: '8%'
      },
      "bodyPart": {
        name: '<span data-i18n="age" data-name="??????">??????</span>',
        type: 'text',
        code: 'pid',
        w: '6%',
        ww: '6%',
      },
      "modality": {
        name: '<span data-i18n="age" data-name="??????">????????????</span>',
        type: 'text',
        code: 'pname',
        w: '5%',
        ww: '5%'
      },
      "studyDate": {
        name: '<span data-i18n="age" data-name="??????">????????????</span>',
        type: 'text',
        code: 'psex',
        w: '7%',
        ww: '7%'
      },
      "studyInstanceUID": {
        name: '<span data-i18n="age" data-name="??????">?????????</span>',
        type: 'text',
        code: 'age',
        w: '9%',
        ww: '9%'
      },
      "fileType": {
        name: '<span data-i18n="shebei" data-name="??????">????????????</span>',
        type: 'text',
        code: 'shebei',
        w: '5%',
        ww: '5%'
      },
      "patientAge": {
        name: '<span data-i18n="handler" data-name="??????">??????</span>',
        type: 'text',
        code: 'handler',
        w: '5%',
        ww: '5%',
      },
      "patientSex": {
        name: '<span data-i18n="action" data-name="??????">??????</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "importDate": {
        name: '<span data-i18n="action" data-name="??????">????????????</span>',
        type: 'text',
        code: 'action',
        w: '8%',
        ww: '8%'
      },
      "valid": {
        name: '<span data-i18n="action" data-name="??????">??????????????????</span>',
        type: 'text',
        code: 'action',
        w: '6%',
        ww: '6%'
      },
      "keyword": {
        name: '<span data-i18n="action" data-name="??????">?????????</span>',
        type: 'text',
        code: 'action',
        w: '5%',
        ww: '5%'
      },
      "finding": {
        name: '<span data-i18n="action" data-name="??????">????????????</span>',
        type: 'text',
        code: 'action',
        w: '11%',
        ww: '11%'
      },
      "conclusion": {
        name: '<span data-i18n="action" data-name="??????">??????</span>',
        type: 'text',
        code: 'action',
        w: '11%',
        ww: '11%'
      }
    };
    that.obj['type'] = 'center';
    that.obj['tablewidth'] = ES.selctorDoc('.addimage').box().clientWidth - 40;
    that.obj['minwidth'] = 1500;
    that.tableevent(that.obj)
  }

  setTitle_other() {
    let obj = {}
    let that = this;
    that.obj['icon'] = {
      "seriesInstanceUID": {
        name: '<span data-i18n="date" data-name="????????????">?????????</span>',
        type: 'text',
        code: 'date',
        w: '20%',
        ww: '20%',
        n: "40"
      },
      "hospitalName": {
        name: '<span data-i18n="age" data-name="??????">????????????</span>',
        type: 'text',
        code: 'checkid',
        w: '10%',
        ww: '10%'
      },
      "bodyPart": {
        name: '<span data-i18n="age" data-name="??????">??????</span>',
        type: 'text',
        code: 'pid',
        w: '10%',
        ww: '10%',
      },
      "modality": {
        name: '<span data-i18n="age" data-name="??????">????????????</span>',
        type: 'text',
        code: 'pname',
        w: '15%',
        ww: '15%'
      },
      "fileType": {
        name: '<span data-i18n="shebei" data-name="??????">????????????</span>',
        type: 'text',
        code: 'shebei',
        w: '15%',
        ww: '15%'
      },
      "importDate": {
        name: '<span data-i18n="action" data-name="??????">????????????</span>',
        type: 'text',
        code: 'action',
        w: '15%',
        ww: '15%'
      },
      "keyword": {
        name: '<span data-i18n="action" data-name="??????">?????????</span>',
        type: 'text',
        code: 'action',
        w: '15%',
        ww: '15%'
      },
    };
    that.obj['tablewidth'] = ES.selctorDoc('.addimage').box().clientWidth - 40;
    that.obj['type'] = 'center';
    that.tableevent(that.obj)
  }

  tableevent(obj) {
    let that = this
    require.ensure("../../moduleslibs/table/table", function () {
      //that.myScroll=null;
      that.myScroll1 = null;
      let cont_table = require("../../moduleslibs/table/table")
      that.table = that.app.loadModule(cont_table, that.dom.find('.datatable'), {
        id: 'datatable',
        header: obj
      });
      that.table.event._addEvent('table.pagenumber', function (value) {
        that.dom.find('.list-header .check-box').removeClass('choose')
        that.apidata.page = parseInt(value);
        that.table.changenum(that.apidata.page);
        that.refreshPage = false;
        that.event._dispatch('addimage.search', {data: that.apidata})
      });
      that.table.event._addEvent('table.pagesize', function (value) {
        that.apidata.pageSize = value.num;
        that.apidata.page = 1;
        that.refreshPage = true;
        that.event._dispatch('addimage.search', {data: that.apidata})
      });
      that.dom.find('.list-content').removeClass('hide');
      that.initscroll();
      that.inittable();
      that.setMain(true);
    })
  }

  setMain(value, value2) {
    let that = this;
    that.listdata = that.api.data;
    if (value2) {
      that.listdata = value2
    }
    if (!that.listdata) {
      that.table.noData();
      return
    }
    //console.log(that.api.data,'apidata',that.listdata)
    if (that.listdata.list.length > 0) {
      that.listdata.list.forEach(function (val, idx) {
        for (let i in val) {
          val[i] = val[i] == null ? '' : val[i]
        }
        for (let i in that.obj.icon) {
          val[i] = val[i] ? val[i] : ''
        }
        val.finding = val.finding == null ? '' : val.finding;
        val.conclusion = val.conclusion == null ? '' : val.conclusion;
        Tool.configxlkformat(that.app.constmap['MODALITY']).forEach(function (a, b) {
          if (a.idx == val.modality) {
            val.modality = a.val;
          }
        })
        val.valid = val.valid ? '???' : '???';
        switch (val.patientSex) {
          case 'M':
            val.patientSex = '???';
            break;
          case 'F':
            val.patientSex = '???'
            break;
          default:
            val.patientSex = ''
        }
        that.bodypart.forEach(function (a, b) {
          if (a.idx == val.bodyPart) {
            val.bodyPart = a.val;
          }
        })
      })
      that.table.setData(that.listdata.list);
      if (that.refreshPage) {
        that.table.getTotal(that.listdata.pages, 7, that.listdata.total)
      }
    } else {
      that.table.noData();
    }
    that.initscroll();
  }

  resetjctj() {
    let that = this;
    that.apidata.conditions = [];
    let obj1 = {
      join: ''
    }
    obj1.items = [];
    that.dom.find('.sj .sjli').dom.forEach(function (val, idx) {
      obj1.items.push(that.bianlili(val, 'finding'))
    })
    that.apidata.conditions.push(obj1)
    let obj2 = {
      join: that.dom.find('.middle .nowname').attr('data-idx')
    }
    obj2.items = [];
    that.dom.find('.jl .jlli').dom.forEach(function (val, idx) {
      obj2.items.push(that.bianlili(val, 'conclusion'))
    })
    that.apidata.conditions.push(obj2);
    //console.log(that.apidata)
  }

  bianlili(val, value) {
    let that = this;
    let tempobj = {}
    if (val.find('.andor').dom) {
      tempobj.join = val.find('.andor .nowname').attr('data-idx')
    } else {
      tempobj.join = ''
    }
    tempobj.key = value
    tempobj.value = val.find('.liinput').val()
    tempobj.operator = val.find('.bhxlk .nowname').attr('data-idx')
    return tempobj;
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.scrollarea').attr('id', rid)
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

  string_to_name(string) {
    let _name = 'var ' + string;
    eval(_name);
    return _name;
  }
}

module.exports = addimage;
