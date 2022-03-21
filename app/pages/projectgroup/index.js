import './index.less'
import api from './api.js'

class projectgroup extends Interstellar.pagesBase {
  complete() {
    new Vue({
      el: '#projectgroup',
      data() {
        // 分页可供选择的每页记录数
        const PAGESIZE_LIST = [10, 20, 50, 100]
        return {
          categoryList: [], // 所有可供选择的科室类型
          selectedCategory: "1", // 选择的科室类别 0为其他 1为放射科 2为病理科 3为测试 4为数据库
          projectGroupName: '', // 输入/选择的项目群组名称
          optTypeText: '', // 操作项目群组的类型文案
          isShowDeletePopover: false, // 是否展示删除提示
          // 筛选条件中下拉框数据
          groupList: [],
          loading: false,
          projectGroupList: [],
          page: 1, // 是从第一页开始
          pageSize: 10,
          total: 0,
          pageSizeArr: PAGESIZE_LIST,
          dialogFormVisible: false, // 新建/编辑项目群组弹窗
          ruleForm: {
            name: '',
            category: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            category: [
              { required: true, message: '请选择科室类别', trigger: 'change' }
            ]
          }
        }
      },
      computed: {
      },
      created() {
        this.categoryList = [{ label: '放射科', value: "1" }, { label: '病理科', value: "2" }, { label: '其他', value: "0" }, { label: '测试', value: "3" }, { label: '数据库', value: "4" }]
        this.queryProjectGroupList()
      },
      mounted() {
      },
      methods: {
        switchCategory() {
          this.projectGroupName = ''
          this.queryProjectGroupList()
        },
        handleSizeChange(pageSize) {
          this.page = 1
          this.pageSize = pageSize
          this.queryProjectGroupList()
        },
        handleCurrentChange(page) {
          this.page = page
          this.queryProjectGroupList()
        },
        async queryProjectGroupList() {
          const res = await api.queryProjectGroupList({
            category: this.selectedCategory,
            name: this.projectGroupName,
            page: this.page,
            pageSize: this.pageSize
          })
          const { list = [], pages = 0, total = 0 } = res.data
          this.projectGroupList = list
          this.total = total
        },
        remoteMethod(query) {
          if (query) {
            this.loading = true
            setTimeout(async () => {
              const res = await api.queryProjectGroupList({
                category: this.selectedCategory,
                name: query,
                page: 1
              })
              const { list = [] } = res.data
              this.loading = false
              this.groupList = list
            }, 200)
          } else {
            this.groupList = []
          }
        },
        handleCreate() {
          this.optTypeText = '创建'
          this.dialogFormVisible = true
          this.projectGroupId = ""
          this.$nextTick(() => {
            this.ruleForm = Object.assign({}, this.ruleForm, {
              name: '',
              category: ''
            })
            // 奇怪有时候resetFields不能清除表单的值，还得上述操作
            this.$refs.ruleForm.resetFields()
          })
        },
        handleDelete(projectGroupId) {
          this.$confirm('删除该项目群组后，将无法恢复项目与原群组的关联关系。确认删除当前群组？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await api.deleteProjectGroup({
              id: projectGroupId
            })
            this.$message.success("删除成功")
            this.queryProjectGroupList()
          }).catch(() => {
            // 已取消
          })
        },
        handleEdit(projectGroup) {
          this.optTypeText = '编辑'
          const { id, name, category } = projectGroup
          this.ruleForm = Object.assign({}, this.ruleForm, {
            name,
            category: String(category)
          })
          this.projectGroupId = id
          this.dialogFormVisible = true
        },
        handleSave() {
          this.$refs.ruleForm.validate(async (valid) => {
            if (!valid) return false
            const { name, category } = this.ruleForm
            const params = {
              category,
              name
            }
            let tipText
            if (this.projectGroupId) {
              tipText = '编辑'
              params.id = this.projectGroupId
              await api.editProjectGroup(params)
            } else {
              tipText = '创建'
              this.page = 1
              this.selectedCategory = category
              await api.createProjectGroup(params)
            }
            this.$message.success(`${tipText}成功`)
            this.dialogFormVisible = false
            this.queryProjectGroupList()
          })
        }
      }
    })
  }
}

module.exports = projectgroup
