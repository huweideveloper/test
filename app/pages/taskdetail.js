//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import { MessageBox } from 'element-ui'
import SysNotice from '@/components/sys-notice'

class taskdetail extends Interstellar.pagesBase {
  complete() {
    this.action = {
      viewmark: {
        dis: 'inline',
        link: 'noLink',
        content: '查看'
      }
    }

    const app = this.app
    new Vue({
      el: '#taskDetail',
      components: {
        SysNotice
      },
      provide: {
        sysNotice: app.constmap.SYS_NOTICE
      }
    })

    this.app.userResource[0].forEach((v) => {
      if (v.type == 'personalaccount') {
        this.id = v.id
      }
    })
    let permission = this.app.userResource[this.id]
    if (permission && permission.length > 0) {
      permission.forEach((v) => {
        switch (v.type) {
          case 'EDIT':
            this.action.edit = {
              dis: 'inline',
              link: 'noLink',
              content: '编辑'
            }
            break
        }
      })
    }
    ES.selctorDoc('head title').html(this.app.languageMode.getTranslate(this.app.language, 'index', 'mine'))
    this.app.header.showcrube()
    this.dom.find('.back').on('click', () => {
      this.app.model.del('taskdetail')
      this.app.changePage('personalaccount')
    })
    this.styleModel(1)
    this.type = 'doctor'
    this.loadMoudel()
    this.userInfo = JSON.parse(this.app.local.get('all'))
    // this.listData()
    this.dom.find('.series .search').on('click', () => {
      this.model.listInfo.serialNumber = this.dom.find('input[api="serialNumber"]').val()
      this.listInfo()
    })
    // 是否暂停任务
    this.isPauseTask = true
  }

  // 临时调用，判断是否暂停任务
  async setIsPauseTask(projectId) {
    this.app.loading.show()
    let res = await this.api.project_anno_read({
      projectId
    })
    this.app.loading.hide()
    const data = res.data || {}
    const imageAnnotationList = data.imageAnnotationList || []
    const isMask = imageAnnotationList.some((v) => {
      const toolList = v.toolList || []
      return toolList.some((tool) => ['C_DAUBER', 'FREEHAND', 'POLYGON'].includes(tool.type))
    })
    // 是否符合配置
    const isFit = this.isFitTaskControlInfo()
    // 符合条件
    const pass = !isMask || (isMask && isFit) // 不是Mask或者符合配置的
    this.isPauseTask = !pass
  }

  // 是否符合配置中的数据
  isFitTaskControlInfo() {
    const control = Tool.configobjformatremark(this.app.constmap['TASK_CONTROL'])
    const min = control['MIN_TASKID']
    const whiteTaskIds = control['WHITE_TASKID'].split(',')
    const taskId = Number(this.app.parpam['taskId'])
    return taskId > min || whiteTaskIds.includes(`${taskId}`)
  }

  // 提示是否暂停
  checkIsPause() {
    this.isPauseTask && MessageBox.alert('此任务暂停中', '提示')
    return this.isPauseTask
  }

  //加载当前任务数据
  async loadDataTask() {
    this.app.loading.show()
    let value = await this.api.task_read({
      taskId: this.app.parpam['taskId'],
      userId: JSON.parse(this.app.local.get('all')).userId
    })

    // 设置是否暂停任务
    this.setIsPauseTask(value.data.projectId)

    this.taskRead = value.data
    this.app.loading.hide()
    this.useinfo = JSON.parse(this.app.local.get('all'))
    this.projectId = value.data.projectId
    this.model.listInfo.taskId = this.app.parpam['taskId']
    this.model.listInfo.userId = this.useinfo.userId
    this.newList = true
    this.studyAnno = value.data.studyAnno
    this.tasktype = value.data.type
    // if (!value.data.editable) {
    //   delete this.action.edit
    // }
    if (value.data.type == 2) {
      value.data.algPreAnnotation = '审核任务'
    } else {
      if (value.data.algPreAnnotation && value.data.status == 2) {
        this.seriesTotalNum = value.data.seriesTotalNum
        this.status = value.data.status
      }
      value.data.algPreAnnotation = value.data.algPreAnnotation ? '算法标注' : '人工标注'
    }
    this.setData(value.data)
    if (this.app.parpam['projectId'] && this.app.model.get('taskdetail')) {
      // this.app.parpam["projectId"]有值说明是下一个页面返回到此页面
      this.model.setData('listInfo', this.app.model.get('taskdetail'))
      if (this.app.model.get('taskdetail').serialNumber) {
        this.dom.find('.filterarea input[api="serialNumber"]').val(this.app.model.get('taskdetail').serialNumber)
      }
    } else {
      this.model.setData('listInfo', this.model.listInfo)
    }
    if (this.app.parpam['type'] == 'view') {
      this.dom.find('.biaozhubtn').remove()
    }
  }

