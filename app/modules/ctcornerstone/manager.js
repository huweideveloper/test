//该类是对于基本的画圆什么的一些信息的管理
class manager {
    constructor() {
        this.init()
    }
    init() {
        this.info = {}
        this.singelId = Tool.getSigleId()
        this.brushInfo = {}
    }
    setInfo(value) {
        if (!this.info[value.layerNumber]) {
            this.info[value.layerNumber] = []
        }
        value.show=true
        if (!value.uuid) {
            value.uuid = this.singelId
            this.info[value.layerNumber].push(value)
            this.singelId = Tool.getSigleId()
        } else {
            let pushnow = true
            this.info[value.layerNumber].map(function(item) {
                if (item.uuid == value.uuid || item.id == value.id) {
                    for (let i in item) {
                        if (!value[i]) {
                            value[i] = item[i]
                        } else {
                            item[i] = value[i]
                        }
                    }
                    pushnow = false
                }
                //item = value
            })
            //console.log(pushnow)
            if (pushnow) {
                this.info[value.layerNumber].push(value)
            }
        }
    }
    restSignleIdShow(value) {
        for (let i in this.info) {
            for (let j in this.info[i]) {
                if (j == value.bid || j == value.uuid) {
                    this.info[i][j].show = value.show
                }
            }
        }
    }
    getInfo(value) {
        let returnInfo = {}
        this.info[value.layerNumber] && this.info[value.layerNumber].map(function(item) {
            if (item.uuid == value.uuid || item.id == value.uuid) {
                returnInfo = item
            }
        })
        return returnInfo
    }

    removeInfo(value) {
        //  console.log(value.layerNumber, this.info, value)
        if (!this.info[value.layerNumber]) return
        let allData
        for (let i = 0; i < this.info[value.layerNumber].length; i++) {
            let itemId = this.info[value.layerNumber][i]
           // console.log(this.info[value.layerNumber][i])
            if (itemId.uuid == value.id || itemId.id == value.id) {
                allData = JSON.parse(JSON.stringify(this.info[value.layerNumber][i]))
               // console.log(allData, 'allDataallData')
                this.info[value.layerNumber].splice(i, 1)
            }
        }
        return allData
    }

    getSigleLayer(layerNum) {
        return this.info[value.layerNum] ? this.info[value.layerNum] : []
    }
    removeAll() {
        this.info = {}
    }
}

//原型链一定要有的
module.exports = new manager();
