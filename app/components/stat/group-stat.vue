<template>
  <div id="group-stat" class="group-stat">
    <div class="selectContainer">
      <el-date-picker
        class="datePicker startTime"
        v-model="startTime"
        type="date"
        placeholder="开始日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-date-picker
        class="datePicker endTime"
        v-model="endTime"
        type="date"
        placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button type="primary" v-show="showConfig" @click="handleDialog">统计设置</el-button>
    </div>
    <div class="map">
      <div id="echarts-map" class="echarts-map"></div>
    </div>

    <el-dialog
      class="dialog"
      title="统计设置"
      :visible.sync="showDialog"
      @close="reset"
    >
      <el-form ref="form" :model="formModel" :rules="rules" label-width="100px">
        <el-form-item label="数据源医院" prop="hospCodeList">
          <!-- <el-input v-model="form.name"></el-input> -->
          <select-table-page
            placeholder="全部医院"
            v-model="formModel.hospCodeList"
            :data="hospitalList"
            :remote-method="setHospitalList"
            key-name="code"
            value-name="code"
            :collapse-tags="collapseTags"
            :multiple="true"
            className="el-select-item"
          ></select-table-page>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="formModel.showHospName"
            >显示图标医院名称</el-checkbox
          >
        </el-form-item>

        <el-form-item label="统计类型" prop="typeValue" ref="typeValue">
          <div
            class="item"
            v-for="(item, index) in formModel.statisticalConds"
            :key="index"
          >
            <color-picker
              v-model="item.color"
              :defaultColor="baseColor"
            ></color-picker>
            <div
              class="select-container"
              v-for="(subItem, index) in item.selectList"
              :key="index"
            >
              <el-checkbox 
                v-model="subItem.isSelect"
                @change="handleChange"

              >{{
                subItem.name
              }}</el-checkbox>
              <el-select v-model="subItem.value" placeholder="" @change="handleChange">
                <el-option
                  v-for="(optionItem, optionIndex) in subItem.content.split(
                    ';'
                  )"
                  :key="optionIndex"
                  :label="optionItem"
                  :value="optionItem"
                >
                </el-option>
              </el-select>
            </div>
            <el-button
              type="primary"
              v-show="index === formModel.statisticalConds.length - 1"
              @click="add"
              :disabled="getDisabeld(item)"
              >添加</el-button
            >
            <el-button type="warning" v-show="index !== 0" @click="del(index)"
              >删除</el-button
            >
          </div>
          <el-input class="typeValue" v-model="formModel.typeValue"></el-input>
        </el-form-item>

        <el-form-item label="统计方式">
          <el-radio-group v-model="formModel.statisticalChartMode">
            <el-radio :label="chartMode.heap">堆积</el-radio>
            <el-radio :label="chartMode.auratus">簇状</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="showDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SelectTablePage from "@/components/select-table-page";
import app from "../../app.js";
import httpre from "../../utils/interceptAjax";
const httpRequest = new httpre(app);
import moment from "moment";
import * as echarts from "echarts";
import ColorPicker from "vcolorpicker";
import {
  intoGroupFilList,
  statisticsUpdate,
  statisticsQuery,
  statistics,
  hospitalSearch
} from "../../http/group";
import { types, chartMode } from "../../utils/emun";
import local from '../../model/local.js';

