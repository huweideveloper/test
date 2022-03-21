class createaudittask3 extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('audittask')
    this.app.header.changeselected(3)
    this.styleModel(1)
    this.tUser_count()
    this.type = this.app.parpam.type
    this.projectid = this.app.parpam.projectid * 1
    this.taskid = parseInt(this.app.parpam.taskid)
    this.status = parseInt(this.app.parpam.status)
    this.apiData = {}
    this.loadmodules();
    this.vendor_query(false, false, true);
    this.eventAdd()
    // this.render()
  }

  loadmodules() {
    let distrubutions = require("../modules/distrubution/distrubution")
    this.distrubution = this.app.loadModule(distrubutions, this.dom.find('.distrubutionarea'), {})
    this.distrubution.event._addEvent('distrubution.datachange', (value) => {
      this.app.session.set('ischanged', true)
      value.id = this.taskid;
      value.isBasic = false;
      this.apiData = value
    })
    this.distrubution.event._addEvent('distrubution.cominput', (value) => {
      if (value) {
        this.vendor_query(value.data.data.data, value.dom)
      }
    })
    this.distrubution.event._addEvent('distrubution.queryPeople', (value) => {
      console.log(value, 'fff')
      this.user_list(value.data.idx, value.num)
    })
  }

  eventAdd() {
    this.dom.find('.save').on('click', async () => {
      this.dom.find('.inputLine').dom.forEach(function(val, idx) {
        val.find('.' + val.attr('redlabel')).removeClass('redborder')
        val.find('.required').remove();
        if (Tool.checkForm(ES.selctorDoc(val).dom, 'red') !== '') {
          console.log(val.attr('redlabel'))
          val.find('.' + val.attr('redlabel')).addClass('redborder')
          val.find('.' + val.attr('redlabel')).after('<span class="required">' + Tool.checkForm(ES.selctorDoc(val).dom, 'red') + '</span>')
        }
      })
      // 校验
      const isOk = this.distrubution.validateCompanyli()
      if(!isOk) return

      if (this.dom.find('.redborder').dom && this.dom.find('.redborder').dom.some((item) => {
        return item.box().clientHeight !== 0
      })) {
        return false
      } else {
        this.app.loading.show()
        let res = await this.api.audit_task_update(this.apiData)
        this.app.loading.hide()
        if (res.code == 0) {
          this.app.session.clearAll()
          this.app.alert.show({
            title: " ",
            msg: '编辑成功',
            close: false
          })
        } else {
          this.errorshow(res.msg)
        }
      }
    })
  }
  async tUser_count() {
    let res = await this.api.user_count({ hasAudit: true, taskType: 2 })
    if (res.code == 0) {
      this.distrubution.setTotalNum(res.data.count)
    } else {
      this.errorshow(res.msg)
    }
  }
  async user_list(id, index) {
    let res = await this.api.user_list({ venderId: id * 1, taskType: 2 })
    res.data.list.forEach(v => {
      v.idx = v.id;
      v.val = v.name + '(' + v.mobile + ')'
    })
    this.distrubution.renderPeople(res.data.list, index)
  }
  async vendor_query(value, dom, render) {
    this.companydata = []
    let json = {}
    if (value) {
      json.name = value
    }
    if (dom) {
      dom.gsxlk.loading(true)
    }
    let res = await this.api.vendor_audit_query(json)
    if (res.code == 0) {
      res.data.list.forEach((val, idx) => {
        let obj = {
          idx: val.id,
          val: val.name
        }
        this.companydata.push(obj)
      })
      if (dom) {
        dom.gsxlk.loading(false)
        dom.setxlkvalue(this.companydata)
      } else {
        this.distrubution.setxlkvalue(this.companydata)
        if (render) {
          this.render()
        }
      }

    } else {
      this.errorshow(res.msg)
    }
  }

  //报错弹窗
  errorshow(msg) {
    this.app.alert.show({
      title: ' ',
      msg: msg,
      close: false
    })
  }

  //编辑查看时渲染页面
  async render() {
    let pagedata = {}
    let json = {
      id: this.taskid
    }
    this.app.loading.show()
    let res = await this.api.audit_task_read(json)
    this.app.loading.hide()
    if (res.code == 0) {
      pagedata = res.data;
    } else {
      this.errorshow(res.msg)
    }
    this.proname = pagedata.name
    this.model.setData('apiData', pagedata)
    this.distrubution.setData(res)
    if (this.type == 'view' || this.status !== 1) {
      this.dom.find('.apidata').attr('readonly', 'readonly')
      // this.dom.find('.icon-shanchu').remove();
      // this.dom.find('.icon-tianjia').remove();
      pagedata.method === 2 && this.dom.find('.save').remove() // 任务方式为开放式时不能编辑
      this.distrubution.disable();
      this.apiData.editTaskUser = true
    }
    this.app.session.clearAll()
  }
}

module.exports = createaudittask3;
