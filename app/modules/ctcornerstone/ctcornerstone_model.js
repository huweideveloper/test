//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
//存放在里面用的一些静态信息。这些都是由接口获取的，然后由页面直接传入
/*
nidusComponentInfo 保存所有组件信息。组件信息分为两块，一块是整体序列的信息，key值为all
另外一块是病症的组件信息。分别以病症的命名来保存的

nidusComponentData 保存每个被标注出来的病症的组件数据是什么

nidusChoose 选择了的病灶信息
*/

class ctmanage extends Interstellar.modelBase {
  constructor(app) {
        super(app)
        this.nidusComponentInfo = {}
        this.nidusComponentData = {}
        this.nidusChoose = null
        this.seriesInfo = {}
        this.controlStauts = {
            delete: true
        }
        this.allresult = null
        this.layerMarkImageAnnotation = null // 图层标记对应imageAnnotation的toolList相关信息
        this.seriesAnnotationResult = [] // 最左边一个序列下的所有小征象列表
        this.projectInfo = {}
        this.currentSeriesInfo = {} // 存储当前序列信息（目前只有标注列表的id和对应的序列id）
        this.currentLayer = 1 // 当前处于第几层
        this.imageAnnotationResultId = null // 调用image_result_create接口后返回的id，存起来留着image_result_item_edit接口要用
    }
    setCurrentSeriesInfo(value) {
        this.currentSeriesInfo = value
    }
    getDicomValue(detail) {
        let point = detail.currentPoints.image
        let width = detail.image.width
        let height = detail.image.height
        let allData = detail.image.getPixelData()
        let pos = width * Math.round(point.y) + Math.round(point.x)
        if (allData.length != width * height) {
            pos = 4 * pos
        }
        return {
            point: point,
            allcolor: [allData[pos], allData[pos + 1], allData[pos + 2], allData[pos + 3]],
            hu: allData[pos]
        }
    }

    //返回布局，各自所占的大小和比例
    getLayout(value) {
        switch (value) {
            case 1:
                return {
                    w: 1,
                    h: 1,
                    t: 0
                }
                break
            case 2:
                return {
                    w: 0.5,
                    h: 1,
                    t: 0
                }
                break
            case 3:
                return {
                    w: 1 / 3,
                    h: 1,
                    t: 0
                }
                break
            case 4:
                return {
                    w: 0.5,
                    h: 0.5,
                    t: 1
                }
                break
            case 6:
                return {
                    w: 1 / 3,
                    h: 0.5,
                    t: 1
                }
                break
            case 8:
                return {
                    w: 0.25,
                    h: 0.5,
                    t: 1
                }
                break
        }
    }
    returnBodyName(value) {
        switch (value) {
            case 1:
                return '前上缘'
                break
            case 2:
                return '前下缘'
                break
            case 3:
                return '后上缘'
                break
            case 4:
                return '后下缘'
                break
        }
    }

    //chooseHU为一开始选择的像素值，config为设置的参数，value为点位信息
    findHU(value, config, chooseHU) {
        let data = []

        for (var i = 0; i < config.distance; i++) {
            data.push(this.returnscore('r', value, i, config, chooseHU))
            data.push(this.returnscore('l', value, i, config, chooseHU))
            data.push(this.returnscore('u', value, i, config, chooseHU))
            data.push(this.returnscore('v', value, i, config, chooseHU))
        }
        let dataf = data.filter((item) => {
            return item
        })
        dataf = dataf.sort(function(a, b) {
            return a.d - b.d
        })
        return dataf[0]
            //console.log(dataf)
        for (var i = 0; i < config.distance; i++) {
            let da = this.returnscore('r', value, i, config, chooseHU)
            if (da) {
                return da
            }
            da = this.returnscore('l', value, i, config, chooseHU)
            if (da) {
                return da
            }
            da = this.returnscore('u', value, i, config, chooseHU)
            if (da) {
                return da
            }
            da = this.returnscore('b', value, i, config, chooseHU)
            if (da) {
                return da
            }
            /*let da = this.returnscore('l', value, i, config, chooseHU) || this.returnscore('r', value, i, config, chooseHU) || this.returnscore('u', value, i, config, chooseHU) || this.returnscore('b', value, i, config, chooseHU)
            if (da) {
                return da
            }*/
        }
    }
    returnscore(type, value, num, config, chooseHU) {
        let point = {}
        switch (type) {
            case 'l':
                point = {
                    x: value.currentPoints.image.x - num,
                    y: value.currentPoints.image.y
                }
                break
            case 'r':
                point = {
                    x: value.currentPoints.image.x + num,
                    y: value.currentPoints.image.y
                }
                break
            case 'u':
                point = {
                    x: value.currentPoints.image.x,
                    y: value.currentPoints.image.y - num
                }
                break
            case 'b':
                point = {
                    x: value.currentPoints.image.x,
                    y: value.currentPoints.image.y + num
                }
                break
        }
        let data = {
            currentPoints: {
                image: point
            },
            image: {
                width: value.image.width,
                getPixelData: value.image.getPixelData
            }
        }
        let hu = this.getDicomValue(data)
        let deviation = config.deviation
        let len = 0
            //利用加权平均数进行彩色跟灰度的换算 0.3,0.59,0.11
        let chooseC = 0.3 * chooseHU.allcolor[0] + 0.59 * chooseHU.allcolor[1] + 0.11 * chooseHU.allcolor[2]
        let hudata = 0.3 * hu.allcolor[0] + 0.59 * hu.allcolor[1] + 0.11 * hu.allcolor[2]
        if (Math.abs(hudata - chooseC) <= deviation) {
            len = Math.abs(hudata - chooseC)
        } else {
            return null
        }
        hu.point.d = len
        return hu.point

        /*for (let i = 0; i < 3; i++) {
            if (hu.allcolor[i] < chooseHU.allcolor[i] + deviation && hu.allcolor[i] > chooseHU.allcolor[i] - deviation) {
                len += Math.abs(chooseHU.allcolor[i] - hu.allcolor[i])
            } else {
                return null
            }
        }
        if (hu.hu < this.chooseHU.hu + this.cornerstoneTools_config.polygon_config.deviation && hu.hu > this.chooseHU.hu - this.cornerstoneTools_config.polygon_config.deviation) {
                return hu.point
            }
            return null*/
    }

