<template>
    <div class="config-group">
        <div class="top">
            <div class="tips">注意：统计文件内容一经添加，无法删改，请谨慎添加内容！</div>
            <div class="select">
                <el-input v-model="name" placeholder="请输入内容" clearable></el-input>
                 <el-button type="primary" @click="findTableData">查询</el-button>
                  <el-button type="primary" @click="dialogVisible = true">新建</el-button>
            </div>
        </div>
        <div class="table-container">
            <el-table
                :data="tableList"
                style="width: 100%"
            >
                <el-table-column
                type="index"
                label="序号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="统计项">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="统计类型"
                >
                    <template slot-scope="scope">
                        {{ scope.row.type === types.input ? "输入" : "选择" }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="内容">
                </el-table-column>
            </el-table>
        </div>
        <el-dialog 
            title="新建统计项" 
            :visible.sync="dialogVisible" 
            @close="resetForm"
        >
            <el-form :model="createModel" label-width="100px"  ref="ruleForm" :rules="rules" >
                <el-form-item label="统计项名称" prop="name">
                    <el-input v-model="createModel.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="统计项类型">
                    <el-radio-group v-model="createModel.type">
                        <el-radio :label="types.input">输入</el-radio>
                        <el-radio :label="types.select">选择</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label=" " v-show="createModel.type === types.input" prop="content">
                    <el-input v-model="createModel.content" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label=" " v-show="createModel.type === types.select" prop="content" >
                    <div class="selectOptions"
                        v-for="(item,index) in selectOptions"
                        :key="index"
                    >
                        <span class="text">选项{{ index + 1}}：</span>
                        <el-input v-model="item.value" autocomplete="off" clearable></el-input>
                        <el-button @click="del(index)" v-show="index !== 0 || selectOptions.length > 1" >删除</el-button>
                        <el-button type="primary" @click="add()" v-if="selectOptions.length - 1 === index">添加</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleConfirm()">确 定</el-button>
            </div>
            </el-dialog>
    </div>
</template>


<script>
  import {
    intoGroupFilList,
    intoGroupFileQuery,
    intoGroupFileUpdate,
  } from '../../../http/group';
  import {
      types
  } from '../../../utils/emun';

  
  export default {
    data() {
        function validateContent(rule, value, callback){
            if( this.createModel.type == types.input ){
                callback( value ? undefined : new Error('必填'));
            } else {
                const isValue = this.selectOptions.some(item=> item.value);
                callback( isValue ? undefined : new Error('必填') );
            }
        }
        return {
            types: types,
            name: '',
            dialogVisible:false,
            tableList: [], 
            createModel:{
                name: "",           //统计项名称
                type: types.input,  //统计类型
                content: "",        //内容
            },
            rules:{
                name: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { min: 1, max: 20, message: '不能超过20个字符', trigger: 'blur' }
                ],
                content: [{ validator: validateContent.bind(this), trigger: 'blur' }]
            },
            selectOptions: [
                { value: ''  }
            ],
        }
    },
    watch:{
        dialogVisible(){
            if( !this.dialogVisible ){
                    this.reset();
            }
        }
    },
    async mounted() {
      this.setTableData();
    },
    methods: {
        add(){
            if( this.selectOptions.some(item=> !item.value)  ){ 
                return this.$message({
                    message: '请填写选项',
                    type: 'warning'
                });
            }
            this.selectOptions.push({ value: ""});
        },
        del(index){
            this.selectOptions.splice(index, 1);
        },
        async setTableData(tableList){
            if( tableList ){
                this.tableList = tableList;
            } else {
                const { list } = await intoGroupFilList();
                this.tableList = list;
            }
        },
        async findTableData(){
            const { list } = await intoGroupFileQuery({name: this.name});
            this.setTableData(list);
        },
        handleConfirm(){
            this.$refs.ruleForm.validate( async (valid) => {
                if (valid) {
                    const model = this.getCreateModel();
                    await intoGroupFileUpdate(model);
                    this.setTableData();
                    this.resetForm();
                }
            });
        },
        getCreateModel(){
            const content = this.createModel.type === types.select ? this.selectOptions.map(item=> item.value).join(";") : this.createModel.content;
            const model = {
                ...this.createModel,
                content
            }
            return model;
        },
        handleCancel(){
            this.dialogVisible = false;
            this.resetForm();
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
            this.selectOptions = [
                { value: ''  }
            ];
        }
    }
  }
</script>

<style lang="less">
  .config-group{
      padding: 0 15px;
      .top{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .tips{
              color: red;
          }
          .select{
              display: flex;
              .el-input{
                  width: 150px;
                  margin-right: 15px;
              }
          }
      }
      .table-container{
          margin-top: 25px;
      }
      
      .selectOptions{
          margin-top: 10px;
          .el-input{
              display: inline-block;
              width: 150px;
          }
      }
      .el-dialog{
          max-width: 650px;
      }
  }
</style>



