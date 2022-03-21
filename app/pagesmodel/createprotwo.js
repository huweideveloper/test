//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class createprotwo extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.modality = {};
        this.ytjcomplist = {};
        this.componentdata = {};
        this.apiData = { modality: '',seriesList:[], annotationItemList:[],imageAnnotationList:[],cacheNumber:'',discurdIdList:[] , studyAnno:false , category:0,yayAttributes:2 }
    }
}
module.exports = createprotwo;
