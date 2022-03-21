import SelectTablePage from '@/components/select-table-page'
import app from '../../app.js'
import httpre from '../../utils/interceptAjax'
const httpRequest = new httpre(app);
import moment from 'moment';
import axios from 'axios';


class StoreVue extends Interstellar.pagesBase {
    complete() {
        this.initVue();
    }
    initVue(){
        new Vue({
            el: "#content",
            components: {
                SelectTablePage
            },
            data() {
                return {
                    projectType: [],
                    projectList: {
                        total: 0,
                        list: [],
                    },
                    hospitalCode: [],
                    hospitalList: {
                        total: 0,
                        list: [],
                    },
                    startTime:'',
                    endTime: '',
                    date: ['',''],
                    tableList: [],
    
                }
            },
            async mounted() {
                $("#content").css({
                    marginTop: "70px",
                    marginLeft: "200px"
                })
                this.$nextTick(this.bindHover);
                this.setDefaultDate();
                this.setProjectList();
                await this.setHospitalList();
                await this.setTableList();
                
            },
            methods: {
                bindHover(){
                    const vue = this;
                    $(".tableContainer").on("mouseenter", ".el-table__body-wrapper .el-table__row td", function(e){
                        const $cell = $(this).find('.cell');
                        const name = $cell.text();
                        const item = vue.projectList.list.find(item => item.name === name );
                        if( item && item.remark ){
                            $cell.append("<span class='hoverContent'>( "+item.remark+" )</span>")
                        }
                    })
                    $(".tableContainer").on("mouseleave", ".el-table__body-wrapper .el-table__row", function(){
                        $(this).find(".hoverContent").remove()
                    })
                },
                setDefaultDate(){
                    const date = moment();
                    this.startTime = date.subtract( date.day() - 1, 'days');
                    this.endTime = new Date();
    
                },
                setProjectList(){
                    try {
                        const list = app.constmap.ALG_TARGET_DIY.children || []
                        this.projectList.list = list;
                        this.projectList.total = list.length;
                    } catch (error) {
                        console.warn(error);
                    }
                },
                async setHospitalList(options={}){
                    const model = {
                        code: options.value || '',
                        page: options.page || 1,
                        pageSize: options.pageSize || 10
                    }
                    const { data } = await httpRequest.POST('/algTargetDiyReports/search/hospitalInfo/page', model);
                    this.hospitalList.list = data.list;
                    this.hospitalList.total = data.total;
                },
                handleSearch(){
                    this.setTableList();
                },
                getModel(){
                    const model = {
                        algTargetDiy: this.projectType,
                        hospitalCode: this.hospitalCode,
                        archiveTimeStart: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') + ' 00:00:00' : '',
                        archiveTimeEnd:  this.endTime ? moment(this.endTime).format('YYYY-MM-DD') + ' 23:59:59' : '',
                    }
                    return model;
                },
                async setTableList(){
                    const model = this.getModel();
                    const { data } = await httpRequest.POST('/algTargetDiyReports/query', model);
                    if( data ){
                        const tableList = this.changeTableList(data.seriesCountList);
                        this.tableList = tableList;
                    }
                },
                async hanlderExport(){
                    axios({
                        url: app.domain1 + 'v1/algTargetDiyReports/exportExcel',
                        method: 'post',
                        data: this.getModel(),
                        responseType: 'blob',
                        headers:{
                            "accessToken": window.localStorage.accessToken
                        },
                    }).then(res=>{
                        let blob = new Blob([res.data]); //res为从后台返回的数据
                        const elink = document.createElement('a');
                        elink.download = "入库数量统计.xlsx";
                        elink.style.display = 'none';
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href);
                        document.body.removeChild(elink);
                    })
                },
                changeTableList(tableList){
                    tableList.sort((a,b)=> b.itemTotal - a.itemTotal);
                    let list = [];
                    tableList.forEach( item =>{
                        const { seriesCountListItemList, algTargetDiy, itemTotal, itemTotalByTime } = item;
                        seriesCountListItemList.sort((a,b)=> b.seriesCount - a.seriesCount);
                        seriesCountListItemList.forEach((subItem,subIndex)=>{
                            subItem.typeName = algTargetDiy;
                            subItem.span = {
                                rowspan: subIndex === 0 ? seriesCountListItemList.length + 1 : 0,
                                colspan: subIndex === 0 ? 1 : 0
                            }
                            list.push(subItem);
                        });
                        list.push({
                            hospitalCode: '总数',
                            typeName: algTargetDiy,
                            seriesCount: itemTotal,
                            seriesCountByTime: itemTotalByTime,
                            span: {
                                rowspan: 0,
                                colspan: 0
                            }
                        })
                    })
                    return list;
                },
                objectSpanMethod({ row, columnIndex }) {
                    if ( columnIndex === 0 ) return row.span
                },
            }
        })
    }
  }

module.exports = StoreVue
