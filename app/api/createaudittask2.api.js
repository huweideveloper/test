const urlDict = {
  audit_task_series_annoitem_list: '/audit/task/series/annoitem/list',
  audit_task_image_annoitem_list: '/audit/task/image/annoitem/list',
  audit_task_series_annoitem_create: '/audit/task/series/annoitem/create',
  audit_task_image_annoitem_create: '/audit/task/image/annoitem/create',
  audit_task_auditinfo_update: '/audit/task/auditinfo/update',
  audit_task_series_count: '/audit/task/series/count',
  task_source_query: '/audit/project/import/task/source/query',
  task_source_import: '/audit/task/source/import',
  task_source_remove: '/audit/task/source/remove',
  audit_project_series_search: '/audit/project/series/search',
  audit_project_matchrate_query: '/audit/project/matchrate/query',
  audit_task_series_update: '/audit/task/series/update',
  audit_task_series_search: '/audit/task/series/search',
  audit_task_series_search_result_remove: '/audit/task/series/search/result/remove',
  formComponent_read: '/formComponent/read',
  audit_task_read: '/audit/task/read',
  audit_task_update: '/audit/task/update',
  audit_task_series_needaudit_count: '/audit/task/series/needaudit/count',
  audit_task_auditinfo_savePickCondition: '/audit/task/auditinfo/savePickCondition',
  audit_task_addYay: '/audit/task/addYay',
  audit_task_getLastCountSeriesNumResult: '/audit/task/getLastCountSeriesNumResult',
  audit_task_addRemarkType: '/audit/task/addRemarkType',
}
var api = {
    audit_task_series_annoitem_list: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_annoitem_list, value)
    },
    audit_task_image_annoitem_list: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_image_annoitem_list, value)
    },
    audit_task_series_annoitem_create: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_annoitem_create, value)
    },
    audit_task_image_annoitem_create: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_image_annoitem_create, value)
    },
    audit_task_auditinfo_update: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_auditinfo_update, value)
    },
    audit_task_series_count: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_count, value)
    },
    task_source_query: function(value) {
      return this.HttpRequest.POST(urlDict.task_source_query, value)
    },
    task_source_import: function(value) {
      return this.HttpRequest.POST(urlDict.task_source_import, value)
    },
    task_source_remove: function(value) {
      return this.HttpRequest.POST(urlDict.task_source_remove, value)
    },
    audit_project_series_search: function(value) {
      return this.HttpRequest.POST(urlDict.audit_project_series_search, value)
    },
    audit_project_matchrate_query: function(value) {
      return this.HttpRequest.POST(urlDict.audit_project_matchrate_query, value)
    },
    audit_task_series_update: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_update, value)
    },
    audit_task_series_search: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_search, value)
    },
    audit_task_series_search_result_remove: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_search_result_remove, value)
    },
    formComponent_read: function(value) {
      return this.HttpRequest.POST(urlDict.formComponent_read, value)
    },
    audit_task_read: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_read, value)
    },
    audit_task_update: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_update, value)
    },
    audit_task_series_needaudit_count: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_series_needaudit_count, value)
    },
  audit_task_auditinfo_savePickCondition: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_auditinfo_savePickCondition, value)
    },
  audit_task_addYay: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_addYay, value)
    },
  audit_task_getLastCountSeriesNumResult: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_getLastCountSeriesNumResult, value)
    },
  audit_task_addRemarkType: function(value) {
      return this.HttpRequest.POST(urlDict.audit_task_addRemarkType, value)
    }
}
module.exports = api;
