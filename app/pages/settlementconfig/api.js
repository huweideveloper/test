import { generateRequestFn } from '@/api/common.api'

const urlDict = {
  quereyPageList: '/settlement/config/search',
  queryById: '/settlement/config/detail',
  edit: '/settlement/config/edit',
  delete: '/settlement/config/deleteById'
}

export default generateRequestFn(urlDict)
