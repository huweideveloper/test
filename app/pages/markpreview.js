//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markpreview extends MarkBase {
    constructor(app, api, dom, model) {
            super(app, api, dom, model)
        }
        //初始化加载接口
    apiload() {
        this.api.project_basic_read({
            id: this.app.parpam['projectId']
        }).done((value) => {
            this.dom.find('.task-name span').eq(1).html(value.data.name)
            this.dom.find('.infojian').html('返回项目')
            this.model.taskInfo = value.data
        })
        this.dom.find('.cotrol-btn .btn-pause').remove()
    }

    //获取需要标注的序列
    series_get() {
            if (this.cornerstoneContorl) {
                this.cornerstoneContorl.close()
            }
            if (this.dicommenu) {
                this.dicommenu.resetAll()
            }
            this.model.seriesInfo = {}
            this.model.seriesResult = {}
            this.pageNum = this.pageNum ? (this.pageNum + 1) : 1
            this.app.loading.show()
            this.api.project_series_next({
                projectId: this.app.parpam['projectId']
            }).done((value) => {
                this.app.loading.hide()

                let serLength = value.data.seriesList.length
                let seriesInstanceUids = []
                for (let i = 0; i < serLength; i++) {
                    seriesInstanceUids.push({
                        seriesAnnotationResultId: 30 + i,
                        seriesInstanceUid: value.data.seriesList[i],
                        needAnno: true
                    })
                }
                let temp = {
                    studyInstanceUid: value.data.studyInstanceUid,
                    seriesInstanceUids: seriesInstanceUids
                }
                if (!this.model.taskInfo.studyAnno) {
                    temp.studyInstanceUid = temp.seriesInstanceUids[0].seriesInstanceUid
                }
                this.model.setData('series_result_id', temp)
                let lists = this.model.series_result_id.seriesInstanceUids
                for (let i = 0; i < lists.length; i++) {
                    this.model.seriesResult[lists[i].seriesAnnotationResultId] = {
                        data: {
                            "auditId": null,
                            "annotationItemResultList": [],
                            "seriesInstanceUid": lists[i].seriesInstanceUid,
                            "submitTime": null,
                            "imageAnnotationResultList": [],
                            "id": lists[i].seriesAnnotationResultId,
                            "algVersionId": null,
                            "userId": "",
                            "projectId": this.app.parpam['projectId'],
                            "taskId": this.app.parpam['taskId'],
                            "status": 1
                        }
                    }
                }
                this.model.setData('seriesResult', this.model.seriesResult)
                    /*this.model.setData('seriesResult', {
                        data: {
                            "auditId": null,
                            "annotationItemResultList": [],
                            "seriesInstanceUid": temp.seriesInstanceUID,
                            "submitTime": null,
                            "imageAnnotationResultList": [],
                            "id": 30,
                            "algVersionId": null,
                            "userId": "",
                            "projectId": this.app.parpam['projectId'],
                            "taskId": this.app.parpam['taskId'],
                            "status": 1
                        }
                    })*/
            })
        }
        //影像区加载
    cornerstoneContorlOther() {
        let that = this
            //对于图片上面的影像标注操作
        this.cornerstoneContorl.event._addEvent('ctcornerstone.addNode', function(value) {

        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNode', function(value) {

        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.deleteNode', function(value) {

            })
            //获取整个序列的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.Allthing', function(value) {

            })
            //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', function(value) {

            })
            //-------------------------------魔法棒的处理-------------------------------
            //魔法棒点击去调用接口进行后续处理
        this.cornerstoneContorl.event._addEvent('ctcornerstone.makeMagic', function(value) {
                //console.log(value)
                let dataToolType = that.dicommenu.chooseData.data
                value.ct.hu = (that.model.seriesInfo.info.wwc.hight * 1 - that.model.seriesInfo.info.wwc.low * 1) * value.ct.hu / 255 + that.model.seriesInfo.info.wwc.low * 1
                if (dataToolType.imageAnnotation == "ANNO4") {
                    if (value.ct.hu < 130) {
                        that.app.alert.show({
                            title: ' ',
                            msg: '提交的点CT值不符合要求，请重新选择CT值大于130的点位。',
                            close: true
                        })
                        that.cornerstoneContorl.removeSequencelist(value)
                        return
                    }
                }
                that.app.alert.show({
                    title: ' ',
                    msg: '确认提交影像标注的标注位置？提交后将自动生成影像标注区域，请耐心等待。<br />请填写CT差值：<input class="ct_d" type="text" value="200" style="width: 60px;">',
                    close: true,
                    closeSure: function() {
                        that.cornerstoneContorl.removeSequencelist(value)
                    },
                    sure: async function() {
                        //console.log(that.app.alert.dom.find('.ct_d').val())
                        //return
                        let ctVal = isNaN(that.app.alert.dom.find('.ct_d').val()) ? 0 : that.app.alert.dom.find('.ct_d').val() * 1
                        that.model.loadData = {
                            total: 1,
                            num: 0
                        }
                        let points = value.e.detail.currentPoints.image
                        if (that.model.seriesInfo.info.wwc.flag * 1 == 1) {
                            value.layerNumber = that.model.seriesInfo.imgsTotal - value.layerNumber + 1
                        }
                        //value.ct.hu = (that.model.seriesInfo.info.wwc.hight * 1 - that.model.seriesInfo.info.wwc.low * 1) * value.ct.hu / 255 + that.model.seriesInfo.info.wwc.low * 1
                        let backData = {
                            points: that.model.getpoints({
                                points: value.points,
                                z: value.layerNumber
                            }, dataToolType.imageAnnotation),
                            threshUp: value.ct.hu * 1 + ctVal, // that.dicommenu.chooseData.ctVal * 1, //value.toolType.userChoose ? value.toolType.userChoose.yzmax * 1 : 130,
                            threshDown: value.ct.hu * 1 - ctVal, // that.dicommenu.chooseData.ctVal * 1 //value.toolType.userChoose ? value.toolType.userChoose.yzmin * 1 : 4000
                        }
                        if (dataToolType.imageAnnotation == "ANNO4") {
                            backData.threshDown = backData.threshDown < 130 ? 130 : backData.threshDown
                        }
                        let magicloadingClass = require("../modal/magicloading/magicloading.js")
                        that.magicloading = that.app.loadModal(magicloadingClass, {
                            adv: true
                        })
                        for (var i in that.model.seriesResult) {
                            for (var j in that.model.seriesInfo) {
                                if (that.model.seriesInfo[j].sarId * 1 == i * 1 && that.model.seriesInfo[j].needAnno) {
                                    try {
                                        let resCreate = await that.api.magicToolCerate({
                                            sarId: i,
                                            param: JSON.stringify(backData),
                                            imgToolId: value.toolType.id
                                        })
                                      if(resCreate.code == 0) {
                                        let resRead = await that.api.magicToolRead({
                                          id: resCreate.data.iarId
                                        })
                                        console.log(value, 'wishing第三')
                                        that.baseMagicTranData(resCreate.data.iarId, resRead, value, true, i)
                                      }else{
                                        that.app.alert.show({
                                          title: ' ',
                                          msg:resCreate.msg,
                                          close: true,
                                          footer: true
                                        })
                                      }
                                    } catch (err) {}
                                    that.magicloading.hide()
                                }
                            }
                        }
                    }
                })
            })
            //点完魔法棒拿算法返回的所有图片以后触发的事件
        this.cornerstoneContorl.event._addEvent('ctcornerstone.brushfirstload', function(value) {
                that.magicloading.hide()
            })
            //编辑魔法棒
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editBrush', function(value) {

        })
    }
    needApiAll(data, apineed, newdata, postData) {
            data.brush = true
            newdata.id = data.backId = data.id
            this.cornerstoneContorl.updataSequencelist(data)

            this.cornerstoneContorl.setbrush(newdata)
        }
        //影像区加载
        //************************废片区*************************
    discaseToDone(value, dom) {
            let that = this
            this.alertSubmit.show({
                title: ' ',
                msg: '确认提交该序列？提交后该序列将不再修改',
                closeSure: function() {
                    window.location.href =  window.location.origin + '/#!/createprothree/' + this.app.parpam['taskId'] + '/' + this.app.parpam['projectId']
                    window.location.reload()
                },
                sure: function() {
                    that.series_get()
                }
            })
        }
        //************************废片区*************************
    btnEvent() {
        let page = this.app.parpam['projectType'] == 1 ? 'createprothree' : 'createbackflowpro3'
        this.dom.find('.back-icon').on('click', () => {
            window.location.href =  window.location.origin + '/#!/' + page + '/edit' + '/' + this.app.parpam['projectId'] + '/' + this.app.parpam['status']
            window.location.reload()
        })
        this.dom.find('.cotrol-btn .btn-submit').remove()
        this.dom.find('.cotrol-btn .btn-submit1').remove()
    }
}
module.exports = markpreview;
