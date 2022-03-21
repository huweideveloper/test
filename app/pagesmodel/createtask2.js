//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class createtask2 extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.proseriesdata = {page:1,pageSize:10,assigned:false}
        this.querytask={page:1,pageSize:10}
    }
}
module.exports = createtask2;