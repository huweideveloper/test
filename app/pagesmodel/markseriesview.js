class markseriesview extends MarkModel {
    constructor(app) {
        super(app)
    }
    //将组件数据翻译后端需要的数据格式进行提交
    changeItemDataToBackend(id, value) {
        let postData = {}
        postData.id = id
        postData.annotationItemResultList = []
        for (var i in value) {
            let data = value[i].result.split(',').filter((item) => { return item }).toString()
            postData.annotationItemResultList.push({ annotationItemId: i, formComponentId: value[i].formComponentId, result: data })
        }
        return postData
    }
}
module.exports = markseriesview;
