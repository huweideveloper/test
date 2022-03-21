class MakeJPG {
    constructor() {
        this.event = new Interstellar.event()
    }
    imageList(imgaeIds) {
        this.len = imgaeIds.length
        //this.len = 5
        this.count = 0
        this.type = "jpg"
        this.startNum = 0
        if (imgaeIds[0].toLocaleLowerCase().lastIndexOf('.dcm') != -1) {
            this.type = 'dcm'
        }
        window.imageList = new Array(this.len)
        this.zUrl = new Array(this.len)
        for (let i = 0; i < this.len; i++) {
            this.zUrl[i] = (this.type == 'jpg' ? ("glayImage:z" + i) : ("pixImage:z" + i))
        }
        if (this.type == 'jpg') {
            this.jpgParse(imgaeIds, 0)
        } else {
            this.fiveLoad(imgaeIds)
        }
    }
    fiveLoad(urls) {
        this.count = 0
        this.fiveL = 0
        for (let i = this.startNum; i < this.startNum + 5; i++) {
            console.log(i)
            this.dcmParse(urls, i)
        }
    }
    dcmParse(url, num) {
        let that = this
        if (num > this.len - 1) {
            return
        }
        if (!url[num]) {
            return
        }
        this.fiveL++
        let div = document.createElement('div')
        cornerstone.enable(div);
        console.log(url[num])
        cornerstone.loadImage(url[num]).then(function(image) {
            console.log(image)
            that.count++
            that.startNum++
            if (!window.imageList[num]) {
                window.imageList[num] = new Array(image.columns);
            }
            if (num == 0) {
                that.urlAddress(image.columns, image.rows)
            }
            if (!that.z) {
                that.z = []
            }
            that.width = image.columns
            that.height = image.rows
            that.z[num] = image.data.string('x00200032').match(/(\-|\+)?\d+(\.\d+|\d)/g)[2]
            //console.log(num,that.z[num],image.data.string('x00200032'))
            //console.log(image)
            window.targetInfo = {
                wc: image.data.string('x00281050').match(/(\-|\+)?\d+/g)[0],
                ww: image.data.string('x00281051').match(/(\-|\+)?\d+/g)[0],
                columnPixelSpacing: image.columnPixelSpacing,
                rowPixelSpacing: image.rowPixelSpacing
            }
            let arrData = image.getPixelData()
            for (let i = 0; i < arrData.length; i++) {
                let row = Math.floor(i / image.columns)
                if (!window.imageList[num][row]) {
                    window.imageList[num][row] = new Int16Array(image.columns)
                }
                let HUDATA = arrData[i] * image.slope + image.intercept
                window.imageList[num][row][Math.floor(i % image.columns)] = HUDATA
                window.targetInfo.min = window.targetInfo.min ? (window.targetInfo.min < HUDATA ? window.targetInfo.min : HUDATA) : HUDATA
                window.targetInfo.max = window.targetInfo.max ? (window.targetInfo.max > HUDATA ? window.targetInfo.max : HUDATA) : HUDATA
            }
            cornerstone.disable(div)
            if (that.count != that.fiveL) {
                return
            }
            if (that.startNum < that.len - 1) {
                that.fiveLoad(url)
            } else {
                window.depth = Math.abs(that.z[0] - that.z[1])
                //console.log(window.depth,window.targetInfo)
                that.event._dispatch('makeJPG.finish')
            }
            //console.log(window.imageList)
        })

    }
    jpgParse(url, num) {
        let that = this
        if (!url[num]) {
            return
        }
        let imgase = new Image()
        imgase.crossOrigin = 'anonymous';
        imgase.onload = function() {
            that.count++
            let canvas = document.createElement("CANVAS");
            that.width = this.width
            that.height = this.height
            canvas.setAttribute("width", this.width);
            canvas.setAttribute("height", this.height);
            if (num == 0) {
                that.urlAddress(this.width, this.height)
            }
            if (!window.imageList[num]) {
                window.imageList[num] = new Array(this.height);
            }
            let ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0)
            let imageData = ctx.getImageData(0, 0, this.width, this.height).data
            let lengthWH = imageData.length / 4
            for (let i = 0; i < lengthWH; i++) {
                let row = Math.floor(i / this.width)
                if (!window.imageList[num][row]) {
                    window.imageList[num][row] = new Uint8Array(this.width)
                }
                window.imageList[num][row][Math.floor(i % this.width)] = imageData[i * 4]
            }
            ctx = null
            imageData = null
            canvas = null
            if (that.count < that.len) {

            } else {
                //console.log(window.imageList)
                that.event._dispatch('makeJPG.finish')
            }
        }
        imgase.onerror = function() {
            console.log('error')
        }
        imgase.src = url[num].replace('myImageLoader:', '')
        this.jpgParse(url, num + 1)
    }
    urlAddress(w, h) {
        //x,y代表的是沿着那个方向切
        this.xUrl = new Array(w)
        this.yUrl = new Array(h)
        for (let i = 0; i < w; i++) {
            this.xUrl[i] = (this.type == 'jpg' ? ("glayImage:x" + i) : ("pixImage:x" + i))
        }
        for (let j = 0; j < h; j++) {
            this.yUrl[j] = (this.type == 'jpg' ? ("glayImage:y" + j) : ("pixImage:y" + j))
        }

    }
    clearAllData() {
        window.imageList = null
        window.wwc = null
        window.depth = null
        this.xUrl = this.yUrl = this.zUrl = this.len = null
    }

}
module.exports = MakeJPG;