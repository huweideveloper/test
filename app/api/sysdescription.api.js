const urlDict = {
  sys_summary: '/v1/sys/summary'
}
const transUrl = '/sys/transfer'
let temp={service:'DR'}
var api = {
    sys_summary: function(value) {
      temp.method = urlDict.sys_summary
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    }
}
module.exports = api;
