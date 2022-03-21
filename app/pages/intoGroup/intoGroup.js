import SelectTablePage from '@/components/select-table-page'
import app from '../../app.js'
import httpre from '../../utils/interceptAjax'
const httpRequest = new httpre(app);
import moment from 'moment';
import * as echarts from 'echarts';


class IntoGroup extends Interstellar.pagesBase {
    complete() {
        this.init();
    }
    init(){
        new Vue({
            el: "#content",
            components: {
                SelectTablePage
            },
            data() {
                return {
                    hospitalCode: [],
                    hospitalList: {
                        total: 0,
                        list: [],
                    },
                    startTime:'',
                    endTime: '',
                    date: ['',''],
                    tableList: [],

                    
                    dimension: 'SERIES', //统计维度
    
                }
            },
            async mounted() {
                // this.initEchartsMap();
                await this.setHospitalList();
                
            },
            methods: {
                async setHospitalList(options={}){
                    console.log(options);
                    const model = {
                        name: options.value || "",
                        continueValidPerm:true
                    }
                    const { data } = await httpRequest.POST('/vendor/search', model);
                    this.hospitalList.list = data.list;
                },
                async handleSearch(){
                    const { data } = await httpRequest.POST('/statistics/anno/search', this.getModel());
                    const { list } = data;
                    list.sort((a,b)=> a.annoCount - b.annoCount)
                    const yAxisData = [],seriesData = [];
                    list.forEach(item=>{
                        yAxisData.push(item.userName);
                        seriesData.push(item.annoCount)
                    })
                    this.renderEchartsMap(yAxisData,seriesData);
                },
                getModel(){
                    const model = {
                        companyIds: this.hospitalCode,
                        dimension: this.dimension,
                        // startSubmitTime: this.startTime ? new Date(this.startTime).getTime()/1000 : null,
                        // endSubmitTime:  this.endTime ? new Date(this.endTime).getTime()/1000 : null,
                        startSubmitTime: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') + ' 00:00:00' : null,
                        endSubmitTime:  this.endTime ? moment(this.endTime).format('YYYY-MM-DD') + ' 23:59:59' : null,
                        page: 1,
                        pageSize: 20

                    }
                    return model;
                },
                renderEchartsMap(yAxisData, seriesData){
                    const chartDom = document.getElementById('echarts-map');
                    const myChart = echarts.init(chartDom);
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
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        },
                        yAxis: {
                            type: 'category',
                            data: yAxisData
                        },
                        series: [
                            {
                                type: 'bar',
                                data: seriesData
                            }
                        ]
                    };
                    myChart.setOption(option);
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
        })
    }
  }

module.exports = IntoGroup
