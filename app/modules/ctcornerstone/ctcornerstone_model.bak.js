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
        this.seriesInfo={}
        this.controlStauts = {
            delete: true
        }
        this.allresult = null
    }
    getDicomValue(detail) {
        let point = detail.currentPoints.image
        let width = detail.image.width
        let allData = detail.image.getPixelData()
        let pos = width * Math.round(point.y) + Math.round(point.x)
        pos = 4 * pos
        //console.log(detail)
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
                return { w: 1, h: 1, t: 0 }
                break
            case 2:
                return { w: 0.5, h: 1, t: 0 }
                break
            case 3:
                return { w: 1 / 3, h: 1, t: 0 }
                break
            case 4:
                return { w: 0.5, h: 0.5, t: 1 }
                break
            case 6:
                return { w: 1 / 3, h: 0.5, t: 1 }
                break
            case 8:
                return { w: 0.25, h: 0.5, t: 1 }
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

    //---------------------点递归方式，堆栈消耗较大------------
    getPoints(value, config) {
        console.log(new Date().getTime())
        value.currentPoints.image.x = Math.floor(value.currentPoints.image.x)
        value.currentPoints.image.y = Math.floor(value.currentPoints.image.y)
        let ponits = [value.currentPoints.image]
        let st = value.currentPoints.image.x + value.currentPoints.image.y * value.image.width
        let keyPoint = []
        keyPoint[512 * 512] = undefined
        keyPoint[st] = 1
        let color = this.getDicomValue(value).allcolor
        this.imageData = {
            pixelData: value.image.getPixelData(),
            width: value.image.width,
            color: color
        }
        this.findPointRight({
            currentPoints: {
                image: {
                    x: value.currentPoints.image.x,
                    y: value.currentPoints.image.y
                }
            }
        }, ponits, config, keyPoint)
        color = null
        console.log(new Date().getTime())
        return ponits
    }
    findPointRight(value, dataArray, config, keyPoint) {
        let pointl = {
            x: value.currentPoints.image.x + 1,
            y: value.currentPoints.image.y
        }
        let pointr = {
            x: value.currentPoints.image.x - 1,
            y: value.currentPoints.image.y
        }
        let pointu = {
            x: value.currentPoints.image.x,
            y: value.currentPoints.image.y + 1
        }
        let pointt = {
            x: value.currentPoints.image.x,
            y: value.currentPoints.image.y - 1
        }
        let lx = this.imageData.width * pointl.y + pointl.x
        let rx = this.imageData.width * pointr.y + pointr.x
        let ux = this.imageData.width * pointu.y + pointu.x
        let bx = this.imageData.width * pointt.y + pointt.x
        //console.log(keyPoint[lx])
        if (!keyPoint[lx]) {
            keyPoint[lx] = 1
            let lc = this.onePoint(pointl, dataArray, config)
            if (lc) {
                this.findPointRight({
                    currentPoints: {
                        image: {
                            x: pointl.x,
                            y: pointl.y
                        }
                    }
                }, dataArray, config, keyPoint)
            }
        }
        if (!keyPoint[rx]) {
            keyPoint[rx] = 1
            let rc = this.onePoint(pointr, dataArray, config)
            if (rc) {
                this.findPointRight({
                    currentPoints: {
                        image: {
                            x: pointr.x,
                            y: pointr.y
                        }
                    }
                }, dataArray, config, keyPoint)
            }
        }
        if (!keyPoint[ux]) {
            keyPoint[ux] = 1
            let uc = this.onePoint(pointu, dataArray, config)
            if (uc) {
                this.findPointRight({
                    currentPoints: {
                        image: {
                            x: pointu.x,
                            y: pointu.y
                        }
                    }
                }, dataArray, config, keyPoint)
            }
        }
        if (!keyPoint[bx]) {
            keyPoint[bx] = 1
            let bc = this.onePoint(pointt, dataArray, config)
            if (bc) {
                this.findPointRight({
                    currentPoints: {
                        image: {
                            x: pointt.x,
                            y: pointt.y
                        }
                    }
                }, dataArray, config, keyPoint)
            }
        }

        //this.onePoint('r', value, dataArray, config, keyPoint)
        //this.onePoint('u', value, dataArray, config, keyPoint)
        //this.onePoint('b', value, dataArray, config, keyPoint)
    }
    onePoint(point, dataArray, config) {
        let imageData = this.imageData
        let pos = 4 * (imageData.width * Math.round(point.y) + Math.round(point.x))
        let hu = [imageData.pixelData[pos], imageData.pixelData[pos + 1], imageData.pixelData[pos + 2], imageData.pixelData[pos + 3]] //this.getDicomValue(data).allcolor
        let deviation = config.deviation
        let st = true
        //console.log(hu, imageData.color, point,pos)
        for (let i = 0; i < 3; i++) {
            if (hu[i] < imageData.color[i] + deviation && hu[i] > imageData.color[i] - deviation) {} else {
                st = false
            }
        }
        pos = null
        hu = null
        deviation = null
        if (st) {
            st = null
            dataArray.push(point)
            point = null
            return true
        }
        return false
    }

    //--------------行列法1------------------
    fillPoint_RGB32(image, p, val, deviation, stack, points) {
        let x = p.x;
        let y = p.y;
        let ret2 = true
        let stT = true
        ret2 = this.returnPointStauts(p.x, p.y, points)
        if (!ret2) {
            let st = this.scanLine(image, p, val, deviation)
            if (!st) {
                return false
            }
            points.push(p)
        }
        if (y > 0) {
            //ret2 = this.returnPointStauts(yrp, points)
            if (!this.returnPointStauts(x, y - 1, points) && !this.returnPointStauts(x, y - 1, stack)) {
                let yr = this.scanLine(image, {
                    x: x,
                    y: y - 1
                }, val, deviation)
                if (yr) {
                    stack.push({
                        x: x,
                        y: y - 1
                    });
                }
            }
        }
        if (y < image.height - 1) {
            //ret2 = this.returnPointStauts(ylp, points)
            if (!this.returnPointStauts(x, y + 1, points) && !this.returnPointStauts(x, y + 1, stack)) {
                let yl = this.scanLine(image, {
                    x: x,
                    y: y + 1
                }, val, deviation)
                if (yl) {
                    stack.push({
                        x: x,
                        y: y + 1
                    });
                }

                //}
            }
        }
        //console.log(stack)
        return true;
    }
    returnPointStauts(x, y, arr) {
        let a = false
        a = arr.find((value, index, arr) => {
            return (value.x == x && value.y == y)
        })
        return a
    }
    scanLine(image, p, val, deviation) {
        let x = p.x;
        let y = p.y;
        let pos = 4 * (image.width * p.y + p.x)
        let st = true
        let hu = [image.pixelData[pos], image.pixelData[pos + 1], image.pixelData[pos + 2], image.pixelData[pos + 3]]
        return (Math.abs(hu[0] - val[0]) <= deviation) && (Math.abs(hu[1] - val[1]) <= deviation) && (Math.abs(hu[2] - val[2]) <= deviation);
        //QRgb * line = (QRgb * ) image.scanLine(y);
    }
    floodFill_RGB32(image, config) {
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
        stack.push({
            x: x,
            y: y
        })
        let imageData = {
            pixelData: image.image.getPixelData(),
            width: image.image.width,
            height: image.image.height
        }
        do {
            let p = stack.pop();
            //let aa = this.returnPointStauts(p.x, (p.y + 1), points) && this.returnPointStauts(p.x, (p.y - 1), points)
            let bb = this.returnPointStauts((p.x + 1), p.y, points) && this.returnPointStauts((p.x - 1), p.y, points)
            if (!bb) {
                num++
                let ret = this.fillPoint_RGB32(imageData, p, color, deviation, stack, points);
                let ret2 = ret;
                y = p.y;
                x = p.x;
                x--;
                if (ret && x >= 0) {
                    this.findLineleft({
                        x: x,
                        y: y
                    }, imageData, color, deviation, stack, points)
                }
                x = p.x;
                x++;
                if (x < width && ret2) {
                    this.findLineright({
                        x: x,
                        y: y
                    }, imageData, color, deviation, stack, points)
                }
            }
            //console.log(p, stack.length)

            //console.log(stack)

        } while (stack.length != 0)
        console.log(new Date().getTime(), num)
        return points;
    }
    findLineleft(point, imageData, color, deviation, stack, points) {
        do {
            ret = this.fillPoint_RGB32(imageData, {
                x: point.x,
                y: point.y
            }, color, deviation, stack, points);
            point.x--;

            //console.log(ret)
        } while (point.x >= 0 && ret)
    }
    findLineright(point, imageData, color, deviation, stack, points) {
        do {
            ret = this.fillPoint_RGB32(imageData, {
                x: point.x,
                y: point.y
            }, color, deviation, stack, points);
            point.x++;
            //console.log(ret)
        } while (point.x < imageData.width && ret)
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
        let rand=d *d
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
    makeCiclePoint(value,radiu){
        let arr = []
        let r=radiu.deviation/2
        let px=value.currentPoints.image.x
        let py=value.currentPoints.image.y
        let sx = Math.round(px - r)
        let sy = Math.round(py - r)
        let d = 2 * r
        let rand=d *d
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
