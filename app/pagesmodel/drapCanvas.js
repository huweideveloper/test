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

}
module.exports = drapCanvasM;