//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markaudit extends MarkBase {
    constructor(app, api, dom, model) {
            super(app, api, dom, model)
        }
        //接口调用，获取信息
    baseApi() {
        console.log(this.app.parpam, 'this.app.parpam')
            //获取项目信息
        this.app.loading.show()
        this.api.project_read({
            auditProjectId: this.app.parpam['projectId']
        }).done((value) => {
            this.app.loading.hide()
            this.dom.find('.task-name span').eq(1).html(value.data.name)
        })
        if (this.app.parpam['type'] == 'check_viewer_all') {
            console.log(decodeURIComponent(this.app.parpam['projectInfo'].split('_')[2]))
            let data = JSON.parse(decodeURIComponent(this.app.parpam['projectInfo'].split('_')[2]))
            this.api.series_result_next({
                "index": this.app.parpam['projectInfo'].split('_')[1] * 1,
                "projectId": this.app.parpam['projectId'] * 1,
                compareSymbol: data.compareSymbol ? data.compareSymbol * 1 : null,
                imageTotalCount: data.imageTotalCount ? data.imageTotalCount * 1 : null
            }).done((value) => {
                /*this.tempRes = {
                    seriesAnnotationResultId: value.data.sarId,
                    seriesInstanceUid: value.data.series
                }*/
                this.tempRes = {
                    studyInstanceUid: value.data.series,
                    seriesInstanceUids: [{
                        seriesAnnotationResultId: value.data.sarId,
                        seriesInstanceUid: value.data.series,
                        imageList:value.data.imageIdList
                    }]
                }
                this.tempRes.remark = value.data.remark
                this.api.annoitem_project_read({
                    sarId: value.data.sarId
                }).done((value) => {
                    this.model.setData('projectInfo', value.data)
                })
            })
            return
        }
        this.api.annoitem_project_read({
            sarId: this.app.parpam['type'] == 'check_viewer' ? this.app.parpam['projectInfo'].split('_')[1] * 1 : 0
        }).done((value) => {
            this.model.setData('projectInfo', value.data)
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

        if (this.app.parpam['type'] == 'check_viewer') {
            let taskData = this.app.parpam['projectInfo'].split('_')
                /*let temp = {
                    seriesAnnotationResultId: taskData[1],
                    seriesInstanceUid: taskData[0]
                }*/
            let temp = {
                studyInstanceUid: taskData[0],
                seriesInstanceUids: [{
                    seriesAnnotationResultId: taskData[1],
                    seriesInstanceUid: taskData[0]
                }],
                remark:taskData[2]
            }
            this.model.setData('series_result_id', temp)
        } else {
            this.model.setData('series_result_id', this.tempRes)
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
                sarId: that.model.seriesResult.data.sarId,
                type: "ANNOITEM",
                resultList: that.model.changeItemDataToBackend(value)
            }).done(() => {
                that.app.loading.hide()
            })
        })

        //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', function(value) {
            let arr = that.model.changeItemDataToBackend(value.chooseData)
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
                    that.cornerstoneContorl.groupMakeSame(value)
                })
            })

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
            window.location.href =  window.location.origin + '/#!/viewauditres/' + this.app.parpam['projectId']
            window.location.reload()
        })
        let that = this
        if (this.app.parpam['type'].lastIndexOf('viewer_all') == -1) {
            this.dom.find('.cotrol-btn .btn-submit1').remove()
            this.dom.find('.cotrol-btn .btn-submit2').remove()
        } else {
            let ti = this.app.parpam['projectInfo'].split('_')
            this.dom.find('.cotrol-btn .btn-submit1').on('click', () => {
                console.log('aaaa')
                if (ti[1] * 1 > 0) {
                    let nowtaksInfod = ti[0] + '_' + (ti[1] - 1) + '_' + ti[2]
                    window.location.href =  window.location.origin + '/#!/markauditprojectview/' + this.app.parpam['projectId'] + '/' + nowtaksInfod + '/check_viewer_all'
                    window.location.reload()
                } else {
                    this.alerError('没有上一个序列了！')
                }
            })
            this.dom.find('.cotrol-btn .btn-submit2').on('click', () => {
                if (ti[1] * 1 < ti[0] - 1) {
                    let nowtaksInfod = ti[0] + '_' + (ti[1] * 1 + 1) + '_' + ti[2]
                    window.location.href =  window.location.origin + '/#!/markauditprojectview/' + this.app.parpam['projectId'] + '/' + nowtaksInfod + '/check_viewer_all'
                    window.location.reload()
                } else {
                    this.dom.find('.back-icon').click()
                }
            })
        }
    }
}
module.exports = markaudit;
