//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class createaudittask3 extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.modality = {};
        this.ytjcomplist = {};
        this.componentdata = {};
        this.apiData = { modality: '',seriesList:[], annotationItemList:[],imageAnnotationList:[],cacheNumber:'',discurdIdList:[] }
    }
}
module.exports = createaudittask3;