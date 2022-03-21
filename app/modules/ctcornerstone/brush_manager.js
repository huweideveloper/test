class brushManager {
    constructor() {
        this.init()
    }
    init() {
        this.brushInfo = {}
        this.brushIdInfo = {}
        this.brushlength = 0
        this.aplha = 140
        this.colorMap = {
            'AA1113': [170, 17, 19, this.aplha],
            'F5A623': [245, 166, 35, this.aplha],
            'F8E71C': [248, 231, 28, this.aplha],
            '7ED321': [126, 211, 33, this.aplha],
            '4A90E2': [74, 144, 226, this.aplha],
            '50E3C2': [80, 227, 194, this.aplha],
            '8B572A': [139, 87, 42, this.aplha],
            '417505': [65, 117, 5, this.aplha],
            'B8E986': [184, 233, 134, this.aplha],
            'BD10E0': [189, 16, 224, this.aplha]
        }
    }
    delbrush(value) {
        //console.log(value, 'deledle', this.brushInfo)
        for (let i in this.brushInfo) {
            if (this.brushInfo[i][value.bid || value.uuid]) {
                delete this.brushInfo[i][value.bid || value.uuid]
            }
            if (this.brushInfo[i][value.uuid]) {
                delete this.brushInfo[i][value.uuid]
            }
        }
    }

    getPixTotal(bid, uuid) {
        console.log(bid, this.brushIdInfo)
        let total = 0
        if (this.brushIdInfo[bid]) {
            for (let i of this.brushIdInfo[bid].layerLists) {
                total = total + this.brushInfo[i][bid].orginimage.length
            }
            return total
        }
        if (this.brushIdInfo[uuid]) {
            for (let i of this.brushIdInfo[uuid].layerLists) {
                total = total + this.brushInfo[i][uuid].orginimage.length
            }
            return total
        }
        return total
    }


    //以病兆id为一个维度清洗数据
    brushIdInfoSet(bid, layerNumber) {
        // console.log(this.brushIdInfo)
        this.brushIdInfo = this.brushIdInfo ? this.brushIdInfo : {}
        if (!this.brushIdInfo[bid]) {
            this.brushIdInfo[bid] = {
                layerLists: []
            }
        }
        this.brushIdInfo[bid].layerLists.push(layerNumber)
        let result = []
        let obj = {}
        for (let i of this.brushIdInfo[bid].layerLists) {
            if (!obj[i]) {
                result.push(i)
                obj[i] = 1
            }
        }
        this.brushIdInfo[bid].layerLists = result
    }
    creatBrushInfoData(layerNumber, bId) {
        if (!this.brushInfo[layerNumber]) {
            this.brushInfo[layerNumber] = {}
        }
        if (!this.brushInfo[layerNumber][bId]) {
            this.brushInfo[layerNumber][bId] = {}
        }
    }
    setBrush(layerNumber, value, r, w, id, sId) {
        if (!this.brushInfo[layerNumber]) {
            this.brushInfo[layerNumber] = {}
        }
        let newid = id
        if (!id) {
            newid = Tool.getSigleId()
            this.brushInfo[layerNumber][newid] = {}
        }
        //this.creatBrushInfoData()
        if (!this.brushInfo[layerNumber][newid]) {
            this.brushInfo[layerNumber][newid] = {}
        }
        let arr = this.getroundpoint(value, r)
        if (r == 0) {
            arr = value
        }
        this.brushIdInfoSet(newid, layerNumber)
            //console.log(arr,'artrrrr')
        this.brushInfo[layerNumber][newid].image = this.creatImage(arr, layerNumber, newid, true, w)
        this.brushInfo[layerNumber][newid].uuid = newid
        this.brushInfo[layerNumber][newid].sId = sId
        this.brushInfo[layerNumber][newid].show = true
        this.brushInfo[layerNumber][newid].fill = this.brushInfo[layerNumber][newid].fill != undefined ? this.brushInfo[layerNumber][newid].fill : true
        this.brushInfo[layerNumber][newid].color = this.brushInfo[layerNumber][newid].color ? this.brushInfo[layerNumber][newid].color : this.colorMap['AA1113']
        return this.brushInfo[layerNumber][newid]
    }
    creatBrush(layerNumber, img, id, sId, wh) {
        // console.log(id)
        if (!this.brushInfo[layerNumber]) {
            this.brushInfo[layerNumber] = {}
        }
        let newid = id || Tool.getSigleId()
            //let imgurl = img
        if (!this.brushInfo[layerNumber][newid]) {
            this.brushInfo[layerNumber][newid] = {}
        }
        //console.log(imgurl)
        this.brushIdInfoSet(newid, layerNumber)

        this.brushInfo[layerNumber][newid].orginimage = []
        let canvas = document.createElement("canvas");
        canvas.width = wh.w
        canvas.height = wh.h
        let ctx = canvas.getContext("2d");
        //ctx.drawImage(img, 0, 0, wh.w, wh.h, 0, 0, canvas.width, canvas.height)
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            //[0, 200, 0, this.aplha]
        for (let i = 0; i < img.length; i++) {
            let num = img[i]
            this.brushInfo[layerNumber][newid].orginimage.push(num)
            imgData.data[num * 4] = 0
            imgData.data[num * 4 + 1] = 200
            imgData.data[num * 4 + 2] = 0
            imgData.data[num * 4 + 3] = this.aplha
        }
        /*for (let i = 0; i < imgData.data.length / 4; i++) {
            //console.log(imgData.data[i * 4 + 3],'imgData.data[i * 4 + 3]imgData.data[i * 4 + 3]')
            if (imgData.data[i * 4 + 3] != 0) {
                //console.log(i)
                this.brushInfo[layerNumber][newid].orginimage.push(i)
            }
        }*/
        ctx.putImageData(imgData, 0, 0)
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        ctx = null
        canvas = null
        imgData = null

        this.brushInfo[layerNumber][newid].image = image
            //this.brushInfo[layerNumber][newid].orginimage = imgurl
        this.brushInfo[layerNumber][newid].uuid = newid
        this.brushInfo[layerNumber][newid].sId = sId
        this.brushInfo[layerNumber][newid].color = this.colorMap['AA1113']
        this.brushInfo[layerNumber][newid].show = true
        this.brushInfo[layerNumber][newid].fill = this.brushInfo[layerNumber][newid].fill!=undefined?this.brushInfo[layerNumber][newid].fill:true
        return this.brushInfo[layerNumber][newid]
    }
    getInfo(value) {
        console.log(this.brushInfo)
        if (!this.brushInfo[value.layerNumber])
            return null
        if (this.brushInfo[value.layerNumber][value.bid]) {
            return this.brushInfo[value.layerNumber][value.bid]
        }
        if (this.brushInfo[value.layerNumber][value.uuid]) {
            return this.brushInfo[value.layerNumber][value.uuid]
        }
    }
    updataInfo(value) {
        for (let i = 0; i < value.length; i++) {
            this.brushInfo[value[i].layerNumber][value[i].id].imgurl = value[i].imgurl
        }
    }
    removeBrush(layerNumber, value, r, w, id) {
        if (!this.brushInfo[layerNumber]) {
            return
        }
        if (!id) {
            return
        }
        console.log(this.brushInfo, '================', layerNumber, id)
        let arr = this.getroundpoint(value, r)
        this.brushInfo[layerNumber][id].image = this.creatImage(arr, layerNumber, id, false, w)
        return this.brushInfo[layerNumber][id]
    }
    creatNewImage(img, data, wh, layerNumber, cid) {
        //console.log(layerNumber, 'layerNumber')
        this.brushlength = (this.brushlength < layerNumber * 1 ? layerNumber * 1 : this.brushlength)
            //console.log(this.brushlength)
        let rate = 1
            //只有x光可以适用
        console.log(data.needScale)
        if (data.needScale) {
            rate = 0.5
        }
        let canvas = document.createElement("canvas");
        canvas.width = wh.width * rate
        canvas.height = wh.height * rate
        let ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, wh.width, wh.height, 0, 0, canvas.width, canvas.height)
        let id = data.id
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        let color = this.colorMap['AA1113'] //[230, 25, 75, this.aplha]
        let dataA = []
        for (let i = 0; i < imgData.data.length / 4; i++) {
            //console.log(imgData.data[i * 4 + 3],'imgData.data[i * 4 + 3]imgData.data[i * 4 + 3]')
            if (imgData.data[i * 4 + 3] != 0) {
                dataA.push(i)
                imgData.data[i * 4] = color[0]
                imgData.data[i * 4 + 1] = color[1]
                imgData.data[i * 4 + 2] = color[2]
                imgData.data[i * 4 + 3] = color[3]
            }
        }
        ctx.putImageData(imgData, 0, 0)
        var image = new Image();
        image.src = canvas.toDataURL("image/png");

        ctx = null
        canvas = null
        imgData = null
        if (!this.brushInfo[layerNumber]) {
            this.brushInfo[layerNumber] = {}
        }
        if (!this.brushInfo[layerNumber][id]) {
            this.brushInfo[layerNumber][id] = {}
        }
        this.brushIdInfoSet(id, layerNumber)
            //this.brushInfo[layerNumber][id].imgurl = img.src
        this.brushInfo[layerNumber][id].num = layerNumber
        this.brushInfo[layerNumber][id].id = id
        this.brushInfo[layerNumber][id].rid = data.rid
        this.brushInfo[layerNumber][id].sId = data.sId
        this.brushInfo[layerNumber][id].image = image
        this.brushInfo[layerNumber][id].color = this.colorMap['AA1113']
        this.brushInfo[layerNumber][id].fill = true
        this.brushInfo[layerNumber][id].show = true
        this.brushInfo[layerNumber][id].orginimage = dataA
        if (cid == id) {
            setTimeout(() => {
                //= this.resetColor(image)
                this.brushInfo[layerNumber][id].image = this.resetColor(this.brushInfo[layerNumber][id].orginimage, [0, 200, 0, this.aplha], this.brushInfo[layerNumber][id].fill, this.brushInfo[layerNumber][id].image)
            }, 20)
        }
        this.brushInfo[layerNumber][id].orginimage = dataA // image
            //return image
    }
    creatImage(data, layerNumber, id, type, width) {
        let canvas = document.createElement("canvas");
        canvas.width = width.w || 512
        canvas.height = width.h || 512
        let ctx = canvas.getContext("2d");
        //console.log(this.brushInfo[layerNumber][id].image)
        let imgData
        let color = [0, 200, 0, this.aplha]
        if (!type) {
            color = [255, 255, 255, 0]
        }
        console.log(id, layerNumber, this.brushInfo)
        
        if (this.brushInfo[layerNumber][id].image) {
            canvas.width = this.brushInfo[layerNumber][id].image.width
            canvas.height = this.brushInfo[layerNumber][id].image.height
            imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            this.brushInfo[layerNumber][id].orginimage.map((item) => {
                    imgData.data[item * 4] = 0
                    imgData.data[item * 4 + 1] = 200
                    imgData.data[item * 4 + 2] = 0
                    imgData.data[item * 4 + 3] = this.aplha
                })
                // ctx.drawImage(this.brushInfo[layerNumber][id].image, 0, 0)
        }else{
             imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        }
        // let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        /*let color = [0, 200, 0, this.aplha]
        if (!type) {
            color = [255, 255, 255, 0]
        }*/

        console.log(data, 'dklsjdklajdlkasjd')
        this.calPoint(data, imgData, width.w, color)
        ctx.putImageData(imgData, 0, 0)
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        ctx = null
        canvas = null
        this.brushInfo[layerNumber][id].orginimage = []
        for (let i = 0; i < imgData.data.length / 4; i++) {
            //console.log(imgData.data[i * 4 + 3],'imgData.data[i * 4 + 3]imgData.data[i * 4 + 3]')
            if (imgData.data[i * 4 + 3] != 0) {
                this.brushInfo[layerNumber][id].orginimage.push(i)
            }
        }
        imgData = null
        //this.brushInfo[layerNumber][id].fill=true
        //if (!this.brushInfo[layerNumber][id].fill) {
            //image=this.resetColor(brushInfoLayer.orginimage,  [0, 200, 0, this.aplha], brushInfoLayer.fill, brushInfoLayer.image)
        //}
        this.brushInfo[layerNumber][id].image = image
            //this.brushInfo[layerNumber][id].orginimage = image
        return image
    }
    calPoint(data, imgData, width, color) {
        let len = data.length
        for (let j = 0; j < len; j++) {
            let i = 4 * (data[j].x * 1 + data[j].y * width)
                //console.log(data[j], i)
            if (imgData.data[i + 3] == color[3] && color[3] == 0) {} else {
                imgData.data[i] = color[0]
                imgData.data[i + 1] = color[1]
                imgData.data[i + 2] = color[2]
                imgData.data[i + 3] = color[3]
            }
        }
    }

    //颜色的变换和镂空操作
    doneSingleChange(chooseData, selfNode, type) {
        if (type == 'color' && chooseData.uuid == selfNode.uuid) {
            return
        }
        console.log(this.brushIdInfo)

        let nodeId = selfNode.bid || selfNode.uuid
        if (chooseData.uuid == selfNode.uuid) {
            this.changeColorById(selfNode.bid, selfNode.uuid, [0, 200, 0, this.aplha])
        } else {
            this.changeColorById(selfNode.bid, selfNode.uuid)
        }

    }

    //改变状态
    restChooseColor(done, cancel) {
        console.log(new Date().getTime())
        if (done) {
            let doneId = done.bid
            if (doneId) {
                this.changeColorById(doneId, done.uuid, [0, 200, 0, this.aplha])
            }
        }
        if (cancel) {
            let cancelId = cancel.bid
            if (cancelId) {
                this.changeColorById(cancelId, cancel.uuid)
            }
        }
        console.log(new Date().getTime())
    }

    //通用改变颜色的方法
    changeColorById(id, uuid, color) {
        console.log(this.brushIdInfo, id, uuid)
        let endId = id
        if (!this.brushIdInfo) {
            this.brushIdInfo = {}
            return
        }
        if (this.brushIdInfo[id]) {
            endId = id
        }
        if (this.brushIdInfo[uuid]) {
            endId = uuid
        }
        console.log(endId, this.brushIdInfo[endId])
        if (!this.brushIdInfo[endId]) {
            return
        }

        for (let j of this.brushIdInfo[endId].layerLists) {
            let brushInfoLayer = this.brushInfo[j][endId]
                //let ttt = new Date().getTime()
            console.log(brushInfoLayer.fill,'brushInfoLayer.fillbrushInfoLayer.fillbrushInfoLayer.fill')
            brushInfoLayer.image = this.resetColor(brushInfoLayer.orginimage, color ? color : brushInfoLayer.color, brushInfoLayer.fill, brushInfoLayer.image)
                //console.log(new Date().getTime() - ttt)
        }
    }

    //进行了优化，就是第一次进来只改变当前图层的图片，然后进行渲染，背后开启异步渲染机制。然后渲染全图层的内容。以不阻碍用户操作为第一前提
    /*allrest(data, layerNum, roation) {
        layerNum = layerNum * 1
        if (this.brushlength) {
            if (layerNum <= 0 || layerNum > this.brushlength) {
                return
            }
        }
        let layerArray = [layerNum]
        switch (roation) {
            case "add":
                layerArray = [layerNum + 1, layerNum + 2, layerNum + 3, layerNum + 4, layerNum + 5]
                break
            case "remove":
                layerArray = [layerNum - 5, layerNum - 4, layerNum - 3, layerNum - 2, layerNum - 1]
                break
            default:
                layerArray = [layerNum - 2, layerNum - 1, layerNum, layerNum + 1, layerNum + 2]
                break
        }
        //console.log(layerArray, this.brushInfo)
        for (let i = 0; i < layerArray.length; i++) {
            if (this.brushInfo[layerArray[i]]) {
                //console.log(this.brushInfo[layerArray[i]], 'this.brushInfo[layerArray[i]]this.brushInfo[layerArray[i]]')
                let brushInfoArray = this.brushInfo[layerArray[i]]
                for (let bid in brushInfoArray) {
                    let img = brushInfoArray[bid].orginimage
                        //console.log(i, bid, data.bid)
                        //console.log(brushInfoArray[bid])
                    if (bid == data.bid || bid == data.uuid) {
                        img = this.resetColor(img, [0, 200, 0, this.aplha], brushInfoArray[bid].fill)
                    } else {
                        //img = this.resetColor(img, [230, 25, 75, this.aplha])
                        //console.log('==============', brushInfoArray[bid])
                        img = this.resetColor(img, brushInfoArray[bid].color, brushInfoArray[bid].fill)
                    }
                    brushInfoArray[bid].image = img
                }
            }
        }
        if (!roation) {
            setTimeout(() => {
                this.allrest(data, layerNum + 2, 'add')
            }, 100)
            setTimeout(() => {
                this.allrest(data, layerNum - 2, 'remove')
            }, 100)
        }
        if (roation == 'add' && (layerNum + 5 < this.brushlength)) {
            setTimeout(() => {
                this.allrest(data, layerNum + 5, 'add')
            }, 100)
        }
        if (roation == 'remove' && (layerNum - 5 > 0)) {
            setTimeout(() => {
                this.allrest(data, layerNum - 5, 'remove')
            }, 100)
        }
    }*/

    //重置颜色
    resetColor(imgArr, colorA, fillSt, img) {
        if (img.width == 0) {
            return
        }
        let canvas = document.createElement("canvas");
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext("2d");
        //ctx.drawImage(img, 0, 0)
        let imgData = ctx.getImageData(0, 0, img.width, img.height)
        let color = colorA ? colorA : [0, 200, 0, this.aplha]
            //console.log(imgArr)
        let obj = {}
        for (let i of imgArr) {
            if (!obj[i]) {
                obj[i] = 1
            }
        }
        for (let i = 0; i < imgArr.length; i++) {
            let num = imgArr[i] * 4
            imgData.data[num] = color[0]
            imgData.data[num + 1] = color[1]
            imgData.data[num + 2] = color[2]
            imgData.data[num + 3] = color[3]
            if (fillSt == false) {
                let boud = this.fourpd(imgArr[i], obj, img.width, img.height) // this.fourpd(imgArr[i], imgArr, img.width, img.height)
                if (!boud) {
                    imgData.data[num + 3] = 0
                }
            }

        }
        /*let newData = [img.width * img.height * 4]
        for (let i = 0; i < imgData.data.length / 4; i++) {
            if (imgData.data[i * 4 + 3] != 0) {
                newData[i * 4] = color[0]
                newData[i * 4 + 1] = color[1]
                newData[i * 4 + 2] = color[2]
                newData[i * 4 + 3] = color[3]
                if (fillSt == false) {
                    let boud = this.fourpd(i, imgData.data, img.width, img.height)
                    if (!boud) {
                        newData[i * 4 + 3] = 0
                    }
                }
            }
        }
        for (let j = 0; j < newData.length; j++) {
            if (newData[j] != undefined) {
                imgData.data[j] = newData[j]
            }
        }*/
        //imgData.data=newData
        //clone = null
        ctx.putImageData(imgData, 0, 0)
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        ctx = null
        canvas = null
        imgData = null
            //newData = null
        return image
    }
    fourpd(point, imageData, width, height) {
        let up = Math.floor((point - width) / width)
        let right = (point % width) == (width - 1) ? null : (point + 1)
        let left = (point % width) == 0 ? null : point - 1
        let down = Math.floor((point + width) / width)
        let num = 0
            //console.log(up, right, left, down)
        if (up < 0 || (down > height) || !right || !left) {
            return true
        }
        if (imageData[String(point - width)]) {
            num++
        }
        if (imageData[String(point + width)]) {
            num++
        }
        if (imageData[String(right)]) {
            num++
        }
        if (imageData[String(left)]) {
            num++
        }
        /*if (up >= 0) {
            if (imageData.includes(point - width)) {
                num++
            }
        }
        if (down < height) {
            if (imageData.includes(point + width)) {
                num++
            }
        }
        if (right != null) {
            if (imageData.includes(right)) {
                num++
            }
        }
        if (left != null) {
            if (imageData.includes(left)) {
                num++
            }
        }*/
        //console.log(num)
        return (num == 4 ? false : true)
    }

    //单个病灶颜色更改
    restSignleId(value) {
        for (let i in this.brushInfo) {
            for (let j in this.brushInfo[i]) {
                if (j == value.bid || j == value.uuid) {
                    this.brushInfo[i][j].color = this.colorMap[value.color]
                }
            }
        }
    }

    //单个病兆更改填充
    restSignleIdFill(value) {
        for (let i in this.brushInfo) {
            for (let j in this.brushInfo[i]) {
                if (j == value.bid || j == value.uuid) {
                    this.brushInfo[i][j].fill = value.fill
                }
            }
        }
    }

    //单个病灶显示更改
    restSignleIdShow(value) {
        for (let i in this.brushInfo) {
            for (let j in this.brushInfo[i]) {
                if (j == value.bid || j == value.uuid) {
                    this.brushInfo[i][j].show = value.show
                }
            }
        }
    }
    allShow(value) {
        for (let i in this.brushInfo) {
            for (let j in this.brushInfo[i]) {
                this.brushInfo[i][j].show = value.show
            }
        }
    }
    clearBrush(layerNumber) {
        this.brushInfo[layerNumber] = null
    }
    deleteAll() {
        this.brushInfo = {}
        this.brushIdInfo = null
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
}

//原型链一定要有的
module.exports = new brushManager();