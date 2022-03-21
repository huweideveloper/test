class freedhand {
    constructor() {}
    creatPath(point, wh, img, lw) {
        wh = wh ? wh : {
            width: 512,
            height: 512
        }
        this.craetCanvas(wh, lw)
        if (img) {
            let imgData = this.ctx.getImageData(0, 0, wh.width, wh.height)
            img.map((item) => {
                imgData.data[item * 4] = 0
                imgData.data[item * 4 + 1] = 200
                imgData.data[item * 4 + 2] = 0
                imgData.data[item * 4 + 3] = 140
            })
            this.ctx.putImageData(imgData, 0, 0)
                //this.ctx.drawImage(img, 0, 0)
        }
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
    }
    drawPath(point) {
        //console.log(point)
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();
        let arr = []
        let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        for (let i = 0; i < imgData.data.length / 4; i++) {
            //imgData.data[i * 4 + 3] = 0
            if (imgData.data[i * 4 + 1] + imgData.data[i * 4] + imgData.data[i * 4 + 2] > 128) {
                arr.push(i)
                    // imgData.data[i * 4 + 3] = 128
            }
        }
        //var image = new Image();
        //image.src = this.canvas.toDataURL("image/png");
        return arr //image
    }
    noneClosePath() {
        let arr = []
        let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        for (let i = 0; i < imgData.data.length / 4; i++) {
            imgData.data[i * 4 + 3] = 0
            if (imgData.data[i * 4 + 1] + imgData.data[i * 4] + imgData.data[i * 4 + 2] > 128) {
                arr.push(i) //imgData.data[i * 4 + 3] = 128
            }
        }
        //this.ctx.putImageData(imgData, 0, 0)
        //var image = new Image();
        //image.src = this.canvas.toDataURL("image/png");
        return arr //image
    }
    endPath() {
        this.ctx.closePath();
        this.ctx.fill()
        this.ctx.stroke();
        let arr = []
        let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        for (let i = 0; i < imgData.data.length / 4; i++) {
            imgData.data[i * 4 + 3] = 0
            if (imgData.data[i * 4 + 1] > 128) {
                arr.push(i)
                    //imgData.data[i * 4 + 3] = 128
            }
        }
        //this.ctx.putImageData(imgData, 0, 0)
        //var image = new Image();
        //image.src = this.canvas.toDataURL("image/png");
        return arr //image
    }
    craetCanvas(wh, lw) {
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = wh.width
            this.canvas.height = wh.height
            this.ctx = this.canvas.getContext("2d");
            this.ctx.lineWidth = lw ? lw : 1;
            this.ctx.strokeStyle = "rgba(0,200,0,1)"
            this.ctx.fillStyle = "rgba(0,200,0,0.5)"
        } else {
            this.ctx.lineWidth = lw ? lw : 1;
            this.ctx.clearRect(0, 0, wh.width + 1, wh.height + 1);
        }
    }

}

//原型链一定要有的
module.exports = new freedhand();