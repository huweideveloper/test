//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import { MessageBox } from 'element-ui'

class createbackflowtask2 extends Interstellar.pagesBase {
  complete() {
    let that = this;
    this.apidata = {}
    this.apidata.condition = null
    this.apidata.remark = ''
    this.type = this.app.parpam.type
    this.taskId = this.app.parpam.taskid*1
    this.projectId = this.app.parpam.projectid*1;
    this.status = this.app.parpam.status;
    this.uploadalgdata = require("../modal/uploadalgdata/uploadalgdata")
    this.alglist = require("../modal/alglist/alglist")
    this.formsubmit = require("../modal/formsubmit/formsubmit")
    this.prodata = require("../modal/projectdata/projectdata")
    this.app.header.openControl('backflowtask')
    this.app.header.changeselected(2)
    this.styleModel(1)
    this.alg_sar_list_tool()
    this.user_searchAlgUser()
    this.task_series_count();
    this.taskDetail();
    this.initscroll('createtask2');
    this.dom.find('.exportres .yrdata').on('click', function(){
      if(that.seriesCount>0){
        if (!ES.selctorDoc(this).hasClass('disabled')) {
          that.uploadalg = that.app.loadModal(that.uploadalgdata, {adv: true}, {toolList : that.toolList?that.toolList:[],type:'project'})
          that.uploadalg.event._addEvent('uploadalgdata.upload', async (value) => {
            that.choosePerson(value)
          })
        }
      }else{
        Tool.errorshow('请先引入影像数据',that.app)
      }
    })
    this.dom.find('.addseries .yrdata').on('click', function(){
      if (!ES.selctorDoc(this).hasClass('disabled')) {
        that.prodatapoll = that.app.loadModal(that.prodata, {adv: true}, {type: 'add', id: that.taskId})
        that.resetPage = true;
        that.prodatapoll.event._addEvent('projectdata.addall', async (value) => {
          that.apidata.condition = value.query;
          that.apidata.operation = 1;
          that.apidata.taskId = that.taskId;
          that.apidata.randomAddNum = parseInt(value.randomAddNum);
          that.apidata.currentSearchReqId = value.currentSearchReqId;
          delete that.apidata.condition.page;
          delete that.apidata.condition.pageSize;
          that.app.loading.show()
          let res = await that.api.updateseries(that.apidata)
          that.app.loading.hide()
          if (res.code == 0) {
            that.task_series_count();
          }else {
            Tool.errorshow(res.msg,that.app)
          }
          if (value.total > 0) {
            that.dom.find('.addseries .yyrarea').removeClass('hide');
            that.dom.find('.addseries .yyr .num').html(value.total);
          }
          that.prodatapoll.close()
        })
        that.prodatapoll.event._addEvent('projectdata.search', (value) => {
          that.resetPage = true
          that.model.setData('proseriesdata', value.data)
        })
        that.prodatapoll.event._addEvent('projectdata.datachange', () => {
          that.resetPage = true
          that.task_series_count()
        })
        that.prodatapoll.event._addEvent('hospital.input', (value) => {
          that.getxlvalue(value)
        })
        that.prodatapoll.event._addEvent('projectdata.taskinput', (value) => {
          that.gettask(value)
        })
        that.prodatapoll.event._addEvent('prodata.pagenumber', (value) => {
          that.resetPage = false;
          that.model.setData('proseriesdata', value.data)
        })
        that.prodatapoll.event._addEvent('prodata.pagesize', (value) => {
          that.resetPage = true;
          that.model.setData('proseriesdata', value.data)
        })
        that.getxlvalue('')
        that.model.setData('proseriesdata', {page: 1, pageSize: 10, assigned: false, needCache: true})
      }
    })
    // this.dom.find('.exportres .import-auxiliary-sequence').on('click', function(){
    //   that.dom.find("#auxiliarySequenceFile").click()
    // })
    this.model._event._addEvent('proseriesdata.change', async () => {
      let json = this.model.getData('proseriesdata')
      json['projectId'] = this.projectId
      json['needCache'] = true
      this.app.loading.show()
      let res = await this.api.getproseries(json)
      this.app.loading.hide()
      if (res.code == 0) {
        if (this.resetPage) {
          this.prodatapoll.setMain(res, true)
        } else {
          this.prodatapoll.setMain(res)
        }
      }else {
        Tool.errorshow(res.msg,this.app)
      }
    })
    this.model._event._addEvent('querytask.change', () => {
      this.gettaskseries();
    })
    this.dom.find('.addseries .yyr').on('click', () => {
      this.prodatapoll = this.app.loadModal(this.prodata, {adv: true}, {
        type: 'view',
        candel: this.type === 'view' ? false : true
      })
      this.prodatapoll.event._addEvent('prodata.pagenumber', (value) => {
        this.resetPage = false;
        this.model.setData('querytask', value.data)
      })
      this.prodatapoll.event._addEvent('prodata.pagesize', (value) => {
        this.resetPage = true;
        this.model.setData('querytask', value.data)
      })
      this.prodatapoll.event._addEvent('hospital.input', (value) => {
        this.getxlvalue(value)
      })
      this.prodatapoll.event._addEvent('projectdata.search', (value) => {
        delete value.data.assigned;
        delete value.data.taskIdList;
        value.data.seriesSubmitCount = value.data.seriSubmitCount;
        //delete value.data.seriSubmitCount;
        value.data.taskId = this.taskId;
        value.data.needCache = true;
        this.resetPage = true;
        this.model.setData('querytask', value.data)
      })
      this.prodatapoll.event._addEvent('projectdata.deleteresult', async (value) => {
        if (value.totalnum == 0) {
          this.app.alert.show({
            title: ' ',
            msg: '查询结果为空',
            close: true,
            footer: true
          })
        } else {
          this.apidata.condition = null;
          delete value.data.page;
          delete value.data.pageSize;
          let json = {
            taskId: this.taskId,
            condition: value.data,
            currentSearchReqId: value.currentSearchReqId
          }
          this.app.loading.show()
          let res = await this.api.searchresult_remove(json)
          this.app.loading.hide()
          if (res.code == 0) {
            this.task_series_count()
          } else {
            Tool.errorshow(res.msg,this.app)
          }
          this.model.setData('proseriesdata', {page: 1, pageSize: 10, assigned: false})
        }
      })
      this.prodatapoll.event._addEvent('projectdata.exportresult', (value) => {
        if (value.totalnum == 0) {
          this.app.alert.show({
            title: ' ',
            msg: '查询结果为空，不支持导出。',
            close: true,
            footer: true
          })
        } else {
          delete value.data.assigned;
          delete value.data.taskIdList;
          delete value.data.page;
          delete value.data.pageSize;
          let json = {
            taskId: this.taskId,
            condition: value.data,
            currentSearchReqId: value.currentSearchReqId,
            operation: 'URL'
          }
          let url = this.app.domain1 + 'v1/task/series/searchresult/export?param=' + encodeURI(JSON.stringify(json)+'&accessToken='+window.localStorage.accessToken);
          this.api.HttpRequest.downLoadFile(url)
        }
      })
      this.getxlvalue('')
      this.resetPage = true;
      this.model.setData('querytask', {page: 1, pageSize: 10})
    })
    this.dom.find('.exportres .yyr').on('click', () => {
      this.queryImportedData(1,false,true)
      this.alglistModal = this.app.loadModal(this.alglist,{adv:true},{data:this.listRes.data})
      this.alglistModal.event._addEvent('alglist.listaction',async (value)=>{
        switch (value.classname) {
          case 'delete':
            break;
          case 'viewfail':
            let param = encodeURI(JSON.stringify({resourceId:value.id.split(',')[1]}))
            this.api.HttpRequest.downLoadFile(`${this.app.domain1}v1/base/fileResource/download?param=${param}&&accessToken=${window.localStorage.accessToken}`)
            break;
        }
      })
      this.alglistModal.event._addEvent('alglist.pagenumber',async (value)=>{
        this.queryImportedData(value,true,false)
      })
    })
    this.dom.find('.donetask').on('click',async () => {
      if(this.projectStatus == 2){
        let res = await this.api.data_backwash_complete({taskId:this.taskId})
        if(res.code==0){
          this.app.changePage('backflowtask',{type:'fs'})
        }else {
          Tool.errorshow(res.msg,this.app)
        }
      }else {
        this.app.alert.show({
          title: ' ',
          msg: '请先开启项目',
          close: true
        })
      }
    })
    this.dom.find('.choosePart .radio-box').on('click',async function(){
      let dom = ES.selctorDoc(this)
      if(dom.hasClass('choose')){
        that.app.alert.show({
          title: '',
          template: '<span style="font-size: 18px;margin-left:20px;">确认取消部分标注吗</span>',
          sure: async () => {
            dom.removeClass('choose')
            that.dom.find('.exportArea').addClass('hide')
            let res = await that.api.task_portionAnno({taskId:that.taskId*1,portionAnno:false})
            if(res.code == 0){

            }else {
              Tool.errorshow(res.msg,that.app)
            }
          },
          close: true
        })
      }else{
        dom.addClass('choose')
        that.dom.find('.exportArea').removeClass('hide')
        let res = await that.api.task_portionAnno({taskId:that.taskId*1,portionAnno:true})
        if(res.code == 0){

        }else {
          Tool.errorshow(res.msg,that.app)
        }
      }

    })
    this.dom.find('.choosePart .export').on('click', () => {
      this.exportData = this.app.loadModal(this.exportdata, {adv: true}, {})
      this.exportData.event._addEvent('uploadalgdata.upload', (value) => {
        if(this.seriesCount<=0){
          that.app.alert.show({
            title: '',
            template: '<span style="font-size: 18px;margin-left:20px;">请先引入影像文件</span>',
            sure: false,
            close: true,
            footer:true
          })
          return;
        }
        let filePath = ES.selctorDoc("#file1").val();
        let fileType = Tool.getFileType(filePath);
        if ( 'xlsx' !== fileType && 'xls' !== fileType) {
          ES.selctorDoc("#filechoose").val("");
          this.app.alert.show({
            title: '',
            template: '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
            close: false,
            sure: () => {
              this.app.alert.hide();
            }
          })
        } else {
          this.app.loading.show()
          $.ajaxFileUpload({
            url: '/aaa/v1/task/series/import/needAnno', // that.app.domain+'/ccc/user/import',
            secureuri: false,
            dataType: "JSON",
            async: false,
            data: {
              taskId: this.taskId*1,
              accessToken: window.localStorage.accessToken
            },
            type: 'post',
            fileElementId: 'file1',
            success: (data, status, e) => {
              this.app.loading.hide()
              let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
              that.exportData.close();
              if (jsonArr.code == 0) {
                this.app.alert.show({
                  title: '',
                  template: '<span style="font-size: 18px;margin-left:20px;">成功导入' + jsonArr.data.successCount + '条序列，有' + jsonArr.data.errorCount + '条序列未被匹配到</span>',
                  sure: false,
                  close: true,
                  footer: true
                })
                this.event._dispatch('projectdata.datachange')
                this.task_series_count()
              } else {
                let msg = jsonArr.code == -1 ? '繁忙' : jsonArr.msg
                MessageBox.alert(`<pre>${msg}</pre>`, '提示', {
                  dangerouslyUseHTMLString: true
                })
              }
              this.close()
              this.dom.find('.file').remove();
              this.dom.find('.btnarea').append('<input class="file" type="file" id="file" name="file"/>')
              // that.bindchangefile();
            }
          });
        }
      })
    })
    let config={
      icon:{
        "seriesTotalCount": { name: '<span data-i18n="age" data-name="年龄">总序列数</span>', type: 'text', code: 'checkid', w: '20%', ww: '20%', n: "40" },
        "successCount": { name: '<span data-i18n="age" data-name="年龄">匹配序列数</span>', type: 'text', code: 'checkid', w: '20%', ww: '20%' },
        "errorCount": { name: '<span data-i18n="age" data-name="年龄">未匹配序列数</span>', type: 'text', code: 'pid', w: '20%', ww: '20%' },
        "importTime": { name: '<span data-i18n="age" data-name="年龄">导入时间</span>', type: 'text', code: 'pname', w: '20%', ww: '20%' },
        "action": { name: '<span data-i18n="age" data-name="年龄">操作</span>', type: 'action', code: 'pname', w: '20%', ww: '20%' },
      },
      type:'center',
      tablewidth:800,
      operation:{
        export: {dis: 'inline', link: 'noLink', content: '导出'}
      }
    }
    this.dom.find('.choosePart .viewexported').on('click', async () => {
      this.listShow = this.app.loadModal(this.listshow, {adv: true}, {headerconfig:config,title:'查看指定序列'})
      let res = await this.api.task_series_import_infoList({taskId:that.taskId,page:1,pageSize:10})
      this.listShow.setMain(res,true);
      this.listShow.event._addEvent('listshow.change',async (value)=>{
        let res = await this.api.task_series_import_infoList({taskId:that.taskId,page:value.page,pageSize:value.pageSize})
        this.listShow.setMain(res,value.refreshPage);
      })
      this.listShow.event._addEvent('listshow.action',async (value)=>{
        that.api.HttpRequest.downLoadFile(`${that.app.domain1}v1/task/series/import/infoList/export?id=${value.id}&accessToken=${window.localStorage.accessToken}`)
      })
    })
    // this.dom.find("#auxiliarySequenceFile").on("change", () => {
    //   let filePath = ES.selctorDoc("#auxiliarySequenceFile").val()
    //   let fileType = that.getFileType(filePath)
    //   if ("csv" !== fileType) {
    //     MessageBox.alert('格式错误，上传失败。')
    //   } else {
    //     that.app.loading.show()
    //     $.ajaxFileUpload({
    //       url: "/aaa/v1/project/series/auxiliary_series/import",
    //       secureuri: false,
    //       dataType: "JSON",
    //       timeout: 60000,
    //       async: false,
    //       data: {
    //         projectId: that.projectId,
    //         accessToken: window.localStorage.accessToken
    //       },
    //       type: "post",
    //       fileElementId: "auxiliarySequenceFile",
    //       sequentialUploads: true,
    //       beforeSend: function(xhr, data) {
    //         xhr.setRequestHeader("accessToken", window.localStorage.accessToken)
    //       },
    //       success: (data, status, e) => {
    //         that.app.loading.hide()
    //         let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
    //         if (jsonArr.code === 0) {
    //           MessageBox.alert(`已成功导入序列数${jsonArr.data.successCount}条`)
    //         } else {
    //           MessageBox.alert(jsonArr.msg)
    //         }
    //       }
    //     })
    //   }
    // })

    // this.dom.find(".download-auxiliary-sequence .link-a").on("click", () => {
    //   const json = {
    //     projectId: that.projectId
    //   }
    //   const url = that.app.domain1 + "v1/project/series/auxiliary_series/export?param=" + encodeURI(JSON.stringify(json) + "&accessToken=" + window.localStorage.accessToken)
    //   that.api.HttpRequest.downLoadFile(url, {
    //     key: "accessToken",
    //     val: that.app.local.get("accessToken")
    //   })
    // })
    if (this.type == 'view') {
      this.dom.find('.yrdata').addClass('hide')
      this.dom.find('.exportArea .export').addClass('hide')
      // this.dom.find('.import-auxiliary-sequence').parent().addClass('hide')
      this.dom.find('.choosePart .radio-box').off('click')
    }
  }

