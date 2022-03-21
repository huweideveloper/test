class getdatamanage extends DataBase {
  complete() {
    this.changeAll(this.model.condition)
    this.resize()
    this.hospital_search('')
    this.recode = require("../modal/createrecode/createrecode")
    this.viewdetail = require("../modal/uploadresult/uploadresult")
    this.formsubmit = require("../modal/formsubmit/formsubmit")
    this.model.tableconfig.tablewidth = ES.selctorDoc('.getdatamanage').box().clientWidth - 240
    this.dom.find('.create').on('click', () => {
      this.createrecode = this.app.loadModal(this.recode, {adv: true}, {title: '创建记录', xlk: this.hospitaldata})
      this.createrecode.event._addEvent('createrecode.submit', async (value) => {
        value.createBy = JSON.parse(this.app.local.get('all')).name
        let json = {
          service: 'DR',
          method: '/v1/data/collection/create',
          params: JSON.stringify(value)
        }
        this.app.loading.show()
        let res = await this.api.data_collection_create(json)
          this.app.loading.hide()
          if (res.code == 0) {
            this.createrecode.close();
            this.model.apiData.page = 1;
            this.search(true)
          }
      })
      this.createrecode.event._addEvent('createrecode.dropinput', (value) => {
        this.hospital_search(value.data.data)
      })
      this.createrecode.event._addEvent('createrecode.dropclear', (value) => {
        this.hospital_search('')
      })
    })
    this.loadlist('group')
    this.dom.find('.searchbtn').on('click', () => {
      this.model.condition.forEach((val) => {
        this.model.apiData[val[0].name] = this.getfiltercondition()[val[0].name].toString() == '' ? null : this.getfiltercondition()[val[0].name].toString()
      })
      this.model.apiData.page = 1;
      this.search(true)
    })
    this.dom.find('.export').on('click', () => {
      if (this.nodata) {
        this.app.alert.show({
          title: ' ',
          msg: '未查询到对应数据，不支持导出！',
          close: true
        })
      } else {
        let json = this.model.apiData;
        delete json.page;
        delete json.pageSize;
        let url = this.app.domain + 'v1/data/collection/export?param=' + encodeURI(JSON.stringify(json));
        this.api.HttpRequest.downLoadFile(url)
      }
    })
  }

  async search(bool) {
    let data2 = []
    let json = {
      service: 'DR',
      method: '/v1/data/collection/search',
      params: JSON.stringify(this.model.apiData)
    }
    this.tablecont.showloading()
    let res = await this.api.data_collection_search(json)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        this.nodata = false;
        res.data.list.forEach( (val) => {
          let obj = {
            id: val.id + ',' + val.udiskPath + ',' + val.serverPath
          }
          for (let i in val) {
                val[i] = val[i] == null ? '' : val[i]
            }
          Tool.configxlkformat(this.app.constmap['BODY_PART']).forEach(function (a, b) {
            if (a.idx == val.bodyPart) {
              val.bodyPart = a.val;
            }
          })
          Tool.configxlkformat(this.app.constmap['MODALITY']).forEach(function (a, b) {
            if (a.idx == val.modality) {
              val.modality = a.val;
            }
          })
          switch (val.status) {
            case 0:
              val.status = '数据已获取';
              obj.operation = this.model.listicon.action;
              break;
            case 1:
              val.status = '数据已交付';
              obj.operation = this.model.listicon.action1;
              break;
            case 2:
              val.status = '数据已上传';
              obj.operation = this.model.listicon.action2;
              break;
            case 3:
              val.status = '数据已入库';
              obj.operation = this.model.listicon.action3;
              break;
          }
          val.id = val.id + ',' + val.taskId
          data2.push(obj)
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.nodata = true;
        this.tablecont.noData();
      }
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
    this.initscroll('scrolltable')
  }

  async listaction(value) {
    switch (value.classname) {
      case 'view':
        this.loadmodal(value.classname, value.id.split(',')[0])
        break;
      case 'edit':
        this.loadmodal(value.classname, value.id.split(',')[0])
        break;
      case 'confirm':
        let config = [{
          name: 'serverDisk',
          type: 'input',
          title: '服务器硬盘:',
          value: Tool.configxlkformat(this.app.constmap['DISK'])[0].val,
          check: 'empty',
          remark: ''
        }]
        this.editcontent = this.app.loadModal(this.formsubmit, {adv: true}, {title: '', config: config})
        this.editcontent.event._addEvent('formsubmit.submit', async (data) => {
          this.app.loading.show()
          let json = {
            service: 'DR',
            method: '/v1/data/collection/finishAcquire',
            params: JSON.stringify({
              id: value.id.split(',')[0],
              acquirePerson: JSON.parse(this.app.local.get('all')).name,
              serverDisk: data.serverDisk
            })
          }
          this.app.loading.show()
          let res = await this.api.data_collection_finishAcquire(json)
          this.app.loading.hide()
          if (res.code == 0) {
            this.model.apiData.page = 1;
            this.editcontent.close()
            this.search(true)
          } else if (res.code == 905) {
            this.app.alert.show({
              title: ' ',
              msg: '根据[部位][检查设备][数据来源医院][拷贝时间]及[硬盘存放路径]信息，服务器路径已存在',
              close: false,
              sure: function () {
              }
            })
          }
        })
        break;
      case 'upload':
        let config1 = [{
          name: 'importType',
          type: 'dropdown',
          title: '导入类型:',
          value: '',
          check: 'empty',
          remark: '',
          datatype: 'obj',
          data: [{val: 'JPG_SERIES', idx: 'JPG_SERIES'}, {val: 'JPG_FOLDER', idx: 'JPG_FOLDER'}, {
            val: 'DICOM',
            idx: 'DICOM'
          }]
        }]
        this.editcontent = this.app.loadModal(this.formsubmit, {adv: true}, {title: '', config: config1})
        this.editcontent.event._addEvent('formsubmit.submit', (data) => {
          let json = {
            service: 'DR',
            method: '/v1/data/collection/finishUpload',
            params: JSON.stringify({
              id: value.id.split(',')[0],
              uploadPerson: JSON.parse(this.app.local.get('all')).name,
              importType: data.importType
            })
          }
          this.editcontent.close()
          this.app.alert.show({
            title: ' ',
            msg: '数据已拷贝至内网路径，并开启上传数据仓库任务',
            close: true,
            sure:async () => {
              this.app.loading.show()
              let res = await this.api.data_collection_finishUpload(json)
                this.app.loading.hide()
                if (res.code == 0) {
                  this.model.apiData.page = 1;
                  this.search(true)
                } else if (res.code == 901) {
                  this.app.alert.show({
                    title: ' ',
                    msg: '未检测到“' + value.id.split(',')[2] + '”路径中存在文件',
                    close: true
                  })
                } else {
                  this.app.alert.show({
                    title: ' ',
                    msg: value.id.split(',')[2] + '目录不存在',
                    close: true
                  })
                }
            }
          })
        })
        break;
      case 'done':
        let json1 = {
          service: 'DR',
          method: '/v1/data/collection/finishArchive',
          params: JSON.stringify({
            id: value.id.split(',')[0],
            archivePerson: JSON.parse(this.app.local.get('all')).name
          })
        }
        this.app.loading.show()
        let res = await this.api.data_collection_finishArchive(json1)
        this.app.loading.hide()
        if (res.code == 0) {
          this.model.apiData.page = 1;
          this.search(true)
        }
        break;
    }
  }

  async listlink(value) {
    this.app.loading.show()
    let json = {taskId: value.id.split(',')[1], page: 1, pageSize: 10}
    let res = await this.api.task_detail(json)
    this.app.loading.hide()
    if (res.code == 0) {
      this.uploadres = this.app.loadModal(this.viewdetail, {adv: true}, {data: res.data, type: 'getdata'})
      this.uploadres.event._addEvent('uploadresult.pagenumber',async (v1) => {
        json.page = v1
        this.app.loading.show()
        let res1 = await this.api.task_detail(json)
        this.app.loading.hide()
        this.uploadres.setList(res1.data)
      })
    }
  }

  async loadmodal(type, id) {
    let json = {
      service: 'DR',
      method: '/v1/data/collection/read',
      params: JSON.stringify({id: id})
    }
    let res = await this.api.data_collection_read(json)
    if (res.code == 0) {
      switch (type) {
        case 'view':
          this.viewrecode = this.app.loadModal(this.recode, {adv: true}, {
            title: '查看详情',
            type: 'view',
            data: res.data,
            xlk: this.hospitaldata
          })
          break;
        case 'edit':
          this.editrecode = this.app.loadModal(this.recode, {adv: true}, {
            title: '编辑记录',
            type: 'edit',
            data: res.data,
            xlk: this.hospitaldata
          })
          this.editrecode.event._addEvent('createrecode.submit', async (value) => {
            let json1 = {
              service: 'DR',
              method: '/v1/data/collection/update',
              params: JSON.stringify(value)
            }
            let res = await this.api.data_collection_update(json1)
              if (res.code == 0) {
                this.editrecode.close()
                this.model.apiData.page = 1;
                this.search(true)
              }
          })
          this.editrecode.event._addEvent('createrecode.dropinput',  (value) => {
            this.hospital_search(value.data.data)
          })
          break;
      }
    }
  }

  async hospital_search(value) {
    if (this.createrecode) {
      this.createrecode.showloading()
    }
    if (this.viewrecode) {
      this.viewrecode.showloading()
    }
    if (this.editrecode) {
      this.editrecode.showloading()
    }
    let res = await this.api.hospital_search({code: value, page: 1, pageSize: 10000})
    if (res.code == 0) {
      this.hospitaldata = []
      res.data.list.forEach((val) => {
        let obj = {
          val: val.name,
          idx: val.code
        }
        this.hospitaldata.push(obj)
      })
      if (this.createrecode) {
        this.createrecode.sethospitalxlk(this.hospitaldata)
      }
      if (this.viewrecode) {
        this.viewrecode.sethospitalxlk(this.hospitaldata)
      }
      if (this.editrecode) {
        this.editrecode.sethospitalxlk(this.hospitaldata)
      }
    }
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc('.getdatamanage').css({'height': ch, 'width': cw});
    ES.selctorDoc('.scrolltable').css({'height': ch - 200});
  }

}

module.exports = getdatamanage;
