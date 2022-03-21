const urlDict = {
  matchrate_query: '/audit/project/matchrate/query',
  auditproject_read: '/audit/project/read',
  import_project_edit: '/audit/project/import/project/edit',
  addable_series_query: '/audit/project/annoitem/addable/series/query',
  addable_image_query: '/audit/project/annoitem/addable/image/query',
  formComponent_read: '/formComponent/read',
  task_source_query: '/audit/project/import/task/source/query',
  import_task_edit: '/audit/project/import/task/edit',
}
var api = {

    matchrate_query: function(value) {
      return this.HttpRequest.POST(urlDict.matchrate_query, value)
    },

    auditproject_read: function(value) {
      return this.HttpRequest.POST(urlDict.auditproject_read, value)
    },

    import_project_edit: function(value) {
      return this.HttpRequest.POST(urlDict.import_project_edit, value)
    },

    addable_series_query: function(value) {
      return this.HttpRequest.POST(urlDict.addable_series_query, value)
    },

    addable_image_query: function(value) {
      return this.HttpRequest.POST(urlDict.addable_image_query, value)
    },

    formComponent_read: function(value) {
      return this.HttpRequest.POST(urlDict.formComponent_read, value)
    },

    task_source_query: function(value) {
      return this.HttpRequest.POST(urlDict.task_source_query, value)
    },

    import_task_edit: function(value) {
      return this.HttpRequest.POST(urlDict.import_task_edit, value)
    }
}
module.exports = api;
