//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import SysNotice from '@/components/sys-notice'

class newtaskdetail extends Interstellar.pagesBase {
  complete() {
    const app = this.app
    new Vue({
      el: '#newTaskDetail',
      components: {
        SysNotice
      },
      provide: {
        sysNotice: app.constmap.SYS_NOTICE
      }
    })
    ES.selctorDoc('head title').html(this.app.languageMode.getTranslate(this.app.language, 'index', 'mine'))
    this.app.header.showcrube()
    this.dom.find('.join').on('click', () => {
      this.addTaskToDoctor()
    })
    this.dom.find('.back').on('click', () => {
      this.app.changePage('alltasklist')
    })
    this.styleModel(1)
    this.type = 'doctor'
    this.loadDataTask()
  }

  //添加任务
  addTaskToDoctor() {
    this.app.alert.show({
      title: ' ',
      msg: '确认加入该任务？加入任务数量满5个后，需要提交已加入的任务后才能继续加入',
      close: true,
      sure: () => {
        this.todoApi()
      }
    })
  }

  async todoApi() {
    let useinfo = JSON.parse(this.app.local.get('all'))
    this.app.loading.show()
    let value = await this.api.task_join({
      taskId: this.app.parpam['taskId'],
      userId: useinfo.userId
    })
    this.app.loading.hide()
    if (value.code == 0) {
      const {type, clientType, seriesImgFileType, largeFigure, auditType} = this.projectInfo.data // type=2是审核项目、clientType=2是C端审核模式
      if (seriesImgFileType !== 1 && seriesImgFileType !== 2) {
        // 新开页面跳转到C端  auditType：2-Mask单审 3-Mask双审 4-命名双审 7-mpr双审 8-冠脉斑块双审
        Tool.goToC(this.app, {
          taskId: this.app.parpam['taskId'],
          seriesImgFileType,
          type: clientType === 2 && [2, 3, 4, 7, 8].includes(auditType) ? ([3, 4, 7, 8].includes(auditType) ? 14 : 10) : type === 2 && clientType === 2 ? 6 : 1
        })
        this.app.changePage('personalaccount') // 当前页跳转到主页
        return
      }
      if (this.tasktype == 1 || this.tasktype == 3) {
        if (this.algPreAnnotation) {
          this.app.changePage('taskdetail', {
            taskId: this.app.parpam['taskId'],
            projectId: this.projectId,
            type: 'editor'
          })
          return
        } else {
          if (largeFigure) {
            this.app.changePage('drapCanvas', {
              taskId: this.app.parpam['taskId'],
              projectId: this.projectId,
              type: 'editor'
            })
            return
          }
          this.app.changePage('mark', {
            taskId: this.app.parpam['taskId'],
            projectId: this.projectId,
            type: 'editor'
          })
          return
        }
      } else {
        if (largeFigure) {
          window.location.href =  window.location.origin + '/#!/drapCanvasAudEdit/' + this.app.parpam['taskId'] + '/' + this.projectId + '/check'
          return
        }
        window.location.href =  window.location.origin + '/#!/markaudit/' + this.app.parpam['taskId'] + '/' + this.projectId + '/check'
        window.location.reload()
      }
    } else {
      this.app.alert.show({
        title: '提示',
        msg: value.msg,
        close: true
      })
    }
  }

  //加载当前任务数据
  async loadDataTask() {
    this.app.loading.show()
    let value = await this.api.task_user_read({
      taskId: this.app.parpam['taskId'],
      userId: JSON.parse(this.app.local.get('all')).userId
    })
    this.app.loading.hide()
    this.algPreAnnotation = value.data.algPreAnnotation
    if (value.data.type == 2) {
      value.data.algPreAnnotation = '审核任务'
    } else {
      value.data.algPreAnnotation = value.data.algPreAnnotation ? '算法标注' : '人工标注'
    }
    this.tasktype = value.data.type
    this.projectId = value.data.projectId
    this.setData(value.data)
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
    this.dom.find('.infoarea label[data=remark]').html(value.remark ? JSON.parse('"' + value.remark + '"') : '') //任务备注

    this.projectId = value.projectId
    //项目的信息填写
    this.app.loading.show()
    let res = await this.api.project_basic_read({
      id: value.projectId
    })
    this.projectInfo = res
    this.app.loading.hide()
    this.dom.find('label[data="pname"]').html(res.data.name) //所属项目,项目名称
    this.dom.find('.proinfo .pmark').val(JSON.parse('"' + res.data.remark + '"')) //项目描述

    var textarea = document.getElementById('remarkarea')
    textarea.style.height = textarea.scrollHeight + 'px'
    // this.dom.find('.proinfo .pmark').parent().css({'height':textarea.scrollHeight})
    this.dom.find('.infoarea label[data=modality]').html(res.data.modality) //样本类型
    if (this.api.data.remarkFileUrl) {
      let temparr = JSON.parse(this.api.data.remarkFileUrl)
      temparr.forEach(function(val, idx) {
        this.dom.find('.imgcontrol').append('<li imgurl="' + val + '" class="controls"></li>')
      })
    }
    this.dom.find('.controls').on('click', () => {
      let url = ES.selctorDoc(this).attr('imgurl')
      let temp = url.lastIndexOf('.')
      let imgtype = ',jpg,png,gif,WMF,webp,'
      let videotype = ',ogg,mp4,swf,'

      if (imgtype.lastIndexOf(url.substring(temp + 1)) !== -1) {
        let aa = new Image()
        aa.onload = () => {
          this.dom.find('.fujianarea').html(this.outerHTML)
          this.initscrollmenu()
        }
        aa.src = url
      } else if (videotype.lastIndexOf(url.substring(temp + 1)) !== -1) {
        let html =
          '<video width="600" height="350" controls>\n' +
          '    <source src="' +
          url +
          '" type="video/mp4">\n' +
          '    <source src="' +
          url +
          '" type="video/ogg">\n' +
          '    您的浏览器不支持 video 标签。\n' +
          '</video>'
        this.dom.find('.fujianarea').html(html)
        this.initscrollmenu()
      }
    })
    this.dom
      .find('.controls')
      .eq(0)
      .click()
  }
}

module.exports = newtaskdetail
