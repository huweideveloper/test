class createaudittask2 extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('audittask')
    this.app.header.changeselected(2)
    this.styleModel(1)
    this.type = this.app.parpam.type
    this.projectid = this.app.parpam.projectid*1
    this.taskid = parseInt(this.app.parpam.taskid)
    this.status = parseInt(this.app.parpam.status)
    if (this.type == 'view' || this.status !== 1) {
      this.disabled = true
    } else {
      this.disabled = false
    }
    this.audit_project_matchrate_query('')
    this.audit_task_series_count()
    this.audit_task_getLastCountSeriesNumResult()
    this.loadmodules();
    this.resize()
    this.eventAdd()
    this.render()
    this.initscroll();
  }

  loadmodules() {
    this.auditseries = require("../modal/auditseries/auditseries")
  }

  eventAdd() {
    let that = this;
    //添加大征象
    this.dom.find('.auditcomset .bigset').on('click', () => {
      that.showcomplist('big')
    })
    //添加小征象
    this.dom.find('.auditcomset .smallset').on('click', () => {
      that.showcomplist('small')
    })
    //添加聚合组件
    this.dom.find('.component .composet').on('click', () => {
      that.showcomplist('match')
    })
    //添加审核源
    this.dom.find('.auditsource .icon-tianjia').on('click', () => {
      that.showauditsource({pro: that.projectlist})
    })
    this.dom.find('.hasYay .check-box').on('click', async function() {
      let dom = ES.selctorDoc(this)
      if(!dom.hasClass('choose')){
        dom.addClass('choose')
      }else{
        dom.removeClass('choose')
      }
      console.log(dom.hasClass('choose'),'dom.hasClass(\'choose\')')
      let res = await that.api.audit_task_addYay({
        taskId:that.taskid,
        hasYay:dom.hasClass('choose')*1
      })
      if(res.code == 0){

      }else {
        Tool.errorshow(res.msg,that.app)
      }
    })
    //添加序列
    this.dom.find('.addseries').on('click', () => {
      that.auditsourcearr = []
      that.auditsourceidarr = []
      if (that.dom.find('.tasklist li').dom) {
        that.dom.find('.tasklist li').dom.forEach((val) => {
          let obj = {
            id: val.attr('data-id'),
            name: val.find('span').html()
          }
          that.auditsourcearr.push(obj)
          that.auditsourceidarr.push(parseInt(val.attr('data-id')))
        })
      }
      that.addseries = that.app.loadModal(that.auditseries, {adv: true}, {
        type: 'add',
        config: that.auditsourcearr,
        id: that.taskid
      })
      that.addseries.event._addEvent('auditseries.addtask', () => {
        that.showauditsource({
          title: '添加任务名称',
          pro: this.projectlist
        }, 1)
        // that.showauditsource.event._addEvent('addauditsource.adddata',function (res) {
        //     that.addseries.tasklist(res.list)
        // })
      })
      that.addseries.event._addEvent('auditseries.deletetask', (value) => {
        this.model.temptask = this.model.temptask.filter((item) => {
          return item.taskId !== parseInt(value)
        })
      })
      this.addseries.event._addEvent('auditseries.search', (value) => {
        this.searchseries(value, true)
      })
      this.addseries.event._addEvent('auditseries.pagenumber', (value) => {
        this.searchseries(value, false)
      })
      this.addseries.event._addEvent('auditseries.pagesize', (value) => {
        this.searchseries(value, true)
      })
      this.addseries.event._addEvent('auditseries.datachange', (value) => {
        this.audit_task_series_count()
      })
      this.addseries.event._addEvent('auditseries.close', (value) => {
        this.model.temptask = []
      })
      this.addseries.event._addEvent('auditseries.addall', async (value) => {
        let json = {
          taskId: this.taskid,
          currentSearchReqId: value.currentSearchReqId,
          condition: value.condition
        }
        if (value.randomAddNum) {
          json.randomAddNum = value.randomAddNum
        }
        this.app.loading.show()
        let res = await this.api.audit_task_series_update(json)
        this.app.loading.hide()
        if (res.code == 0) {
          this.addseries.close()
          this.audit_task_series_count()
        } else {
          this.errorshow(res.msg)
        }
      })
      this.audit_project_series_search({
        taskId: this.taskid,
        page: 1,
        pageSize: 10,
        condition: {existTaskIdList: this.auditsourceidarr}
      }, true);
    })
    //查看序列
    this.dom.find('.viewseries').on('click', async () => {
      let viewseries = this.app.loadModal(this.auditseries, {adv: true}, {
        type: 'view',
        candel: true,
        disabled: this.disabled
      })
      viewseries.event._addEvent('auditseries.search', async (value) => {
        this.app.loading.show()
        let res = await this.api.audit_task_series_search({
          taskId: this.taskid,
          page: 1,
          pageSize: 10,
          condition: value.data
        })
        this.app.loading.hide()
        if (res.code == 0) {
          viewseries.setMain(res, true)
        } else {
          this.errorshow(res.msg)
        }
      })
      viewseries.event._addEvent('auditseries.pagenumber', async (value) => {
        this.app.loading.show()
        let res = await this.api.audit_task_series_search({
          taskId: this.taskid,
          page: value.data.page,
          pageSize: value.data.pageSize,
          condition: value.data
        })
        this.app.loading.hide()
        if (res.code == 0) {
          viewseries.setMain(res, false)
        } else {
          this.errorshow(res.msg)
        }
      })
      viewseries.event._addEvent('auditseries.pagesize', async (value) => {
        this.app.loading.show()
        let res = await this.api.audit_task_series_search({
          taskId: this.taskid,
          page: value.data.page,
          pageSize: value.data.pageSize,
          condition: value.data
        })
        this.app.loading.hide()
        if (res.code == 0) {
          viewseries.setMain(res, true)
        } else {
          this.errorshow(res.msg)
        }
      })
      viewseries.event._addEvent('auditseries.delall', async (value) => {
        this.app.loading.show()
        let res = await this.api.audit_task_series_search_result_remove({
          taskId: this.taskid,
          condition: value.data
        })
        this.app.loading.hide()
        if (res.code == 0) {
          this.audit_task_series_count()
        } else {
          this.errorshow(res.msg)
        }
      })
      viewseries.event._addEvent('auditseries.exportres', (value) => {
        delete value.condition.page
        delete value.condition.pageSize
        delete value.condition.taskIdList
        let json = {
          taskId: this.taskid,
          condition: value.condition
        }
        let url = this.app.domain1 + 'v1/audit/task/series/search/result/export?param=' + encodeURI(JSON.stringify(json));
        Tool.downfile(url, this.app)
      })
      this.app.loading.show()
      let res = await this.api.audit_task_series_search({taskId: that.taskid, page: 1, pageSize: 10})
      this.app.loading.hide()
      if (res.code == 0) {
        viewseries.setMain(res, true)
      } else {
        this.errorshow(res.msg)
      }
    })
    //部分审核
    this.dom.find('.choosePart .check-box').on('click', async function() {
      let dom = ES.selctorDoc(this)
      if(!dom.hasClass('choose')){
        dom.addClass('choose')
        that.dom.find('.partConfig').removeClass('hide')
      }else{
        let res = await that.api.audit_task_auditinfo_savePickCondition({
          taskId:that.taskid,
          pickPercent:0,
          pickType:0
        })
        if(res.code == 0){
          dom.removeClass('choose')
          that.dom.find('.pickPercent').val('')
          that.dom.find('.partType .choose').removeClass('choose')
          that.dom.find('.partConfig').addClass('hide')
        }else {
          Tool.errorshow(res.msg,that.app)
        }
      }
    })
    this.dom.find('.pickPercent').on('blur',async function () {
      console.log(ES.selctorDoc(this).val(),/^([1-9]{1}[0-9]?)|100$/.test(ES.selctorDoc(this).val()))
      if(/^([1-9]{1}[0-9]?|100)$/.test(ES.selctorDoc(this).val())){
        that.dom.find('.required').addClass('hide')
        if(that.dom.find('.partType .choose').dom){
          let res = await that.api.audit_task_auditinfo_savePickCondition({
            taskId:that.taskid,
            pickPercent:ES.selctorDoc(this).val()*1,
            pickType:that.dom.find('.partType .choose').parent().attr('data-id')*1
          })
          if(res.code == 0){

          }else {
            Tool.errorshow(res.msg,that.app)
          }
        }
      }else{
        ES.selctorDoc(this).val('')
        that.dom.find('.required').removeClass('hide')
      }

    })
    this.dom.find('.partType .radio-box').on('click',async function () {
      let dom = ES.selctorDoc(this)
      if(dom.hasClass('choose')){
        // dom.removeClass('choose')
      }else{
        that.dom.find('.partType .choose').removeClass('choose')
        dom.addClass('choose')
        console.log(that.dom.find('.pickPercent').val(),'val')
        if(that.dom.find('.pickPercent').val()){
          console.log(dom.parent().attr('data-id'),'id')
          let res = await that.api.audit_task_auditinfo_savePickCondition({
            taskId:that.taskid,
            pickPercent:that.dom.find('.pickPercent').val()*1,
            pickType:dom.parent().attr('data-id')*1
          })
          if(res.code == 0){

          }else {
            Tool.errorshow(res.msg,that.app)
          }
        }
      }
    })
    //选择数据匹配方式
    this.dom.find('.component .radio-box').on('click', async function(){
      let dom = ES.selctorDoc(this)

      that.app.loading.show()
      let res = await that.api.audit_task_series_annoitem_create({
        id: that.taskid,
        clusterType: ES.selctorDoc(this).parent().attr('data-id'),
        annotationItemIdList: []
      })
      that.app.loading.hide()
      if (res.code == 0) {
        that.model.apiData.clusterType = dom.parent().attr('data-id')
        that.dom.find('.component .choose').removeClass('choose')
        dom.addClass('choose')
        if (ES.selctorDoc(this).hasClass('special')) {
          that.dom.find('.composet').removeClass('hide')
        } else {
          that.dom.find('.composet').addClass('hide')
        }
      } else {
        that.errorshow(res.msg)
      }
    })
    //选择审核集
    this.dom.find('.choosetype p .radio-box').on('click', async function (){
      that.dom.find('.choosetype .choose').removeClass('choose')
      ES.selctorDoc(this).addClass('choose')
      that.app.loading.show()
      let res = await that.api.audit_task_auditinfo_update({
        taskId: that.taskid,
        auditChoose: ES.selctorDoc(this).parent().attr('data-id')
      })
      that.app.loading.hide()
      if (res.code == 0) {

      } else {
        that.errorshow(res.msg)
      }
    })
    //计算序列
    this.dom.find('.calculation').on('click', async () => {
      let res = await this.api.audit_task_series_needaudit_count({id: this.taskid,submitTime:new Date().getTime()})
      if (res.code == 0) {
        let msg = ''
        switch (res.data.status) {
          case 1:
            msg = `已开始计算，请等待计算结果`
            break
          case 2:
            msg = `计算成功，共有${res.data.seriesNum}个序列符合并参与本次审核,其中包括${res.data.discardCount}例废片。`
            break
          case 3:
            msg = `计算失败，需要重新计算吗？`
            break
        }
        this.dom.find('.seriescount').html(msg);
      } else {
        this.errorshow(res.msg)
      }
    })
  }

  searchseries(value, bool) {
    let temp = {}
    if (value.data.exist !== undefined && value.data.exist !== '') {
      temp = {
        exist: value.data.exist,
        taskIdList: value.data.taskIdList
      }
    }
    let data = {
      taskId: this.taskid,
      page: value.data.page,
      pageSize: value.data.pageSize,
      condition: {existTaskIdList: this.auditsourceidarr, seriesUseCondition: temp}
    }
    if (JSON.stringify(temp) == '{}') {
      delete data.condition.seriesUseCondition
    }
    this.audit_project_series_search(data, bool)
  }
