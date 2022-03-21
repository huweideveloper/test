const urlDict = {
  study_detail: '/study/detail'
}
var api = {
    study_detail: function(value) {
      return this.HttpRequest.POST(urlDict.study_detail, value ,api.app.domain)
    }
}
module.exports = api;
