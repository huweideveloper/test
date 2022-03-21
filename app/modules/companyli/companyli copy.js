require('./companyli.less')
// var html = require('./tpl.html')

class companyli extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = "bztoolli"
    this.data = value
  }
  complete() {
    this.returndata = { costVisible: false }
    this.initli();
    this.render();
    if (this.nowParam.type == 'audit') {
      this.dom.find('.pmoney').html('审核单价')
    }
  }
  initli() {
    let that = this;
    let dropdown1 = require('../../moduleslibs/dropdown1/drop')
    this.gsxlk = this.app.loadModule(dropdown1, that.dom.find('.gsxlk'), {
      className: 'xlk',
      firstSelect: {val: '', idx: ''},
      maxshownum: 5,
      input: true,
      data: []
    })
    let dropdown = require("../../moduleslibs/duoxuanxlk/duoxuanxlk.js")
    this.people = this.app.loadModule(dropdown, this.dom.find('.people'), {
      firstSelect:{val: '', idx: ''},
      data: [],
      input: false,
      maxshownum: 5
    })
  }
  render() {
    let that = this;
    this.gsxlk.event._addEvent('option.click', function (value) {
      this.firstRender = false
      that.returndata.venderId = value.idx ? parseInt(value.idx.split(',')[0]) : ''
      that.event._dispatch('companyli.choosed', { data: value, num: that.data.num ,firstRender:this.firstRender})
      that.event._dispatch('companyli.datachange', { data: that.returndata, num: that.data.num })
    })
    this.gsxlk.event._addEvent('drop.input', function (value) {
      that.event._dispatch('companyli.cominput', { data: value, num: that.data.num })
    })
    this.gsxlk.event._addEvent('dropDown.clear', function (value) {
      that.returndata.venderId = ''
      that.dom.find('.usercont').html(0)
      that.event._dispatch('companyli.cominput', { data: that.returndata, num: that.data.num })
    })
    this.people.event._addEvent('duoxuan.select', function (value) {
      that.returndata.userList = value.name.split(',')
      that.dom.find('.usercont').html(value.name.split(',').length)
      that.event._dispatch('companyli.datachange', { data: that.returndata, num: that.data.num })
    })
    this.people.event._addEvent('duoxuanxlk.clear', function (value) {
      that.returndata.userList = []
      that.dom.find('.usercont').html(0)
      that.event._dispatch('companyli.cominput', { data: that.returndata, num: that.data.num })
    })
    that.dom.find('.adddelli .icon-shanchu').on('click', function() {
      if (that.app.parpam.status !== '1' && $(this).parent().parent().parent().attr('previous') === 'true') {
        // 任务待发布状态时允许删人，其他状态不能删除
        that.app.alert.show({
          title: " ",
          msg: '已添加的不能删除',
          close: false
        })
        return false
      }
      that.event._dispatch('companyli.delete', { num: that.nowParam.num });
    })
    that.dom.find('.unitprice').on('change', function () {
      that.returndata.cost = parseFloat(ES.selctorDoc(this).val())
      that.event._dispatch('companyli.datachange', { data: that.returndata, num: that.data.num })
    })
    that.dom.find('.price .check-box').on('click', function () {
      let dom = ES.selctorDoc(this)
      if (dom.hasClass('choose')) {
        dom.removeClass('choose')
        that.returndata.costVisible = false;
      } else {
        dom.addClass('choose')
        that.returndata.costVisible = true;
      }
      that.event._dispatch('companyli.datachange', { data: that.returndata, num: that.data.num })
    })
  }
  setdata(val) {
    let that = this;
    that.returndata = val;
    that.dom.find('.unitprice').val(val.cost)
    that.dom.find('.gsxlk .option').dom.forEach(function (val1, idx) {
      if (val1.attr('data-idx').split(',')[0] == val.venderId) {
        ES.selctorDoc(val1).click()
      }
    })
    this.firstRender = true
    this.choosedUser = val.userList.filter(({ selected }) => selected)
    // that.dom.find('.gsxlk .option[data-idx="'+val.venderId+','+val.userCount+'"]').click()
    if (val.costVisible) {
      that.dom.find('.price .check-box').click()
    }
  }
  renderPeople(list){
    this.people.renderHtml(list)
    this.dom.find('.usercont').html(list.length)
    if(!this.firstRender) {
      this.people.chooseAll()
    } else {
      this.choosedUser.forEach(v => {
        const selectedPeopleEls = this.dom.find('.people li[id="'+v.id+'"] .check-box')
        selectedPeopleEls.addClass('choose')
        this.app.parpam.status !== '1' && selectedPeopleEls.addClass('disabled') // 任务待发布状态时允许删人，其他状态不能删除
      })
      this.people.getResult()
      this.firstRender = false
    }
  }
  setxlkvalue(value) {
    let that = this
    that.gsxlk.renderHtml(value)
  }
  cleardata() {
    let that = this;
    that.gsxlk.reset();
  }
  disabled() {
    let that = this;
    that.gsxlk.disable();
    that.dom.find('.icon-shanchu').remove();
    that.dom.find('.price .check-box').off('click')
    that.dom.find('.unitprice').attr('readonly', 'readonly')
    that.dom.find('.inputLine').css({'pointer-events':'none','cursor':'not-allowed'})
  }
}

//原型链一定要有的
module.exports = companyli;
