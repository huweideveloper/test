class uploaddata extends DataBase {
  complete() {
    let that = this;
    this.addli()
    this.loadlist('group', this.model.tableconfig[this.app.parpam['type']])
    this.dom.find('.filterarea').append('<input class="file" type="file" id="file" name="file"/>')
    this.type=this.app.parpam['type']
    this.model.tableconfig[this.app.parpam['type']].tablewidth = ES.selctorDoc('.uploaddata').box().clientWidth - 240
    this.errorlist = require("../modal/errorlist/errorlist")
    this.viewdetail = require("../modal/uploadresult/uploadresult")
    this.jpgdetail = require("../modal/jpgresult/jpgresult")
    this.hospital=[]
    if(this.type=='fs'){
      this.dom.find('.read').removeClass('hide')
    }else{
      this.dom.find('.read').addClass('hide')
    }
    this.dom.find('.upload').on('click',() => {
      let temp=''
      switch (this.type) {
        case 'fs':
          temp='RADIOLOGY';
          break;
        case 'bl':
          temp='PATHOLOGY';
          break;
        case 'qt':
          temp='OTHER';
          break;

      }
      let uploadcatelog = require("../modal/uploadcatelog/uploadcatelog")
      that.uploadresult = that.app.loadModal(uploadcatelog, {adv: true}, {
        type: temp,
        hospital: this.hospital,
        modality: Tool.configxlkformat(this.app.constmap['MODALITY']),
        body: Tool.configxlkformat(this.app.constmap['BODY_PART'])
      })
      that.getxlvalue('');
      this.uploadresult.event._addEvent('uploadcatelog.upload',async (value) => {
        if (this.type == 'fs') {
          value.data.category = 'RADIOLOGY'
        } else if (this.type == 'bl') {
          value.data.category = 'PATHOLOGY'
        } else {
          value.data.category = 'OTHER'
        }
        this.app.loading.show()
        let res = await this.api.uploadcategory(value.data)
          this.app.loading.hide()
          if (res.code == 0) {
            this.uploadresult.close();
            this.apidata.page = 1;
            this.setMain(true)
          } else {
            this.app.alert.show({
              title: ' ',
              msg: res.msg,
              close: true,
              footer: true,
              sure: function () {
              }
            })
          }
      })
      this.uploadresult.event._addEvent('hospital.input', (value) => {
        this.getxlvalue(value)
      })

    })
    this.dom.find('.read').on('click', () => {
      let readreport = require("../modal/readreport/readreport")
      let readresult = this.app.loadModal(readreport, {adv: true})
      readresult.event._addEvent('readreport.upload',async (value) => {
        value.data.category = 'RADIOLOGY'
        this.app.loading.show()
        let res = await this.api.readreport(value.data)
          this.app.loading.hide()
          if (res.code == 0) {
            readresult.close();
            this.apidata.page = 1;
            this.setMain(true)
          } else {
            this.app.alert.show({
              title: ' ',
              msg: res.msg,
              close: true,
              footer: true,
              sure: function () {
              }
            })
          }
      })
    })
    this.dom.find('.searchbtn').on('click', () => {
      this.model.condition[this.type].forEach((val, idx) => {
        if (val[0].name == 'inspectTime') {
          this.model.apiData.beginTime = this.getfiltercondition()[val[0].name][0].startTime
          this.model.apiData.endTime = this.getfiltercondition()[val[0].name][0].endTime
        } else {
          this.model.apiData[val[0].name] = this.getfiltercondition()[val[0].name][0]
        }
      })
      this.model.apiData.page = 1;
      this.search(true)
    })
  }

  toggletab(value) {
    this.app.changePage('uploaddata', {type: value.id})
  }

  binduploadevent(type, taskId) {
    let url = ''
    switch (type) {
      case 'seriesvolidate':
        url = '/data/v1/series/info/import/volidate';
        break;
      case 'seriescomfirm':
        url = '/data/v1/series/info/import';
        break;
      case 'studyvolidate':
        url = '/data/v1/study/info/import/volidate';
        break;
      case 'studycomfirm':
        url = '/data/v1/study/info/import';
        break
    }
    this.dom.find('.file').on('change', () => {
      let filePath = ES.selctorDoc("#file").val();
      let fileType = this.getFileType(filePath);
      if (fileType !== '') {
        if ("csv" != fileType) {
          ES.selctorDoc("#filechoose").val("");
          this.app.alert.show({
            title: '',
            template: '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
            close: false,
            sure: () => {
              this.app.alert.hide();
              this.dom.find('.file').remove();
              this.dom.find('.filterarea').append('<input class="file" type="file" id="file" name="file"/>')
            }
          })
        } else {
          this.app.loading.show()
          this.ajaxsend(url, type, taskId)
        }
      }
    })
  }

  resultshow(jsonArr, type, taskId) {
    switch (type) {
      case 'seriesvolidate':
        if (jsonArr.code == 0) {
          let errormodal = this.app.loadModal(this.errorlist, {adv: true}, {
            data: jsonArr.data.errorMap,
            attachdata: jsonArr.data.attributeKeySet ? '通用属性字段：' + JSON.stringify(jsonArr.data.attributeKeySet) : '',
            type: 'keyvalue',
            title: '错误信息'
          })
          errormodal.event._addEvent('errorlist.sure', () => {
            errormodal.close()
            this.ajaxsend('/data/v1/series/info/import', 'seriescomfirm', taskId)
          })
          errormodal.event._addEvent('errorlist.cancel', () => {
            this.dom.find('.file').remove();
            this.dom.find('.filterarea').append('<input class="file" type="file" id="file" name="file"/>')
          })
        } else {
          this.app.alert.show({
            title: '',
            template: '<span style="font-size: 18px;margin-left:20px;">上传失败</span>',
            sure: false,
            close: true,
            footer: true
          })
        }
        break;
      case 'studyvolidate':
        if (jsonArr.code == 0) {
          let errormodal = this.app.loadModal(this.errorlist, {adv: true}, {
            data: jsonArr.data.errorMap,
            attachdata: jsonArr.data.attributeKeySet ? '通用属性字段：' + JSON.stringify(jsonArr.data.attributeKeySet) : '',
            type: 'keyvalue',
            title: '错误信息'
          })
          errormodal.event._addEvent('errorlist.sure', () => {
            errormodal.close()
            this.ajaxsend('/data/v1/study/info/import', 'studycomfirm', taskId)
          })
          errormodal.event._addEvent('errorlist.cancel', () => {
            this.dom.find('.file').remove();
            this.dom.find('.filterarea').append('<input class="file" type="file" id="file" name="file"/>')
          })
        } else {
          this.app.alert.show({
            title: '',
            template: '<span style="font-size: 18px;margin-left:20px;">上传失败</span>',
            sure: false,
            close: true,
            footer: true
          })
          this.dom.find('.file').remove();
          this.dom.find('.filterarea').append('<input class="file" type="file" id="file" name="file"/>')
        }
        break;
      default:
        if (jsonArr.code !== 0) {
          this.app.alert.show({
            title: '',
            template: '<span style="font-size: 18px;margin-left:20px;">上传失败</span>',
            sure: false,
            close: true,
            footer: true
          })
        } else {
          this.app.alert.show({
            title: ' ',
            msg: '导入成功！',
            close: true,
            footer: true
          })
        }
        this.dom.find('.file').remove();
        this.dom.find('.filterarea').append('<input class="file" type="file" id="file" name="file"/>')
    }
  }

  ajaxsend(url, type, taskId) {
    $.ajaxFileUpload({
      url: url,
      secureuri: false,
      dataType: "JSON",
      timeout: 60000,
      async: false,
      type: 'post',
      fileElementId: 'file',
      data: {
        accessToken: window.localStorage.accessToken,
        taskId: taskId
      },
      success: (data, status, e) => {
        let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
        this.app.loading.hide()
        this.resultshow(jsonArr, type, taskId)
      }
    });
  }

  getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
      return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
  }

  getapidata(value) {
    if (value) {
      switch (value.name) {
        case 'hospitalCode':
          this.chooseData.moduleobj.hospitalCode.loading(true)
          this.hospitalCode(value.data.data ? value.data.data.trim() : "");
          break;
      }
    } else {
      this.chooseData.moduleobj.hospitalCode.loading(true)
      this.hospitalCode('');
    }
  }

  async hospitalCode(name) {
    let {data} = await this.api.hospitalCode({name})
    this.chooseData.moduleobj.hospitalCode.loading(false)
    let temparr = data.list.map((item) => {
      return {
        idx:item.code,
        val:item.name
      }
    })
    this.chooseData.renderHtml(temparr, 'hospitalCode')
  }

  async listaction(value) {
    switch (value.classname) {
      case 'view':
        let json = {
          taskId: value.id,
          page: 1,
          pageSize: 10
        }
        this.app.loading.show()
        let viewres = await this.api.getdetail(json)
        if (viewres.code == 0) {
          this.app.loading.hide()
          this.uploadres = this.app.loadModal(this.viewdetail, {adv: true}, {id: value.id, data: viewres.data})
          this.uploadres.event._addEvent('uploadresult.restart',async () => {
            this.app.loading.show()
            let res1 = await this.api.task_restart(json)
              this.app.loading.hide()
              this.uploadres.close();
              this.apidata.page = 1;
              this.setMain(true)
          })
          this.uploadres.event._addEvent('uploadresult.stop',async () => {
            let res1 = await this.api.task_stop(json)
              this.app.loading.hide()
              this.uploadres.close();
              this.apidata.page = 1;
              this.setMain(true)
          })
          this.uploadres.event._addEvent('uploadresult.pagenumber',async (v1) => {
            json.page = v1
            this.app.loading.show()
            let res1 = await this.api.getdetail(json)
              this.app.loading.hide()
              this.uploadres.setList(res1.data)
          })
        }
        break;
      case 'jpg':
        this.app.loading.show()
        let jpgRes = await this.api.convert_detail({taskId: value.id, page: 1, pageSize: 10})
        if (jpgRes.code == 0) {
          this.app.loading.hide()
          this.jpgres = this.app.loadModal(this.jpgdetail, {adv: true}, {id: value.id, data: jpgRes.data})
          this.jpgres.event._addEvent('jpgresult.restart',async () => {
            this.app.loading.show()
            let res1 = await this.api.image_convert({taskId: value.id, force: false})
              this.app.loading.hide()
              this.jpgres.close();
              this.apidata.page = 1;
              this.setMain(true)
          })
          this.jpgres.event._addEvent('jpgresult.restartall',async () => {
            this.app.loading.show()
            let res1 = await this.api.image_convert({taskId: value.id, force: false})
              this.app.loading.hide()
              this.jpgres.close();
              this.apidata.page = 1;
              this.setMain(true)
          })
          this.jpgres.event._addEvent('jpgresult.pagenumber',async (v1) => {
            json.page = v1
            this.app.loading.show()
            let res1 = await this.api.convert_detail(json)
              this.app.loading.hide()
              this.jpgres.setList(res1.data)
          })
        }
        break;
      case 'export':
        this.api.HttpRequest.downLoadFile(`${this.app.domain}v1/task/series/export?taskId=${value.id}`)
        break;
      case 'seriesinfo':
        this.binduploadevent('seriesvolidate', value.id);
        this.dom.find('.file').click();
        break;
      case 'studyinfo':
        this.binduploadevent('studyvolidate', value.id);
        this.dom.find('.file').click();
        break;
      case 'detail':
        let detail = await this.api.import_detail({taskId: value.id})
        if (detail.code == 0) {
          this.app.alert.show({
            title: ' ',
            msg: '<p style="font-size: 16px">入库序列数：' + detail.data.seriesCount + '</p><p style="font-size: 16px">入库检查数：' + detail.data.studyCount + '</p><p style="font-size: 16px">入库患者数：' + detail.data.patientCount + '</p>',
            close: true,
            footer: true
          })
        }
        break;
    }
  }

  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.querylist(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val) => {
          for (let i in val) {
            val[i] = val[i] == null ? '' : val[i]
          }
          let obj = {}
          obj.id = val.taskId;
          val.id = val.taskId;
          switch (val.status) {
            case 1:
              val.status = '处理中';
              obj.operation = this.type == 'fs' ? this.model.listicon.action1.radio : this.model.listicon.action1.other;
              break;
            case 2:
              val.status = '处理成功';
              if (val.successSeriesCount > 0) {
                obj.operation = this.type == 'fs' ? this.model.listicon.action.radio : this.model.listicon.action.other;
              } else {
                obj.operation = this.type == 'fs' ? this.model.listicon.action2.radio : this.model.listicon.action2.other;
              }
              break;
            case 3:
              val.status = '处理失败';
              if (val.successSeriesCount > 0) {
                obj.operation = this.type == 'fs' ? this.model.listicon.action.radio : this.model.listicon.action.other;
              } else {
                obj.operation = this.type == 'fs' ? this.model.listicon.action2.radio : this.model.listicon.action2.other;
              }
              break;
            case 4:
              val.status = '处理中断';
              if (val.successSeriesCount > 0) {
                obj.operation = this.type == 'fs' ? this.model.listicon.action.radio : this.model.listicon.action.other;
              } else {
                obj.operation = this.type == 'fs' ? this.model.listicon.action2.radio : this.model.listicon.action2.other;
              }
              break;
          }
          data2.push(obj)
          Tool.configxlkformat(this.app.constmap['MODALITY']).forEach(function (a, b) {
            if (a.idx == val.modality) {
              val.modality = a.val;
            }
          })
          val.hospitalName = val.hospitalName == null ? '' : val.hospitalName;
          if (val.type == 'IMPORT_IMAGE') {
            val.type = '影像文件'
            Tool.configxlkformat(this.app.constmap['BODY_PART']).forEach(function (a, b) {
              if (a.idx == val.bodyPart) {
                val.bodyPart = a.val;
              }
            })
          } else {
            val.type = '报告数据'
            val.bodyPart = ''
          }
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData();
      }
      this.initscroll();
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
  }

  async getxlvalue(value) {
    let json1 = {}
    json1['code'] = value
    if (this.uploadresult.yymc) {
      this.uploadresult.yymc.loading(true)
    }
    let {data} = await this.api.hospitalCode(json1)
    this.hospital = data.list.map((val) => {
      return {
        idx:val.code,
        val:val.code
      }
    })
    if (this.uploadresult.yymc) {
      this.uploadresult.yymc.loading(false)
      console.log(this.hospital,'hop')
      this.uploadresult.resetxlk(this.hospital)
    }
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.scrolltable').attr('id', rid)
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
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc('.uploaddata').css({'height': ch});
    ES.selctorDoc('.uploaddata').css({'width': cw});
    ES.selctorDoc('.scrolltable').css({'height': ch - 320});
  }
}

module.exports = uploaddata;
