//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class hospitaldata extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.queryinfo = {page:1,pageSize:10}
    }
}
module.exports = hospitaldata;