//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markaudit extends MarkBase {
    constructor(app, api, dom, model) {
        
            super(app, api, dom, model)
        }
        //接口调用，获取信息
    baseApi() {
        console.log(this.app.parpam, 'this.app.parpam', this.app.model)
            //获取项目信息
        this.app.loading.show()
        this.api.annoitem_task_read({
            taskId: this.app.parpam['taskId']
        }).done((value) => {
            this.app.loading.hide()
            this.model.setData('projectInfo', value.data)
        })
        //获取
        this.api.task_read({
            id: this.app.parpam['taskId']
        }).done((value) => {
            this.imageDataType = String(value.data.seriesImgFileType) == "2" ? "orgin" : "noneOrgin"
            this.dom.find('.task-name span').eq(1).html(value.data.name)
            this.model.taskInfo = value.data
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
        for (let i = 0; i < projectInfo.imageAnnotationList.length; i++) {
            let teampData = projectInfo.imageAnnotationList[i].annotationItemList
            let xu = 0
            projectInfo.imageAnnotationList[i].annotationItemList.splice(0, 0, {
                componentCode: "check_reslut",
                componentData: '[{"text":"对","code":"0"},{"text":"错","code":"1"}]',
                componentId: "check_reslut",
                componentName: "正确与否",
                componentParameter: '{"isdefault ":false}',
                componentType: "select",
                optional: true,
                sequence: xu
            })
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
        if (this.cornerstoneContorl) {
            this.cornerstoneContorl.close()
        }
        if (this.dicommenu) {
            this.dicommenu.resetAll()
        }

        if (this.app.parpam['type'] == 'check_viewer' || this.app.parpam['type'] == 'check_viewer_taskdetail' || this.app.parpam['type'] == 'check_viewer_taskdetail_view') {
            let taskData = this.app.parpam['taskInfo'].split('$$')
            let temp = {
                seriesAnnotationResultId: taskData[1],
                seriesInstanceUid: taskData[0]
            }
            this.api.series_result_search({
                id: this.app.parpam['taskId'] * 1,
                serialNumber: taskData[0],
                userId: taskData[2] * 1,
                type: 'TASK'
            }).done((value) => {
                //console.log(value, 'valuevaluevaluevalue')
                let endInfo = {
                    studyInstanceUid: taskData[0],
                    seriesInstanceUids: []
                }
                value.data.list.map((item) => {
                    endInfo.seriesInstanceUids.push({
                        seriesAnnotationResultId: item.id,
                        seriesInstanceUid: item.seriesInstanceUid,
                        imageList: item.imageIdList
                    })
                })
                console.log(endInfo)
                endInfo.remark = value.data.remark
                this.model.setData('series_result_id', endInfo)
            })

        } else {
            this.app.loading.show()
            this.api.series_result_next({
                "index": this.app.parpam['taskInfo'].split('$$')[1] * 1,
                "taskId": this.app.parpam['taskId'] * 1,
                "userId": parseInt(this.app.parpam['uid'])
            }).done((item) => {
                this.app.loading.hide()
                let temp = {
                    seriesAnnotationResultId: item.data.sarId,
                    seriesInstanceUid: item.data.series
                }
                let endInfo = {
                        studyInstanceUid: item.data.series,
                        seriesInstanceUids: [{
                            seriesAnnotationResultId: item.data.sarId,
                            seriesInstanceUid: item.data.series
                        }]
                    }
                    //endInfo.remark = value.data.remark
                this.model.setData('series_result_id', endInfo)
            })
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
            userId: 5088
        }).done((value) => {
            if (value.code == 1001) {
                window.location.href =  window.location.origin + '/#!/viewaudittask/' + this.app.parpam['taskId'] //this.app.changePage('personalaccount')
                window.location.reload()
            }
            if (!value.data) {
                window.location.href =  window.location.origin + '/#!/viewaudittask/' + this.app.parpam['taskId']
                window.location.reload()
            }
            let temp = {
                seriesAnnotationResultId: value.data.seriesAnnotationResultId,
                seriesInstanceUid: value.data.seriesInstanceUid
            }
            let seriesInstanceUids = []
            for (let i = 0; i < value.data.sarIdList.length; i++) {
                seriesInstanceUids.push({
                    seriesAnnotationResultId: value.data.sarIdList[i],
                    seriesInstanceUid: value.data.seriesList[i],
                    imageList: value.data.seriesList[i].imageIdList
                })
            }
            let endInfo = {
                studyInstanceUid: value.data.seriesList[0],
                seriesInstanceUids: seriesInstanceUids
            }
            this.model.setData('series_result_id', endInfo)
        })

    }

    //标注基础信息准备完成，进入这一轮标注的起始点
    //result_get_fromback() {
    //console.log()
    /*for (let i = 0; i < this.model.series_result_id.seriesInstanceUids.length; i++) {
      this.api.series_result_read({
        sarId: this.model.series_result_id.seriesInstanceUids[i].seriesAnnotationResultId //this.model.series_result_id.seriesAnnotationResultId
      }).done((value) => {
        console.log(value, this.model.projectInfo.annotationItemList, '-----------------')
        this.model.translateBackData(value, this.model.projectInfo.annotationItemList)
        console.log(value, 'result_seriesResult')
        value.data.seriesInstanceUid = this.model.series_result_id.seriesInstanceUids[i].seriesInstanceUid
        this.model.seriesResult[this.model.series_result_id.seriesInstanceUids[i].seriesInstanceUid] = value
        this.model.setData('seriesResult', this.model.seriesResult)
      })
    }*/

    /*this.api.series_result_read({
        sarId: this.model.series_result_id.seriesAnnotationResultId
    }).done((value) => {
        console.log(value, 'result_seriesResult')
        this.model.translateBackData(value, this.model.projectInfo.annotationItemList)
        console.log('-----------------------')
        this.model.setData('seriesResult', value)
    })*/
    // }

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
                /*that.api.audit_annoitem_update({
                    sarId: that.model.seriesResult.data.sarId,
                    type: "ANNOITEM",
                    resultList: that.model.changeItemDataToBackendCheck(value)
                }).done(() => {
                    that.app.loading.hide()
                })*/
        })

        //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', function(value) {
            that.cornerstoneContorl.groupMakeSame(value)
            return
            /*let arr = that.model.changeItemDataToBackendCheck(value.chooseData)

            that.app.loading.show()
            that.api.audit_imganno_audit({
                sarId: that.model.seriesResult.data.sarId,
                iarClusterId: value.backId.split('_')[0] * 1,
                auditResult: (value.chooseData['check_reslut'].result == "0" ? true : false)
            }).done((res) => {
                ///console.log(res,value)

                that.api.audit_annoitem_update({
                    sarId: that.model.seriesResult.data.sarId,
                    type: "IMGITEM",
                    "imgAnnoResultId": res.data.imgAnnoResultId,
                    resultList: arr
                }).done((item) => {
                    that.app.loading.hide()

                })
            })*/

        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.brushfirstload', function(value) {
            that.model.loadData.num++
                if (that.magicloading && that.model.loadData.num >= that.model.loadData.total) {
                    that.magicloading.hide()
                }
        })
    }

    //************************弹框区*************************
    //弹窗加载
    modalLoad() {

    }

    //************************弹框区*************************
    //提交整个序列事件
    btnEvent() {
        this.dom.find('.back-icon').on('click', () => {
            if (this.app.parpam['type'] == 'check_viewer_taskdetail') {
                this.app.changePage('taskdetail', {
                        taskId: this.app.parpam['taskId'],
                        type: 'editor'
                    })
                    // window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/editor'
                    // window.location.reload()
                return
            }
            if (this.app.parpam['type'] == 'check_viewer_taskdetail_view') {
                this.app.changePage('taskdetail', {
                        taskId: this.app.parpam['taskId'],
                        type: 'view'
                    })
                    // window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/view'
                    // window.location.reload()
                return
            }
            this.app.changePage('viewaudittask', {
                    id: this.app.parpam['taskId']
                })
                // window.location.href =  window.location.origin + '/#!/viewaudittask/' + this.app.parpam['taskId']
                //   window.location.reload()
        })
        let that = this
        if (this.app.parpam['type'].lastIndexOf('viewer_all') == -1) {
            this.dom.find('.cotrol-btn .btn-submit1').remove()
            this.dom.find('.cotrol-btn .btn-submit2').remove()
        } else {
            let ti = this.app.parpam['taskInfo'].split('$$')
            this.dom.find('.cotrol-btn .btn-submit1').on('click', () => {
                //console.log('aaaa')
                if (ti[1] * 1 > 0) {
                    let nowtaksInfod = ti[0] + '$$' + (ti[1] - 1)
                    this.app.changePage('markauditview', {
                            taskId: this.app.parpam['taskId'],
                            taskInfo: nowtaksInfod,
                            type: 'check_viewer_all'
                        })
                        // window.location.href =  window.location.origin + '/#!/markauditview/' + this.app.parpam['taskId'] + '/' + nowtaksInfod + '/check_viewer_all'
                        //   window.location.reload()
                } else {
                    this.alerError('没有上一个序列了！')
                }
            })
            this.dom.find('.cotrol-btn .btn-submit2').on('click', () => {
                if (ti[1] * 1 < ti[0] - 1) {
                    let nowtaksInfod = ti[0] + '$$' + (ti[1] * 1 + 1)
                    this.app.changePage('markauditview', {
                            taskId: this.app.parpam['taskId'],
                            taskInfo: nowtaksInfod,
                            type: 'check_viewer_all'
                        })
                        // window.location.href =  window.location.origin + '/#!/markauditview/' + this.app.parpam['taskId'] + '/' + nowtaksInfod + '/check_viewer_all'
                        //   window.location.reload()
                } else {
                    this.dom.find('.back-icon').click()
                }
            })
        }
    }
}
module.exports = markaudit;
