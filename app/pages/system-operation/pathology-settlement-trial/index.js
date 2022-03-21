import './index.less'
import Papa from 'papaparse'
import XLSX from 'xlsx'

class pathologySettlementTrial extends Interstellar.pagesBase {
  complete() {
    const that = this
    new Vue({
      el: '#pathologySettlementTrial',
      data() {
        return {
          fileList: [],
          fileDatas: [],
          loading: false,
          settlementConfig: null
        }
      },
      mounted() {
        this.initConfig()
      },
      methods: {
        // 初始化配置文件
        initConfig() {
          const mapConfig = Tool.configobjformatremark(that.app.constmap["BL_SETTLEMENT_CONFIG"])
          mapConfig.config && (this.settlementConfig = JSON.parse(mapConfig.config))
        },
        handleBeforeUpload(file) {
          const fileName = file.name
          const isCSV = /.*\.csv$/.test(fileName.toLowerCase())
          if (!isCSV) {
            this.$message.error('请选择CSV文件转换')
            this.fileList = []
            return false
          }
          this.fileList = [{ name: fileName }]
          return false
        },
        handleChange(file, fileList) {
          this.showLoading(true)
          // 选中的某个文件
          Papa.parse(file.raw, {
            complete: ({ data }) => {
              this.fileDatas = data
              this.getDoctorSeqList()
            }
          })
        },
        // 获取医生和序列号的分组信息，key：医生和序列号
        getDoctorSeqList() {
          const allDatas = this.fileDatas || []
          const allHeaders = allDatas[0] || []
          // 查找序列编号，影像工具，影像结果，病灶列
          const doctoridIdx = Tool.findColIndex('医生ID', allHeaders)
          const seqIdx = Tool.findColIndex('序列号', allHeaders)
          const auditIdx = Tool.findColIndex('审核判定', allHeaders)
          if (doctoridIdx === -1 || seqIdx === -1 || auditIdx === -1) {
            this.showLoading(false)
            return
          }

          // 根据医生ID和序列号，计算出病灶总数，正确率，根据病灶数确定取配置文件的：底薪，标准，数据结果
          const docSeqMap = {} // 医生序列号数据
          const doctorAccountMap = {} // 医生总额统计
          for (let i = 1; i < allDatas.length; i++) {
            const data = allDatas[i]
            const doc = data[doctoridIdx]
            const seq = data[seqIdx]
            if (!doc || !seq) continue
            const doc_seq = `${doc}_${seq}` // 医生ID_序列号
            !docSeqMap[doc_seq] && (docSeqMap[doc_seq] = [])
            docSeqMap[doc_seq].push(data)
          }

          // 构建返回医生数据
          const resDataSheet = []
          for (const doc_seq in docSeqMap) {
            const [doc, seq] = doc_seq.split('_')
            const datas = docSeqMap[doc_seq]
            const allNums = datas.length
            let rightNums = 0
            datas.forEach(d => {
              const auditVal = d[auditIdx] // 审核判定
              auditVal === '正确' && rightNums++
            })
            const rightRate = `${(rightNums / allNums * 100).toFixed(2)}%`
            // 计算结算金额
            const settlementCount = this.countSettlement(rightNums, allNums)
            // 构造sheet数据
            resDataSheet.push({ '医生ID': doc, '序列号': seq, '准确率': rightRate, '正确总数': rightNums, '病灶总数': allNums, '结算金额': settlementCount })
            // 统计医生总额
            !doctorAccountMap[doc] && (doctorAccountMap[doc] = 0)
            doctorAccountMap[doc] += Number(settlementCount)
          }

          // 构造统计医生总额Sheet
          let doctorAccountSheet = []
          let allMount = 0
          for (const doc in doctorAccountMap) {
            const val = doctorAccountMap[doc]
            const accounts = val.toFixed(2)
            doctorAccountSheet.push({ '医生Id': doc, '结算总额': accounts })
            allMount += Number(accounts)
          }
          doctorAccountSheet.push({ '医生Id': '总计', '结算总额': allMount })

          // 输出Excel文件
          const sheet1 = XLSX.utils.json_to_sheet(resDataSheet)
          const sheet2 = XLSX.utils.json_to_sheet(doctorAccountSheet)
          const blob1 = Tool.sheet2blob({ '医生序列号统计数据': sheet1, '统计数据': sheet2 }, 'excel-json')
          Tool.openDownloadDialog(blob1, `病理结算试算结果.xlsx`)
          this.showLoading(false)
        },
        // 计算结算金额
        countSettlement(rightNums, allNums) {
          /**
           * salaryRangs: 底薪区间[min, max],
           * gear: 档位,
           * rateRanges: 准确率区间[min, max]，
           * 如果区间的数据,则使用公式：底薪+档位*准确率
           */
          // const config = {
          //   "basicCount": 200,
          //   "level1": { "gear": 100, "salaryRangs": [30, 140], "rateRanges": [60, 90] }, // < basicCount
          //   "level2": { "gear": 200, "salaryRangs": [50, 250], "rateRanges": [50, 90] } // >= basicCount
          // }

          !this.settlementConfig && this.initConfig()
          const config = this.settlementConfig
          const { basicCount, level1, level2 } = config
          const level = allNums >= basicCount ? level2 : level1
          const { gear, salaryRangs, rateRanges } = level
          const [salMin, salMax] = salaryRangs || [0, 0]
          const [rateMin, rateMax] = rateRanges || [0, 0]
          const rightRate = (rightNums / allNums * 100)

          let settlementCount = 0
          if (rightRate < rateMin) {
            settlementCount = salMin
          } else if (rightRate >= rateMin && rightRate < rateMax) {
            settlementCount = (gear * rightRate / 100) + salMin // 使用公式：档位*准确率+底薪
          } else if (rightRate >= rateMax) {
            settlementCount = salMax
          }
          return Number(settlementCount.toFixed(2))
        },
        showLoading(bool) {
          this.loading = bool
        }
      }
    })
  }
}

module.exports = pathologySettlementTrial
