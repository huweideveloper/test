require("./addimage.less");

class addimage extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = 'addimage';
  }

  complete() {
    let that = this;
    console.log(this.api.hospital,'this.api.hospital')
    let config_fun = require("./searchcondition");
    this.searchData = new config_fun(that.app.constmap);
    this.category = 'fs';
    let datacondition = require("../../modules/datacondition/datacondition")
    let tablist = require("../../moduleslibs/tab/tab")
    this.tablist = [{'id': 'fs', 'name': '放射科'}, {'id': 'bl', 'name': '病理科'}, {'id': 'qt', 'name': '其它'}]
    let tabListControl = this.app.loadModule(tablist, this.dom.find('.topchoose'), { data: this.tablist, default: this.category })
    tabListControl.event._addEvent('tab.change', (value) => {
      this.toggletab(value)
    })
    this.apidata = {page: 1, pageSize: 10, valid: true,jpgValid:true, category: 'RADIOLOGY'};
    this.chooseData = this.app.loadModule(datacondition, this.dom.find('.filterarea'), { data: this.searchData[this.category] })
    this.chooseData.event._addEvent('datacondition.moduledone',()=>{
      if (this.category == 'fs') {
        this.dom.find('.inspect .drop-down .selectbox').dom.forEach(function (val, idx) {
          val.find('li').eq(0).click()
        })
        this.dom.find('.check .drop-down .selectbox').dom.forEach(function (val, idx) {
          val.find('li').eq(0).click()
        })
      }
      this.dom.find('.valid .drop-down .selectbox li[data-idx="1"]').click()
      this.dom.find('.jpgValid .drop-down .selectbox li[data-idx="1"]').click()
      this.setxlk(this.api.hospital)
    })
    this.chooseData.event._addEvent('datacondition.dropinput',(value)=>{
      console.log(value,'111')
      this.event._dispatch('hospital.input',value)
    })
    this.listHeader('fs');
    this.finaldata = this.apidata
    // this.refreshPage = true;
    // this.yymcdata = [{
    //   val: '',
    //   idx: ''
    // }]
    // this.bodypart = Tool.configxlkformat(this.app.constmap['BODY_PART'])
    // this.hospital = [];
    // this.duoxuanobj = {};
    // if (this.api.type == 'view') {
    //   this.dom.find('.filterarea').addClass('hide');
    //   this.dom.find('.sjandjl').addClass('hide');
    //   this.dom.find('.timefilter').addClass('hide');
    //   this.dom.find('.topchoose').addClass('hide');
    //   this.dom.find('.viewbtn').removeClass('hide');
    // } else {
    //   this.render();
    // }
    // this.setTitle_radio();
    // this.dom.find('.topchoose a').on('click', function () {
    //   if (!ES.selctorDoc(this).hasClass('choosed')) {
    //     that.dom.find('.topchoose a').removeClass('choosed');
    //     ES.selctorDoc(this).addClass('choosed')
    //     if (ES.selctorDoc(this).hasClass('fsk')) {
    //       that.imagetype = 'radio'
    //     } else {
    //       that.imagetype = 'other'
    //     }
    //     that.toggleimagetype()
    //   }
    // })
    this.dom.find('.icon-guanbi').on('click', function () {
      that.close();
      that.duoxuanobj = {}
    })
    // this.dom.find('.downloadall').on('click', function () {
    //   that.event._dispatch('addimage.download', 1);
    // })
    // this.dom.find('.downloadpart').on('click', function () {
    //   that.event._dispatch('addimage.download', 2);
    // })
    // this.dom.find('.sjandjl .liinput').on('change', function () {
    //   that.resetjctj();
    // })
    // this.dom.find('.addnew').on('click', function () {
    //   if (that.listdata.list.length == 0) {
    //     that.app.alert.show({
    //       title: ' ',
    //       msg: '本次查询无数据，<br>继续操作会将历史原数据做删除处理',
    //       close: true,
    //       sure: function () {
    //         that.event._dispatch('addimage.new', {data: that.finaldata})
    //       }
    //     })
    //   } else {
    //     that.event._dispatch('addimage.new', {data: that.finaldata})
    //   }
    // })
    this.dom.find('.addall').on('click', function () {
      that.event._dispatch('addimage.all', {data: that.finaldata})
    })
    this.dom.find('.searchbtn').on('click', () => {
      that.refreshPage = true;
      that.apidata.seriesCreateTimeStamp = Tool.GetDateStr(0) + " 23:59:59"
      that.searchData[that.category].forEach((val, idx) => {
        if (val[0].name == 'inspectTime') {
          that.apidata.studyDateBegin = this.chooseData.data[val[0].name][0].startTime
          that.apidata.studyDateEnd = this.chooseData.data[val[0].name][0].endTime
        } else if (val[0].name == 'uploadTime') {
          that.apidata.importDateBegin = this.chooseData.data[val[0].name][0].startTime
          that.apidata.importDateEnd = this.chooseData.data[val[0].name][0].endTime
        } else if (val[0].type == 'dTexts') {
          that.apidata[val[0].name] = JSON.stringify(this.chooseData.data[val[0].name][0]) == '{}' ? null : this.chooseData.data[val[0].name]
        } else if (val[0].name == 'patientAgeType') {
          that.apidata[val[0].name] = this.chooseData.data[val[0].name][0]
          that.apidata.patientAgeLower = parseInt(this.chooseData.data[val[0].name][1].lower)
          that.apidata.patientAgeUpper = parseInt(this.chooseData.data[val[0].name][1].upper)
        } else if (val[0].name == 'check' || val[0].name == 'inspect') {
          that.apidata[val[0].name] = this.chooseData.data[val[0].name]
        } else {
          that.apidata[val[0].name] = this.chooseData.data[val[0].name].toString() == '' ? null : this.chooseData.data[val[0].name].toString()
        }
      })
      if (that.apidata.kernalfilter) {
        that.apidata.kernelLower = that.apidata.kernalfilter[0].lower;
        that.apidata.kernelUpper = that.apidata.kernalfilter[0].upper;
      }
      if (that.apidata.dyfilter) {
        that.apidata.kvpLower = that.apidata.dyfilter[0].lower;
        that.apidata.kvpUpper = that.apidata.dyfilter[0].upper;
      }
      if (that.apidata.csfilter) {
        that.apidata.layerCountLower = that.apidata.csfilter[0].lower;
        that.apidata.layerCountUpper = that.apidata.csfilter[0].upper;
      }
      if (that.apidata.chfilter) {
        that.apidata.sliceThicknessLower = that.apidata.chfilter[0].lower;
        that.apidata.sliceThicknessUpper = that.apidata.chfilter[0].upper;
      }
      if (that.apidata.windowWidth) {
        that.apidata.windowWidthLower = that.apidata.windowWidth[0].lower;
        that.apidata.windowWidthUpper = that.apidata.windowWidth[0].upper;
      }
      if (that.apidata.windowCenter) {
        that.apidata.windowCenterLower = that.apidata.windowCenter[0].lower;
        that.apidata.windowCenterUpper = that.apidata.windowCenter[0].upper;
      }
      that.apidata.conditions = []
      if (that.apidata.inspect) {
        let temp = []
        temp.push({ join: '', key: 'finding', value: that.apidata.inspect[1], operator: that.apidata.inspect[0] })
        temp.push({ join: that.apidata.inspect[2], key: 'finding', value: that.apidata.inspect[4], operator: that.apidata.inspect[3] })
        temp.push({ join: that.apidata.inspect[5], key: 'finding', value: that.apidata.inspect[7], operator: that.apidata.inspect[6] })
        that.apidata.conditions.push({ join: '', items: temp })
      }
      if (that.apidata.check) {
        let temp = []
        temp.push({ join: '', key: 'conclusion', value: that.apidata.check[1], operator: that.apidata.check[0] })
        temp.push({ join: that.apidata.check[2], key: 'conclusion', value: that.apidata.check[4], operator: that.apidata.check[3] })
        temp.push({ join: that.apidata.check[5], key: 'conclusion', value: that.apidata.check[7], operator: that.apidata.check[6] })
        that.apidata.conditions.push({ join: that.apidata.inspect[8], items: temp })
      }
      if (that.apidata.valid) {
        that.apidata.valid = Boolean(1 * that.apidata.valid)
      }
      if (that.apidata.mhaValid) {
        that.apidata.mhaValid = Boolean(1 * that.apidata.mhaValid)
      }
      if (that.apidata.jpgValid) {
        that.apidata.jpgValid = Boolean(1 * that.apidata.jpgValid)
      }
      if (that.apidata.jpgCompressValid) {
        that.apidata.jpgCompressValid = Boolean(1 * that.apidata.jpgCompressValid)
      }
      delete that.apidata.check
      delete that.apidata.inspect
      delete that.apidata.chfilter
      delete that.apidata.kernalfilter
      delete that.apidata.csfilter
      delete that.apidata.dyfilter
      that.apidata.page = 1;
      that.finaldata = that.apidata
      that.event._dispatch('addimage.search', {data: that.apidata})
    })
  }

  toggletab(value){
    this.apidata = {page:1,pageSize:10,valid:true}
    switch (value.id) {
      case 'fs':
        this.apidata.category = 'RADIOLOGY'
        this.apidata.jpgValid = true
        break;
      case 'bl':
        this.apidata.category = 'PATHOLOGY'
        break;
      case 'qt':
        this.apidata.category = 'OTHER'
        break;
    }
    this.finaldata = this.apidata
    this.category = value.id;
    this.chooseData.setData(this.searchData[value.id])
    this.dom.find('.valid .drop-down .selectbox li[data-idx="1"]').click()
    if(this.dom.find('.jpgValid').dom){
      this.dom.find('.jpgValid .drop-down .selectbox li[data-idx="1"]').click()
    }
    this.setxlk(this.api.hospital)
    this.listHeader(value.id);
    this.initscroll();
  }

  listHeader(type){
    let obj={
      icon:this.searchData.tableconfig[type].icon,
      type:'center',
      tablewidth:ES.selctorDoc('.tablearea').box().clientWidth - 40,
      minwidth:1500
    }
    require.ensure("../../moduleslibs/table/table", () => {
      this.myScroll1 = null;
      let cont_table = require("../../moduleslibs/table/table")
      this.table = this.app.loadModule(cont_table, this.dom.find('.tablearea'), {
        id: 'datatable',
        header: obj
      });
      this.table.event._addEvent('table.pagenumber', (value) => {
        this.apidata.page = parseInt(value);
        this.table.changenum(this.apidata.page);
        this.refreshPage = false;
        this.event._dispatch('addimage.search', {data: this.apidata})
      });
      this.table.event._addEvent('table.pagesize', (value) => {
        this.apidata.pageSize = value.num;
        this.apidata.page = 1;
        this.refreshPage = true;
        this.event._dispatch('addimage.search', {data: this.apidata})
      });
      this.dom.find('.list-content').removeClass('hide');
      this.initscroll();
      this.inittable();
      this.refreshPage = true;
      // this.setMain(true);
      this.event._dispatch('addimage.search', {data: this.apidata})

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
    that.dom.find('.showData .Timers').html('请选择时间')
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

  setxlk(value) {
    console.log(value,'xlk')
    this.chooseData.renderHtml(value, 'hospitalCode')
    // that.duoxuanobj['hospitalCode'].renderHtml(value)
  }

  // tableevent(obj) {
  //   let that = this
  //   require.ensure("../../moduleslibs/table/table", function () {
  //     //that.myScroll=null;
  //     that.myScroll1 = null;
  //     let cont_table = require("../../moduleslibs/table/table")
  //     that.table = that.app.loadModule(cont_table, that.dom.find('.datatable'), {
  //       id: 'datatable',
  //       header: obj
  //     });
  //     that.table.event._addEvent('table.pagenumber', function (value) {
  //       that.dom.find('.list-header .check-box').removeClass('choose')
  //       that.apidata.page = parseInt(value);
  //       that.table.changenum(that.apidata.page);
  //       that.refreshPage = false;
  //       that.event._dispatch('addimage.search', {data: that.apidata})
  //     });
  //     that.table.event._addEvent('table.pagesize', function (value) {
  //       that.apidata.pageSize = value.num;
  //       that.apidata.page = 1;
  //       that.refreshPage = true;
  //       that.event._dispatch('addimage.search', {data: that.apidata})
  //     });
  //     that.dom.find('.list-content').removeClass('hide');
  //     that.initscroll();
  //     that.inittable();
  //     that.setMain(true);
  //   })
  // }

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
      that.listdata.list.forEach( (val, idx) => {
        for (let i in val) {
          val[i] = val[i] == null ? '' : val[i]
        }
        for (let i in this.searchData.tableconfig[this.category].icon) {
          val[i] = val[i] ? val[i] : ''
        }
        val.finding = val.finding == null ? '' : val.finding;
        val.conclusion = val.conclusion == null ? '' : val.conclusion;
        if(val.importDate) val.importDate = Tool.time(val.importDate, 'yyyy-mm-dd')
        if(val.createDate) val.createDate = Tool.time(val.createDate, 'yyyy-mm-dd')
        if(val.studyDate) val.studyDate = Tool.time(val.studyDate, 'yyyy-mm-dd')
        if(val.patientAge) val.patientAge = Math.floor(val.patientAge/12)
        Tool.configxlkformat(that.app.constmap['MODALITY']).forEach(function (a, b) {
          if (a.idx == val.modality) {
            val.modality = a.val;
          }
        })
        val.valid = val.valid ? '是' : '否';
        switch (val.patientSex) {
          case 'M':
            val.patientSex = '男';
            break;
          case 'F':
            val.patientSex = '女'
            break;
          default:
            val.patientSex = ''
        }
        Tool.configxlkformat(this.app.constmap['BODY_PART']).forEach(function (a, b) {
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
