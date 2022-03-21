//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markpreview extends MarkBase {
    constructor(app, api, dom, model) {
            super(app, api, dom, model)
        }
        //初始化加载接口
    apiload() {
        console.log(this.app.parpam)
        this.api.task_read({
            id: this.app.parpam['taskId']
        }).done((value) => {
            this.dom.find('.task-name span').eq(1).html(value.data.name)
            this.model.taskInfo = value.data
        })
        this.dom.find(".back-icon").on("click", () => {
            console.log("woshidianji")
        })
        if (this.app.parpam['type'] != "editor") {
            this.dom.find('.btn-submit2').remove()
        } else {
            this.dom.find('.btn-submit2').on("click", () => {
                this.needSub = {}
                let xi = ""
                for (var i in this.model.seriesResult) {
                    xi = i
                    for (var j in this.model.seriesInfo) {
                        if (this.model.seriesInfo[j].sarId * 1 == i * 1 && this.model.seriesInfo[j].needAnno) {
                            this.needSub[i] = false
                            this.submitSeries(i)
                        }
                    }
                }
                if (JSON.stringify(this.needSub) == "{}") {
                    this.needSub[xi] = false
                    this.submitSeries(xi)
                }

            })
        }
    }
    annotationIteminit() {
        let projectInfo = this.model.projectInfo
        let tool = {}
            //翻译所有的标注组件信息
        let nidusinfo = {
            all: {}
        }
        nidusinfo.all = this.translateData(projectInfo.annotationItemList)
        for (let i = 0; i < projectInfo.imageAnnotationList.length; i++) {
            let teampData = projectInfo.imageAnnotationList[i].annotationItemList
            if (teampData.length != 0) {
                nidusinfo[projectInfo.imageAnnotationList[i].type] = this.translateData(projectInfo.imageAnnotationList[i].annotationItemList)
            }
        }
        this.cornerstoneContorl.model.nidusComponentInfo = Tool.clone(nidusinfo)
        nidusinfo = null
        if (this.app.parpam['type'] != 'viewer_all') {
            this.series_get(this.app.parpam['sid'])
        } else {
            this.model.frompage = {
                taskId: this.app.parpam['taskId'],
                userId: this.app.parpam['uid'],
                page: this.app.parpam['sid'],
                pageSize: 1
            }
            this.api.task_user_series_search(this.model.frompage).done((value) => {
                if (value.data.list.length != 0) {
                    this.series_get(value.data.list[0].serialNumber)
                } else {
                    //return
                    window.location.href =  window.location.origin + '/#!/ytjtaskdetail/' + this.app.parpam['taskId']
                        //this.app.changePage('ytjtaskdetail', { taskid: this.app.parpam['taskId'] })
                }

            })
        }
        if (this.app.parpam['type'] == 'editor') {
            projectInfo.imageAnnotationList.map((item) => {
                item.toolList.map((res) => {
                    if (!tool[res.type]) {
                        tool[res.type] = []
                    }
                    let tempD = JSON.parse(JSON.stringify(res))
                    tempD.imageAnnotation = item.type
                    tempD.imageAnnotationId = item.id
                    tool[res.type].push(tempD)
                })
            })
            this.model.toolInfo = tool
            for (let i in tool) {
                switch (i) {
                    case "ELLIPSE":
                        this.dicommenu.openadd(tool[i], "ellipticalRoi")
                        break
                    case "RECTANGLE":
                        this.dicommenu.openadd(tool[i], "rectangleRoi")
                            //this.dicommenu.openadd(tool[i], "simpleAngle")
                        break
                    case "COBB":
                        this.dicommenu.openadd(tool[i], "cobb")
                        break
                    case "ALIGNMENT":
                        this.dicommenu.openadd(tool[i], "alignment")
                        break
                    case "PEN":
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "POINT":
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "ANGLE":
                        this.dicommenu.openadd(tool[i], "simpleAngle")
                        break
                    case "LINE":
                        this.dicommenu.openadd(tool[i], "length")
                        break
                    case "MAGIC_STICK_SINGLE":
                        this.dicommenu.openadd(tool[i], "magicStickSingle")
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "FREEHAND":
                        this.dicommenu.openadd(tool[i], "freehand")
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "FREEHANDLINE":
                        this.dicommenu.openadd(tool[i], "freehand")
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "POLYGON":
                        this.dicommenu.openadd(tool[i], "polygon")
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "QSELECT":
                        this.dicommenu.openadd(tool[i], "quickselect")
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                    case "REGION_PAINT":
                        this.dicommenu.openadd(tool[i], "regionpaint")
                        this.dicommenu.openadd(tool[i], "brush")
                        this.dicommenu.openadd(tool[i], "earse")
                        break
                }
            }
        }
    }

    start_series() {
        let data = this.model.series_result_id
        console.log(data, 'data')
        for (let i = 0; i < data.seriesInstanceUids.length; i++) {
            //console.log(data.seriesInstanceUids[i])
            let aa = JSON.parse(JSON.stringify(data.seriesInstanceUids[i]))
            this.getSeriesAllImage(aa)
        }
        this.result_get_fromback()
    }
    async getSeriesAllImage(data) {
        let seriesInstanceUid = typeof data.seriesInstanceUid == 'object' ? data.seriesInstanceUid.series : data.seriesInstanceUid
        this.model.seriesInfo[seriesInstanceUid] = {}
        this.app.loading.show()
        let value = await this.api.sys_transfer({
            service: "DR",
            method: '/v1/series/read',
            params: JSON.stringify({
                    "seriesInstanceUID": seriesInstanceUid
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
                        "seriesInstanceUID": seriesInstanceUid,
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
        this.model.seriesInfo[seriesInstanceUid].info = value
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
        this.formatOrigin(value.data.segmentationInfo)
        this.model.seriesInfo[seriesInstanceUid].imgs = [] //res.data.list
        this.model.seriesInfo[seriesInstanceUid].orginImgSizes = JSON.parse(JSON.stringify(this.model._orginImgSizes))
        this.model.orginImgSizes = null
            /*this.getimage({
                "group": data.seriesInstanceUid,
                "fileType": this.imageType,
                'windowType': "1x",
                "numberList": numlist.split(',')
            }, true)*/
        console.log(this.model.seriesInfo[seriesInstanceUid], 'this.model.seriesInfothis.model.seriesInfo')
        this.model.series_result_id.conclusion = value.data.conclusion
        this.model.series_result_id.finding = value.data.finding
        this.model.setData('seriesInfo', this.model.seriesInfo)
        console.log(this.model.seriesInfo, '厉害我hihi')

    }

    //获取需要标注的序列
    series_get(sid) {
        console.log('================')
        if (this.cornerstoneContorl) {
            this.cornerstoneContorl.close()
        }
        if (this.dicommenu) {
            this.dicommenu.resetAll()
        }
        this.app.loading.show()
        this.api.series_result_search({
            type: 'TASK',
            id: this.app.parpam['taskId'],
            serialNumber: sid, // this.app.parpam['sid'],
            userId: this.app.parpam['uid']
        }).done((value) => {
            //console.log(value.data,'==============')
            this.app.loading.hide()
            if (value.data.list[0].discardCode) {
                let str = ''
                str += value.data.list[0].discardReason ? value.data.list[0].discardReason : ""
                this.dom.find('.discard_info').html('<span>当前序列被标为废片，原因：' + str + '</span>')
            }
            if (value.data.list.length != 0) {
                let temp = {}
                let seriesInstanceUids = []
                for (let i = 0; i < value.data.list.length; i++) {
                    let data = value.data.list[i]
                    temp.studyInstanceUid = data.studyInstanceUid
                    seriesInstanceUids.push({
                        seriesAnnotationResultId: data.id,
                        seriesInstanceUid: data.seriesInstanceUid
                    })
                }
                temp.seriesInstanceUids = seriesInstanceUids
                if (!this.model.taskInfo.studyAnno) {
                    temp.studyInstanceUid = temp.seriesInstanceUids[0].seriesInstanceUid
                }
                //let temp = { studyInstanceUid: value.data.studyInstanceUid, seriesInstanceUids: seriesInstanceUids }


                //let temp = { seriesAnnotationResultId: value.data.list[0].id, seriesInstanceUid: value.data.list[0].seriesInstanceUid }
                this.model.setData('series_result_id', temp)
            } else {
                this.dom.find('.back-icon').click()
            }
        })
    }

    //影像区加载
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
    needApiAll(data, apineed, newdata, postData) {
        data.brush = true
        newdata.id = data.backId = data.id
        this.cornerstoneContorl.updataSequencelist(data)
        this.cornerstoneContorl.setbrush(newdata)
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
                res.data.list.push(this.model.imageCacheList[data.windowType][item-1])
            })
        }
        console.log(res, 'dsdadsad')
        this.cornerstoneContorl.makeImage(res)

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
    submitSeries(id, pading) {
        this.api.series_result_read({
            id: id //this.model.series_result_id.seriesAnnotationResultId
        }).done((value) => {
            console.log(value, 'valuevaluevaluevalue', value.data.yayAttributes, this.model.projectInfo)
            this.app.loading.hide()
            if (value.code == 400) {
                window.location.href =  window.location.origin + '/#!/personalaccount'
                window.location.reload()
                return
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
    startSubmit() {
        for (var i in this.needSub) {
            if (this.needSub[i]) {
                return
            }
        }
        this.series_submit()
    }
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
                this.app.changePage('taskdetail', {
                    taskId: this.app.parpam['taskId'],
                    type: this.app.parpam['rid']
                })
                return
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
    btnEvent() {
        this.dom.find('.back-icon').on('click', () => {
            if (this.app.parpam['type'] != "viewer" && this.app.parpam['type'] != "editor") {
                // window.location.href =  window.location.origin + '/#!/ytjtaskdetail/' + this.app.parpam['taskId'] + '/' + this.app.parpam['taskType']
                // window.location.reload()
                this.app.changePage('ytjtaskdetail', {
                    taskid: this.app.parpam['taskId'],
                    taskType: this.app.parpam['taskType']
                })
                return
            } else {
                // window.location.href =  window.location.origin + '/#!/taskdetail/' + this.app.parpam['taskId'] + '/' + this.app.parpam['rid']
                // window.location.reload()
                this.app.changePage('taskdetail', {
                    taskId: this.app.parpam['taskId'],
                    type: this.app.parpam['rid']
                })
                return
            }
        })

        let that = this
        if (this.app.parpam['type'] == 'viewer_all') {
            this.dom.find('.cotrol-btn .btn-submit').on('click', () => {
                // window.location.href =  window.location.origin + '/#!/drapCanvasCheck/' + this.app.parpam['taskId'] + '/' + this.app.parpam['projectId'] + '/' + this.app.parpam['type'] + '/' + this.app.parpam['uid'] + '/' + (this.app.parpam['sid'] * 1 + 1)
                // window.location.reload()
                this.app.changePage('drapCanvasCheck', {
                    taskId: this.app.parpam['taskId'],
                    projectId: this.app.parpam['projectId'],
                    type: this.app.parpam['type'],
                    uid: this.app.parpam['uid'],
                    sid: (this.app.parpam['sid'] * 1 + 1),
                    taskType: this.app.parpam['taskType']
                })
            })
            this.dom.find('.cotrol-btn .btn-submit1').on('click', () => {
                if (this.app.parpam['sid'] * 1 - 1 == 0) {
                    this.alerError('没有上一个序列了！')
                    return
                }
                // window.location.href =  window.location.origin + '/#!/drapCanvasCheck/' + this.app.parpam['taskId'] + '/' + this.app.parpam['projectId'] + '/' + this.app.parpam['type'] + '/' + this.app.parpam['uid'] + '/' + (this.app.parpam['sid'] * 1 - 1)
                // window.location.reload()
                this.app.changePage('drapCanvasCheck', {
                    taskId: this.app.parpam['taskId'],
                    projectId: this.app.parpam['projectId'],
                    type: this.app.parpam['type'],
                    uid: this.app.parpam['uid'],
                    sid: (this.app.parpam['sid'] * 1 - 1),
                    taskType: this.app.parpam['taskType']
                })
            })
        } else {
            this.dom.find('.cotrol-btn .btn-submit').remove()
            this.dom.find('.cotrol-btn .btn-submit1').remove()
        }
    }

}
module.exports = markpreview;
