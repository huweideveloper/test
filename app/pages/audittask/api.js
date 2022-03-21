import { generateRequestFn } from '@/api/common.api'

const urlDict = {
  // 列表相关 - start
  queryAuditTaskList: '/audit/task/search',
  cloneAuditTask: '/audit/task/clone',
  startAuditTask: '/audit/task/start',
  startAuditTaskC: '/audit/task/to/c/client/start',
  queryInfoPreStartAuditTask: '/audit/task/series/needaudit/count',
  queryLikeProjectList: '/audit/project/name/search',
  queryLikeTaskList: '/task/like/query',
  terminateTask: '/task/end',
  cloneCopyClone: '/audit/task/cloneV2',
  // 列表相关 - end
  // 创建/编辑 - start
  queryAuditProjectList: '/audit/project/name/venderId/search',
  createAuditTask: '/audit/task/create',
  updateAuditTask: '/audit/task/update',
  queryAuditTaskDetail: '/audit/task/read',
  queryAuditProjectCompList: '/audit/project/component/read',
  createAuditTaskToolComp: '/audit/task/tool/component/create',
  queryDoctorTaskProjectList: '/audit/project/task/doctor/project/read',
  queryProjectSeriesAnnotationResult: '/audit/project/series/annotation/result/read',
  addAuditTaskSeries: '/audit/task/series/add/',
  queryAuditTaskSeries: '/audit/task/series/annotation/result/read',
  deleteAuditTaskSeries: '/audit/task/project/series/annotation/result/delete',
  queryUserCountForAudit: '/user/annoable/count',
  queryVendorList: '/vendor/query',
  queryVendorUserList: '/vendor/user/list',
  viewComponentDetail: '/formComponent/read',
  queryAuditTaskToolComp: '/audit/task/tool/component/read',
  queryAuditTaskLesionComponent: '/audit/task/lesion/component/read', // C端病理大图时，查询病灶和小征象数据
  saveAuditTaskLesionComponent: '/audit/task/lesion/component/create', // C端病理大图时，保存
  // 创建/编辑 - end

  // 查阅审核结果相关
  auditTaskUserList: '/audit/task/user/list',
  auditTaskUserSeriesSearch: '/audit/task/user/series/search',
  seriesResultTaskJoin: '/audit/project/series/result/task/join'
}

export default generateRequestFn(urlDict)
