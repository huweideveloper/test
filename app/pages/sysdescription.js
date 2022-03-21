//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class sysdescription extends Interstellar.pagesBase {
  complete() {
    this.app.header.showcrube();
    this.resize()
    let todayTime = new Date()
    let Month = todayTime.getMonth() + 1 < 10 ? '0' + (todayTime.getMonth() + 1) : (todayTime.getMonth() + 1)
    let today = todayTime.getFullYear() + '-' + Month + '-' + todayTime.getDate()
    this.apidata = {
      startDate: Tool.GetDateStr(-7) + " 00:00:00",
      endDate: Tool.GetDateStr(0) + " 23:59:59"
    }
    require.ensure('../moduleslibs/times_double/times.js', () => {
      let calendar = require('../moduleslibs/times_double/times.js')
      this.startTime = this.app.loadModule(calendar, this.dom.find('.timefiltercont'), {
        titleShow: false,
        startTime: Tool.GetDateStr(-7),
        endTime: Tool.GetDateStr(0),
        min: Tool.GetDateStr(-7),
        max: Tool.GetDateStr(0)
      })
      this.startTime.event._addEvent('times1.day', (value) => {
        this.apidata.startDate = value.st ? value.st + " 00:00:00" : ''
        this.apidata.endDate = value.et ? value.et + " 23:59:59" : ''
      })
      this.startTime.event._addEvent('times.dele', (value) => {
        if (value.dom.hasClass('day_left')) {
          this.apidata.startDate = ''
        } else {
          this.apidata.endDate = '';
        }
      })
    })
    this.dom.find('.searchbtn').on('click', () => {
      this.search(true)
    })
    this.dom.find('.searchbtn').click()
  }

  async search() {
    this.app.loading.show()
    let res = await this.api.sys_summary(this.apidata)
    this.app.loading.hide()
    if (res.code == 0) {
      for (let i in res.data) {
        this.dom.find('p label[data="' + i + '"]').html(res.data[i])
      }
    }
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc('.sysdescription').css({'height': ch - 100, 'width': cw});
  }
}

module.exports = sysdescription;
