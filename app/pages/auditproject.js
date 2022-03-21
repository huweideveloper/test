class auditproject extends DataBase {
  complete() {
    const app = this.app
    // vue相关
    new Vue({
      el: '#btnareaContainer',
      methods: {
        handleCreateProject(type) {
          app.changePage(type === 'C' ? 'createauditproc1' : 'createauditpro1', { type: 'new' })
        }
      }
    })

    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="auditproject"]')
        .parent()
        .attr('id')
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case 'CREATE':
            // this.dom.find('.btnarea').append('<a class="createbtn strokeBtn">' + v.name + '</a>')
            this.dom.find('.create-audipro-btn').removeClass('hide')
            break
          case 'START':
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case 'STOP':
            this.model.listicon.action1.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case 'VIEW_SERIES':
            this.model.listicon.action1.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          case 'EXPORT':
            this.model.listicon.action1.config.content.push({
              text: v.name,
              key: v.type
            })
            break
          default:
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action1.config.content.push({
              text: v.name,
              key: v.type
            })
            this.model.listicon.action2.config.content.push({
              text: v.name,
              key: v.type
            })
            break
        }
      })
    }
    this.changeAll(this.model.condition)
    this.resize()
    this.model.tableconfig.tablewidth = ES.selctorDoc('.auditproject').box().clientWidth - 240
    this.dom.find('.createbtn').on('click', () => {
      this.app.changePage('createauditproc1', { type: 'new' })
    })
    this.loadlist('group')
    this.dom.find('.searchbtn').on('click', () => {
      this.model.condition.forEach((val, idx) => {
        this.model.apiData[val[0].name] = this.getfiltercondition()[val[0].name].toString() == '' ? null : this.getfiltercondition()[val[0].name].toString()
      })
      this.model.apiData.page = 1
      this.search(true)
    })
  }
  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.audit_project_search(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val, idx) => {
          for (let i in val) {
            val[i] = val[i] == null ? '' : val[i]
          }
          let temp = val.quotedByAuditTask ? 2 : 1
          let obj = {
            id: val.id + ',' + temp + ',' + val.taskCount
          }
          switch (val.status) {
            case 1:
              val.status = '未启用'
              obj.operation = this.model.listicon.action
              break
            case 2:
              val.status = '已启用'
              if (val.auditProjectJoinHisCount > 0) {
                obj.operation = this.model.listicon.action1
              } else {
                obj.operation = this.model.listicon.action2
              }
              break
          }
          data2.push(obj)
          if (val.createTime) val.createTime = Tool.time(val.createTime, 'yyyy-mm-dd')
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
    this.initscroll('scrolltable')
  }
  async listaction(value) {
    switch (value.classname) {
      case 'READ':
        window.open( window.location.origin + '/#!/createauditpro1/view/' + value.id.split(',')[0])
        // this.app.changePage('createauditpro1',{type:'view',projectid:value.id.split(',')[0]})
        break
      case 'EDIT':
        window.open( window.location.origin + '/#!/createauditpro1/edit/' + value.id.split(',')[0] + '/' + value.id.split(',')[1])
        // this.app.changePage('createauditpro1',{type:'edit',projectid:value.id.split(',')[0],status:value.id.split(',')[1]})
        break
      case 'STOP':
        this.app.alert.show({
          title: ' ',
          msg: '确定暂停？',
          close: true,
          sure: async () => {
            this.app.loading.show()
            let res = await this.api.project_status_update({
              auditProjectId: value.id.split(',')[0],
              status: 1
            })
            this.app.loading.hide()
            if (res.code == 0) {
              this.model.apiData.page = 1
              this.search(true)
            } else {
              this.errorshow(res.msg)
            }
          }
        })
        break
      case 'COPY':
        this.app.alert.show({
          title: ' ',
          msg: '确认复制吗？',
          close: true,
          sure: async () => {
            this.app.loading.show()
            let res = await this.api.audit_project_clone({
              auditProjectId: value.id.split(',')[0]
            })
            this.app.loading.hide()
            if (res.code == 0) {
              this.model.apiData.page = 1
              this.search(true)
            } else {
              this.errorshow(res.msg)
            }
          }
        })
        break
      case 'START':
        this.app.loading.show()
        let startRes = await this.api.project_status_update({
          auditProjectId: value.id.split(',')[0],
          status: 2
        })
        this.app.loading.hide()
        if (startRes.code == 0) {
          this.model.apiData.page = 1
          this.search(true)
        } else {
          this.errorshow(startRes.msg)
        }
        break
      case 'VIEW_SERIES':
        let url1 =  window.location.origin + '/#!/viewauditres/' + value.id.split(',')[0]
        let link = document.createElement('a')
        link.target = '_blank'
        link.href = url1
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        break
      case 'EXPORT':
        let json = {
          projectId: parseInt(value.id.split(',')[0])
        }
        let url = this.app.domain1 + 'v1/audit/project/series/result/export?param=' + encodeURIComponent(JSON.stringify(json))
        Tool.downfile(url, this.app)
        break
    }
  }
  getapidata(value) {
    const tempModuleobj = this.chooseData.moduleobj
    if (value) {
      let keyword = value.data.data
      keyword = keyword ? keyword.trim() : ''
      switch (value.name) {
        case 'auditProjecId':
          tempModuleobj.auditProjecId.loading(true)
          this.audit_project_name_search(keyword)
          break
        case 'importProjectId':
          tempModuleobj.importProjectId.loading(true)
          this.project_name_search(keyword)
          break
        case 'groupId':
          tempModuleobj.groupId.loading(true)
          this.queryProjectGroupList(keyword)
          break
      }
    } else {
      tempModuleobj.auditProjecId.loading(true)
      tempModuleobj.importProjectId.loading(true)
      tempModuleobj.groupId.loading(true)
      this.project_name_search('')
      this.audit_project_name_search('')
      this.queryProjectGroupList('')
    }
  }
  async project_name_search(projectName) {
    let { data } = await this.api.project_name_search({ projectName })
    this.chooseData.moduleobj.importProjectId.loading(false)
    let projectNames = data.list.map(function(item) {
      return {
        idx: item.projectId,
        val: item.projectName
      }
    })
    this.chooseData.renderHtml(projectNames, 'importProjectId')
  }
  async audit_project_name_search(auditProjectName) {
    let json1 = {
      page: 1,
      pageSize: 10,
      auditProjectName
    }
    let { data } = await this.api.audit_project_name_search(json1)
    this.chooseData.moduleobj.auditProjecId.loading(false)
    let auditProjects = data.list.map(item => {
      return {
        idx: item.auditProjectId,
        val: item.auditProjectName
      }
    })
    this.chooseData.renderHtml(auditProjects, 'auditProjecId')
  }
  async queryProjectGroupList(groupName) {
    let { data } = await this.api.queryProjectGroupList({
      name: groupName,
      page: 1
    })
    this.chooseData.moduleobj.groupId.loading(false)
    let temparr = data.list.map(val => {
      return {
        idx: val.id,
        val: val.name
      }
    })
    this.chooseData.renderHtml(temparr, 'groupId')
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
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc('.scrolltable').css({ height: ch - 200 })
  }
}
module.exports = auditproject
