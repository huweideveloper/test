import { domain1 } from '@/api/common.api'
import axios from '@utils/request'

const urlDict = {
  querycomponent: '/component/query',
  getcomponentdetail: '/component/read',
  createproject: '/project/create',
  project_anno_read: '/project/anno/read',
  project_basic_read: '/project/basic/read',
  getimage: '/sys/transfer',
  gethospital: '/sys/transfer',
  getmodality: '/series/modality/all',
  isrepeat: '/project/findByName',
  task_stayClone_search: '/task/stayClone/search',
  task_cloneList: '/task/cloneList',
  task_like_query: '/task/like/query',
  getproimage: '/project/series/search',
  updateproimage: '/project/series/update',
  clearseries: '/project/series/empty',
  series_count: '/project/series/count',
  searchresult_remove: '/project/series/searchresult/remove',
  get_import_result_list_search: '/alg/sar/get_import_result_list/search',
  alg_sar_list_tool: '/alg/sar/list_tool',
  project_edit_algResultType: '/project/edit/algResultType',
  sar_get_last_import_log: '/alg/sar/get_last_import_log',
  heartSegment_resultRead:'/heartSegment/resultRead',
  heartSegment_start:'/heartSegment/start',
  joinAlg:'/project/edit/joinAlg',
  mergemask7Process:'/heartSegment/mergemask7/process',
  project_eurysmMask:'/project/eurysmMask',
  auditProjectTaskList: '/audit/task/search',
  exportReferAnnotatedArea: '/anno/alg/preprocess/export' // 下载已导入参考标注区域范围数据
}
var api = {
  querycomponent (value) {
    return this.HttpRequest.POST(urlDict.querycomponent, value)
  },
  getcomponentdetail (value) {
    return this.HttpRequest.POST(urlDict.getcomponentdetail, value)
  },
  createproject (value) {
    return this.HttpRequest.POST(urlDict.createproject, value)
  },
  project_anno_read (value) {
    return this.HttpRequest.POST(urlDict.project_anno_read, value)
  },
  project_basic_read (value) {
    return this.HttpRequest.POST(urlDict.project_basic_read, value)
  },
  getimage (value) {
    return this.HttpRequest.POST(urlDict.getimage, value)
  },
  gethospital (value) {
    return this.HttpRequest.POST(urlDict.gethospital, value)
  },
  getmodality (value) {
    return this.HttpRequest.POST(urlDict.getmodality, value)
  },
  isrepeat (value) {
    return this.HttpRequest.POST(urlDict.isrepeat, value)
  },
  task_stayClone_search (value) {
    return this.HttpRequest.POST(urlDict.task_stayClone_search, value)
  },
  task_cloneList (value) {
    return this.HttpRequest.POST(urlDict.task_cloneList, value)
  },
  task_like_query (value) {
    return this.HttpRequest.POST(urlDict.task_like_query, value)
  },
  getproimage (value) {
    return this.HttpRequest.POST(urlDict.getproimage, value)
  },
  updateproimage (value) {
    return this.HttpRequest.POST(urlDict.updateproimage, value)
  },
  clearseries (value) {
    return this.HttpRequest.POST(urlDict.clearseries, value)
  },
  series_count (value) {
    return this.HttpRequest.POST(urlDict.series_count, value)
  },
  searchresult_remove (value) {
    return this.HttpRequest.POST(urlDict.searchresult_remove, value)
  },
  get_import_result_list_search (value) {
    return this.HttpRequest.POST(urlDict.get_import_result_list_search, value)
  },
  alg_sar_list_tool (value) {
    return this.HttpRequest.POST(urlDict.alg_sar_list_tool, value)
  },
  project_edit_algResultType (value) {
    return this.HttpRequest.POST(urlDict.project_edit_algResultType, value)
  },
  heartSegment_resultRead (value) {
    return this.HttpRequest.POST(urlDict.heartSegment_resultRead, value)
  },
  heartSegment_start (value) {
    return this.HttpRequest.POST(urlDict.heartSegment_start, value)
  },
  project_joinAlg (value) {
    return this.HttpRequest.POST(urlDict.joinAlg, value)
  },
  mergemask7Process_start (value) {
    return this.HttpRequest.POST(urlDict.mergemask7Process, value)
  },
  sar_get_last_import_log (value) {
    return this.HttpRequest.POST(urlDict.sar_get_last_import_log, value)
  },
  project_eurysmMask (value) {
    return this.HttpRequest.POST(urlDict.project_eurysmMask, value)
  },
  auditProjectTaskList: function(data) {
    return this.HttpRequest.POST(urlDict.auditProjectTaskList, data)
  },
  exportReferAnnotatedArea: function(data) {
    // return this.HttpRequest.POST(urlDict.exportReferAnnotatedArea, data, undefined, 'blob')
    return axios.post(`${domain1}/v1/${urlDict.exportReferAnnotatedArea}`, data, { responseType: 'blob' })
  }
}
module.exports = api;
