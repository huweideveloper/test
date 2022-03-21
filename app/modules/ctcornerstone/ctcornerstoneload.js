function ctcornerstoneload() {

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstone.registerImageLoader('myImageLoader', loadImage);

    function loadImage(imageId) {
        const width = 512;
        const height = 512;
        const numPixels = 100;
        let pixelData //= new Uint16Array(numPixels);
        let index = 0;
        let canvas
        let aaaimg

        function getPixelData() {
            return pixelData;
        }

        function getCanvas() {
            return canvas;
        }

        function getImage() {
            return aaaimg;
        }

        function setPixelData() {
            return aaaimg;
        }
        let image = {
            imageId: imageId,
            minPixelValue: 0,
            maxPixelValue: 255,
            slope: 1.0,
            intercept: 0,
            windowCenter: 128,
            windowWidth: 256,
            render: cornerstone.renderWebImage,
            getPixelData: getPixelData,
            setPixelData: setPixelData,
            getCanvas: getCanvas,
            getImage: getImage,
            rows: height,
            columns: width,
            height: height,
            width: width,
            Wretched: false, //以此判定图片是否跟原始尺寸有区别
            rate: 1,
            color: true,
            rgba: false,
            columnPixelSpacing: 1.0,
            rowPixelSpacing: 1.0,
            invert: false,
            sizeInBytes: width * height * 4
        };
        return {
            promise: new Promise(function(resolve, reject) {
                let x1 = document.createElement("CANVAS");
                canvas = x1
                let imgase = new Image()
                imgase.crossOrigin = 'anonymous'
                imgase.onload = function() {
                    aaaimg = this
                        //只有x光可以适用
                    if ((this.width > 2000 || this.height > 2000) && window.fileTypeName == "DCM") {
                        image.rate = 0.5
                        image.Wretched = true
                    }
                    image.columns = image.width = Math.floor(this.width * image.rate)
                    image.rows = image.height = Math.floor(this.height * image.rate)
                    image.sizeInBytes = image.width * image.height * 4
                    x1.setAttribute("width", image.width);
                    x1.setAttribute("height", image.height);
                    let ctx = x1.getContext("2d");
                    //console.log(this.width, this.height, image.width, image.height, '============')
                    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, image.width, image.height)
                    let imageData = ctx.getImageData(0, 0, image.width, image.height).data
                    pixelData = imageData // new Uint16Array(this.width * this.height*4);
                    resolve(image);
                }
                image.onerror = function() {
                    that.event._dispatch('ctcornerstone.imgloadError', {
                        src: imgase.src
                    })
                }
                imgase.src = imageId.replace('myImageLoader:', '')
            }),
            cancelFn: undefined
        }
    }
    cornerstone.registerImageLoader('glayImage', loadGlayImage);

    function loadGlayImage(imageId) {
        const width = 512;
        const height = 512;
        const numPixels = 100;
        let pixelData //= new Uint16Array(numPixels);
        let index = 0;
        let canvas
        let aaaimg

        function getPixelData() {
            return pixelData;
        }

        function getCanvas() {
            return canvas;
        }

        function getImage() {
            return aaaimg;
        }

        function setPixelData() {
            return aaaimg;
        }
        let image = {
            imageId: imageId,
            minPixelValue: 0,
            maxPixelValue: 255,
            slope: 1.0,
            intercept: 0,
            windowCenter: 128,
            windowWidth: 256,
            render: cornerstone.renderWebImage,
            getPixelData: getPixelData,
            setPixelData: setPixelData,
            getCanvas: getCanvas,
            getImage: getImage,
            rows: height,
            columns: width,
            height: height,
            width: width,
            Wretched: false, //以此判定图片是否跟原始尺寸有区别
            rate: 1,
            color: true,
            rgba: false,
            columnPixelSpacing: 1.0,
            rowPixelSpacing: 1.0,
            invert: false,
            sizeInBytes: width * height * 4
        };
        return {
            promise: new Promise(function(resolve, reject) {
                let x1 = document.createElement("CANVAS");
                canvas = x1
                let ctx = x1.getContext("2d");
                let numw = imageId.replace('glayImage:', '').match(/\d{1,}/g)[0] * 1
                let type = imageId.replace('glayImage:', '').match(/[a-z]{1,}/g)[0]
                let ratey = window.depth / window.targetInfo.rowPixelSpacing
                ratey = ratey < 1 ? 1 : ratey
                let ratex = window.depth / window.targetInfo.columnPixelSpacing
                ratex = ratex < 1 ? 1 : ratex
                let imageData1
                switch (type) {
                    case "x":
                        image.columns = image.width = window.imageList[0].length
                        image.rows = image.height = Math.round(window.imageList.length * ratex)
                        console.log(ratex)
                        x1.setAttribute("width", image.width);
                        x1.setAttribute("height", image.height);
                        imageData1 = ctx.getImageData(0, 0, image.width, image.height)

                        for (let i = 0; i < image.height; i++) {
                            for (let j = 0; j < image.width; j++) {
                                let orginI = Math.floor(i / ratex)
                                let num = i * image.width + j
                                imageData1.data[num * 4] = window.imageList[orginI][j][numw]
                                imageData1.data[num * 4 + 1] = window.imageList[orginI][j][numw]
                                imageData1.data[num * 4 + 2] = window.imageList[orginI][j][numw]
                                imageData1.data[num * 4 + 3] = 255
                            }
                        }
                        break
                    case "y":
                        image.columns = image.width = window.imageList[0][0].length
                        image.rows = image.height = Math.round(window.imageList.length * ratey)
                        x1.setAttribute("width", image.width);
                        x1.setAttribute("height", image.height);
                        imageData1 = ctx.getImageData(0, 0, image.width, image.height)
                        for (let i = 0; i < image.height; i++) {
                            for (let j = 0; j < image.width; j++) {
                                let orginI = Math.floor(i / ratey)
                                let num = i * image.width + j
                                    //console.log(xy[i][j],num)
                                imageData1.data[num * 4] = window.imageList[orginI][numw][j]
                                imageData1.data[num * 4 + 1] = window.imageList[orginI][numw][j]
                                imageData1.data[num * 4 + 2] = window.imageList[orginI][numw][j]
                                imageData1.data[num * 4 + 3] = 255
                            }
                        }

                        break
                    case "z":
                        image.columns = image.width = window.imageList[0][0].length
                        image.rows = image.height = window.imageList[0].length
                        x1.setAttribute("width", image.width);
                        x1.setAttribute("height", image.height);
                        imageData1 = ctx.getImageData(0, 0, image.width, image.height)
                        for (let i = 0; i < image.height; i++) {
                            for (let j = 0; j < image.width; j++) {
                                let num = i * image.width + j
                                    //console.log(xy[i][j],num)
                                imageData1.data[num * 4] = window.imageList[numw][i][j]
                                imageData1.data[num * 4 + 1] = window.imageList[numw][i][j]
                                imageData1.data[num * 4 + 2] = window.imageList[numw][i][j]
                                imageData1.data[num * 4 + 3] = 255
                            }
                        }
                        //pixelData = imageData
                        //aaaimg = x1.toDataURL('image/jpeg');
                        break
                }
                ctx.putImageData(imageData1, 0, 0)
                let imgase = new Image()
                imgase.src = x1.toDataURL('image/jpeg');
                imgase.crossOrigin = 'anonymous';
                imgase.onload = function() {
                    aaaimg = this
                    image.columns = image.width = this.width
                    image.rows = image.height = this.height
                    image.sizeInBytes = image.width * image.height * 4
                    x1.setAttribute("width", image.width);
                    x1.setAttribute("height", image.height);
                    ctx = x1.getContext("2d");
                    ctx.drawImage(this, 0, 0)
                    let imageData = ctx.getImageData(0, 0, image.width, image.height).data
                    pixelData = imageData // new Uint16Array(this.width * this.height*4);
                        //console.log(image)
                    resolve(image);
                }
                image.onerror = function() {
                    that.event._dispatch('ctcornerstone.imgloadError', {
                        src: imgase.src
                    })
                }
                imageData1 = null
            }),
            cancelFn: undefined
        }
    }
    cornerstone.registerImageLoader('pixImage', pixImage);

    function pixImage(imageId) {
        const width = 512;
        const height = 512;
        const numPixels = 100;
        let pixelData //= new Uint16Array(numPixels);
        let index = 0;
        let canvas
        let aaaimg

        function getPixelData() {
            console.log(pixelData, 'pixelDatapixelDatapixelDatapixelData')
            return pixelData;
        }

        function getCanvas() {
            return canvas;
        }

        function getImage() {
            return aaaimg;
        }

        function setPixelData() {
            return aaaimg;
        }
        let image = {
            imageId: imageId,
            minPixelValue: 0,
            maxPixelValue: 255,
            slope: 1.0,
            intercept: 0,
            windowCenter: 128,
            windowWidth: 256,
            render: cornerstone.renderWebImage,
            getPixelData: getPixelData,
            setPixelData: setPixelData,
            getCanvas: getCanvas,
            getImage: getImage,
            rows: height,
            columns: width,
            height: height,
            width: width,
            Wretched: false, //以此判定图片是否跟原始尺寸有区别
            rate: 1,
            color: true,
            rgba: false,
            columnPixelSpacing: 1.0,
            rowPixelSpacing: 1.0,
            invert: false,
            sizeInBytes: width * height * 4
        };
        return {
            promise: new Promise(function(resolve, reject) {
                let x1 = document.createElement("CANVAS");
                canvas = x1
                let ctx = x1.getContext("2d");
                let numw = imageId.replace('pixImage:', '').match(/\d{1,}/g)[0] * 1
                let type = imageId.replace('pixImage:', '').match(/[a-z]{1,}/g)[0]
                let imageData1
                let minW = window.targetInfo.wc * 1 - 1 * window.targetInfo.ww / 2
                let maxW = window.targetInfo.wc * 1 + 1 * window.targetInfo.ww / 2
                minW = window.targetInfo.min < minW ? minW : window.targetInfo.min
                maxW = window.targetInfo.max > maxW ? maxW : window.targetInfo.max
                let ratey = window.depth / window.targetInfo.rowPixelSpacing
                let ratex = window.depth / window.targetInfo.columnPixelSpacing
                ratex = ratex < 1 ? 1 : ratex
                ratey = ratey < 1 ? 1 : ratey
                    //image.rowPixelSpacing = window.targetInfo.rowPixelSpacing
                    //image.columnPixelSpacing = window.targetInfo.columnPixelSpacing
                console.log(ratey, ratex)
                switch (type) {
                    case "x":
                        image.columns = image.width = window.imageList[0].length
                        image.rows = image.height = Math.round(window.imageList.length * ratex)
                        x1.setAttribute("width", image.width);
                        x1.setAttribute("height", image.height);
                        console.log(image.height, image.width)
                        imageData1 = ctx.getImageData(0, 0, image.width, image.height)
                        for (let i = 0; i < image.height; i++) {
                            for (let j = 0; j < image.width; j++) {
                                let orginI = Math.floor(i / ratex)
                                let num = i * image.width + j
                                let dataNum = window.imageList[orginI][j][numw] < minW ? minW : window.imageList[orginI][j][numw]
                                dataNum = dataNum > maxW ? maxW : dataNum
                                dataNum = Math.floor(255 * (dataNum - minW) / (maxW - minW))
                                imageData1.data[num * 4 + 2] = imageData1.data[num * 4 + 1] = imageData1.data[num * 4] = dataNum
                                imageData1.data[num * 4 + 3] = 255
                            }
                        }
                        break
                    case "y":
                        image.columns = image.width = window.imageList[0][0].length
                        image.rows = image.height = Math.round(window.imageList.length * ratey)
                        x1.setAttribute("width", image.width);
                        x1.setAttribute("height", image.height);
                        imageData1 = ctx.getImageData(0, 0, image.width, image.height)
                        for (let i = 0; i < image.height; i++) {
                            for (let j = 0; j < image.width; j++) {
                                let orginI = Math.floor(i / ratey)
                                let num = i * image.width + j
                                let dataNum = window.imageList[orginI][numw][j] < minW ? minW : window.imageList[orginI][numw][j]
                                dataNum = dataNum > maxW ? maxW : dataNum
                                dataNum = Math.floor(255 * (dataNum - minW) / (maxW - minW))
                                imageData1.data[num * 4 + 2] = imageData1.data[num * 4 + 1] = imageData1.data[num * 4] = dataNum
                                imageData1.data[num * 4 + 3] = 255
                            }
                        }

                        break
                    case "z":
                        image.columns = image.width = window.imageList[0][0].length
                        image.rows = image.height = window.imageList[0].length
                        x1.setAttribute("width", image.width);
                        x1.setAttribute("height", image.height);
                        imageData1 = ctx.getImageData(0, 0, image.width, image.height)
                        for (let i = 0; i < image.height; i++) {
                            for (let j = 0; j < image.width; j++) {
                                let num = i * image.width + j
                                let dataNum = window.imageList[numw][i][j] < minW ? minW : window.imageList[numw][i][j]
                                dataNum = dataNum > maxW ? maxW : dataNum
                                dataNum = Math.floor(255 * (dataNum - minW) / (maxW - minW))
                                imageData1.data[num * 4 + 2] = imageData1.data[num * 4 + 1] = imageData1.data[num * 4] = dataNum
                                imageData1.data[num * 4 + 3] = 255
                            }
                        }
                        //pixelData = imageData
                        //aaaimg = x1.toDataURL('image/jpeg');
                        break
                }
                ctx.putImageData(imageData1, 0, 0)
                let imgase = new Image()
                imgase.src = x1.toDataURL('image/jpeg');
                imgase.crossOrigin = 'anonymous';
                imgase.onload = function() {
                    aaaimg = this
                    image.columns = image.width = this.width
                    image.rows = image.height = this.height
                    image.sizeInBytes = image.width * image.height * 4
                    x1.setAttribute("width", image.width);
                    x1.setAttribute("height", image.height);
                    ctx = x1.getContext("2d");
                    ctx.drawImage(this, 0, 0)
                    let imageData = ctx.getImageData(0, 0, image.width, image.height).data
                    console.log(pixelData)
                    pixelData = imageData // new Uint16Array(this.width * this.height*4);
                    console.log(image)
                    resolve(image);
                }
                image.onerror = function() {
                    that.event._dispatch('ctcornerstone.imgloadError', {
                        src: imgase.src
                    })
                }
                imageData1 = null
            }),
            cancelFn: undefined
        }
    }

    cornerstone.registerImageLoader('niiImage', loadNii);

    function loadNii(imageId) {
        const width = 512;
        const height = 512;
        const numPixels = 100;
        let pixelData //= new Uint16Array(numPixels);
        let index = 0;
        let canvas
        let aaaimg

        function getPixelData() {
            return image.pixelData;
        }
        let image = {
            imageId: imageId,
            minPixelValue: null,
            maxPixelValue: null,
            slope: 1.0,
            intercept: 0,
            windowCenter: 200,
            windowWidth: 600,
            render: cornerstone.renderGrayscaleImage,
            getPixelData: getPixelData,
            rows: height,
            columns: width,
            height: height,
            width: width,
            Wretched: false, //以此判定图片是否跟原始尺寸有区别
            rate: 1,
            color: false,  
            columnPixelSpacing: 1.0,
            rowPixelSpacing: 1.0,
            invert: false,
            sizeInBytes: width * height
        };
        return {
            promise: new Promise(function(resolve, reject) {
                let x1 = document.createElement("CANVAS");
                canvas = x1
                let xhr = new XMLHttpRequest()
                xhr.open("GET", imageId.replace('niiImage:', ''), true)
                xhr.responseType = "blob";
                xhr.contentType = 'application/x-www-form-urlencoded'
                xhr.onreadystatechange = async() => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let res = xhr.response
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(res)
                        reader.onload = () => {
                            //console.log(reader)
                            let header = new Int16Array(reader.result, 0, 88 * 4);
                            let arr = new Int16Array(reader.result, 88 * 4, reader.result.length);
                            image.columns = image.width = header[21]
                            image.rows = image.height = header[22]
                            let data = width * height
                            let dataArray
                            if (data == arr.length) {
                                image.pixelData = new Int16Array(arr)
                            } else {
                                image.pixelData = new Int16Array(Math.floor(arr.length / 2))
                                arr.map((item, index) => {
                                    if (Math.floor(index % 2) == 0) {
                                        dataArray[Math.floor(index / 2)] = item
                                    }
                                })
                            }
                            for (let i = 0; i < image.pixelData.length; i++) {
                                if (!image.maxPixelValue) {
                                    image.maxPixelValue = image.pixelData[i]
                                } else {
                                    image.maxPixelValue = image.maxPixelValue < image.pixelData[i] ? image.pixelData[i] : image.maxPixelValue
                                }
                                if (!image.minPixelValue) {
                                    image.minPixelValue = image.pixelData[i]
                                } else {
                                    image.minPixelValue = image.minPixelValue > image.pixelData[i] ? image.pixelData[i] : image.minPixelValue
                                }
                            }
                            image.windowCenter=(image.maxPixelValue+image.minPixelValue)/2
                            image.windowWidth=(image.maxPixelValue-image.minPixelValue)/2
                            arr = null
                        }
                        resolve(image);
                    }
                }
                xhr.onerror = async() => {
                    // reject(new Error(xhr.status || 'Server is fail.'));
                }
                xhr.send();
            }),
            cancelFn: undefined
        }
    }


}
ctcornerstoneload()
    //原型链一定要有的
    //module.exports = new ctcornerstoneload();