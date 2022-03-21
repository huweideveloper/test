import './index.less'
import api from '../api.js'
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入线状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

class YtjtaskStatistical extends Interstellar.pagesBase {
  complete() {
    const self = this
    this.styleModel(1)
    const app = this.app
    const { sid, taskId, nidusId } = app.parpam // sid:序列号 taskId:任务Id nidusId:病灶Id

    new Vue({
      el: `#ytjtaskstatistical`,
      data() {
        return {
          seriesId: sid,
          taskId,
          nidusId,
          tableData: [],

          visibleModel: false,
          nidusInfoTableDataIarId: '',
          nidusInfoTableData: []
        }
      },
      mounted() {
        this.queryTableData()
      },
      methods: {
        async queryTableData() {
          const { seriesId, taskId, nidusId } = this
          let res = {}
          if (nidusId) {
            // 根据序列号和病灶Id查询
            res = await api.maskPropertiesIarDetailList({ seriesUid: seriesId, imageAnnotationResultId: Number(nidusId)})
          } else {
            // 根据序列号和任务Id查询
            res = await api.maskPropertiesStudyDetailList({ seriesId, taskId }) // seriesId实际为studyId
          }
          this.initTableData(res.data.list)
        },
        initTableData(list) {
          const data = []
          list.forEach((series) => {
            const { seriesUid, maskProperties } = series
            maskProperties.forEach((mask, i) => {
              i === 0 && (mask.rowspan = maskProperties.length)
              mask.seriesUid = seriesUid
              // 格式化密度分布
              mask.instanceInfo &&
                mask.instanceInfo.forEach((ins = {}) => {
                  const huInfo = ins.huInfo || []
                  ins.huInfoStr = huInfo
                    .sort((a, b) => a.huVal - b.huVal)
                    .map((hu) => `${hu.huVal}：${hu.valCount}个`)
                    .join('；')
                })
              data.push(mask)
            })
          })
          this.tableData = data
        },
        // 查看病灶统计
        handleShowModel(iarId, data) {
          this.nidusInfoTableDataIarId = iarId
          this.nidusInfoTableData = data
          this.changeVisibleModel(true)
        },
        // model显示
        changeVisibleModel(isShow) {
          this.visibleModel = isShow
        },
        // 合并序列单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 0) {
            if (row.rowspan) {
              return {
                rowspan: row.rowspan,
                colspan: 1
              }
            } else {
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
        },
        // 病灶汇总的直方图
        handleShowChartAll(row) {
          // 汇总求和
          const instanceInfo = row.instanceInfo
          const list = instanceInfo.reduce((all, cur) => {
            cur.huInfo &&
              cur.huInfo.forEach((huInfo) => {
                const { huVal, valCount } = huInfo
                const curVal = all.find((v) => v.huVal === huVal)
                curVal ? (curVal.valCount += valCount) : all.push({ huVal, valCount })
              })
            return all
          }, [])
          this.initChart(`nidus-echarts-container${row.iarId}`, list)
        },
        // 病灶单个位置的直方图
        handleShowChart(row, index) {
          // 数据
          const huInfoList = row.huInfo || []
          this.initChart(`nidus-echarts-container${this.nidusInfoTableDataIarId}${index}`, huInfoList)
        },
        // 线状图
        initChart(id, listData = []) {
          // 数据排序
          const xAxisData = []
          const seriesData = []
          listData
            .sort((a, b) => {
              return Number(a.huVal) - Number(b.huVal)
            })
            .forEach((v) => {
              xAxisData.push(v.huVal)
              seriesData.push(v.valCount)
            })
          // test...
          let str = `All:{`
          listData.map(v => { str += `${v.huVal}:${v.valCount},`})
          console.log(`${str}}`)

          // 基于准备好的dom，初始化echarts实例
          const myChart = echarts.init(document.getElementById(id))
          // 绘制图表
          myChart.setOption({
            title: {
              text: '密度分布图'
            },
            legend: {
              data: ['bar']
            },
            toolbox: {
              // y: 'bottom',
              feature: {
                magicType: {
                  type: ['stack', 'tiled']
                },
                dataView: {},
                saveAsImage: {
                  pixelRatio: 2
                }
              }
            },
            tooltip: {},
            xAxis: {
              name: 'HU',
              type: 'category',
              data: xAxisData,
              splitLine: {
                show: false
              }
            },
            yAxis: {
              name: '（个数）'
            },
            series: [
              {
                name: '密度分布',
                type: 'line',
                smooth: true,
                data: seriesData,
                animationDelay: function(idx) {
                  return idx * 2
                }
              }
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function(idx) {
              return idx * 2
            }
          })
        }
      }
    })
  }
}

module.exports = YtjtaskStatistical
