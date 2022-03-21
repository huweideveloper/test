const urlDict = {
  tagneed_addTagNeed: '/tagneed/addTagNeed',
  tagneed_findTagNeedById: '/tagneed/findTagNeedById',
  tagneed_batchDelTagTransfer: '/tagneed/batchDelTagTransfer',
  tagneed_findTagInfoList: '/tagneed/findTagInfoList',
  tagneed_batchAddTagTransfer: '/tagneed/batchAddTagTransfer',
  tagneed_batchExecuteTagTransfer: '/tagneed/batchExecuteTagTransferV2',
  tagneed_executeTagTransfer: '/tagneed/executeTagTransfer',
  tagneed_findGainIdDict: '/tagneed/findGainIdDict',
  tagneed_continueByTagTransferId: '/tagneed/continueByTagTransferId',
  tagneed_restart: '/tagneed/restartV2',
  getdictionary: '/sys/transfer',
}
var api = {
  tagneed_addTagNeed: function(value) {
    return this.HttpRequest.POST(urlDict.tagneed_addTagNeed, value)
  },
  tagneed_findTagNeedById: function(value) {
    return this.HttpRequest.POST(urlDict.tagneed_findTagNeedById, value)
  },
  tagneed_batchDelTagTransfer: function(value) {
    return this.HttpRequest.POST(urlDict.tagneed_batchDelTagTransfer, value)
  },
  tagneed_findTagInfoList: function(value) {
    return this.HttpRequest.POST(urlDict.tagneed_findTagInfoList, value)
  },
  tagneed_batchAddTagTransfer: function(value) {
    return this.HttpRequest.POST(urlDict.tagneed_batchAddTagTransfer, value)
  },
  tagneed_batchExecuteTagTransfer: function(value) {
    return this.HttpRequest.POST(urlDict.tagneed_batchExecuteTagTransfer, value)
  },
  getdictionary: function (value) {
    return this.HttpRequest.POST(urlDict.getdictionary, value)
  },
  tagneed_executeTagTransfer: function (value) {
    return this.HttpRequest.POST(urlDict.tagneed_executeTagTransfer, value)
  },
  tagneed_continueByTagTransferId: function (value) {
    return this.HttpRequest.POST(urlDict.tagneed_continueByTagTransferId, value)
  },
  tagneed_restart: function (value) {
    return this.HttpRequest.POST(urlDict.tagneed_restart, value)
  }

}
module.exports = api;