//查询参与审核的序列数量计算结果
  async audit_task_getLastCountSeriesNumResult(){
    let res = await this.api.audit_task_getLastCountSeriesNumResult({id:this.taskid})
    if (res.code == 0) {
      let msg = ''
      switch (res.data.status) {
        case 1:
          msg = `已开始计算，请等待计算结果`
          break
        case 2:
          msg = `计算成功，共有${res.data.seriesNum}个序列符合并参与本次审核,其中包括${res.data.discardCount}例废片。`
          break
        case 3:
          msg = `计算失败，需要重新计算吗？`
          break
      }
      this.dom.find('.seriescount').html(msg);
    } else {
      this.errorshow(res.msg)
    }
  }

  //查找项目下序列全集
  async audit_project_series_search(value, changePage) {
    this.app.loading.show()
    let res = await this.api.audit_project_series_search(value)
    this.app.loading.hide()
    if (res.code == 0) {
      this.addseries.setMain(res, changePage)
    } else {
      this.errorshow(res.msg)
    }
  }

  //查找该审核项目下包含的所有项目
  async audit_project_matchrate_query(value) {
    if (this.addauditsource && this.addauditsource.xmmc) {
      this.addauditsource.xmmc.loading(true)
    }
    let res = await this.api.audit_project_matchrate_query({auditProjectId: this.projectid, name: value, type: 1})
    if (this.addauditsource && this.addauditsource.xmmc) {
      this.addauditsource.xmmc.loading(false)
    }
    if (res.code == 0) {
      res.data.list.forEach(function (val, idx) {
        val.idx = val.id;
        val.val = val.name
      })
      this.projectlist = res.data.list
      if (this.addauditsource) {
        this.addauditsource.setxlk(res.data.list)
      }
    } else {
      this.errorshow(res.msg)
    }
  }

  //查询聚合/审核组件
  async showcomplist(value) {
    let config = {}
    this.app.loading.show()
    switch (value) {
      case 'match':
        let res = await this.api.audit_task_series_annoitem_list({id: this.taskid, cluster: true})
        this.app.loading.hide()
        if (res.code == 0) {
          if (res.data.list.length > 0) {
            let temp = []
            res.data.list.forEach(function (val, idx) {
              let obj = {
                id: val.annotationItemId,
                name: val.formComponentName,
                selected: val.selected,
                formid: val.formComponentId
              }
              temp.push(obj)
            })
            config = {
              title: '请选择一致匹配项',
              data: temp,
              check: true,
              disable: (this.type == 'view' || this.status == 2) ? true : false
            }
          } else {
            this.errorshow('无可聚合的组件，请先设置审核组件')
            return
          }
          this.showcompo(config, value)
        } else {
          this.errorshow(res.msg)
        }
        break;
      case 'big':
        let seriesAnnoitem = await this.api.audit_task_series_annoitem_list({id: this.taskid, cluster: false})
        this.app.loading.hide()
        if (seriesAnnoitem.code == 0) {
          // if (seriesAnnoitem.data.list.length > 0) {
            let temp = []
            seriesAnnoitem.data.list.forEach((val) => {
              let obj = {
                id: val.annotationItemId,
                name: val.formComponentName,
                selected: val.selected,
                formid: val.formComponentId
              }
              temp.push(obj)
            })
            config = {
              title: '序列征象设置',
              data: temp,
              check: true,
              disable: (this.type == 'view' || this.status == 2) ? true : false
            }
            console.log(config, 'config')
            this.showcompo(config, value, seriesAnnoitem.data.remark)
          // } else {
          //   this.errorshow('无可设置的组件，请在审核项目中重新配置')
          //   return
          // }
        } else {
          this.errorshow(res.msg)
        }
        break;
      case 'small':
        let imageAnnoitem = await this.api.audit_task_image_annoitem_list({id: this.taskid})
        this.app.loading.hide()
        if (imageAnnoitem.code == 0) {
          if (imageAnnoitem.data.list.length > 0) {
            let temp = {}
            imageAnnoitem.data.list.forEach((val) => {
              let data = []
              val.itemList.forEach((item) => {
                let obj1 = {
                  id: item.annotationItemId,
                  name: item.formComponentName,
                  selected: item.selected,
                  formid: item.formComponentId
                }
                data.push(obj1)
              })
              val.imageAnnotationType = Tool.configobjformat(this.app.constmap['LESION'])[val.imageAnnotationType]
              let temp1=''
              Tool.configxlkformat(this.app.constmap['TOOL_TYPE']).forEach(function (val1) {
                val.toolTypeList.forEach((item)=>{
                  if (val1.idx == item) {
                    temp1 += val1.val
                  }
                })
              })
              let obj = {
                name: val.imageAnnotationType + '   (' + temp1 + ')',
                data: data,
                selected: val.selected
              }
              temp[val.imageAnnotationId] = obj
            })
            config = {
              title: '影像征象设置',
              menudata: temp,
              check: true,
              disable: (this.type == 'view' || this.status == 2) ? true : false
            }
            this.showcompo(config, value, imageAnnoitem.data.remark)
          } else {
            this.errorshow('无可设置的组件，请在审核项目中重新配置')
            return
          }
        } else {
          this.errorshow(res.msg)
        }
    }
  }

  //显示组件弹窗
  showcompo(config, value ,remark) {
    let complist = require("../modal/showcomplist/showcomplist")
    let showcomplist = this.app.loadModal(complist, {adv: true}, {config: config,type:remark!==undefined?'audittask':'match',remark:remark})
    showcomplist.event._addEvent('showcomplist.choosecomp', async (value) => {
      let json = {
        id: value.id
      }
      this.app.loading.show()
      let res = await this.api.formComponent_read(json)
        this.app.loading.hide()
        if (res.code == 0) {
          let showcomponent = require("../modal/createcomponent/createcomponent")
          this.app.loadModal(showcomponent, {adv: true}, {type: 'view', data: res.data})
        } else {
          this.errorshow(res.msg)
        }
    })
    showcomplist.event._addEvent('showcomplist.datachange', async (v) => {
      this.app.loading.show()
      switch (value) {
        case 'match':
          let res = await this.api.audit_task_series_annoitem_create({
            id: this.taskid,
            clusterType: this.model.apiData.clusterType,
            annotationItemIdList: v
          })
          this.app.loading.hide()
          if (res.code == 0) {

          } else {
            this.errorshow(res.msg)
          }
          break;
        case 'big':
          let createSeriesAnno = await this.api.audit_task_series_annoitem_create({
            id: this.taskid,
            annotationItemIdList: v
          })
          this.app.loading.hide()
          if (createSeriesAnno.code == 0) {

          } else {
            this.errorshow(createSeriesAnno.msg)
          }
          break;
        case 'small':
          let createImageAnno = await this.api.audit_task_image_annoitem_create({id: this.taskid, list: v})
          this.app.loading.hide()
          if (createImageAnno.code == 0) {

          } else {
            this.errorshow(createImageAnno.msg)
          }
          break;
      }
    })
    showcomplist.event._addEvent('showcomplist.remark',async (v)=>{
      console.log(v,value,config)
      let json={taskId:this.taskid,remark:v.remark*1}
      switch (value) {
        case 'big':
          json.type  = 1
          break;
        case 'small':
          json.type  = 2
          break;
      }
      let res = await this.api.audit_task_addRemarkType(json)
      if(res.code == 0){

      }else{
        this.errorshow(res.msg)
      }
    })
  }

  //添加审核源弹窗（当addtask为1时，为添加任务名称弹窗）
  showauditsource(config, addtask) {
    let auditsource = require("../modal/addauditsource/addauditsource")
    this.addauditsource = this.app.loadModal(auditsource, {adv: true}, {
      config: config,
      chooseddata: addtask ? this.model.temptask : this.model.apiData.joinTaskList,
      projectList: this.projectlist
    })
    this.addauditsource.event._addEvent('addauditsource.search', (value) => {
      value.auditProjectId = this.projectid;
      value.queryType = 2;
      this.task_source_query(value)
    })
    this.addauditsource.event._addEvent('addauditsource.adddata', async (value) => {
      if (addtask) {
        this.addauditsource.close()
        this.addseries.tasklist(value.list)
        this.model.temptask = value.list
      } else {
        this.app.loading.show()
        let res = await this.api.task_source_import({id: this.taskid, joinTaskIdList: value.data})
        this.app.loading.hide()
        if (res.code == 0) {
          this.addauditsource.close()
          this.render()
        } else {
          this.errorshow(res.msg)
        }
      }
    })
    this.task_source_query({auditProjectId: this.projectid, queryType: addtask ? addtask : 2});
  }

  //已添加审核源列表
  addedsource(value) {
    let that = this;
    let html = ''
    value.forEach(function (val, idx) {
      val.id = val.id ? val.id : val.taskId
      val.name = val.name ? val.name : val.taskName
      html += '<li data-id=' + val.id + '>\n' +
        '                    <span>' + val.name + '</span>\n' +
        '                    <i class="iconfont icon-shanchu"></i>\n' +
        '                </li>'
    })
    this.dom.find('.auditsource .tasklist').html('')
    this.dom.find('.auditsource .tasklist').append(html)
    this.initscroll()
    this.dom.find('.auditsource .tasklist i').off('click');
    this.dom.find('.auditsource .tasklist i').on('click', async function(){
      let dom = ES.selctorDoc(this)
      if (that.dom.find('.viewseries').hasClass('hide')) {
        that.app.loading.show()
        let res = await that.api.task_source_remove({id: that.taskid, joinTaskId: dom.parent().attr('data-id')})
        that.app.loading.hide()
        if (res.code == 0) {
          that.model.apiData.joinTaskList = that.model.apiData.joinTaskList.filter((item) => {
            return parseInt(item.id) !== parseInt(dom.parent().attr('data-id'))
          })
          dom.parent().remove()
          that.audit_task_series_count();
        } else {
          that.errorshow(res.msg)
        }
        return;
      }
      that.app.alert.show({
        title: ' ',
        msg: '删除审核任务源，已添加的序列会被清空，是否继续操作',
        close: true,
        sure: async () => {
          that.app.loading.show()
          let res = await that.api.task_source_remove({id: that.taskid, joinTaskId: dom.parent().attr('data-id')})
          that.app.loading.hide()
          if (res.code == 0) {
            that.model.apiData.joinTaskList = that.model.apiData.joinTaskList.filter((item) => {
              return parseInt(item.id) !== parseInt(dom.parent().attr('data-id'))
            })
            dom.parent().remove()
            that.audit_task_series_count();
          } else {
            that.errorshow(res.msg)
          }
        }
      })
      that.initscroll()

    });
  }

  //审核源列表
  async task_source_query(value) {
    this.app.loading.show()
    let res = await this.api.task_source_query(value)
    this.app.loading.hide()
    if (res.code == 0) {
      this.addauditsource.setMain(res)
    } else {
      this.errorshow(res.msg)
    }
  }

  //查询审核任务下已引用的序列数量
  async audit_task_series_count() {
    let res = await this.api.audit_task_series_count({taskId: this.taskid})
    if (res.code == 0) {
      if (res.data.count > 0) {
        this.dom.find('.viewseries').removeClass('hide')
      } else {
        this.dom.find('.viewseries').addClass('hide')
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
    if (pagedata.clusterType) {
      this.dom.find('.matchset .component[data-id="' + pagedata.clusterType + '"]').find('.radio-box').addClass('choose')
      if (pagedata.clusterType == 1) {
        this.dom.find('.composet').removeClass('hide')
      }
    }
    if (pagedata.joinTaskList.length > 0) {
      this.addedsource(pagedata.joinTaskList)
    }
    if (pagedata.auditChoose) {
      this.dom.find('.choosetype p[data-id="' + pagedata.auditChoose + '"]').find('.radio-box').addClass('choose')
    }
    if (pagedata.hasYay) {
      this.dom.find('.hasYay .check-box').addClass('choose')
    }
    if(pagedata.pickType&&pagedata.pickType!==0){
      this.dom.find('.choosePart .check-box').click()
      this.dom.find('.pickPercent').val(pagedata.pickPercent)
      this.dom.find('.partType p[data-id="'+pagedata.pickType+'"').find('.radio-box').addClass('choose')
    }
    if (this.disabled) {
      this.dom.find('.radio-box').off("click")
      this.dom.find('.check-box').off("click")
      this.dom.find('input').attr('disabled','disabled')
      this.dom.find('.addseries').remove()
      this.dom.find('.icon-shanchu').remove();
      this.dom.find('.icon-tianjia').remove();
    }
    if (this.status !== 1) {
      this.dom.find('.calculation').remove()
    }
    this.initscroll()
    this.app.session.clearAll()
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 40
    ES.selctorDoc('.createaudittask2').css({'height': ch, 'width': cw});
    this.initscroll();
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.createaudittask2').attr('id', rid)
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

module.exports = createaudittask2;
