import { generateRequestFn } from '@/api/common.api'

const urlDict = {
  queryPathologyStatistics: '/statistics/pathology'
}

export default generateRequestFn(urlDict)
