/**
 * @class CanvasBase
 * @classdesc 初始化createJS，挂载event事件，渲染画布
 *
 * 对外事件
 * @event 鼠标按下 stageMousedown
 * @event 鼠标松开 stageMouseup
 * @event 鼠标移动 stageMove
 *
 * 暂时只兼容Chrome
 */
class CanvasBase extends MarkBase {
    constructor(app, api, dom, model) {
            super(app, api, dom, model)
        }
        //接口调用，获取信息
    baseApi() {
        //获取项目信息
        this.app.loading.show()
        this.api.annoitem_task_read({
            taskId: this.app.parpam['taskId']
        }).done((value) => {
            this.model.setData('projectInfo', value.data)
        })

        //获取
        this.api.task_read({
            id: this.app.parpam['taskId']
        }).done((value) => {
            this.dom.find('.task-name span').eq(1).html(value.data.name)
            this.model.taskInfo = value.data
        })
    }
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
                //console.log(nidusinfo.all)
                //console.log(projectInfo.imageAnnotationList)
            for (let i = 0; i < projectInfo.imageAnnotationList.length; i++) {
                let teampData = projectInfo.imageAnnotationList[i].annotationItemList
                let xu = 0
                projectInfo.imageAnnotationList[i].annotationItemList.splice(0, 0, this.model.returnSelectComponent())
                projectInfo.imageAnnotationList[i].annotationItemList.map((item) => {
                    item.sequence = xu
                    item.id = item.componentId
                    xu++
                })
                console.log('========')
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
        //************************标注相关*************************
        //获取需要标注的序列
    series_get(sid) {
        if (this.cornerstoneContorl) {
            this.cornerstoneContorl.close()
        }
        if (this.dicommenu) {
            this.dicommenu.resetAll()
        }
        console.log(sid, '=========')
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
            let seriesInstanceUids = []
            for (let i = 0; i < value.data.sarIdList.length; i++) {
                seriesInstanceUids.push({
                    seriesAnnotationResultId: value.data.sarIdList[i],
                    seriesInstanceUid: value.data.seriesList[i]
                })
            }
            //let endInfo = { studyInstanceUid: value.data.studyInstanceUid, seriesInstanceUids: seriesInstanceUids }
            let endInfo = {
                studyInstanceUid: value.data.seriesList[0],
                seriesInstanceUids: seriesInstanceUids
            }
            endInfo.remark = value.data.remark
            this.model.setData('series_result_id', endInfo)
        })
    }
    start_series() {
        let data = this.model.series_result_id
            //console.log(data, 'data')
        for (let i = 0; i < data.seriesInstanceUids.length; i++) {
            //console.log(data.seriesInstanceUids[i])
            //let aa =typeof data.seriesInstanceUids[i].seriesInstanceUid=="object"?data.seriesInstanceUids[i].seriesInstanceUid// JSON.parse(JSON.stringify(data.seriesInstanceUids[i]))
            //console.log(data.seriesInstanceUids[i])
            this.getSeriesAllImage(data.seriesInstanceUids[i])
                //this.getSeriesAllImage(data.seriesInstanceUids[i])
        }
        this.result_get_fromback()
    }
    async getSeriesAllImage(data) {
        let ssId = typeof data.seriesInstanceUid == 'object' ? data.seriesInstanceUid.series : data.seriesInstanceUid
        this.model.seriesInfo[ssId] = {}
        this.app.loading.show()
        let value = await this.api.sys_transfer({
            service: "DR",
            method: '/v1/series/read',
            params: JSON.stringify({
                    "seriesInstanceUID": ssId
                })
                //this.api.series_read({
                //seriesInstanceUID: data.seriesInstanceUid
        })
        this.model.imageCacheList = {}
        for (var tt in value.data.segmentationInfo) {
            if (tt != 'thumbnail') {
                let imageList = await this.api.sys_transfer({
                    service: "DR",
                    method: '/v1/image/query',
                    params: JSON.stringify({
                        "seriesInstanceUID": ssId,
                        "fileType": "BIG_IMAGE",
                        "windowType": tt
                    })
                })

                // test....
                // imageList.data.list && imageList.data.list.forEach(v => {
                //     v.urlWAN = v.urlLAN
                // })
                this.model.imageCacheList[tt] = imageList.data.list
            }
        }

        this.app.loading.hide()
        this.model.seriesInfo[ssId].info = value
        if (!this.model.taskInfo) {
            this.app.alert.show({
                title: ' ',
                msg: '数据异常,点击确认进入下一个序列',
                close: false,
                sure: function() {
                    that.discaseToDone({
                        type: 98,
                        des: '序列加载异常'
                    })
                }
            })
            return
        }
        //console.log(this.model._orginImgSizes, '==============')
        this.formatOrigin(value.data.segmentationInfo)
            //console.log(numlist,'numlistnumlist')
        this.model.seriesInfo[ssId].imgs = [] //res.data.list
        this.model.seriesInfo[ssId].orginImgSizes = JSON.parse(JSON.stringify(this.model._orginImgSizes))
        this.model.orginImgSizes = null
            /*this.getimage({
                "group": data.seriesInstanceUid,
                "fileType": this.imageType,
                'windowType': "1x",
                "numberList": numlist.split(',')
            }, true)*/
        console.log(this.model.seriesInfo[ssId], 'this.model.seriesInfothis.model.seriesInfo')
        this.model.series_result_id.conclusion = value.data.conclusion
        this.model.series_result_id.finding = value.data.finding
        this.model.setData('seriesInfo', this.model.seriesInfo)

    }
    async getimage(data) {
        let res = {
            data: {
                list: []
            }
        }
        if (!this.model.imageCacheList[data.windowType]) {
            res = await this.api.sys_transfer({
                service: "DR",
                method: '/v1/image/query',
                params: JSON.stringify(data)
            })

            // test....
            // res.data.list && res.data.list.forEach(v => {
            //     v.urlWAN = v.urlLAN
            // })
        } else {
            data.numberList.map((item) => {
                res.data.list.push(this.model.imageCacheList[data.windowType][item - 1])
            })
        }
        console.log(res, 'dsdadsad')
        this.cornerstoneContorl.makeImage(res)

    }
    cornerstoneContorlOther() {
        let that = this
        this.cornerstoneContorl.event._addEvent('ctcornerstone.loadImage', (value) => {
            this.getimage(value)
        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.addNode', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNode', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.deleteNode', function(value) {})

        this.cornerstoneContorl.event._addEvent('ctcornerstone.brushfirstload', function(value) {

        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.Allthing', function(value) {
            that.app.loading.show()
            that.api.audit_annoitem_update({
                sarIdList: that.getCurrentSeriesSarId(),
                type: "ANNOITEM",
                resultList: that.model.changeItemDataToBackendCheck(value)
            }).done(() => {
                that.app.loading.hide()
            })
        })

        //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', function(value) {
            let arr = that.model.changeItemDataToBackendCheck(value.chooseData)
            let auditResult = null
            if (value.chooseData['check_reslut'].result == "0") {
                auditResult = true
            }
            if (value.chooseData['check_reslut'].result == "1") {
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
            that.app.loading.show()
            that.api.audit_imganno_audit({
                sarId: that.model.seriesResult[value.sId].data.sarId,
                iarClusterId: value.backId.split('_')[0] * 1,
                auditResult: auditResult
            }).done((res) => {
                ///console.log(res,value)
                that.app.loading.hide()
                if (res.data) {
                    that.app.loading.show()
                    that.api.audit_annoitem_update({
                        sarIdList: String(that.model.seriesResult[value.sId].data.sarId),
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

    /*result_get_fromback() {
        let lists = this.model.series_result_id.seriesInstanceUids
        for (let i = 0; i < lists.length; i++) {
            this.api.series_result_read({
                sarId: lists[i].seriesAnnotationResultId
            }).done((res) => {
                //this.model.seriesResult[lists[i].seriesAnnotationResultId] = res
                this.model.seriesResult[lists[i].seriesAnnotationResultId] = res
                this.model.setData('seriesResult', this.model.seriesResult)
            })
        }
    }*/
    //格式化原图数据
    formatOrigin(data) {
            data.length = 1
            for (let i in data) {
                if (i != 'thumbnail' && i != 'length') {
                    data[i] = JSON.parse(data[i])
                        //console.log(data[i])
                    data[i].row = data[i].rows
                    data[i].colnum = data[i].columns
                    data[i].height = data[i].hieght || data[i].height
                    if (i.replace('x', '') * 1 > data.length) {
                        data.length = i.replace('x', '') * 1
                    }
                }
            }
            this.model.orginImgSizes = data
        }
        //提交整个序列事件
    btnEvent() {
        this.dom.find('.back-icon').on('click', () => {
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
        this.api.series_audit_submit({
            sarIdList: this.getSarIds()
        }).done((value) => {
            this.app.loading.hide()
            if (value.code == 400) {
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

module.exports = CanvasBase
