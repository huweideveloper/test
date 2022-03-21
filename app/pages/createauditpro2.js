class createauditpro2 extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('auditproject')
    this.app.header.changeselected(2)
    this.styleModel(1)
    this.resize()
    this.maxnum = 10000;
    this.type = this.app.parpam.type*1
    this.projectId = this.app.parpam.projectid*1
    this.status = this.app.parpam.status
    this.closetip = false;
    this.loadmodule()
    this.render()
    //按钮事件
    this.btnEvent()
    this.initscroll();
  }

  //点击事件
  btnEvent() {
    let that = this;
    //是否需要展示报告
    this.dom.find('.showReport .check-box').on('click', function(e){
      let dom = ES.selctorDoc(this)
      that.radioClick(e,dom.parent().attr('type'))
    })
    //是否需要以检查号级别进行审核
    this.dom.find('.studyAnno .check-box').on('click', function(e){
      that.radioClick(e,'studyAnno')
    })
    //是否超大图
    this.dom.find('.largeFigure .check-box').on('click', function(e){
      that.radioClick(e,'largeFigure')
    })
    //影像标注添加
    this.dom.find('.bigadd').on('click', () => {
      this.app.session.set('ischanged', true)
      this.multlist.addli()
      this.initscroll();
    })
    this.dom.find('.save').on('click', async () => {
      this.dom.find('.redborder').removeClass('redborder');
      this.dom.find('.required').remove();
      if (this.dom.find('.inputLine').dom) {
        this.dom.find('.inputLine').dom.forEach((val, idx) => {
          if (Tool.checkForm(ES.selctorDoc(val).dom, 'red') !== '') {
            val.find('.' + val.attr('redlabel')).addClass('redborder')
            val.find('.' + val.attr('redlabel')).after('<span class="required">' + Tool.checkForm(ES.selctorDoc(val).dom, 'red') + '</span>')
          }
        })
      }
      if (this.dom.find('.redborder').dom && this.dom.find('.redborder').dom.some((item) => {
        return item.box().clientHeight !== 0
      })) {
        return false
      } else {
        if (this.closetip && JSON.stringify(this.importProjectList) !== '[]') {
          this.app.alert.show({
            title: ' ',
            msg: '<span style="font-size: 15px">【病灶类型】及【标注工具】与前一次保存版本不一致，是否继续保存。继续保存将清空之前在第三步的“所属项目”。若该审核项目下已有相关审核任务，该任务下审核源也将清空。</span>',
            close: true,
            sure:async () => {
              this.app.loading.show()
              let res = await this.api.matchrate_edit(this.model.getData('apiData'))
              this.app.loading.hide()
                if (res.code == 0) {
                  this.closetip = false;
                  this.app.session.clearAll()
                  this.app.changePage('createauditpro3', {type: 'edit', projectid: this.projectId, status: this.status})
                } else {
                  this.errorshow(res.msg)
                }
            }
          })
        } else {
          this.app.loading.show()
          let res = await this.api.matchrate_edit(this.model.getData('apiData'))
          this.app.loading.hide()
            if (res.code == 0) {
              this.closetip = false;
              this.app.session.clearAll()
              this.app.changePage('createauditpro3', {type: 'edit', projectid: this.projectId, status: this.status})
            } else {
              this.errorshow(res.msg)
            }
        }
      }
    })
  }

  radioClick(e,type){
    this.app.session.set('ischanged', true)
    let dom = ES.selctorDoc(e.target)
    console.log(type,'hhh')
    if (dom.hasClass('choose')) {
      dom.removeClass('choose');
      this.model.apiData[type] = false
      this.model.setData('apiData', this.model.apiData)
    } else {
      dom.addClass('choose');
      this.model.apiData[type] = true
      this.model.setData('apiData', this.model.apiData)
    }
  }

  async render() {
    let pagedata = {}
    let json = {
      auditProjectId: this.projectId
    }
    this.app.loading.show()
    let res = await this.api.auditproject_read(json)
      this.app.loading.hide()
      if (res.code == 0) {
        pagedata = res.data;
        this.model.apiData.imgMactchrateList = pagedata.imgMactchrateList
        this.model.apiData.inspectSee = pagedata.inspectSee ? pagedata.inspectSee : false
        this.model.apiData.diagnosisIncome = pagedata.diagnosisIncome ? pagedata.diagnosisIncome : false
        this.model.apiData.auditProjectId = pagedata.auditProjectId
        this.importProjectList = pagedata.importProjectList;
        let json1 = {
          id: this.projectId
        }
        if (pagedata.inspectSee) {
          this.dom.find('.showReport[type="inspectSee"] .check-box').click()
        }
        if (pagedata.diagnosisIncome) {
          this.dom.find('.showReport[type="diagnosisIncome"] .check-box').click()
        }
        /*if (pagedata.studyAnno) {
          this.dom.find('.studyAnno .check-box').click()
        }*/
        if (pagedata.largeFigure) {
          this.dom.find('.largeFigure .check-box').click()
        }
        let finalarr = []
        pagedata.imgMactchrateList.forEach((val) => {
          let obj = {
            id: val.imgAnnoMactchrateId,
            toolList: [{id: 1, type: val.imageToolType, property: val.matchrate}],
            type: val.imageType,
            annotationItemList: []
          }
          finalarr.push(obj)
        })
        if (this.type == 'view' || this.status == 2) {
          this.dom.find('.save').remove()
          this.multlist.setData(finalarr, 'view')
          this.todisabled();
        } else {
          this.multlist.setData(finalarr)
        }
        this.app.session.clearAll()
      } else {
        this.errorshow(res.msg)
      }
    this.initscroll();
  }

  //加载各个模块
  loadmodule() {
    let multiliModule = require("../modules/bztoollist/bztoollist.js")
    this.multlist = this.app.loadModule(multiliModule, this.dom.find('.multiitem'), {protype: 'audit'})
    this.multlist.event._addEvent('bztoollist.toolListchange', () => {
      this.model.apiData.imgMactchrateList = [];
      let temp = this.multlist.getData()
      temp.forEach((val, idx) => {
        let obj = {}
        obj.imgAnnoMactchrateId = val.id;
        obj.imageType = val.type;
        obj.imageToolType = val.toolList[0].type;
        obj.matchrate = parseFloat(val.toolList[0].property);
        obj.action = val.action;
        this.model.apiData.imgMactchrateList.push(obj)
      })
      this.app.session.set('ischanged', true)
      this.model.setData('apiData', this.model.apiData)
      this.initscroll()
    })
    this.multlist.event._addEvent('bztoollist.specialchange', (value) => {
      this.closetip = true
    })
    this.multlist.event._addEvent('bztoollist.refresh', (value) => {
      this.app.changePage('createauditpro2', {type: this.type, projectid: this.projectId, status: this.status})
    })
  }

  todisabled() {
    this.dom.find('.bigadd').addClass('hide');
    this.dom.find('.check-box').off('click');
    this.dom.find('.inputBox').attr('readonly', 'readonly');
    this.multlist.disable();
  }

  errorshow(msg) {
    this.app.alert.show({
      title: ' ',
      msg: msg,
      close: false
    })
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 40
    ES.selctorDoc('.createauditpro2').css({'height': ch, 'width': cw});
    this.initscroll();
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.createauditpro2').attr('id', rid)
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

module.exports = createauditpro2;
