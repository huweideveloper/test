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
        if (!value.uuid) {
            value.uuid = Tool.getSigleId()
        }
        this.info[value.uuid] = value
        return this.info[value.uuid]
    }
    getInfo(value) {
        return this.info[value.uuid]
    }
    getAll(){
        return this.info
    }
    removeInfo(value) {
        delete this.info[value.uuid]
    }


    removeAll() {
        this.info = {}
    }
}

//原型链一定要有的
module.exports = new manager();