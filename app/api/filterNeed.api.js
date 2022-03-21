const urlDict = {
  tagneed_searchTagNeedByCondition: '/tagneed/searchTagNeedByCondition',
  tagneed_batchExecuteTagTransferByTagNeedId: '/tagneed/batchExecuteTagTransferByTagNeedId',
  tagneed_pauseByTagNeedId: '/tagneed/pauseByTagNeedId',
}
var api = {
  tagneed_searchTagNeedByCondition: function (value) {
    return this.HttpRequest.POST(urlDict.tagneed_searchTagNeedByCondition, value)
  },
  tagneed_batchExecuteTagTransferByTagNeedId: function (value) {
    return this.HttpRequest.POST(urlDict.tagneed_batchExecuteTagTransferByTagNeedId, value)
  },
  tagneed_pauseByTagNeedId: function (value) {
    return this.HttpRequest.POST(urlDict.tagneed_pauseByTagNeedId, value)
  }
}
module.exports = api;
