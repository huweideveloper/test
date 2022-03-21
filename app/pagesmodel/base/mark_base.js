class MarkModel extends Interstellar.modelBase {
  constructor(app) {
    super(app)

    //taskInfo任务详情
    //projectInfo项目详情
    //cachelist缓存列表

    //series_result_id 标注列表的id和对应的序列id

    //seriesInfo序列详情
    //seriesResult这个序列下面的标注结果

    //loadData根据用户标注了多少钙化灶的信息，然后进行加载。整体加载完了，关闭弹框

    //taskInfo里面会记录他隶属的项目是否按照检查号标注
    this.___auto = true

    this.taskInfo = {}
    this.projectInfo = {}
    this.cachelist = {}
    this.seriesInfo = {}
    this.seriesResult = {}
    this.series_result_id = {
      seriesAnnotationResultId: "",
      seriesInstanceUid: ""
    }
    this.userInfo = {}
    this.doneNum = 0
    this.toolInfo = {}

    this.loadData = {
      total: 0,
      num: 0
    }
  }

  translateWord(value) {
    switch (value) {
      case "LINE":
        return "length"
        break
      case "COBB":
        return "cobb"
        break
      case "ALIGNMENT":
        return "alignment"
        break
      case "FREEHANDLINE":
        return "freehandline"
        break
      case "ELLIPSE":
        return "ellipticalRoi"
        break
      case "RECTANGLE":
        return "rectangleRoi"
        break
      case "ANGLE":
        return "simpleAngle"
        break
      case "MAGIC_STICK_SINGLE":
        return "magicStickSingle"
        break
      case "POLYGON":
        return "polygon"
        break
      case "FREEHAND":
        return "freehand"
        break
      case "QSELECT":
        return "quickselect"
        break
      case "REGION_PAINT":
        return "regionpaint"
        break
    }
  }

  //将后端还回来的数据转换成画图控件可以用的数据，根据不同类型进行相应的装换
  translateDataReslut(value, sId, needbian) {
    value.map(item => {
      if (typeof item.result == "string") {
        let res
        try {
          res = JSON.parse(item.result)
        } catch (err) {
          res = item.result
        }
        //let res=JSON.parse('{"point1":{"x":897.2789968652032,"y":2016.5360501567397,"highlight":true,"active":false,"z":1},"point2":{"x":1479.833855799373,"y":1236.808777429467,"highlight":true,"active":true,"z":1}}')
        item.uuid = item.backId = item.id
        item.setDataType = "number"
        item.sId = sId ? sId : null
        switch (item.imageAnnotationToolType) {
          case "LINE":
            item.type = "length"
            if (needbian) {
              res.point1.x = res.point1.x / 2
              res.point1.y = res.point1.y / 2
              res.point2.x = res.point2.x / 2
              res.point2.y = res.point2.y / 2
            }
            item.result = res
            item.layerNumber = res.point1.z * 1
            item.tooltype = "length"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "COBB":
            item.type = "cobb"
            res.lineA.map(item => {
              if (needbian) {
                item.point1.x = item.point1.x / 2
                item.point1.y = item.point1.y / 2
                item.point2.x = item.point2.x / 2
                item.point2.y = item.point2.y / 2
              }
            })
            item.result = res
            item.lineA = []
            res.lineA.map(itemw => {
              item.lineA.push({
                end: {
                  x: itemw.point2.x,
                  y: itemw.point2.y
                },
                start: {
                  x: itemw.point1.x,
                  y: itemw.point1.y
                }
              })
            })
            item.layerNumber = res.lineA[0].point1.z
            item.tooltype = "cobb"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "ALIGNMENT":
            item.type = "alignment"
            res.pointA.map(item => {
              if (needbian && item.point1) {
                item.point1.x = item.point1.x / 2
                item.point1.y = item.point1.y / 2
              }
            })
            item.result = res
            item.pointA = []
            res.pointA.map(itemw => {
              if (itemw.point1) {
                item.pointA.push({
                  start: {
                    x: itemw.point1.x,
                    y: itemw.point1.y
                  }
                })
                item.layerNumber = itemw.point1.z
              } else {
                item.pointA.push({})
              }
            })
            //item.layerNumber = res.pointA[0].point1.z
            item.tooltype = "alignment"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "FREEHANDLINE":
            item.type = "freehandline"
            if (needbian) {
              res.point1.x = res.point1.x / 2
              res.point1.y = res.point1.y / 2
              res.point2.x = res.point2.x / 2
              res.point2.y = res.point2.y / 2
            }
            item.result = res
            item.layerNumber = res.point1.z
            item.tooltype = "freehandline"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "ELLIPSE":
            let sp = this.seriesInfo[sId].info.data.pixelSpacing
              ? this.seriesInfo[sId].info.data.pixelSpacing[0]
              : 1
            item.type = "ellipticalRoi"
            if (needbian) {
              res.x = res.x / 2
              res.y = res.y / 2
              res.maxd = res.maxd / 2
              res.mind = res.mind / 2
            }
            item.layerNumber = res.z
            item.result = {}
            item.result = {
              point1: {
                x: res.x - (0.5 * res.maxd) / sp,
                y: res.y - (0.5 * res.maxd) / sp
              },
              point2: {
                x: res.x + (0.5 * res.maxd) / sp,
                y: res.y + (0.5 * res.maxd) / sp
              }
            }

            item.tooltype = "ellipticalRoi"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "RECTANGLE":
            item.type = "rectangleRoi"
            if (needbian) {
              res.point1.x = res.point1.x / 2
              res.point1.y = res.point1.y / 2
              res.point2.x = res.point2.x / 2
              res.point2.y = res.point2.y / 2
            }
            item.result = res
            item.layerNumber = res.point1.z
            item.tooltype = "rectangleRoi"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "ANGLE":
            item.type = "simpleAngle"
            if (needbian) {
              res.point1.x = res.point1.x / 2
              res.point1.y = res.point1.y / 2
              res.point2.x = res.point2.x / 2
              res.point2.y = res.point2.y / 2
              res.point3.x = res.point3.x / 2
              res.point3.y = res.point3.y / 2
            }
            item.result = res
            item.layerNumber = res.point1.z
            item.tooltype = "simpleAngle"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "MAGIC_STICK_SINGLE":
            item.type = "magicStickSingle"
            item.result = item.result
            item.tooltype = "magicStickSingle"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "POLYGON":
            item.type = "polygon"
            item.result = item.result
            item.tooltype = "polygon"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "FREEHAND":
            item.type = "freehand"
            item.result = item.result
            item.tooltype = "freehand"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "QSELECT":
            item.type = "quickselect"
            item.result = item.result
            item.tooltype = "quickselect"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "REGION_PAINT":
            item.type = "regionpaint"
            item.result = item.result
            item.tooltype = "regionpaint"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          case "IMAGE_TAG":
            item.type = "imagetag"
            item.result = res
            item.layerNumber = res.z
            item.tooltype = "imagetag"
            item.toolType = {
              id: item.imageAnnotationToolId,
              imageAnnotation: item.imageAnnotationType,
              imageAnnotationId: item.imageAnnotationId,
              type: item.imageAnnotationToolType
            }
            break
          default:
            item.type = item.imageAnnotationToolType.toLowerCase()
            item.result = item.result
            item.tooltype = item.imageAnnotationToolType.toLowerCase()
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
  getpoints(value, length, num) {
    let points = []
    if (num == 1) {
      return [[Math.round(value.x), Math.round(value.y), value.z]]
    }
    for (let i = 0; i < num; i++) {
      let point = [
        Math.round(value.x - length + 2 * Math.random() * length),
        Math.round(value.y - length + 2 * Math.random() * length),
        value.z
      ]
      points.push(point)
    }
    return points
  }
  getImages(images, flag, total) {
    if (!images) {
      return []
    }
    let newImages = []
    images.map(item => {
      let num = item.number
      if (flag == 0) {
        newImages[num - 1] = item.urlWAN || item.urlWan
      } else {
        newImages[total - num + 1] = item.urlWAN || item.urlWan
      }
    })
    return newImages
  }
  getImagesBack(images, flag, total) {
    if (!images) {
      return []
    }
    let newImages = []
    images.map(item => {
      //console.log(item)
      //let num = Tool.changeToName(item.urlWAN || item.urlWan, 'png')
      newImages[item.number] = item.urlWAN || item.urlWan
    })
    return newImages
  }
  //判断是不是x光
  judgeX(fileType, modality) {
    if (
      fileType == "DCM" &&
      (modality == "DX" ||
        modality == "DR" ||
        modality == "CR" ||
        modality == "CX")
    ) {
      return true
    }
    return false
  }
  //判断是不是CT，MR，MRI
  judgeCT(fileType, modality) {
    if (
      fileType == "DCM" &&
      modality != "DX" &&
      modality != "DR" &&
      modality != "CR" &&
      modality != "CX"
    ) {
      return true
    }
    return false
  }
}
window.MarkModel = window.MarkModel || MarkModel
module.exports = MarkModel
