### 下拉选项显示分页表格

#### 属性

#### 使用

```js
  <select-table-page
    placeholder="请输入任务名称"
    v-model="listQuery.taskName"
    :data="likeTaskList"
    :remote-method="toQueryLikeTaskList"
    :loading="queryTasksLoading"
    key-name="taskName"
    value-name="taskName"
  ></select-table-page>
```

```js
  // 查询产品
  toQueryLikeTaskList({ value = '', page = 1, pageSize = 10 } = {}) {
    this.queryTasksLoading = true
    const params = {
      noLoading: true,
      page,
      pageSize,
      keyword: value,
    }
    const res = await api.querytaskList(params)
    this.queryTasksLoading = false
    this.likeTaskList = res.data
  },
```
