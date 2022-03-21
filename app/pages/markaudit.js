//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markaudit extends MarkBase {
    constructor(app, api, dom, model) {
        super(app, api, dom, model)
    }

    //接口调用，获取信息
    baseApi() {
        //获取项目信息
        this.app.loading.show()

        //获取
        this.api.task_read({
            id: this.app.parpam['taskId']
        }).done((value) => {
            this.dom.find('.task-name span').eq(1).html(value.data.name)
            this.model.taskInfo = value.data
            this.imageDataType = String(value.data.seriesImgFileType) == "2" ? "orgin" : "noneOrgin"
            //this.imageType = String(value.data.seriesImgFileType) == 2 ? "DCM" : "JPG"
            this.api.annoitem_task_read({
                taskId: this.app.parpam['taskId']
            }).done((res) => {

                this.model.setData('projectInfo', res.data)
            })
        })
    }

    //关闭菜单功能，生成病症的选项
    annotationIteminit() {
        //console.log(this.model.projectInfo,'this.model.projectInfothis.model.projectInfo')
        let projectInfo = this.model.projectInfo
        let tool = {}
            //翻译所有的标注组件信息
        let nidusinfo = {
            all: {}
        }
        let xu1 = 0
        projectInfo.annotationItemList.map((item) => {
            item.id = item.componentId
            item.sequence = xu1
            item.formComponentId = item.componentId
            xu1++
        })
        nidusinfo.all = this.translateData(projectInfo.annotationItemList)
        console.log(nidusinfo.all)
        for (let i = 0; i < projectInfo.imageAnnotationList.length; i++) {
            let teampData = projectInfo.imageAnnotationList[i].annotationItemList
            let xu = 0
            projectInfo.imageAnnotationList[i].annotationItemList.splice(0, 0, this.model.returnSelectComponent())
            projectInfo.imageAnnotationList[i].annotationItemList.map((item) => {
                item.sequence = xu
                item.id = item.componentId
                xu++
            })
            if (teampData.length != 0) {
                nidusinfo[projectInfo.imageAnnotationList[i].type] = this.translateData(projectInfo.imageAnnotationList[i].annotationItemList)
            }
        }
        console.log(nidusinfo, 'nidusinfo')
        this.cornerstoneContorl.model.nidusComponentInfo = Tool.clone(nidusinfo)
        nidusinfo = null
            //=========根据不同类型来拿series=============
        if (this.app.parpam['type'] != 'viewer_all') {
            this.series_get(this.app.parpam['sid'])
        }
    }

    //************************影像数据列表************************
    //初始化标注结果，当前序列

    needApiAll(data, apineed, newdata, postData) {
        console.log(newdata, 'newdatanewdatanewdata')
        this.cornerstoneContorl.setbrush(newdata)
    }

    //************************影像数据列表************************
    //************************标注相关*************************
    //获取需要标注的序列
    series_get(sid) {
        if (this.cornerstoneContorl) {
            this.cornerstoneContorl.close()
        }
        if (this.dicommenu) {
            this.dicommenu.resetAll()
        }
        this.api.series_get({
            taskId: this.app.parpam['taskId'],
            userId: this.useinfo.userId //5088
        }).done((value) => {
            if (value.code == 1001) {
                window.location.href =  window.location.origin + '/#!/personalaccount' //this.app.changePage('personalaccount')
                window.location.reload()
            }
            if (!value.data) {
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
            }
            const sarIdList = this.model.sarIdList = value.data.sarIdList
            let seriesInstanceUids = []
            for (let i = 0; i < sarIdList.length; i++) {
                seriesInstanceUids.push({
                    seriesAnnotationResultId: sarIdList[i],
                    seriesInstanceUid: value.data.seriesList[i],
                    imageList:value.data.seriesList[i].imageIdList
                })
            }
            let endInfo = {
                sarIdList: value.data.sarIdList,
                studyInstanceUid: value.data.studyInstanceUid,
                seriesInstanceUids: seriesInstanceUids
            }
            this.model.setData('series_result_id', endInfo)
        })

    }

    //标注基础信息准备完成，进入这一轮标注的起始点
    /*result_get_fromback() {
      //console.log()
      for (let i = 0; i < this.model.series_result_id.seriesInstanceUids.length; i++) {
        this.api.series_result_read({
          sarId: this.model.series_result_id.seriesInstanceUids[i].seriesAnnotationResultId //this.model.series_result_id.seriesAnnotationResultId
        }).done((value) => {
          console.log(value, this.model.projectInfo.annotationItemList, '-----------------')
          this.model.translateBackData(value, this.model.projectInfo.annotationItemList)
          console.log(value, 'result_seriesResult')
          value.data.seriesInstanceUid = this.model.series_result_id.seriesInstanceUids[i].seriesInstanceUid
          this.model.seriesResult[this.model.series_result_id.seriesInstanceUids[i].seriesInstanceUid] = value
          this.model.setData('seriesResult', this.model.seriesResult)
          console.log(this.model.seriesResult)
          if (i == this.model.series_result_id.seriesInstanceUids.length - 1) {
            this.api.audit_annoitem_update({
              sarIdList: this.getSarIds(),
              type: "ANNOITEM",
              resultList: this.model.changeItemDataToBackend(value.data.annotationItemResultList)
            }).done(() => {
            })
          }
        })
      }

    }*/

    //************************标注相关*************************
    //影像区加载
    cornerstoneContorlOther() {
        let that = this

        //对于图片上面的影像标注操作
        this.cornerstoneContorl.event._addEvent('ctcornerstone.addNode', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNode', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.deleteNode', function(value) {})
            //获取整个序列的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.Allthing', function(value) {
            that.app.loading.show()
            that.api.audit_annoitem_update({
                sarIdList: that.model.sarIdList.join(),
                type: "ANNOITEM",
                resultList: that.model.changeItemDataToBackendCheck(value)
            }).done(() => {
                that.app.loading.hide()
            })
        })

        //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', function(value) {
            const checkReslutVal = value.chooseData['check_reslut'].result
            if (checkReslutVal) { // 没值说明是点击某个病灶时进来的，此时还没开始审核呢
              that.cornerstoneContorl.sequencelist.setHasAuditedNode(value)
            }
            let arr = that.model.changeItemDataToBackendCheck(value.chooseData)
            let auditResult = null
            if (checkReslutVal == "0") {
                auditResult = true
            }
            if (checkReslutVal == "1") {
                auditResult = false
            }
            if (value.jiangui) {
                if (auditResult == null) {
                    let temp = that.cornerstoneContorl.model.nidusComponentData[that.dom.find('.nodeInfolist .choose').attr('bid')]
                    for (let i in temp) {
                        if (temp[i].result) {
                            temp[i].result = ''
                        }
                    }
                    return
                }
            }

            if (value.jiangui) {
                if (auditResult == null) {
                    let temp = that.cornerstoneContorl.model.nidusComponentData[that.dom.find('.nodeInfolist .choose').attr('bid')]
                    for (let i in temp) {
                        if (temp[i].result) {
                            temp[i].result = ''
                        }
                    }
                    return
                }
            }
            if (auditResult == null) {
                return
            }
            that.app.loading.show()
            that.api.audit_imganno_audit({
                sarId: that.model.seriesResult[value.sId].data.sarId,
                iarClusterId: value.backId.split('_')[0] * 1,
                auditResult: auditResult
            }).done((res) => {
                that.app.loading.hide()
                if (res.data) {
                    that.app.loading.show()
                    that.api.audit_annoitem_update({
                        sarIdList: that.model.sarIdList.join(),
                        type: "IMGITEM",
                        "imgAnnoResultId": res.data.imgAnnoResultId,
                        resultList: arr
                    }).done((item) => {
                        that.app.loading.hide()
                        that.cornerstoneContorl.groupMakeSame(value)
                    })
                } else {
                    that.app.alert.show({
                        title: ' ',
                        msg: '请先选择正确与否',
                        sure: function() {
                            let temp = that.cornerstoneContorl.model.nidusComponentData[that.dom.find('.nodeInfolist .choose').attr('bid')]
                            for (let i in temp) {
                                if (temp[i].result) {
                                    temp[i].result = ''
                                }
                            }
                            that.dom.find('.nodeInfolist .choose .nname').click()
                        }
                    })
                }
            })

        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.brushfirstload', function(value) {
            that.model.loadData.num++
                if (that.magicloading && that.model.loadData.num >= that.model.loadData.total) {
                    that.magicloading.hide()
                }
        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.NodeRemark', function(value) {
            console.log(value, that.model.seriesResult[value.sId])
            that.app.loading.show()
            that.api.audit_task_updateRemake({
                id: value.backId.split('_')[0], //sarId, //that.model.seriesResult.data.sarId,
                type: 2,
                remark: value.remarkRes
            }).done((res) => {
                that.app.loading.hide()
                if (res.msg) {
                    that.cornerstoneContorl.clearRemark(value)
                    that.app.alert.show({
                        title: ' ',
                        msg: '请先选择正确与否',
                        sure: function() {
                            let temp = that.cornerstoneContorl.model.nidusComponentData[that.dom.find('.nodeInfolist .choose').attr('bid')]
                            for (let i in temp) {
                                if (temp[i].result) {
                                    temp[i].result = ''
                                }
                            }
                            that.dom.find('.nodeInfolist .choose .nname').click()
                        }
                    })
                }
            })
        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.AllRemark', function(value) {
            that.app.loading.show()
            that.api.audit_task_updateRemake({
                id: that.getSarIds(),
                type: 1,
                remark: value
            }).done(() => {
                that.app.loading.hide()
            })
        })
    }

    //************************弹框区*************************
    //弹窗加载

    //************************弹框区*************************
    //提交整个序列事件
    btnEvent() {
        this.dom.find('.back-icon').on('click', () => {
            // if (this.app.parpam['type'] != "viewer") {
            //     window.location.href =  window.location.origin + '/#!/ytjtaskdetail/' + this.app.parpam['taskId']
            //     window.location.reload()
            //         // this.app.changePage('ytjtaskdetail', { taskid: this.app.parpam['taskId'] })
            //     return
            // } else {
            //     window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/editor'
            //     window.location.reload()
            //         //this.app.changePage('taskdetail', { taskId: this.app.parpam['taskId'], type: this.app.parpam['rid'] })
            //     return
            // }
            window.location.href =  window.location.origin + '/#!/personalaccount' //this.app.changePage('personalaccount')
            window.location.reload()
        })
        let that = this
        this.dom.find('.cotrol-btn .btn-submit').on('click', () => {
            this.alertSubmit.show({
                title: ' ',
                msg: '确认提交该序列？提交后该序列将不再修改',
                closeSure: function() {
                    that.model.doneNum = -1
                    that.submitSeries()
                },
                sure: function() {
                    that.model.doneNum += 1
                    that.submitSeries()
                }
            })

            //window.location.reload()
        })
        switch (this.app.parpam['type']) {
            case 'check':
                this.dom.find('.cotrol-btn .btn-submit1').remove()
                this.dom.find('.cotrol-btn .btn-submit2').remove()
                break
            case 'check_viewer':
                this.dom.find('.cotrol-btn .btn-submit').remove()
                this.dom.find('.cotrol-btn .btn-submit1').remove()
                this.dom.find('.cotrol-btn .btn-submit2').remove()
                break
            case 'check_viewer_all':
                this.dom.find('.cotrol-btn .btn-submit').remove()
                break
        }
        this.dom.find('.toolsImg li[fun="remove_xu"]').find('.btn').remove()
    }
    submitSeries() {
        this.app.loading.show()
            /*let sarId = ''
            for (let i in this.model.seriesResult) {
                sarId += this.model.seriesResult[i].data.sarId+','
            }*/
        this.api.series_audit_submit({
            sarIdList: this.model.series_result_id.sarIdList.join(),
        }).done((value) => {
            this.app.loading.hide()
            if(value.code==400){
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
                return
            }

            if (value.code != 0) {
                this.app.alert.show({
                    title: ' ',
                    msg: value.msg
                })
            } else {
                if (this.model.doneNum == -1) {
                    window.location.href =  window.location.origin + '/#!/personalaccount'
                    window.location.reload()
                        //this.app.changePage('personalaccount')
                    return
                }
                window.location.reload();
            }
        })
    }
}
module.exports = markaudit;
