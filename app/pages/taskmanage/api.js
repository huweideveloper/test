import { generateRequestFn } from '@/api/common.api'

const urlDict = {
  // 任务指标数据相关
  maskPropertiesStudyDetailList: '/mask/properties/study/detail/list', // 查看任务指标数据，根据序列号和任务ID查询
  maskPropertiesIarDetailList: '/mask/properties/iar/detail/list', // 查看任务指标数据，根据序列号和病灶ID查询
}

export default generateRequestFn(urlDict)
