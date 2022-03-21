import { generateRequestFn } from '@/api/common.api'

const urlDict = {
  // common
  projectNameSearch: '/project/name/search', // 根据名称查询项目
  auditProjectNameSearch: '/audit/project/name/search', // 根据名称查询所属项目

  // 列表
  auditProjectSearch: '/audit/project/search', // 查询列表
  auditProjectStatusUpdate: '/audit/project/status/update', // 启用
  auditProjectClone: '/audit/project/clone', // 复制

  // 第一步相关
  taskNameSearch: '/task/name/search', // 根据名称查询任务
  auditTaskSearchv2: '/audit/task/searchv2', // 查询审核源
  auditProjectRead: '/audit/project/read', // 审核项目详情
  auditProjectEdit: '/audit/project/edit', // 保存项目第一步

  // 第二步相关
  auditProjectSourceEdit: '/audit/project/source/edit', // 添加审核项目的审核任务
  auditProjectStatistics: '/audit/project/detail/statistics', // 查询统计导入审核源
  auditProjectSeriesRead: '/audit/project/series/read', // 查询已进入和未进入的审核序列数
  auditProjectTaskRead: '/audit/project/task/read', // 查询已选择的任务

  // 第三步相关
  auditTaskSearch: '/audit/task/search' // 审核任务列表
}

export default generateRequestFn(urlDict)