export default {
  // inheritAttrs: false,
  // props: ["showConfig"],
  components: {
    ColorPicker,
  },
  props: {
    type: {
      type: String,
      default: "local",
    },
  },
  components: {
    SelectTablePage,
  },
  data() {
    return {
      showConfig: location.href.indexOf("group") > -1,
      statisticsConfig: {
        hospCodeList: [],
        showHospName: false,
        statisticalConds: [],
        statisticalChartMode: chartMode.heap, //heap（堆积）/auratus（簇状）
      },
      types: types,
      chartMode: chartMode,
      baseColor: "#448E97",
      myChart: null,
      startTime: "",
      endTime: "",
      currentPage: 1,
      pageSize: 10,
      loading: false,
      cities: [
        {
          id: 1,
          name: 11,
        },
        {
          id: 2,
          name: 22,
        },
      ],
      showDialog: false,
      formModel: {
        typeValue: '',
        hospCodeList: [],
        showHospName: false,
        statisticalConds: [],
        statisticalChartMode: chartMode.heap, //heap（堆积）/auratus（簇状）
      },
      hospitalList: {
        total: 0,
        list: [],
      },
      collapseTags: false,
      options: [
        {
          value: "1",
          label: "有",
        },
        {
          value: "2",
          label: "无",
        },
      ],
      statisticsList: [],
      rules: {
        hospCodeList: [
          { required: true, message: "请选择医院", trigger: "change" },
        ],
        typeValue: { required: true, message: '请选择统计类型', trigger: 'change' },
      },
      selectList: [],
    };
  },

  async mounted() {
    this.setStatisticsConfig();
    this.setHospitalList();
  },
  methods: {
    handleChange(){
      let value = "";
      this.formModel.statisticalConds.forEach(item=>{
        item.selectList.forEach(subItem=>{
          if( subItem.isSelect &&  subItem.value ){
            value = "value";
          }
        })
      })
      this.formModel.typeValue = value;
      if( value && this.$refs.typeValue ){
        this.$refs.typeValue.clearValidate();
      }
    },
    // 统计设置
    async setStatisticsConfig() {
      const res = await statisticsQuery();
      if( res ){
        this.statisticsConfig = res;
        this.handleSearch();
      }
      await this.setSelectList();
      this.setFormModel();
    },
    //统计设置的统计类型这一项数据
    getSelectList(obj){
      const list = [];
      const keys = Object.keys(obj);
      this.selectList.forEach(item=> {
        const isSelect = keys.includes(item.name);
        list.push({
          ...item,
          isSelect,
          value: isSelect ? obj[item.name] : '',
        })
      })
      return list;
    },
    //去统计设置之前，先设置好formModel的值
    setFormModel(){
      this.formModel.hospCodeList = this.statisticsConfig.hospCodeList;
      this.formModel.showHospName = this.statisticsConfig.showHospName;
      if( this.statisticsConfig.statisticalConds.length === 0 ){
        this.statisticsConfig.statisticalConds.push({
          color: this.baseColor,
          conds: {},
        })
      }
      this.formModel.statisticalConds = this.statisticsConfig.statisticalConds.map(item=> {
        const result = {
          color: item.color,
          selectList: this.getSelectList(item.conds),
        }
        return result;
      })
      this.formModel.statisticalChartMode = this.statisticsConfig.statisticalChartMode;
      this.handleChange();
    },
    //搜索
    async handleSearch() {
      const model = this.getModel();
      const { list } = await statistics(model);
      this.statisticsList = list;
      this.renderMap();
    },
    getModel() {
      const model = {
        importDateBegin: this.startTime ? this.startTime + " 00:00:00" : null,
        importDateEnd: this.endTime ? this.endTime + " 23:59:59" : null,
        statisticalCondList: this.statisticsConfig.statisticalConds.map(item=> item.conds)
      };
      return model;
    },
    changeData(){
      let index = 1;
      this.statisticsList.forEach(item=>{
        Object.keys(item).forEach(key=>{
          if( item[key] === 0 ){
            item[key] = index;
            index++;
          }
        });
      })
    },
    //处理渲染图表需要的数据
    getRenderMapData() {
      const colors = [];
      const legendData = [];
      this.statisticsConfig.statisticalConds.forEach(({ color, conds }) => { 
        const values = Object.keys(conds).map((key) => `${conds[key]}${key}`).join("+");
        colors.push(color);
        legendData.push(values);
      });
      const isHeap = this.statisticsConfig.statisticalChartMode === chartMode.heap; //堆积
      const stack = isHeap ? legendData.map(item=> 1) : legendData.map((item,index)=> index + 1);
      const xAxisData = this.statisticsList.length > 0 ? this.statisticsList[0].map(item=> item.hosp) : [];
      const series = legendData.map((item,index)=>{
         return {
          name: item,
          type: "bar",
          barMaxWidth: 80,
          stack: stack[index],
          data: this.statisticsList[index].map(subItem=> {
            return {
              value: subItem.count,
              itemStyle: {
                color: colors[index]
              }
            }
          })
        }
      })
      return {
        legendData,
        stack,
        xAxisData,
        series,
        colors
      };
    },
    //渲染图表
    renderMap() {
      // https://echarts.apache.org/examples/zh/editor.html?c=bar-brush
      const { 
        legendData,
        xAxisData,
        series,
        colors
      } = this.getRenderMapData();
      console.log(legendData,
        xAxisData,
        series,
        colors)
      var chartDom = document.getElementById("echarts-map");
      this.myChart = echarts.init(chartDom);
      const option = {
        color: colors,
        legend: {
          type: "scroll",
          orient: "vertical",
          right: "1%",
          top: 20,
          bottom: 20,
          data: legendData,
        },
        xAxis: {
          data: xAxisData,
          name: "",
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false },
          axisLabel: { interval: 0, rotate: -45 }
        },
        yAxis: {},
        tooltip: {},
        grid: {
          bottom: 100,
          right: "15%",
          left: 50
        },
        series: series,
      };
      if( this.myChart ){
        this.myChart.clear();
      }
      this.myChart.setOption(option);
    },
    handleDialog(){
      this.setFormModel();
      this.showDialog = true;
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const model = this.getFormModel();
          await statisticsUpdate(model);
          this.$message("设置成功！");
          this.setStatisticsConfig();
          this.showDialog = false
        }
      });
    },
    getFormModel() {
      const model = JSON.parse(JSON.stringify(this.formModel));
      delete model.typeValue;
      const conds = [];
      model.statisticalConds.forEach((item) => {
        const _item = {
          color: item.color,
          conds: {}
        };
        item.selectList.forEach((subItem) => {
          if (subItem.isSelect && subItem.value ) {
            _item.conds[subItem.name] = subItem.value;
          }
        });
        if( Object.keys(_item.conds).length ){
          conds.push(_item);
        }
      });
      return {
        ...model,
        statisticalConds: conds,
      };
    },
    //获取类型为select的列表数据
    async setSelectList(){
      const { list } = await intoGroupFilList();
      const selectList = list.filter((item) => item.type === types.select);
      this.selectList = selectList;
    },
    getDisabeld({ selectList }) {
      return selectList.every((item) => !item.value || !item.isSelect );
    },
    async setHospitalList(options = {}) {
      const model = {
        name: options.value || "",
        page: options.page || 1,
        pageSize: options.pageSize || 10,
      };
      const { list, total }  = await hospitalSearch(model);
      this.hospitalList.list = list;
      this.hospitalList.total = total;
    },
    add() {
      if( !this.formModel.statisticalConds.length ) return;
      const item = JSON.parse(
        JSON.stringify(this.formModel.statisticalConds[0])
      );
      item.color = this.getColor();
      item.selectList = item.selectList.map((item) => {
        return {
          ...item,
          isSelect: false,
          value: "",
        };
      });
      this.formModel.statisticalConds.push(item);
    },
    del(index) {
      this.formModel.statisticalConds.splice(index, 1);
    },
    reset() {
      this.$refs.form.resetFields();
    },
    getColor() {
      return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
    },
  },
};
</script>

