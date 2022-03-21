//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class createauditpro2 extends Interstellar.modelBase {
    constructor(app) {
        super(app)

        this.apiData = {projectId:parseInt(app.parpam.projectid),showReport:false,imgMactchrateList:[]}

    }
}
module.exports = createauditpro2;