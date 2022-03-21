//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
require("../less/personalaccount.less")
import SysNotice from '@/components/sys-notice'

class alltasklist extends Interstellar.pagesBase {
  complete() {
    const app = this.app
    new Vue({
      el: '#allTaskList',
      components: {
        SysNotice
      },
      provide: {
        sysNotice: app.constmap.SYS_NOTICE
      }
    })
    this.app.header.showcrube();
    this.resize()
    this.styleModel(1)
    this.type = 'doctor';
    this.resetStauts = true
    this.item = require("../modules/alltasklistitem/alltasklistitem.js")
    this.pageControl()
    this.model.data.currentTime = Tool.time(new Date().getTime(), 'yyyy-mm-dd HH:MM:ss')
    this.model._event._addEvent('data.change', () => {
      this.loadData()
    })

  }

  async loadData() {
    let value = await this.api.task_search(this.model.getData('data'))
    this.setData(value.data.list);
    if (this.resetStauts) {
      if (value.data.list.length != 0) {
        this.pagina.getTotal(value.data.pages, 3)
        this.pages.getTotal(value.data.pages, value.data.total)
      } else {
        this.pagina.resetAll()
        this.pages.getTotal(1, value.data.total)
      }
    }
    this.pages.setnowpage(this.model.getData('data').page)
    this.initscroll('tasklistarea');
  }

  pageControl() {
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
        let drop = this.app.loadModule(dropdown, this.dom.find('.sicknessType'), {
          className: 'xlk',
          firstSelect: {val: '项目标签', idx: ''},
          data: Tool.configxlkformat(this.app.constmap['SICKNESS_TYPE'])
        })
        drop.event._addEvent('option.click', (value) => {
          this.resetStauts = true
          this.model.data['sicknessType'] = value.idx;
          this.loadData()
        })
        drop.event._addEvent('dropDown.clear', (value) => {
          this.resetStauts = true
          this.model.data['sicknessType'] = null;
          this.loadData()
        })
    })
    require.ensure(['../moduleslibs/pagination_new/pagination.js', '../moduleslibs/pagesizeset/pagesizeset.js'], () => {
      let pagination = require('../moduleslibs/pagination_new/pagination.js')
      let pageset = require('../moduleslibs/pagesizeset/pagesizeset.js')
      this.pagina = this.app.loadModule(pagination, this.dom.find('.pagination'), {
        total: 1,
        flag: true
      });
      this.pagina.event._addEvent('pagination.changePage', (value) => {
        this.resetStauts = false
        let data = this.model.getData('data')
        data.page = value
        this.model.setData('data', data)
      });
      this.pages = this.app.loadModule(pageset, this.dom.find('.pageset'))
      this.pages.event._addEvent('pagesizeset.change', (value) => {
        this.resetStauts = true
        let data = this.model.getData('data')
        data.page = 1
        data.pageSize = value.num
        this.model.setData('data', data)
      })
      this.loadData()
    })
  }

  dropdownRender() {
    require.ensure("../moduleslibs/search/search.js", () => {
      let dropdown = require("../moduleslibs/search/search.js")
      this.patientSex = this.app.loadModule(dropdown, this.dom.find('.searchtask'), {
        firstSelect: {
          val: '全部任务',
          idx: ''
        },
        data: [{
          val: '男',
          idx: 'M'
        }, {
          val: '女',
          idx: 'F'
        }]
      })
    })
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      this.patientSex = this.app.loadModule(dropdown, this.dom.find('.taskfilter'), {
        className: 'xlk',
        firstSelect: {
          val: '全部标注类型',
          idx: ''
        },
        data: [{
          val: '男',
          idx: 'M'
        }, {
          val: '女',
          idx: 'F'
        }]
      })
      this.patientSex = this.app.loadModule(dropdown, this.dom.find('.profilter'), {
        className: 'xlk',
        firstSelect: {
          val: '全部项目',
          idx: ''
        },
        data: [{
          val: '男',
          idx: 'M'
        }, {
          val: '女',
          idx: 'F'
        }]
      })
    })
  }

  setData(value) {
    let that = this;
    this.dom.find('.tasklistarea .taskcontent').html('')
    if (value.length == 0) {
      this.dom.find('.tasklistarea .taskcontent').html('<span>没有任务可以领取！</span>')
      return
    }
    for (let i = 0; i < value.length; i++) {
      this.dom.find('.tasklistarea .taskcontent').append('<div class="newtask task' + i + '" taskid="' + i + '"></div>')
      value[i].endTime = value[i].endTime ? Tool.time(value[i].endTime, "yyyy-mm-dd") : "无"
      value[i].sicknessType = value[i].sicknessType ? value[i].sicknessType : ""
      if (value[i].type == 2) {
        value[i].algPreAnnotation = "审核任务"
      } else {
        value[i].algPreAnnotation = value[i].algPreAnnotation ? '算法标注' : '人工标注'
      }
      this.app.loadModule(this.item, this.dom.find('.task' + i), value[i])
      this.dom.find('.task' + i).on('click',function() {
        let tdom = ES.selctorDoc(this)
        let data = value[tdom.attr('taskid')]
        that.app.changePage('newtaskdetail', {taskId: data.id})
      })
    }
  }

  initscroll(val) {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.' + val).attr('id', rid)
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

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 220
    ES.selctorDoc('.tasklistarea').css({'height': ch});
  }
}

module.exports = alltasklist;