  loadMoudel() {
    const obj = {}
    obj['icon'] = {
      serialNumber: {
        name: '<span data-name="序号">序号</span>',
        type: 'text',
        w: '30%',
        ww: '30%'
      },
      imageAnnoNum: {
        name: '<span data-name="病灶数量">病灶数量</span>',
        type: 'text',
        w: '10%',
        ww: '10%'
      },
      submitTime: {
        name: '<span data-name="提交时间">提交时间</span>',
        type: 'text',
        w: '15%',
        ww: '15%'
      },
      auditStatus: {
        name: '<span data-name="审核状态">审核状态</span>',
        type: 'text',
        w: '10%',
        ww: '10%'
      },
      annoUpdateStatus: {
        name: '<span data-name="标注是否更新">标注是否更新</span>',
        type: 'text',
        w: '15%',
        ww: '15%'
      },
      annoLastUpdateTime: {
        name: '<span data-name="标注最后更新时间">标注最后更新时间</span>',
        type: 'text',
        w: '15%',
        ww: '15%'
      },
      discarded: {
        name: '<span data-name="是否废片">是否废片</span>',
        type: 'text',
        w: '10%',
        ww: '10%'
      }
    }
    obj['actionulwidth'] = 200
    obj['tablewidth'] = ES.selctorDoc('.taskdetail .series').box().clientWidth - 210
    obj['type'] = 'center'
    obj['actionicon'] = {
      operation: {
        name: '<span data-i18n="action" data-name="操作">操作</span>',
        type: 'action',
        code: 'action',
        w: '100%',
        ww: '100%'
      }
    }
    require.ensure('../moduleslibs/table_group/table_group', () => {
      let cont_table = require('../moduleslibs/table_group/table_group')
      this.table = this.app.loadModule(cont_table, this.dom.find('.seriestable'), {
        id: 'seriestable',
        header: obj
      })
      this.table.event._addEvent('table.action', (value) => {
        if (this.checkIsPause()) return // 判断是否暂停
        this.app.model.set('taskdetail', this.model.listInfo)
        const { type, clientType, seriesImgFileType, auditType } = this.taskRead // type=2是审核项目、clientType=2是C端审核模式
        const taskId = this.app.parpam['taskId']
        // 下载
        if (value.classname === 'down') {
          const url = `${window.location.origin}/aaa/v1/pdf/lung/nodules?taskId=${taskId}&studyInstanceUid=${value.id}&clearDicom=true`
          this.api.HttpRequest.downLoadFile(url, {
            key: 'accessToken',
            val: this.app.local.get('accessToken')
          })
          return
        }
        const isEdit = value.classname !== 'viewmark'
        if (![1, 2].includes(seriesImgFileType)) {
          // 审核任务中的方体审核模式 auditType：2-Mask单审 3-Mask双审 4-命名双审 5:冠脉狭窄-点位 1-Mpr的点位 6-病理大图的点位 7-mpr双审 8-冠脉斑块双审
          let ctype = clientType === 2 && [2, 3, 4, 7, 8].includes(auditType) ?
            (isEdit ? ([3, 4, 7, 8].includes(auditType) ? 15 : 11) : [3, 4, 7, 8].includes(auditType) ? 16 : 12)
            : type === 2 && clientType === 2 ? 8 : isEdit ? 4 : 2 // 11是mask审核编辑/冠脉分割审核编辑(或者叫单点追踪审核编辑)状态, 12是mask审核查看/冠脉分割审核查看(或者叫单点追踪审核查看)状态
          clientType === 2 && [1, 5, 6].includes(auditType) && isEdit && (ctype = 7) // 7-编辑
          // 跳转到C端
          Tool.goToC(this.app, {
            taskId,
            seriesImgFileType,
            type: ctype,
            serialNumber: value.id.split('$$')[0],
            projectId: this.projectId
          })
          return
        }
        if (!isEdit) {
          if (this.tasktype == 2) {
            let page = this.largeFigure ? 'drapCanvasAud' : 'markauditview'
            let temp = this.app.parpam['type'] == 'view' ? 'check_viewer_taskdetail_view' : 'check_viewer_taskdetail'
            // window.location.href =  window.location.origin + '/#!/' + page + '/' + this.app.parpam['taskId'] + '/' + value.id + temp
            // window.location.reload()
            this.app.changePage(page, {
              taskId,
              taskInfo: value.id,
              type: temp
            })
          } else {
            let page = this.largeFigure ? 'drapCanvasCheck' : 'markview'
            // window.location.href =  window.location.origin + '/#!/' + page + '/' + this.app.parpam['taskId'] + '/' + this.projectId + '/viewer' + '/' + JSON.parse(this.app.local.get('all')).userId + '/' + value.id + '/' + this.app.parpam['type']
            // window.location.reload()
            this.app.changePage(page, {
              taskId,
              projectId: this.projectId,
              type: 'viewer',
              uid: JSON.parse(this.app.local.get('all')).userId,
              sid: value.id,
              rid: this.app.parpam['type']
            })
          }
        }
        if (value.classname == 'edit') {
          let page = this.largeFigure ? 'drapCanvasCheck' : 'doctorAudEdit'
          // window.location.href = `${window.location.origin}/#!/${page}/${this.app.parpam.taskId}/${this.projectId}/editor/${JSON.parse(this.app.local.get('all')).userId}/${value.id}/${this.app.parpam.type}`
          // window.location.reload()
          this.app.changePage(page, {
            taskId,
            projectId: this.projectId,
            type: 'editor',
            uid: JSON.parse(this.app.local.get('all')).userId,
            sid: value.id,
            rid: this.app.parpam['type']
          })
        }
      })
      this.table.event._addEvent('table.pagenumber', (value) => {
        let json = this.model.listInfo
        this.newList = false
        json.page = parseInt(value)
        this.model.setData('listInfo', json)
        this.table.changenum(json.page)
      })
      this.table.event._addEvent('table.pagesize', (value) => {
        let json = this.model.listInfo
        json.page = 1
        json.pageSize = value.num
        this.newList = true
        this.model.setData('listInfo', json)
      })
      this.dom.find('.list-content').removeClass('hide')
      this.loadDataTask()
    })
  }