<style lang="less">
#group-stat {
  padding: 20px;
  .selectContainer {
    display: flex;
    justify-content: end;
    .el-select,
    .el-date-editor {
      margin-right: 15px;
    }
  }
  .map {
    display: flex;
    justify-content: space-between;
    margin-top: 35px;
    .echarts-map {
      width: 100%;
      height: 700px;
    }
    .options {
      padding: 0 50px;
      .el-checkbox {
        display: block;
        margin-bottom: 15px;
      }
    }
  }

  .el-dialog {
    width: auto;
    min-width: 860px;
    max-width: 85%;
    .el-select-item {
      width: 450px;
    }
    .el-form-item {
      .item {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 15px;
        .el-button {
          margin-left:0;
          margin-right: 15px;
        }
        .el-checkbox {
          margin-right: 5px;
        }
        .el-checkbox__label {
          padding-left: 3px;
        }
        .el-select {
          width: 80px;
          margin-right: 15px;
        }
      }
    }
  }
  .m-colorPicker {
    margin-right: 5px;
    .open {
      z-index: 10;
    }
  }
  .colorBtn {
    width: 50px;
    height: 25px;
  }
  .typeValue,
  .typeValue input{
      border-radius: 0;
      height: 1px;
      width: 1px;
      border: none;
      opacity: 0;
      display: inline;
      font-size: 0;
      line-height: 0;
      padding: 0;
      margin: 0;
      display: flex;
  }
}
</style>



