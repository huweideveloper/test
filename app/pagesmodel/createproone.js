//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class createproone extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.apiData = { "name": "", "remark": "","remarkFileUrl":"[]" }
    }
}
module.exports = createproone;