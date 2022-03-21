import { domain1, generateRequestFn } from '@/api/common.api'

const urlDict = {
  querySettlementStatics: '/statistics/series/annotation/result/settlement',
  settleSettlement: '/statistics/settlement/status/settled',
  queryAuditTaskList: '/statistics/audit/project/query',

  querySettlementDetail: '/settlement/info/detail', // 查询结算详情
  editSettlement: '/settlement/info/edit', // 编辑结算
  trySettlement: '/settlement/info/try/settlement' // 试结算
}

const fn = generateRequestFn(urlDict)

fn.uploadSettlementUrl = `${domain1}/v1/settlement/info/upload` // 导入

export default fn