  async listInfo() {
    this.table.showloading()
    let value = await this.api.task_user_series_search(this.model.listInfo)
    this.list(value.data)
    if (value.data.total >= this.seriesTotalNum && this.status == 2) {
      this.dom.find('.algdone').removeClass('disabled')
      this.dom.find('.algdone').on('click', () => {
        this.api
          .import_complete({
            taskId: 1 * this.app.parpam['taskId']
          })
          .done((res) => {
            if (res.code == 0) {
              this.app.changePage('personalaccount')
            } else {
              Tool.errorshow(res.msg, this.app)
            }
          })
      })
    }
  }
  //根据接口赋值
  async setData(value) {
    
    this.dom.find('.infoarea label[data=name]').html(value.name) //任务名称
    if (value.costVisible) {
      this.dom.find('.cost').removeClass('hide') //标注单价
      this.dom.find('.infoarea label[data=cost]').html(value.cost) //标注单价
    }
    this.dom.find('.infoarea label[data=taskId]').html(value.id)
    this.dom.find('.infoarea label[data=algPreAnnotation]').html(value.studyAnno ? value.algPreAnnotation + '（以检查号为维度）' : value.algPreAnnotation) //任务类型
    this.dom.find('.infoarea label[data=startTime]').html(Tool.time(value.startTime, 'yyyy-mm-dd')) //开始时间
    this.dom.find('.infoarea label[data=seriesTotalNum]').html(value.seriesTotalNum) //标注数量
    this.dom.find('.infoarea label[data=endTime]').html(Tool.time(value.endTime, 'yyyy-mm-dd')) //结束时间
    try {
      this.dom.find('.infoarea label[data=remark]').html(value.remark || '') //任务备注
    } catch (error) {
      console.log(error);
    }
    //项目的信息填写
    this.app.loading.show()
    let res = await this.api.project_basic_read({
      id: value.projectId
    })
    const { type, clientType, largeFigure, isLungPdf, seriesImgFileType, name, remark, auditType } = res.data || {} // type=2是审核项目、clientType=2是C端审核模式
    // 添加下载pdf功能
    if (isLungPdf) {
      this.action.down = {
        dis: 'inline',
        link: 'noLink',
        content: '下载'
      }
    }
    // clientType === 2 && auditType === 1 && delete this.action.edit // MASK审核需要能编辑
    this.largeFigure = largeFigure
    Object.assign(this.taskRead, {
      clientType,
      seriesImgFileType,
      auditType
    })
    this.app.loading.hide()
    this.dom.find('label[data="pname"]').html(name) //所属项目,项目名称
    try {
      this.dom.find('.proinfo label[data=pmark]').html(value.remark ? remark : '') //项目描述
    } catch (error) {
      console.log(error);
    }
    // 开始任务按钮
    this.dom.find('.btnall').on('click', () => {
      if (this.checkIsPause()) return // 判断是否暂停
      if (seriesImgFileType !== 1 && seriesImgFileType !== 2) {
        // 跳转到C端  auditType：2-Mask单审 3-Mask双审 4-命名双审 7-mpr双审 8-冠脉斑块双审
        Tool.goToC(this.app, {
          taskId: value.id,
          seriesImgFileType,
          type: clientType === 2 && [2, 3, 4, 7, 8].includes(auditType) ? ([3, 4, 7, 8].includes(auditType) ? 14 : 10) : type === 2 && clientType === 2 ? 6 : 1 // 10是mask审核/冠脉分割审核(或者叫单点追踪审核)状态
        })
        return
      }
      if (value.type == 2) {
        let page = this.largeFigure ? 'drapCanvasAudEdit' : 'markaudit' //审核
        window.location.href = window.location.origin + '/#!/' + page + '/' + value.id + '/' + value.projectId + '/check'
        window.location.reload()
        return
      }
      // 标注任务
      let page = this.largeFigure ? 'drapCanvas' : 'mark'
      window.location.href = window.location.origin + '/#!/' + page + '/' + value.id + '/' + value.projectId + '/editor'
      window.location.reload()
    })
  }

