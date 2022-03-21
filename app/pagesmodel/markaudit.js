class markmodel extends MarkModel {
    constructor(app) {
        super(app)
    }

    //将组件数据翻译后端需要的数据格式进行提交
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
        console.log(postData)
        return postData
    }

    //审核对错的组件返回
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
            if (!databack.doctorNidduleAll[item.doctorId]) {
                databack.doctorNidduleAll[item.doctorId] = item.annotationItemResultList
            }
            item.imageAnnotationResultList.map((res) => {

                res.doctorName = item.doctorName
                res.doctorId=item.doctorId
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
}
module.exports = markmodel;
