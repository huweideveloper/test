class createauditpro3 extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('auditproject')
    this.app.header.changeselected(3)
    this.type = this.app.parpam.type
    this.id = this.app.parpam.projectid*1
    this.status = parseInt(this.app.parpam.status)
    this.styleModel(1)
    this.loadmodules();
    this.resize()
    this.render()
    this.eventAdd()
    this.initscroll();
  }

  loadmodules() {
    require.ensure('../moduleslibs/inputarea/inputarea.js', () => {
      let inputarea1 = require('../moduleslibs/inputarea/inputarea.js')
      this.inputarea = this.app.loadModule(inputarea1, this.dom.find('.project'), {type: 1})
      this.inputarea.event._addEvent('inputarea.input', async (value) => {
        this.inputarea.loading(true)
        let res = await this.api.matchrate_query({auditProjectId: this.id, name: value, type: 0})
        this.inputarea.loading(false)
        if (res.code == 0) {
          res.data.list.forEach((val, idx) => {
            val.id = val.id;
            val.name = val.name
          })
          res.data.list = res.data.list.filter((item) => {
            return JSON.stringify(this.model.projectIdList).lastIndexOf(item.id) == -1
          })
          this.inputarea.setlist(res.data.list)
        } else {
          this.errorshow(res.msg)
        }
      })
      this.inputarea.event._addEvent('inputarea.focus', async (value) => {
        this.inputarea.loading(true)
        let res = await this.api.matchrate_query({auditProjectId: this.id, name: '', type: 0})
        this.inputarea.loading(false)
        if (res.code == 0) {
          res.data.list.forEach(function (val, idx) {
            val.id = val.id;
            val.name = val.name
          })
          res.data.list = res.data.list.filter((item) => {
            return JSON.stringify(this.model.projectIdList).lastIndexOf(item.id) == -1
          })
          this.inputarea.setlist(res.data.list)
        } else {
          this.errorshow(res.msg)
        }
      })
      this.inputarea.event._addEvent('inputarea.maxnum', (value) => {
        this.errorshow('最多可添加10个项目名称')
      })
      this.inputarea.event._addEvent('inputarea.createitem', async (value) => {
        if (JSON.stringify(this.model.projectIdList).lastIndexOf(value) == -1) {
          this.app.loading.show()
          let res = await this.api.import_project_edit({
            auditProjectId: this.id,
            importProjectId: parseInt(value),
            action: 1
          })
          this.app.loading.hide()
          if (res.code == 0) {
            if (this.status == 2) {
              this.dom.find('.contentarea .icon-guanbi').remove()
            }
            this.model.projectIdList.push(parseInt(value))
            ES.selctorDoc('.inputarea .mask').click()
          } else {
            this.errorshow(res.msg)
            this.dom.find('.chooseditem').eq(-1).remove()
          }
        }
      })
      this.inputarea.event._addEvent('inputarea.deleteitem', (value) => {
        this.app.alert.show({
          title: ' ',
          msg: '该项目在审核源中可能存在已添加的任务，是否确认删除？确认删除，对应已添加的任务将被清除',
          close: true,
          sure: async () => {
            this.app.loading.show()
            let res = await this.api.import_project_edit({
              auditProjectId: this.id,
              importProjectId: parseInt(value.id),
              action: 3
            })
            this.app.loading.hide()
            if (res.code == 0) {
              this.model.projectIdList = this.model.projectIdList.filter((item) => {
                return item !== parseInt(value.id)
              })
              this.inputarea.removedom(value.dom)
              ES.selctorDoc('.inputarea .mask').click()
              this.render()
            } else {
              this.errorshow(res.msg)
            }
          }
        })
      })
    })
  }

  eventAdd() {
    let that = this
    this.dom.find('.linkarea .viewbig').on('click', function () {
      that.showcomplist('big')
    })
    this.dom.find('.linkarea .viewsmall').on('click', function () {
      that.showcomplist('small')
    })
    this.dom.find('.auditsource .icon-tianjia').on('click', function () {
      that.showauditsource()
    })
  }

  async showcomplist(value) {
    let config = {}
    this.app.loading.show()
    switch (value) {
      case 'big':
        let res = await this.api.addable_series_query({projectIdList: this.model.projectIdList})
        this.app.loading.hide()
        if (res.code == 0) {
          if (res.data.seriesFormComponentList.length > 0) {
            config = {
              title: '查看序列征象',
              data: res.data.seriesFormComponentList
            }
            this.showcomplistmodal(config)
          } else {
            this.errorshow('暂无数据，请重新配置')
          }
        }else {
          Tool.errorshow(res.msg,this.app)
        }
        break;
      case 'small':
        let images = await this.api.addable_image_query({
          auditProjectId: this.id,
          projectIdList: this.model.projectIdList
        })
        this.app.loading.hide()
        if (images.code == 0) {
          if (images.data.imageAnnoList.length > 0) {
            config = {
              title: '查看影像征象',
              menudata: {},
              type: 'project'
            }
            images.data.imageAnnoList.forEach((item, idx) => {
              item.imageType = Tool.configobjformat(this.app.constmap['LESION'])[item.imageType]
              Tool.configxlkformat(this.app.constmap['TOOL_TYPE']).forEach((val) => {
                if (val.idx == item.imageToolType) {
                  item.imageToolType = val.val
                }
              })
              let obj = {
                name: item.imageType + ' ' + item.imageToolType,
                data: item.seriesFormComponentList
              }
              config.menudata[idx] = obj
            })
            this.showcomplistmodal(config)
          } else {
            this.errorshow('暂无数据，请重新配置')
          }
        }else {
          Tool.errorshow(images.msg,this.app)
        }
        break;

    }

  }

  showcomplistmodal(config) {
    let complist = require("../modal/showcomplist/showcomplist")
    let showcomplist = this.app.loadModal(complist, {adv: true}, {config: config})
    showcomplist.event._addEvent('showcomplist.choosecomp', async (value) => {
      this.app.loading.show()
      let json = {
        id: value.id
      }
      let res = await this.api.formComponent_read(json)
      this.app.loading.hide()
      if (res.code == 0) {
        let showcomponent = require("../modal/createcomponent/createcomponent")
        this.app.loadModal(showcomponent, {adv: true}, {type: 'view', data: res.data})
      }else {
        Tool.errorshow(res.msg,this.app)
      }
    })
  }

  showauditsource() {
    let auditsource = require("../modal/addauditsource/addauditsource")
    let temp = []
    this.addauditsource = this.app.loadModal(auditsource, {adv: true}, {chooseddata: this.model.apiData.importTaskProjectList})
    this.addauditsource.event._addEvent('addauditsource.search', (value) => {
      value.auditProjectId = this.id;
      value.queryType = 1;
      this.task_source_query(value)
    })
    this.addauditsource.event._addEvent('addauditsource.adddata', async (value) => {
      this.app.loading.show()
      let res = await this.api.import_task_edit({auditProjectId: this.id, taskIdList: value.data, action: 1})
      this.app.loading.hide()
      if (res.code == 0) {
        this.addauditsource.close();
        this.setsourcelist(value.list)
        this.model.apiData.importTaskProjectList = value.list
      } else {
        this.errorshow(res.msg)
      }
    })
    this.task_source_query({auditProjectId: this.id, queryType: 1});
    this.matchrate_query('')
  }

  async matchrate_query(value) {
    if (this.addauditsource.xmmc) {
      this.addauditsource.xmmc.loading(true)
    }
    let res = await this.api.matchrate_query({auditProjectId: this.id, name: value, type: 1})
    this.addauditsource.xmmc.loading(false)
    if (res.code == 0) {
      res.data.list.forEach(function (val, idx) {
        val.idx = val.id;
        val.val = val.name
      })
      this.addauditsource.setxlk(res.data.list)
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  setsourcelist(value) {
    let that = this;
    this.dom.find('.tasklist').html('')
    value.forEach((val, idx) => {
      this.dom.find('.tasklist').append('<li data-id="' + val.taskId + '"><span class="taskname" title="' + val.taskName + '">' + val.taskName + '</span><i class="iconfont icon-shanchu"></i><span class="seriesnum">' + val.submitSeriesTotalNum + '</span><span>个已提交序列</span></li>')
    })
    this.initscroll()
    this.dom.find('.tasklist .icon-shanchu').on('click', async function(){
      that.app.loading.show();
      let res = await that.api.import_task_edit({
        auditProjectId: that.id,
        taskIdList: [ES.selctorDoc(this).parent().attr('data-id')],
        action: 3
      })
      that.app.loading.hide();
      if (res.code == 0) {
        that.model.apiData.importTaskProjectList = that.model.apiData.importTaskProjectList.filter((item) => {
          return parseInt(item.taskId) !== parseInt(ES.selctorDoc(this).parent().attr('data-id'))
        })
        ES.selctorDoc(this).parent().remove()
        that.initscroll()
      } else {
        that.errorshow(res.msg)
      }
    })
  }

  async task_source_query(value) {
    this.app.loading.show();
    let res = await this.api.task_source_query(value)
    this.app.loading.hide();
    if (res.code == 0) {
      this.addauditsource.setMain(res)
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  async render() {
    let pagedata = {}
    let json = {
      auditProjectId: this.id
    }
    this.app.loading.show();
    let res = await this.api.auditproject_read(json)
      this.app.loading.hide();
      if (res.code == 0) {
        pagedata = res.data;
        this.proname = pagedata.name
        this.model.setData('apiData', pagedata)
        if (pagedata.importProjectList) {
          this.model.projectIdList = []
          this.dom.find('.chooseditem').remove()
          pagedata.importProjectList.forEach((val) => {
            this.inputarea.createlabel(val.name, val.id, 'no')
            this.model.projectIdList.push(val.id)
          })
        }
        if (pagedata.importTaskProjectList) {
          this.setsourcelist(pagedata.importTaskProjectList)
        }
      } else {
        this.errorshow(res.msg)
      }
      this.app.session.clearAll()
      if (this.type == 'view' || this.status == 2) {
        // this.dom.find('.auditsource .icon-tianjia').remove()
        this.dom.find('.tasklist .icon-shanchu').remove()
        this.dom.find('.contentarea .icon-guanbi').remove()
      }
      if (this.type == 'view') {
        this.inputarea.disable()
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

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 40
    ES.selctorDoc('.createauditpro3').css({'height': ch, 'width': cw});
    this.initscroll();
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.createauditpro3').attr('id', rid)
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

module.exports = createauditpro3;
