<template>
  <div class="label-stat">
    <div class="selectContainer">
          <select-table-page
            placeholder="全部医院"
            v-model="hospitalCode"
            :data="hospitalList"
            :remote-method="setHospitalList"
            key-name="id"
            value-name="name"
            :multiple="true"
        ></select-table-page>
        <el-date-picker
            class="datePicker startTime"
            v-model="startTime"
            type="date"
            placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
            class="datePicker endTime"
            v-model="endTime"
            type="date"
            placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <div class="intoGroup-content">
        <div id="echarts-map" class="echarts-map" v-bind:style="{ height: mapHeight+'px' }"></div>
        <div class="select">
            <el-radio v-model="dimension" label="SERIES">序列数</el-radio>
            <el-radio v-model="dimension" label="TASK">任务数</el-radio>
        </div>
    </div>
    
    <el-pagination
      class="el-pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import SelectTablePage from '@/components/select-table-page'
  import app from '../../app.js'
  import httpre from '../../utils/interceptAjax'
  const httpRequest = new httpre(app);
  import moment from 'moment';
  import * as echarts from 'echarts';

  export default {
    // inheritAttrs: false,
    props: {
      type: {
        type: String,
        default: 'local'
      },
    },
    components: {
        SelectTablePage
    },
    data() {
        const pageSizes = [20, 50, 100, 200, 500, 1000];
        return {
            hospitalCode: [],
            hospitalList: {
                total: 0,
                list: [],
            },
            startTime:'',
            endTime: '',
            date: ['',''],
            mapList: [],


            myChart: null,
            dimension: 'SERIES', //统计维度
            total: 0,
            currentPage: 1,
            pageSizes: pageSizes,
            pageSize: pageSizes[0],
            mapHeight: 700

        }
    },
    async mounted() {
        await this.setHospitalList();
        this.handleSearch();
    },
    methods: {
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.handleSearch(true);
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.handleSearch();
        },
        async setHospitalList(options={}){
            const model = {
                name: options.value || "",
                continueValidPerm:true
            }
            const { data } = await httpRequest.POST('/vendor/search', model);
            this.hospitalList.list = data.list;
        },
        async handleSearch(isChangePageSize){
            const model = this.getModel();
            const { data } = await httpRequest.POST('/statistics/anno/search', model);
            const { list, pages, total } = data;
            this.total = total;
            list.sort((a,b)=> a.annoCount - b.annoCount)
            const yAxisData = [],seriesData = [];
            list.forEach(item=>{
                yAxisData.push(item.userName);
                seriesData.push(item.annoCount)
            })
            this.mapHeight = Math.max(list.length, 20 ) / 20 * 700;
            if( this.myChart && isChangePageSize ){
                this.myChart.clear();
            }
            this.renderEchartsMap(yAxisData,seriesData);
        },
        getModel(){
            const model = {
                companyIds: this.hospitalCode,
                dimension: this.dimension,
                startSubmitTime: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') + ' 00:00:00' : null,
                endSubmitTime:  this.endTime ? moment(this.endTime).format('YYYY-MM-DD') + ' 23:59:59' : null,
                page: this.currentPage,
                pageSize: this.pageSize
            }
            return model;
        },
        renderEchartsMap(yAxisData, seriesData){
            const chartDom = document.getElementById('echarts-map');
            this.myChart = echarts.init(chartDom);
            this.myChart.resize({
                height: this.mapHeight + 'px'
            })
            const name = this.dimension === 'SERIES' ? '序列数' : '任务数';
            const option = { 
                title: {
                    text: '标注医生'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                legend: {},
                  
                xAxis: {
                    type: 'value',
                    name: name + ': 个',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: yAxisData
                },
                series: [
                    {
                        type: 'bar',
                        itemStyle: {
                            color: "#448E97"
                        },
                        label: {
                            show: true,
                            position: 'right'
                        },
                        barMaxWidth: '30px',
                        data: seriesData
                    }
                ]
            };
            this.myChart.setOption(option);
        },
        setDefaultDate(){
            const date = moment();
            this.startTime = date.subtract( date.day() - 1, 'days');
            this.endTime = new Date();
        },
        setProjectList(){
            try {
                const list = app.constmap.ALG_TARGET_DIY.children || []
                
            } catch (error) {
                // console.warn(error);
            }
        },
    }
  }
</script>

<style lang="less">
    .label-stat{
        margin: 20px;
        .el-select,
        .el-date-editor{
            margin-right: 15px;
        }
        .selectContainer{
            display: flex;
            justify-content: end;
        }
        .intoGroup-content {
            width: 100%;
            padding-top: 25px;
            padding-bottom: 50px;
            position: relative;
            .echarts-map{
                width: 100%;
                height: 700px;
            }
            .select{
                position: absolute;
                right: 0;
                top: 25px;
                z-index: 10
            }
        }
        .el-pagination-container{
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 0;
            z-index: 10;
            background: #fff;
            padding: 15px 0;
            width: 100%;
        }
    }

</style>


