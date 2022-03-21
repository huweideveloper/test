const urlDict = {
  series_review_task_search: '/v1/series_review_task/search',
  series_review_task_create: '/v1/series_review_task/create',
  series_review_task_read: '/v1/series_review_task/read',
  series_review_task_update: '/v1/series_review_task/update',
  series_review_task_start: '/v1/series_review_task/start',
  series_review_task_delete: '/v1/series_review_task/delete',
}
const transUrl = '/sys/transfer'
let temp={service:'DR'}
var api = {
    series_review_task_search: function(value) {
      temp.method = urlDict.series_review_task_search
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    series_review_task_create: function(value) {
      temp.method = urlDict.series_review_task_create
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    series_review_task_read: function(value) {
      temp.method = urlDict.series_review_task_read
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    series_review_task_update: function(value) {
      temp.method = urlDict.series_review_task_update
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    series_review_task_start: function(value) {
      temp.method = urlDict.series_review_task_start
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    },
    series_review_task_delete: function(value) {
      temp.method = urlDict.series_review_task_delete
      temp.params = JSON.stringify(value)
      return this.HttpRequest.POST(transUrl, temp )
    }
}
module.exports = api;