  list(value) { 
    const data2 = []
    this.dom.find('.infoarea label[data=total]').html(value.total) //项目描述
    const followUpList = value.list
    if (followUpList && followUpList.length) {
      followUpList.forEach(val => {
        for (let i in val) {
          val[i] = val[i] == null ? '' : val[i]
        }
        val.id = val.serialNumber + (this.tasktype == 2 ? '$$' + val.id + '$$' + val.userId : '')
        if (this.studyAnno) {
          val.imageTotalNum = ''
        }
        val.disabled = false
        const obj = {
          id: val.id,
          operation: JSON.parse(JSON.stringify(this.action))
        }
        // if (this.useinfo.roles[0] == 'doctor.research' && this.taskRead.editable) {
        //   obj.operation.edit = edit
        // }
        if (!(this.taskRead.type === 2 && this.useinfo.isAudit) && [0, 2].includes(val.auditStatus)) { //待审核和审核通过不显示编辑按钮
          delete obj.operation.edit
        }
        data2.push(obj)
        val.submitTime = val.submitTime ? Tool.time(val.submitTime, 'yyyy-mm-dd HH:MM:ss') : '无'
        if (typeof val.auditStatus === 'number') {
          const auditStatusList = ['待审核', '', '审核通过', '审核未通过'] //（0-待审核，2-审核通过，3-审核未通过）
          val.auditStatus = auditStatusList[val.auditStatus]
        } else {
          val.auditStatus = ''
        }
        val.annoUpdateStatus = typeof val.annoUpdateStatus === 'boolean' ? (val.annoUpdateStatus ? '是' : '否') : ''
        val.discarded = typeof val.discarded === 'boolean' ? (val.discarded ? '是' : '否') : ''
        val.annoLastUpdateTime = val.annoLastUpdateTime ? Tool.time(val.annoLastUpdateTime, "yyyy-mm-dd HH:MM:ss") : ''
      })
      setTimeout(() => {
        // 以防序列跟进列表中的编辑按钮权限还没判断完就去渲染table了
        this.table.setData(followUpList, data2)
      }, 20)
    } else {
      this.table.noData()
    }
    if (this.newList) {
      this.table.getTotal(value.pages, 2, value.total)
      this.table.changenum(this.model.listInfo.page, this.model.listInfo.pageSize)
    }
  }
  getFileType(filePath) {
    var startIndex = filePath.lastIndexOf('.')
    if (startIndex != -1) return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
    else return ''
  }
}

module.exports = taskdetail
