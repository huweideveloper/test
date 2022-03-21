class drapCanvasM extends MarkModel {
    constructor(app) {
        super(app)
        this._orginImgSizes = {

        }
    }

    set orginImgSizes(value) {
        this.setPrivate(this, { _orginImgSizes: value })
    }
    makeJsonToBackend(value) {
        let arr = []
        let num = 0
        let frist = {}
        let str = JSON.stringify(value)
        arr = null
        return str
    }
    translateDataReslut(value, sId, needbian) {
        value.map((item) => {
            console.log(item)
            if (typeof item.result == "string") {
                let res
                try {
                    res = JSON.parse(item.result)
                } catch (err) {
                    res = item.result
                }
                item.uuid = item.backId = item.id
                item.setDataType = "number"
                item.sId = sId ? sId : null
                switch (item.imageAnnotationToolType) {
                    case "LINE":
                        item.type = 'length'
                        if (needbian) {
                            res.point1.x = res.point1.x / 2
                            res.point1.y = res.point1.y / 2
                            res.point2.x = res.point2.x / 2
                            res.point2.y = res.point2.y / 2
                        }
                        item.result = res
                        item.layerNumber = res.point1.z
                        item.tooltype = 'length'
                        item.toolType = {
                            id: item.imageAnnotationToolId,
                            imageAnnotation: item.imageAnnotationType,
                            imageAnnotationId: item.imageAnnotationId,
                            type: item.imageAnnotationToolType
                        }
                        break
                    case "FREEHANDLINE":
                        item.type = 'freehandline'
                        item.path = {}
                        item.path = res
                        item.layerNumber = 1
                        item.tooltype = 'freehandline'
                        item.toolType = {
                            id: item.imageAnnotationToolId,
                            imageAnnotation: item.imageAnnotationType,
                            imageAnnotationId: item.imageAnnotationId,
                            type: item.imageAnnotationToolType
                        }
                        break
                    case "FREEHAND":
                        item.type = 'freehand'
                        item.path = {}
                        res.map((p) => {
                            item.path[p.x + '_' + p.y] = p
                        })
                        item.tooltype = 'freehand'
                        item.layerNumber = 1
                        item.toolType = {
                            id: item.imageAnnotationToolId,
                            imageAnnotation: item.imageAnnotationType,
                            imageAnnotationId: item.imageAnnotationId,
                            type: item.imageAnnotationToolType
                        }
                        break
                    case "QSELECT":
                        item.type = 'quickselect'
                        item.result = item.result
                        item.tooltype = 'quickselect'
                        item.toolType = {
                            id: item.imageAnnotationToolId,
                            imageAnnotation: item.imageAnnotationType,
                            imageAnnotationId: item.imageAnnotationId,
                            type: item.imageAnnotationToolType
                        }
                        break
                    case "REGION_PAINT":
                        item.type = 'regionpaint'
                        item.result = item.result
                        item.tooltype = 'regionpaint'
                        item.toolType = {
                            id: item.imageAnnotationToolId,
                            imageAnnotation: item.imageAnnotationType,
                            imageAnnotationId: item.imageAnnotationId,
                            type: item.imageAnnotationToolType
                        }
                        break
                }
            }
        })
    }
    changeItemDataToBackendCheck(value) {
        let postData = []
        if (typeof value == 'object' && (value.length != null || value.length != undefined)) {
            value.map((item) => {
                postData.push({
                    componentId: item.formComponentId,
                    result: item.result
                })
            })
        } else {
            for (var i in value) {
                if (value[i].formComponentId != 'check_reslut') {
                    let data = String(value[i].result).split(',').filter((item) => {
                        return item||item=='0'
                    }).toString()
                    postData.push({
                        componentId: value[i].formComponentId,
                        result: data
                    })
                }
            }
        }
        return postData
    }
    changeItemDataToBackend(id, value) {
        let postData = {}
        postData.id = id
        postData.annotationItemResultList = []
        for (var i in value) {
            let data = value[i].result
            if (String(value[i].result).lastIndexOf(',') != -1) {
                data = value[i].result.split(',').filter((item) => {
                    return item
                }).toString()
            }
            postData.annotationItemResultList.push({
                annotationItemId: i,
                formComponentId: value[i].formComponentId,
                result: data
            })
        }
        return postData
    }
    //转变后端数据格式
    translateBackData(value, beiyong) {
        let databack = value.data
        databack.annotationItemResultList = databack.annotationItemResultList ? databack.annotationItemResultList : []
        databack.imageAnnotationResultList = databack.imageAnnotationResultList ? databack.imageAnnotationResultList : []
        databack.doctorNidduleAll = {}
        let check_doctordone = this.check_data_deal(databack)
        //console.log(databack.annoResultList)
        let tempid = {}
        databack.annoResultList.map((item) => {
            if (!databack.doctorNidduleAll[item.doctorName]) {
                databack.doctorNidduleAll[item.doctorName] = item.annotationItemResultList
            }
            item.imageAnnotationResultList.map((res) => {
                res.doctorName = item.doctorName
                res.id = res.iarClusterId + '_' + res.annoIarId //Tool.guid(item.doctorName).substr(0, 8)
                res.annotationItemResultList.map((item1) => {
                    item1.id = item1.formComponentId
                    item1.annotationItemId = item1.formComponentId
                })
                res.orginannotationItemResultList = JSON.parse(JSON.stringify(res.annotationItemResultList))
                res.annotationItemResultList = check_doctordone[res.iarClusterId] ? check_doctordone[res.iarClusterId].annotationItemResultList : []
                res.auditResult = check_doctordone[res.iarClusterId] ? check_doctordone[res.iarClusterId].auditResult : null
                databack.auditResult.imageAnnotationResultList.map((item3)=>{
                    if(res.iarClusterId==item3.iarClusterId){
                        res.imageRemark=item3.imageRemark
                    }
                })
            })
            databack.imageAnnotationResultList = databack.imageAnnotationResultList.concat(item.imageAnnotationResultList)
            item.annotationItemResultList.map((item2) => {
                if (!tempid[item2.formComponentId]) {

                    tempid[item2.formComponentId] = item2.result.split(',').sort((a, b) => {
                        return a - b
                    }).toString()
                } else {
                    if (tempid[item2.formComponentId] != null) {
                        if (tempid[item2.formComponentId] != item2.result.split(',').sort((a, b) => {
                                return a - b
                            }).toString()) {
                            tempid[item2.formComponentId] = null
                        }
                    }
                }
            })
        })
        databack.imageAnnotationResultList = databack.imageAnnotationResultList.sort((a, b) => {
            return a.iarClusterId - b.iarClusterId
        })
        let checkdoctorscore = {}
        databack.auditResult.annotationItemResultList.map((item) => {
            checkdoctorscore[item.formComponentId] = item.result
            //item.annotationItemId = item.formComponentId
        })

        //databack.annotationItemResultList = databack.auditResult.annotationItemResultList
        beiyong.map((item3) => {
            let rest = ""
            if (checkdoctorscore[item3.componentId]) {
                rest = checkdoctorscore[item3.componentId]
            }
            if (tempid[item3.formComponentId] && !rest) {
                rest = tempid[item3.formComponentId]
            }
            databack.annotationItemResultList.push({
                formComponentId: item3.componentId,
                annotationItemId: item3.componentId,
                id: item3.componentId,
                result: rest
            })
        })
        console.log(databack.annotationItemResultList, '=====================', tempid, value)
    }
    check_data_deal(value) {
        let tempData = {}
        //console.log(value.auditResult)
        value.auditResult.imageAnnotationResultList.map((item) => {
            if (!tempData[item.iarClusterId]) {
                //console.log(item.annotationItemResultList,'==============')
                if (item.annotationItemResultList) {
                    item.annotationItemResultList.map((res) => {
                        res.id = res.formComponentId
                        res.annotationItemId = res.formComponentId
                    })

                    let auditResult = ""
                    if (item.auditResult == false) {
                        auditResult = "1"
                    }
                    if (item.auditResult == true) {
                        auditResult = "0"
                    }
                    item.annotationItemResultList.splice(0, 0, {
                        formComponentId: 'check_reslut',
                        result: auditResult,
                        id: 'check_reslut',
                        annotationItemId: 'check_reslut'
                    })
                }
                tempData[item.iarClusterId] = item
            }
        })
        return tempData
    }
    returnSelectComponent() {
        return {
            componentCode: "check_reslut",
            componentData: '[{"text":"对","code":"0"},{"text":"错","code":"1"}]',
            componentId: "check_reslut",
            componentName: "正确与否",
            componentParameter: '{"isdefault ":false}',
            componentType: "select",
            optional: true,
            sequence: 0
        }
    }

}
module.exports = drapCanvasM;