  choosePerson(data){
    let config = [
      { name: 'importUserId', type: 'dropdown', title: '选择医生', value:'', 'check': 'empty', remark: '', data: this.userList }
    ]
    let choosePerson = this.app.loadModal(this.formsubmit, { adv: true }, { title: '选择医生', config: config })
    choosePerson.event._addEvent('formsubmit.submit',(value) => {
      this.importUserId = value.importUserId
      choosePerson.close()
      this.upload(data)
    })
  }

  upload(value){
    let that = this;
    let filePath = ES.selctorDoc("#file1").val();
    let fileType = that.getFileType(filePath);
    if ("csv" != fileType && 'xlsx' !== fileType && 'xls' !== fileType) {
      ES.selctorDoc("#filechoose").val("");
      that.app.alert.show({
        title: '',
        template: '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
        close: false,
        sure: () => {
          this.app.alert.hide();
        }
      })
    } else {
      that.app.loading.show()
      $.ajaxFileUpload({
        url: '/aaa/v1/alg/sar/import', // that.app.domain+'/ccc/user/import',
        secureuri: false,
        dataType: "JSON",
        async: false,
        data: {
          taskId: JSON.parse(that.taskId),
          type: value.data.type,
          accessToken: window.localStorage.accessToken,
          transferNii: value.data.transferNii ? 1 : 0,
          toolType: value.data.toolType ? value.data.toolType.split(',')[1] : '',
          toolId: value.data.toolType ? value.data.toolType.split(',')[0] : '',
          importUserId:this.importUserId,
          dataType: value.data.dataType ? value.data.dataType : '',
        },
        type: 'post',
        fileElementId: 'file1',
        success: (data, status, e) => {
          that.app.loading.hide()
          let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
          that.uploadalg.close();
          if (jsonArr.code == 0) {
            // that.listInfo()
            // that.app.alert.show({
            //   title: '',
            //   template: '<span style="font-size: 18px;margin-left:20px;">成功导入' + jsonArr.data.successCount + '条，失败' + jsonArr.data.errorCount + '条</span>',
            //   sure: false,
            //   close: true,
            //   footer: true
            // })
            that.queryImportedData()
          } else {
            let msg = jsonArr.code == -1 ? '繁忙' : jsonArr.msg
            MessageBox.alert(`<pre>${msg}</pre>`, '提示', {
              dangerouslyUseHTMLString: true
            })
          }
          that.close()
          that.dom.find('.file').remove();
          that.dom.find('.btnarea').append('<input class="file" type="file" id="file" name="file"/>')
          // that.bindchangefile();
        }
      });
    }
  }

