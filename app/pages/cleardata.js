class cleardata extends Interstellar.pagesBase {
  complete() {
    let that = this;
    this.app.menu.refreshmenu()
    this.yymcdata = [{
      val: '',
      idx: ''
    }]
    this.uploadcleardata = require("../modal/uploadcleardata/uploadcleardata")
    this.imagetype = 'radio'
    this.bodypart = Tool.configxlkformat(this.app.constmap['BODY_PART'])
    //this.bodypart=[{idx:'LUNG',val:'肺部'},{idx:'RIB',val:'肋骨'},{idx:'KNEE_JOINT',val:'膝关节'},{idx:'COXA_JOINT',val:'髋关节'},{idx:'HAND',val:'手'},{idx:'FOOT',val:'足'},{idx:'SKULL_BRAIN',val:'颅脑'},{idx:'HEART',val:'心脏'},{val:'眼底',idx:'EYEGROUND'}]
    this.apidata = {page: 1, pageSize: 10};
    //未开启且有序列
    this.action = {
      config: {
        dis: 'inline',
        link: 'noLink',
        content: [{text: '编辑', key: 'edit'}, {text: '开启', key: 'open'}, {text: '删除', key: 'delete'}, {
          text: '导入序列',
          key: 'import'
        }, {text: '下载批次序列号', key: 'download'}, {text: '修改批次结论', key: 'editconclusion'}]
      }
    }
    this.action4 = {
      config: {
        dis: 'inline',
        link: 'noLink',
        content: [{text: '编辑', key: 'edit'}, {text: '开启', key: 'open'}, {text: '导入序列', key: 'import'}, {
          text: '下载批次序列号',
          key: 'download'
        }]
      }
    }
    //未开启没有序列
    this.action1 = {
      config: {
        dis: 'inline',
        link: 'noLink',
        content: [{text: '编辑', key: 'edit'}, {text: '删除', key: 'delete'}, {text: '导入序列', key: 'import'}]
      }
    }
    //开启有结论
    this.action2 = {
      config: {
        dis: 'inline',
        link: 'noLink',
        content: [{text: '查阅序列', key: 'view'}, {text: '修改批次结论', key: 'editconclusion'}, {
          text: '下载批次序列号',
          key: 'download'
        }]
      }
    }
    //开启无结论
    this.action3 = {
      config: {
        dis: 'inline',
        link: 'noLink',
        content: [{text: '查阅序列', key: 'view'}, {text: '下载批次序列号', key: 'download'}]
      }
    }
    this.formsubmit = require("../modal/formsubmit/formsubmit")
    this.render();
    this.setTitle_radio();
    this.resize();
    this.dom.find('.upload').on('click',  () => {
      this.uploadresult = this.app.loadModal(this.uploadcleardata, {adv: true}, {
        type: this.imagetype,
        hospital: this.hospital,
        modality: this.modality,
        body: this.bodypart
      })
      this.uploadresult.event._addEvent('uploadcleardata.upload', async (value) => {
        this.app.loading.show()
        let res = await this.api.series_review_task_create(value.data)
        if (res.code == 0) {
          this.app.loading.hide()
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
      this.uploadresult.event._addEvent('uploadcleardata.uploadsuccess',  (value) => {
        this.apidata.page = 1;
        this.setMain(true)
      })
    })
    this.dom.find('.searchbtn').on('click',  () => {
      this.apidata.page = 1;
      this.setMain(true)
    })
    this.dom.find('.title').on('change',  function(){
      that.apidata.title = ES.selctorDoc(this).val();
    })
    this.dom.find('.downtemprate').on('click', () => {
      this.app.loading.show()
      setTimeout( () => {
        this.app.loading.hide()
      }, 1000)
      var a = document.createElement("a");
      var url = '/images/page/s.csv';
      a.href = url;
      a.download = '模板.csv';
      a.click();
    })
    this.binduploadevent()
  }

  binduploadevent() {
    this.dom.find('.file').on('change', () => {
      this.uploadfile();
    })
  }

  uploadfile(value) {
    let filePath = ES.selctorDoc("#file").val();
    let fileType = this.getFileType(filePath);
    if ("csv" != fileType) {
      ES.selctorDoc("#choosefile").val("");
      this.app.alert.show({
        title: '',
        template: '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
        close: false,
        sure:  () => {
          this.app.alert.hide();
          this.dom.find('.file').remove();
          this.dom.find('.scroll').append('<input class="file" type="file" id="file" name="file"/>')
          this.binduploadevent();
        }
      })
    } else {
      this.app.loading.show()
      $.ajaxFileUpload({
        url: this.app.domain + 'v1/series_review_task/import',
        secureuri: false,
        dataType: "JSON",
        timeout: 60000,
        async: false,
        data: {
          id: this.taskid,
          accessToken: window.localStorage.accessToken
        },
        type: 'post',
        fileElementId: 'file',
        success: (data, status, e) => {
          let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
          this.app.loading.hide()
          if (jsonArr.code == 0) {
            console.log('success')
            this.apidata.page = 1;
            this.setMain(true)
          } else {
            this.app.alert.show({
              title: '',
              template: '<span style="font-size: 18px;margin-left:20px;">上传失败</span>',
              sure: false,
              close: true,
              footer: true
            })
          }
          this.dom.find('.file').remove();
          this.dom.find('.scroll').append('<input class="file" type="file" id="file" name="file"/>')
          this.binduploadevent();
        }
      });
    }
  }

  getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
      return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
  }

  render() {
    require.ensure('../moduleslibs/times_double/times.js',  () => {
      let calendar = require('../moduleslibs/times_double/times.js')
      this.startTime = this.app.loadModule(calendar, this.dom.find('.timefilter'), {
        titleShow: false,
        defaultword: '请选择时间'
      })
      this.startTime.event._addEvent('times1.day',  (value) => {
        this.apidata.beginTime = value.st ? value.st + " 00:00:00" : ''
        this.apidata.endTime = value.et ? value.et + " 23:59:59" : ''
      })
      this.startTime.event._addEvent('times.dele', (value) => {
        if (value.dom.hasClass('day_left')) {
          this.apidata.beginTime = ''
        } else {
          this.apidata.endTime = '';
        }
      })
    })
  }

  setTitle_radio() {
    let obj = {}
    obj['icon'] = {
      "title": {name: '<span>适用项目</span>', type: 'text', code: 'checkid', w: '15%', ww: '15%', n: "40"},
      "seriesCount": {name: '<span>序列数量</span>', type: 'text', code: 'pid', w: '10%', ww: '10%',},
      "goal": {name: '<span>备注</span>', type: 'text', code: 'pname', w: '20%', ww: '20%'},
      "createTime": {name: '<span>上传时间</span>', type: 'text', code: 'pname', w: '15%', ww: '15%'},
      "conclusion": {name: '<span>批次结论</span>', type: 'text', code: 'psex', w: '20%', ww: '20%'},
      "status": {name: '<span>状态</span>', type: 'text', code: 'psex', w: '20%', ww: '20%'},
    };
    obj['actionicon'] = {
      "operation": {
        name: '<span data-i18n="action" data-name="操作">操作</span>',
        type: 'action',
        code: 'action',
        w: '100%',
        ww: '100%'
      }
    };
    obj['actionulwidth'] = 200
    obj['tablewidth'] = ES.selctorDoc('.datatable').box().clientWidth - 240;
    obj['type'] = 'center';
    this.tableevent(obj)
  }

   tableevent(obj) {
    require.ensure("../moduleslibs/table_group/table_group", () => {
      this.myScroll = null;
      let cont_table = require("../moduleslibs/table_group/table_group")
      this.table = this.app.loadModule(cont_table, this.dom.find('.datatable'), {
        id: 'datatable',
        header: obj
      });
      this.table.event._addEvent('table.action',async (value) => {
        switch (value.classname) {
          case 'view':
            let url1 =  window.location.origin + '/#!/markseriesview/' + value.id.split(',')[0] + '/view/1'
            let link = document.createElement('a');
            link.target = "_blank";
            link.href = url1;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            break;
          case 'editconclusion':
            let config = [{
              name: 'conclusion',
              type: 'input',
              title: '提交批次结论',
              value: value.id.split(',')[1],
              check: 'empty',
              remark: '本批次是否适合该项目可以在此填写'
            },
              {
                name: 'suitable',
                type: 'dropdown',
                title: '是否适合项目',
                value: value.id.split(',')[2] == 'true' ? '1' : '0',
                'check': 'empty',
                remark: '',
                data: [{val: '是', idx: '1'}, {val: '否', idx: '0'}]
              }]
            this.editconclusion = this.app.loadModal(this.formsubmit, {adv: true}, {title: '修改批次结论', config: config})
            this.editconclusion.event._addEvent('formsubmit.submit',async (data) => {
              data.id = value.id.split(',')[0]
              data.suitable == 1 ? true : false;
              this.app.loading.show()
              let res = await this.api.series_review_task_update(data)
              this.app.loading.hide()
              if (res.code == 0) {
                this.editconclusion.close()
                this.apidata.page = 1
                this.setMain(true)
              }
            })
            break;
          case 'download':
            let url = this.app.domain + 'v1/series_review_task/export?id=' + value.id.split(',')[0];
            this.api.HttpRequest.downLoadFile(url)
            break;
          case 'delete':
            this.app.loading.show()
            let res = await this.api.series_review_task_delete({id: value.id.split(',')[0]})
            this.app.loading.hide()
              if (res.code == 0) {
                this.apidata.page = 1;
                this.setMain(true)
              }
            break;
          case 'import':
            this.taskid = value.id.split(',')[0]
            this.dom.find('.file').click();
            break;
          case 'open':
            this.app.loading.show()
            let res1 = await this.api.series_review_task_start({id: value.id.split(',')[0]})
            this.app.loading.hide()
              if (res1.code == 0) {
                this.apidata.page = 1;
                this.setMain(true)
              }
            break;
          case 'edit':
            this.app.loading.show()
            let tasks =await this.api.series_review_task_read({id: value.id.split(',')[0]})
              this.app.loading.hide()
              if (tasks.code == 0) {
                this.edit1 = this.app.loadModal(this.uploadcleardata, {adv: true}, {type: 'edit', data: tasks.data})
                this.edit1.event._addEvent('uploadcleardata.upload',async (value1) => {
                  this.app.loading.show()
                  value1.data.id = value.id.split(',')[0]
                  let updateRes = await this.api.series_review_task_update(value1.data)
                  this.app.loading.hide()
                  if (updateRes.code == 0) {
                    this.apidata.page = 1;
                    this.setMain(true)
                    this.edit1.close()
                  }
                })
              }
        }
      });
      this.table.event._addEvent('table.pagenumber',  (value) => {
        this.apidata.page = parseInt(value);
        this.table.changenum(this.apidata.page);
        this.setMain();
      });
      this.table.event._addEvent('table.pagesize', (value) => {
        this.apidata.pageSize = value.num;
        this.apidata.page = 1;
        this.setMain(true);
      });
      this.resize()
      this.setMain(true);
    })
  }

  async setMain(bool) {
    let data2 = []
    this.table.showloading()
    let res = await this.api.series_review_task_search(this.apidata)
      if (res.code == 0) {
        if (res.data.list.length > 0) {
          res.data.list.forEach( (val) => {
            for (let i in val) {
              val[i] = val[i] == null ? '' : val[i]
            }
            let obj = {}
            obj.id = val.id + ',' + val.conclusion + ',' + val.suitable;
            if (val.status == 1) {
              val.status = '未开启'
              if (val.seriesCount > 0) {
                if (val.conclusion) {
                  obj.operation = this.action;
                } else {
                  obj.operation = this.action4;
                }
              } else {
                obj.operation = this.action1;
              }
            } else {
              val.status = '已开启'
              if (val.conclusion) {
                obj.operation = this.action2;
              } else {
                obj.operation = this.action3;
              }
            }
            data2.push(obj)
          })
          this.table.setData(res.data.list, data2)
        } else {
          this.table.noData();
        }
        this.initscroll();
      }
      if (bool) {
        this.table.getTotal(res.data.pages, 2, res.data.total)
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
    ES.selctorDoc('.cleardata').css({'height': ch});
    ES.selctorDoc('.cleardata').css({'width': cw});
    ES.selctorDoc('.scrolltable').css({'height': ch - 150});
  }
}

module.exports = cleardata;
