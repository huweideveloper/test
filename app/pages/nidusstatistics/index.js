import './index.less'
import api from './api.js'
import FilterContainer from '@/components/filter-container'
import TablePagination from '@/components/table-pagination'

class nidusstatistics extends Interstellar.pagesBase {
  complete() {
    const self = this

    new Vue({
      el: '#nidusStatistics',
      components: {
        FilterContainer,
        TablePagination
      },
      data() {
        return {
          dateRange: [], // 开始日期和结束日期
          nidusTotalCount: 0, // 已标注mask病灶总数
          nidusCount1: 0, // 放射科标注mask病灶总数
          nidusCount2: 0, // 病理科标注mask病灶总数
          nidusList: {}, // 审核任务列表
          page: 1, // 是从第一页开始
          pageSize: 10
        }
      },
      computed: {
        startEndDate() {
          const obj = {}
          const [startDate, endDate] = this.dateRange || []
          if(startDate && endDate) {
            obj.startDate = startDate
            obj.endDate = endDate
          }
          return obj
        }
      },
      async created() {
        this.categoryList = { 1: '放射科', 2: '病理科' }
        this.orderObj = {
          property: 'volume',
          direction: 1
        }
        this.queryData()
        this.initDatePickerData()
      },
      methods: {
        initDatePickerData() {
          const generateDateRange = (howLongAgo) => { // 几天前
            const MILLISECONDS_OF_A_DAY = 86400000 // 一天时间的毫秒值(3600 * 1000 * 24)
            const from = new Date()
            from.setTime(from.getTime() - MILLISECONDS_OF_A_DAY * howLongAgo)
            return [from, new Date()]
          }
          this.pickerOptions = {
            shortcuts: [{
              text: '昨天',
              onClick(picker) {
                picker.$emit('pick', generateDateRange(1))
              }
            }, {
              text: '最近三天',
              onClick(picker) {
                picker.$emit('pick', generateDateRange(3))
              }
            },{
              text: '最近一周',
              onClick(picker) {
                picker.$emit('pick', generateDateRange(7))
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                picker.$emit('pick', generateDateRange(30))
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                picker.$emit('pick', generateDateRange(90))
              }
            }]
          }
        },
        queryData() {
          this.page = 1
          this.queryNidusList()
          this.queryOverallStatisticsData()
        },
        async queryOverallStatisticsData() {
          const statisticsData = await api.queryOverallStatisticsData({
            resultType: 1,
            ...this.startEndDate
          })
          this.nidusTotalCount = 0
          this.nidusCount1 = 0
          this.nidusCount2 = 0
          statisticsData.data.forEach(({ category, number }) => {
            if (category === 1 || category === 2) {
              this.nidusTotalCount += number
              this[`nidusCount${category}`] = number
            }
          })
        },
        volumeFormatter({ volume }, column) {
          return volume || '无'
        },
        async queryNidusList() {
          const params = {
            resultType: 1,
            page: this.page,
            pageSize: this.pageSize,
            ...this.startEndDate,
            order: this.orderObj
          }
          const res = await api.queryNidusList(params)
          this.nidusList = res.data
        },
        // 表格状态更新
        onChange(pagination, filtersArg, { prop, order }) {
          const { pageNo, pageSize } = pagination
          this.page = pageNo
          this.pageSize = pageSize
          if(prop && order) { // 选择了按某字段排序
            this.orderObj = {
              property: prop === 'imageAnnotationResultId' ? 'id' : prop,
              direction: order === 'ascending' ? 0 : 1
            }
          }
          this.queryNidusList()
        },
        viewStatistics({ imageAnnotationResultId, seriesInstanceUid, volume }) {
          if(!volume) {
            this.$message.warning('暂无病灶指标')
            return false
          }
          self.app.changePage('ytjtaskstatistical', { sid: seriesInstanceUid, taskId: '0', nidusId: imageAnnotationResultId })
        }
      }
    })
  }
}

module.exports = nidusstatistics