    //--------------返回点位置--------------
    returnRealPoint(point, id, screen, wh) {
        let layout = this.getLayout(screen)
        let top = (layout.t == 0 ? 0 : ((id >= screen / 2) ? wh.h : 0))
        let left = (layout.t == 0 ? id * wh.w : ((id >= screen / 2) ? (id - screen / 2) * wh.w : id * wh.w))
        return {
            x: point.x - left,
            y: point.y - top
        }
    }
    returnScreenPoint(point, id, screen, wh) {
        let layout = this.getLayout(screen)
        let top = (layout.t == 0 ? 0 : ((id >= screen / 2) ? wh.h : 0))
        let left = (layout.t == 0 ? id * wh.w : ((id >= screen / 2) ? (id - screen / 2) * wh.w : id * wh.w))
        return {
            x: point.x + left,
            y: point.y + top
        }
    }

    //--------------行列法2------------------
    compareColors(p, val, deviation) {
        let hu = p.color
        let rmean = (hu[0] + val[0]) / 2
        let R = hu[0] - val[0]
        let G = hu[1] - val[1]
        let B = hu[2] - val[2]
        let data = (2 + rmean / 256) * (R * R) + 4 * (G * G) + (2 + (255 - rmean) / 256) * (B * B)
        return Math.pow(data, 0.5) < deviation ? true : false
            //console.log(hu,val,deviation,'deviationdeviationdeviationdeviation')
        if (Math.abs(hu[0] - val[0]) > deviation) {
            return false
        }
        if (Math.abs(hu[1] - val[1]) > deviation) {
            return false
        }
        if (Math.abs(hu[2] - val[2]) > deviation) {
            return false
        }
        return true
    }
    returnPoint(image, x, y, width) {
        let i = y * width + x
        return {
            x: x,
            y: y,
            i: i,
            color: [image[4 * i], image[4 * i + 1], image[4 * i + 2], image[4 * i + 3]]
        }
    }
    floodFill_newRGB32(image, config) {
        //qDebug() << image.format();
        console.log(new Date().getTime())
        let x = Math.floor(image.currentPoints.image.x)
        let y = Math.floor(image.currentPoints.image.y)
        let width = image.image.width
        let height = image.image.height
        let deviation = config.deviation
            //console.log(x, y)
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return [];
        }
        let num = 0
        let color = this.getDicomValue(image).allcolor
        let stack = []
        let points = []
        points[width * height] = undefined
        let imageData = {
            pixelData: image.image.getPixelData(),
            width: image.image.width,
            height: image.image.height
        }
        stack.push(this.returnPoint(imageData.pixelData, x, y, width))
        let p = stack.pop()
        do {
            if (!points[p.i]) {
                if (this.compareColors(p, color, config.deviation)) {
                    num++
                    points[p.i] = {
                        x: p.x,
                        y: p.y
                    }
                    if (p.x > 0) // west
                        stack.push(this.returnPoint(imageData.pixelData, p.x - 1, p.y, width));
                    if (p.x < width - 1) // east
                        stack.push(this.returnPoint(imageData.pixelData, p.x + 1, p.y, width));
                    if (p.y > 0) // north
                        stack.push(this.returnPoint(imageData.pixelData, p.x, p.y - 1, width));
                    if (p.y < height - 1)
                        stack.push(this.returnPoint(imageData.pixelData, p.x, p.y + 1, width));
                }

            }
        } while ((p = stack.pop()))
        points = points.filter((item) => {
            return item
        })
        console.log(new Date().getTime())
        return points;
    }
    getroundpoint(value, r) {
        let arr = []
        let sx = Math.round(value.x - r)
        let sy = Math.round(value.y - r)
        let d = 2 * r
        let rand = d * d
        for (let i = 0; i < rand; i++) {
            let x = sx + Math.floor(i % d)
            let y = sy + Math.floor(i / d)
            if ((x - value.x) * (x - value.x) + (y - value.y) * (y - value.y) <= r * r) {
                arr.push({
                    x: x,
                    y: y
                })
            }
        }
        return arr
    }
    makeCiclePoint(value, radiu) {
        let arr = []
        let r = radiu.deviation / 2
        let px = value.currentPoints.image.x
        let py = value.currentPoints.image.y
        let sx = Math.round(px - r)
        let sy = Math.round(py - r)
        let d = 2 * r
        let rand = d * d
        for (let i = 0; i < rand; i++) {
            let x = sx + Math.floor(i % d)
            let y = sy + Math.floor(i / d)
            if ((x - px) * (x - px) + (y - py) * (y - py) <= r * r) {
                arr.push({
                    x: x,
                    y: y
                })
            }
        }
        return arr
    }
}
module.exports = ctmanage;