  async taskDetail(){
    let res = await this.api.taskDetail({id:parseInt(this.app.parpam.taskid)})
    if(res.code==0){
      if(res.data.status !== 1){
        this.dom.find('.exportres .yrdata').addClass('hide')
        this.dom.find('.donetask').addClass('hide')
      }
      if(res.data.portionAnno){
        this.dom.find('.choosePart .radio-box').addClass('choose')
        this.dom.find('.exportArea').removeClass('hide')
      }
      if(!res.data.studyAnno){
        this.dom.find('.choosePart').addClass('hide')
      }
      this.projectStatus = res.data.projectStatus
    }else {
      Tool.errorshow(res.msg,this.app)
    }
    this.queryImportedData()
  }

  async queryImportedData(page=1,setList,resetPage){
    this.listRes = await this.api.get_data_backwash_result_list({taskId:this.taskId,page,pageSize:10})
    if(this.listRes.code == 0){
      if(this.listRes.data.list.length>0){
        this.dom.find('.exportres .yyrarea').removeClass('hide')
      }else{
        this.dom.find('.exportres .yyrarea').addClass('hide')
      }
      if(setList){
        this.alglistModal.setList(this.listRes.data,resetPage)
      }
    }
  }

  async user_searchAlgUser(){
    this.userList = []
    let res = await this.api.user_searchAlgUser({})
    if(res.code == 0){
      this.userList = res.data.map((v)=>{
        return{
          val:v.name,
          idx:v.id
         }
      })
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  async alg_sar_list_tool(){
    let json = {
      projectId:this.projectId
    }
    this.toolList = []
    let res = await this.api.alg_sar_list_tool(json)
    if(res.code == 0){
      res.data.forEach((val) => {
        this.toolList.push({val:val.type , idx:val.id+','+val.type})
      })
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  async gettaskseries() {
    let json = this.model.getData('querytask')
    json.taskId = parseInt(this.taskId)
    this.app.loading.show()
    let res = await this.api.querytaskseries(json)
    this.app.loading.hide()
    if (res.code == 0) {
      if (this.resetPage) {
        this.prodatapoll.setMain(res, true)
      } else {
        this.prodatapoll.setMain(res)
      }
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  async task_series_count() {
    this.app.loading.show()
    let res = await this.api.task_series_count({taskId: parseInt(this.taskId)})
    this.app.loading.hide()
    if (res.code == 0) {
      this.seriesCount = res.data.count
      if (res.data.count > 0) {
        this.dom.find('.addseries .yyrarea').removeClass('hide');
        this.dom.find('.addseries .yyr .num').html(res.data.count);
      } else {
        this.dom.find('.addseries .yyrarea').addClass('hide');
      }
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  async getxlvalue(value) {
    let json1 = {service:'DR',method:'/v1/hospital/search',params:JSON.stringify({code:value})}
    if (this.prodatapoll.yymc) {
      this.prodatapoll.yymc.loading(true)
    }
    let res = await this.api.hospitalName(json1)
    this.prodatapoll.yymc.loading(false)
    this.hospital = [];
    res.data.list.forEach((val) => {
      let obj = {}
      obj.idx = val['code'];
      obj.val = val['code'];
      this.hospital.push(obj)
    })
    this.prodatapoll.resetxlk(this.hospital)
  }

  async gettask(value) {
    let json = {
      taskNameKey: value,
      projectId: parseInt(this.projectId),
      type: 3
    }
    let res = await this.api.task_like_query(json)
    if (res.code == 0) {
      this.prodatapoll.tasklist(res.data.list)
    }else {
      Tool.errorshow(res.msg,this.app)
    }
  }

  async setData() {
    let json = {
      id: parseInt(this.taskId)
    }
    let res = await this.api.querytaskseries(json)
    if (res.code == 0) {

    }
    this.model.setData('querytask', this.model.getData('querytask'))
  }

  getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
      return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 40
    ES.selctorDoc('.createtask').css({'height': ch, 'width': cw});
    this.initscroll('createtask');
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
      scrollX: true,
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

module.exports = createbackflowtask2;
