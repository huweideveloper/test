class markmodel extends MarkModel {
  constructor(app) {
    super(app)
  }
  //将组件数据翻译后端需要的数据格式进行提交
  changeItemDataToBackend(id, value) {
    let postData = {}
    postData.id = id
    postData.annotationItemResultList = []
    for (var i in value) {
      let data = value[i].result
      if (String(value[i].result).lastIndexOf(",") != -1) {
        data = value[i].result
          .split(",")
          .filter(item => {
            return item
          })
          .toString()
      }
      postData.annotationItemResultList.push({
        annotationItemId: i,
        formComponentId: value[i].formComponentId,
        result: data
      })
    }
    return postData
  }

  //翻译影像标注结果提交给到后端
  makeJsonToBackend(value, handles, needbian) {
    let result
    console.log(this.seriesInfo[value.sId].info.data)
    switch (value.type) {
      case "ELLIPSE":
        let sp = this.seriesInfo[value.sId].info.data.pixelSpacing
          ? this.seriesInfo[value.sId].info.data.pixelSpacing[0]
          : 1
        result = {
          x: (handles.end.x + handles.start.x) / 2,
          y: (handles.end.y + handles.start.y) / 2,
          z: handles.end.z,
          mind:
            Math.min(
              Math.abs(handles.end.x - handles.start.x),
              Math.abs(handles.end.y - handles.start.y)
            ) * sp,
          maxd:
            Math.max(
              Math.abs(handles.end.x - handles.start.x),
              Math.abs(handles.end.y - handles.start.y)
            ) * sp,
          direction: JSON.stringify({
            x: Math.abs(handles.end.x - handles.start.x),
            y: Math.abs(handles.end.y - handles.start.y),
            z: 0
          })
        }
        if (needbian) {
          result.x = result.x * 2
          result.y = result.y * 2
          result.mind = result.mind * 2
          result.maxd = result.maxd * 2
        }
        break
      case "RECTANGLE":
        let minx = Math.min(handles.start.x, handles.end.x)
        let maxx = Math.max(handles.start.x, handles.end.x)
        let miny = Math.min(handles.start.y, handles.end.y)
        let maxy = Math.max(handles.start.y, handles.end.y)
        let startAll = JSON.parse(JSON.stringify(handles.start))
        startAll.x = minx
        startAll.y = miny
        if (needbian) {
          startAll.x = startAll.x * 2
          startAll.y = startAll.y * 2
        }
        let endAll = JSON.parse(JSON.stringify(handles.end))
        endAll.x = maxx
        endAll.y = maxy
        if (needbian) {
          endAll.x = endAll.x * 2
          endAll.y = endAll.y * 2
        }
        result = {
          point1: startAll,
          point2: endAll
        }
        break
      case "ANGLE":
        let startAll1 = JSON.parse(JSON.stringify(handles.start))
        if (needbian) {
          startAll1.x = startAll1.x * 2
          startAll1.y = startAll1.y * 2
        }
        let middleAll1 = JSON.parse(JSON.stringify(handles.middle))
        if (needbian) {
          middleAll1.x = middleAll1.x * 2
          middleAll1.y = middleAll1.y * 2
        }
        let endAll1 = JSON.parse(JSON.stringify(handles.end))
        if (needbian) {
          endAll1.x = endAll1.x * 2
          endAll1.y = endAll1.y * 2
        }
        result = {
          point1: startAll1,
          point2: middleAll1,
          point3: endAll1
        }
        break
      case "PEN":
        break
      case "POINT":
        break
      case "LINE":
        if (needbian) {
          handles.start.x = handles.start.x * 2
          handles.start.y = handles.start.y * 2
          handles.end.x = handles.end.x * 2
          handles.end.y = handles.end.y * 2
        }
        result = {
          point1: handles.start,
          point2: handles.end
        }
        break
      case "COBB":
        result = {
          lineA: [],
          angle: 0
        }
        console.log(value)
        let nowH = JSON.parse(JSON.stringify(handles))
        nowH.map(item => {
          if (needbian) {
            item.start.x = item.start.x * 2
            item.start.y = item.start.y * 2
            item.end.x = item.end.x * 2
            item.end.y = item.end.y * 2
          }
          result.lineA.push({
            point1: item.start,
            point2: item.end
          })
        })
        if (handles.length == 2) {
          result.angle = Tool.calAngel(handles[0], handles[1])
        }
        //result.angle=
        break
      case "ALIGNMENT":
        result = {
          pointA: [],
          dis: 0
        }
        let nowp = JSON.parse(JSON.stringify(handles))
        nowp.map(item => {
          if (item.start) {
            if (needbian) {
              item.start.x = item.start.x * 2
              item.start.y = item.start.y * 2
            }
            result.pointA.push({
              point1: item.start
            })
          } else {
            result.pointA.push({
              point1: null
            })
          }
        })
        break
    }
    return JSON.stringify(result)
  }
  //装换多点
  getpoints(value, type) {
    let bord = null
    switch (type) {
      case "ANNO4":
        bord = 130
        break
    }
    let points = []
    for (let i = 0; i < value.points.length; i++) {
      let ct =
        ((this.seriesInfo[value.sId].info.wwc.hight * 1 -
          this.seriesInfo[value.sId].info.wwc.low * 1) *
          value.points[i].ct) /
          255 +
        this.seriesInfo[value.sId].info.wwc.low * 1
      console.log(ct)
      if (bord) {
        if (ct > bord) {
          points.push([
            Math.round(value.points[i].x) - 1,
            Math.round(value.points[i].y) - 1,
            value.z - 1
          ])
        }
      } else {
        points.push([
          Math.round(value.points[i].x) - 1,
          Math.round(value.points[i].y) - 1,
          value.z - 1
        ])
      }
    }
    return points
  }
}
module.exports = markmodel
