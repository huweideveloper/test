const urlDict = {
  series_result_search: '/audit/project/series/result/search',
  auditproject_read: '/audit/project/read',
}
var api = {
    series_result_search: function(value) {
      return this.HttpRequest.POST(urlDict.series_result_search, value)
    },
  auditproject_read: function(value) {
      return this.HttpRequest.POST(urlDict.auditproject_read, value)
    },

}
module.exports = api;
