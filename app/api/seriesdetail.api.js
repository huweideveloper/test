const urlDict = {
  series_detail: '/series/detail',
  series_origin_detail: '/series/origin/detail'
}
var api = {
    series_detail: function(value) {
      return this.HttpRequest.POST(urlDict.series_detail, value ,api.app.domain)
    },
    series_origin_detail: function(value) {
      return this.HttpRequest.POST(urlDict.series_origin_detail, value ,api.app.domain)
    }
}
module.exports = api;
