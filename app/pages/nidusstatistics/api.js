import { generateRequestFn } from '@/api/common.api'

const urlDict = {
  queryOverallStatisticsData: '/anno/image_result/statistics/query',
  queryNidusList: '/anno/image_result/search'
}

export default generateRequestFn(urlDict)
