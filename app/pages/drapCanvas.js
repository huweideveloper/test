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
    apiload() {
        this.api.task_read({
                id: this.app.parpam['taskId']
            }).done((value) => {
                this.dom.find('.task-name span').eq(1).html(value.data.name)
                this.model.taskInfo = value.data
                this.model.taskInfo.studyAnno = value.data.studyAnno
            })
            /*this.api.series_cache({
                userId: this.useinfo.userId,
                taskId: this.app.parpam['taskId']
            }).done((value) => {
                this.model.cachelist = value.data
            })*/
    }

    //************************标注相关*************************
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
        this.app.loading.show()

        this.api.series_get({
            taskId: this.app.parpam['taskId'],
            userId: this.useinfo.userId
        }).done((value) => {
            this.app.loading.hide()
            console.log(value, "我是返回值")
                // alert("你好啊")
            if (value.code == 1001) {
                window.location.href =  window.location.origin + '/#!/personalaccount' //this.app.changePage('personalaccount')
                window.location.reload()
            }
            if (!value.data) {
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
            }
            if (value.data.taskStatus == 3 || value.data.taskStatus == 4) {
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
            }
            let serLength = value.data.sarIdList.length
            let seriesInstanceUids = []
            for (let i = 0; i < serLength; i++) {
                seriesInstanceUids.push({
                    seriesAnnotationResultId: value.data.sarIdList[i],
                    seriesInstanceUid: value.data.seriesList[i]
                })
            }
            let endInfo = {
                studyInstanceUid: value.data.studyInstanceUid,
                seriesInstanceUids: seriesInstanceUids
            }
            if (!this.model.taskInfo.studyAnno) {
                endInfo.studyInstanceUid = endInfo.seriesInstanceUids[0].seriesInstanceUid
            }

            /*let temp = {
                seriesAnnotationResultId: value.data.seriesAnnotationResultId,
                seriesInstanceUid: value.data.seriesInstanceUid
            }*/
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

        this.cornerstoneContorl.event._addEvent('ctcornerstone.loadImage', (value) => {
            this.getimage(value)
        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.addNode', (value) => {
            console.log(value, this.model.seriesInfo[value.sId])
            let postData = {}
            postData.seriesAnnotationResultId = this.model.seriesInfo[value.sId].sarId // that.model.seriesResult.data.id //.info.data.seriesInstanceUID
            postData.imageAnnotationId = value.toolType.imageAnnotationId
            postData.imageAnnotationToolId = value.toolType.id
            postData.result = this.model.makeJsonToBackend(value.path)
                //console.log(postData.result)
            this.api.image_result_create(postData).done((res) => {
                this.app.loading.hide()
                value.backId = res.data.id
                this.cornerstoneContorl.updataSequencelist(value)
            })
        })

        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNode', (value) => {
            let postData = {}
            console.log(value)
            postData.id = value.backId
            postData.imageAnnotationId = value.imageAnnotationId
            postData.imageAnnotationToolId = value.imageAnnotationToolId
            postData.result = this.model.makeJsonToBackend(value.path)
            this.app.loading.show()
            this.api.image_result_update(postData).done((res) => {
                this.app.loading.hide()
            })
        })
        this.cornerstoneContorl.event._addEvent('ctcornerstone.deleteNode', (value) => {
                this.app.loading.show()
                this.api.image_result_delete({
                    id: value.backId
                }).done((res) => {
                    this.app.loading.hide()
                })
            })
            //获取整个序列的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.Allthing', (value) => {
                this.app.loading.show()
                let data = this.model.changeItemDataToBackend(this.model.taskInfo.id, value)
                    //data.taskId = that.model.taskInfo.id
                    //data.studyInstanceUid = that.model.series_result_id.studyInstanceUid
                data.sarIdList = this.getCurrentSeriesSarId()
                this.api.series_result_item_edit(data).done(() => {
                    this.app.loading.hide()
                })
            })
            //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', (value) => {
            this.app.loading.show()
            this.api.image_result_item_edit(this.model.changeItemDataToBackend(value.backId, value.chooseData)).done(() => {
                this.app.loading.hide()
            })
        })
    }

    result_get_fromback() {
            let lists = this.model.series_result_id.seriesInstanceUids
            for (let i = 0; i < lists.length; i++) {
                this.api.series_result_read({
                    id: lists[i].seriesAnnotationResultId
                }).done((res) => {
                    //this.model.seriesResult[lists[i].seriesAnnotationResultId] = res
                    if (res.data.discardCode) {
                        let str = ''
                        str += res.data.discardReason ? res.data.discardReason : ""
                        this.dom.find('.discard_info').html('<span>当前序列被标为废片，原因：' + str + '</span>')
                    }
                    this.model.seriesResult[lists[i].seriesAnnotationResultId] = res
                    this.model.setData('seriesResult', this.model.seriesResult)
                })
            }
        }
        // 格式化原图数据
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
        //************************废片区*************************
    discaseToDone(value, dom) {
            let ids = this.getSarIds()
            let that = this
            this.alertSubmit.show({
                title: ' ',
                msg: '确认提交该序列？提交后该序列将不再修改',
                closeSure: function() {
                    that.app.loading.show()
                    that.api.series_discard({
                        sarIdList: ids,
                        //taskId: that.model.taskInfo.id,
                        //studyInstanceUid: that.model.series_result_id.studyInstanceUid,
                        //id: that.model.series_result_id.seriesAnnotationResultId,
                        discardCode: value.type,
                        discardReason: value.des
                    }).done((value) => {
                        that.app.loading.hide()
                        window.location.href =  window.location.origin + '/#!/personalaccount'
                        window.location.reload()
                            // that.app.changePage('personalaccount')
                    })
                },
                sure: function() {
                    that.app.loading.show()
                    that.api.series_discard({
                        sarIdList: ids,
                        //taskId: that.model.taskInfo.id,
                        //studyInstanceUid: that.model.series_result_id.studyInstanceUid,
                        //id: that.model.series_result_id.seriesAnnotationResultId,
                        discardCode: value.type,
                        discardReason: value.des
                    }).done((value) => {
                        that.app.loading.hide()
                        window.location.reload();
                        //that.series_get()
                    })
                }
            })
        }
        //************************废片区*************************
        //************************弹框区*************************
        //提交整个序列事件
    btnEvent() {
            this.dom.find('.back-icon').on('click', () => {

                window.location.href =  window.location.origin + '/#!/personalaccount' //this.app.changePage('personalaccount')
                window.location.reload()
            })
            let that = this
            this.dom.find('.cotrol-btn .btn-submit').on('click', () => {
                //this.model.doneNum += 1
                this.needSub = {}
                this.alertSubmit.show({
                    title: ' ',
                    msg: '确认提交该序列？提交后该序列将不再修改',
                    closeSure: function() {
                        that.model.doneNum = -1
                        that.alertSubmit.hide()
                        that.app.loading.show()
                        let xi = ""
                        for (var i in that.model.seriesResult) {
                            xi = i
                            for (var j in that.model.seriesInfo) {
                                if (that.model.seriesInfo[j].sarId * 1 == i * 1 && that.model.seriesInfo[j].needAnno) {
                                    that.needSub[i] = false
                                    that.submitSeries(i)
                                }
                            }
                        }
                        if (JSON.stringify(that.needSub) == "{}") {
                            that.needSub[xi] = false
                            that.submitSeries(xi)
                        }
                    },
                    sure: function() {
                        that.model.doneNum = 3
                        that.alertSubmit.hide()
                        that.app.loading.show()
                        let xi = ""
                        for (var i in that.model.seriesResult) {
                            xi = i
                            for (var j in that.model.seriesInfo) {
                                if (that.model.seriesInfo[j].sarId * 1 == i * 1 && that.model.seriesInfo[j].needAnno) {
                                    that.needSub[i] = false
                                    that.submitSeries(i)
                                }
                            }
                        }
                        if (JSON.stringify(that.needSub) == "{}") {
                            that.needSub[xi] = false
                            that.submitSeries(xi)
                        }
                    }
                })
            })
        }
        //提交当前在标注的序列
    submitSeries(id, pading) {
        this.api.series_result_read({
            id: id //this.model.series_result_id.seriesAnnotationResultId
        }).done((value) => {
            console.log(value, 'valuevaluevaluevalue', value.data.yayAttributes, this.model.projectInfo)
            this.app.loading.hide()
            if (value.code == 400) {
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
            }
            if (this.model.projectInfo.yayAttributes == value.data.yayAttributes) {
                this.startSubmit()
                return false
            }
            let data = value.data
            let conmponentInfo = this.cornerstoneContorl.model.nidusComponentInfo
                //判断大征象是否完成了
            let allnid = this.allnidussubmit(data)
            if (!allnid) {
                return true
            }
            console.log(conmponentInfo, 'conmponentInfoconmponentInfoconmponentInfo')
            pading = false
                //console.log(data)
            for (let i = 0; i < data.imageAnnotationResultList.length; i++) {
                let item = data.imageAnnotationResultList[i]
                let optionLength = 0
                for (let wn in conmponentInfo[item.imageAnnotationType]) {
                    if (conmponentInfo[item.imageAnnotationType][wn].optional) {
                        optionLength++
                    }
                }
                if (item.annotationItemResultList == null && optionLength != 0) {
                    for (let w in conmponentInfo[item.imageAnnotationType]) {
                        if (conmponentInfo[item.imageAnnotationType][w].optional) {
                            this.errorShow(item, conmponentInfo[item.imageAnnotationType][w])
                            pading = true
                            return true
                        }

                    }
                }
                if (item.annotationItemResultList) {
                    //后台记录的必填项数据比真实必填项个数不一致
                    if (optionLength) {
                        let idsAll = ','
                        for (let j = 0; j < item.annotationItemResultList.length; j++) {
                            let res = item.annotationItemResultList[j]
                            if (res.result) {
                                idsAll += res.annotationItemId + ','
                            }
                        }
                        for (let w in conmponentInfo[item.imageAnnotationType]) {
                            if (idsAll.lastIndexOf(',' + w + ',') == -1 && conmponentInfo[item.imageAnnotationType][w].optional) {
                                this.errorShow(item, conmponentInfo[item.imageAnnotationType][w])
                                pading = true
                                return true
                            }
                        }
                    }
                    //后台记录的必填项数据跟真实必填项个数不一致，判断哪个必填项值为空
                    for (let j = 0; j < item.annotationItemResultList.length; j++) {
                        let res = item.annotationItemResultList[j]
                        if (!res.result && conmponentInfo[item.imageAnnotationType][res.annotationItemId].optional) {
                            pading = true
                            this.errorShow(item, conmponentInfo[item.imageAnnotationType][res.annotationItemId])
                            return true
                        }
                    }
                }
            }
            console.log(data.imageAnnotationResultList, data.annotationItemResultList, 'asdasda')
                // if (data.imageAnnotationResultList.length == 0 && data.annotationItemResultList.length == 0) {
                //   pading = true
                //   this.alerError('请检查你是否进行了标注')
                //   return true
                // }
            this.startSubmit()
                //return now
                //console.log(now, 'now')
                //return
        })
    }
    startSubmit() {
        for (var i in this.needSub) {
            if (this.needSub[i]) {
                return
            }
        }
        this.series_submit()
    }
    allnidussubmit(data) {
        let conmponentInfo = this.cornerstoneContorl.model.nidusComponentInfo
        let now = false
            //console.log(conmponentInfo.all)
        for (let i in conmponentInfo.all) {
            if (i != 'annotationItemResultList') {
                let allitem = conmponentInfo.all[i]
                if (allitem.optional) {
                    let nowS = false
                    data.annotationItemResultList.map((item) => {
                        if (item.annotationItemId == i && item.result) {
                            nowS = true
                        }
                    })
                    if (!nowS) {
                        this.alerError('“序列整体标注信息”的“' + allitem.componentName + '”为必填项，请填写完整。')
                        return false
                    }
                }
            }
        }
        if (data.annotationItemResultList.length == 0) {
            for (let ww in conmponentInfo.all.annotationItemResultList) {
                console.log(conmponentInfo.all)
                if (conmponentInfo.all.annotationItemResultList[ww].optional) {
                    this.alerError('“序列整体标注信息”的“' + conmponentInfo.all.annotationItemResultList[ww].componentName + '”为必填项，请填写完整。')
                    return false
                }
            }
        }
        return true
    }

    //经过检查能够进行提交了
    series_submit() {
        let ids = this.getSarIds()
        this.app.loading.show()
        this.api.series_result_submit({
            sarIdList: ids,
            //taskId: this.model.taskInfo.id,
            //studyInstanceUid: this.model.series_result_id.studyInstanceUid
            //      id: this.model.series_result_id.seriesAnnotationResultId
        }).done(() => {
            this.app.loading.hide()
            console.log(this.model.doneNum)
                //return
            if (this.model.doneNum == -1) {
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
                    //this.app.changePage('personalaccount')
                return
            }
            window.location.reload();
            /*if (this.model.doneNum > this.model.cachelist.length) {
                this.submitFinish()
                return
            }
            this.series_get()*/
        })
    }

    //检查报错部分并且要显示的部分
    errorShow(item, node) {
            this.cornerstoneContorl.openSequenceNode(item)
                //let msg = this.app.disease[item.imageAnnotationType] + '_' + item.id
            let temp = Tool.configobjformat(this.app.constmap.LESION)
            let msg = temp[item.imageAnnotationType] + '_' + item.id
            msg += '的“' + node.componentName + '”为必填项，请填写完整。'
            this.alerError(msg)
        }
        //缓存里面的序列用完了以后的事情
    submitFinish(data) {
        this.app.alert.show({
            title: ' ',
            msg: '需要加载新一批标注，请耐心等待',
            close: true,
            sure: function() {
                window.location.reload();
            }
        })
    }

}
module.exports = CanvasBase
