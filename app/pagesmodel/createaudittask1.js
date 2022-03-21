//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class createaudittask1 extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.listInfo = {}
        this.hospitalInfo = {}
        this.modalityInfo = {}
        this.totalInfo = {}
        this.componentdata={}
        this.apiData = { "name": "", "remark": "","remarkFileUrl":"[]" }
    }
}
module.exports = createaudittask1;