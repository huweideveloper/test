<template>
	<div class="child-selectcontrols">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form-wrapper">
			<el-row>
				<el-col :span="12">
					<el-form-item label="下拉菜单标题" prop="name">
						<el-input v-model="ruleForm.name" placeholder="请输入下拉菜单标题" :disabled="isEditLabel || isView"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="" prop="isdefault">
						<el-checkbox v-model="ruleForm.isdefault" :disabled="isEditLabel || isView">是否设置默认值 <span class="tip-info">（设置的默认值是选项1）</span></el-checkbox>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="!isEditLabel">
				<el-col :span="24">
					<el-form-item label="下拉选项">
						<el-table :data="ruleForm.selectList" class="tree-table-wrapper" row-key="id" border default-expand-all :tree-props="{ children: 'child', hasChildren: 'hasChildren' }">
							<el-table-column label="选项">
								<template slot-scope="scope">
									<!-- 一级 -->
									<el-form-item v-if="!scope.row.isChild" :prop="`selectList.${scope.row.index}.text`" :rules="[{ required: true, trigger: ['blur', 'change'] }]">
                    <div v-if="!scope.row.isChild && (!scope.row.child || !scope.row.child.length)" class="no-child-arraw el-table__expand-icon"><i class="el-icon-arrow-right"></i></div>
										<el-input v-model="scope.row.text" autocomplete="off" placeholder="请输入选项名称" :maxlength="30" :disabled="isView"></el-input>
									</el-form-item>
									<!-- 二级 -->
									<el-form-item v-else :prop="`selectList.${scope.row.parentIndex}.child.${scope.row.index}.text`" :rules="[{ required: true, trigger: ['blur', 'change'] }]">
										<el-input v-model="scope.row.text" autocomplete="off" placeholder="请输入选项名称" :maxlength="30" :disabled="isView"></el-input>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="默认值">
								<template slot-scope="scope">
									<!-- 一级 -->
									<el-form-item
										v-if="!scope.row.isChild"
										:prop="`selectList.${scope.row.index}.code`"
										:rules="[
											{
												required: true,
												validator: (rule, value, callback) => {
													validateNumberSingle(rule, value, callback, scope.row)
												},
												trigger: ['blur', 'change']
											}
										]"
									>
										<el-input-number v-model="scope.row.code" size="small" :min="0" :disabled="isView"></el-input-number>
									</el-form-item>
									<!-- 二级 -->
									<el-form-item
										v-else
										:prop="`selectList.${scope.row.parentIndex}.child.${scope.row.index}.code`"
										:rules="[
											{
												required: true,
												validator: (rule, value, callback) => {
													validateNumberSingle(rule, value, callback, scope.row)
												},
												trigger: ['blur', 'change']
											}
										]"
									>
										<el-input-number v-model="scope.row.code" size="small" :min="0" :disabled="isView"></el-input-number>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column v-if="!isView" label="操作" width="80" align="left" class="action-wrapper">
								<template slot-scope="scope">
									<el-popconfirm v-show="scope.row.isChild || ruleForm.selectList.length > 1" title="确定删除吗？" placement="top" @onConfirm="handleDelete(scope.row)">
										<i slot="reference" class="del-icon el-icon-remove" style="font-size: 18px; color: #e95d57;"></i>
									</el-popconfirm>
									<i v-if="!scope.row.isChild" class="add-icon el-icon-circle-plus" @click="handleAdd(true, scope.row.id)" style="font-size: 18px; color: #6fb4af;"></i>
								</template>
							</el-table-column>
						</el-table>
						<div v-if="!isView">
							<el-button type="danger" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd(false)">添加下拉选项</el-button>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="标签" prop="">
						<add-tag-list v-model="ruleForm.tagIdList" :default-tag-list="defaultTagList" :disabled="isView"></add-tag-list>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div class="footer-btn">
			<el-button v-show="actionType !== 'view'" type="primary" @click="handleSubmit">保存</el-button>
			<el-button @click="handleCancel">取消</el-button>
		</div>
	</div>
</template>

<script>
import { Message } from 'element-ui'
import componentmanageApi from '@/api/componentmanage.api.js'
import InputNumber from '@/components/input-number'
import AddTagList from './add-tag-list'
export default {
	components: {
		InputNumber,
		AddTagList
	},
	props: {
		data: {
			type: Object,
			default: () => {}
		},
		// view, edit, editlabel
		actionType: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ruleForm: {
				type: 'child_select',
				id: '',
				name: '',
				isdefault: false,
				tagIdList: [], // [{id: 14, category: "component", text: "4234324"}]
				selectList: [{ id: this.getRandom(), index: 0, code: 1, text: '', isChild: false }] // 初始化一条数据，必填
			},
			defaultTagList: [], // 默认tag的下拉列表
			rules: {
				name: [{ required: true, message: '请输入下拉列表名称', trigger: 'blur' }]
			}
		}
	},
	computed: {
		isView() {
			return this.actionType === 'view'
		},
		isEditLabel() {
			return this.actionType === 'editlabel'
		}
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
			if (!this.data || !this.data.id) return
			const { id, name, parameter, tagList, data } = this.data || {}
			const paramObj = JSON.parse(parameter)
			const dataObj = JSON.parse(data)
			const selectList = this.initSelectList(dataObj)
			const tagIdList = this.initTagIdList(tagList)
			this.ruleForm = {
				id,
				name,
				isdefault: paramObj.isdefault,
				tagIdList,
				selectList
			}
		},
		initTagIdList(tagList) {
			this.defaultTagList = tagList
			return tagList.map((v) => v.id)
		},
		// 初始化表格数据，用于编辑
		initSelectList(selectList) {
			if (!selectList || !selectList.length) return []
			return selectList.map((v, index) => {
				return this.initOption(v, index, -1)
			})
		},
		// 递归设置初始值的id, parentIndex, index, isChild信息
		initOption(opt, index, parentIndex = -1) {
			let child = opt.child || []
			if (child && child.length) {
				child = child.map((v, i) => {
					return this.initOption(v, i, index)
				})
			}
			return {
				id: this.getRandom(),
				parentIndex,
				index,
				isChild: parentIndex >= 0,
				code: isNaN(opt.code) ? '' : Number(opt.code),
				text: opt.text,
				child: child
			}
		},
		// 获取随机数
		getRandom() {
			return Math.random()
		},
		// 表格-删除
		handleDelete({ id, code, isChild }) {
			const { selectList } = this.ruleForm
			if (isChild) {
				selectList.some((v) => {
					const child = v.child || []
					const index = child.findIndex((o) => o.id === id)
					index !== -1 && child.splice(index, 1)
					return index !== -1
				})
			} else {
				const index = selectList.findIndex((o) => o.id === id)
				selectList.splice(index, 1)
			}
		},
		// 表格-添加
		handleAdd(isChild, id) {
			const selectList = this.ruleForm.selectList
			if (isChild) {
				let parentIndex = -1
				const parent = selectList.find((v, index) => {
					v.id === id && (parentIndex = index)
					return v.id === id
				})
				if (parent) {
					!parent.child && this.$set(parent, 'child', [])
					const maxCode = this.getListMaxCode(parent.child)
					const id = this.getRandom()
					parent.child.splice(parent.child.length, 0, { id, parentIndex, index: parent.child.length, code: maxCode + 1, text: '', isChild })
				}
			} else {
				const maxCode = this.getListMaxCode(selectList)
				const id = this.getRandom()
				selectList.splice(selectList.length, 0, { id, index: selectList.length, code: maxCode + 1, text: '', isChild })
			}
			this.ruleForm.selectList = selectList
		},
		// 获取list最大code
		getListMaxCode(list) {
			return list.reduce((max, cur) => {
				return (max = cur.code > max ? cur.code : max)
			}, 0)
		},
		// 按钮 - 取消
		handleCancel() {
			this.$emit('cancel')
		},
		// 按钮 - 保存
		handleSubmit() {
			this.$refs.ruleForm.validate(async (valid) => {
				if (!valid) {
					Message.closeAll()
					return this.$message.error('请先完善数据')
				}
				const { id, name, isdefault, tagIdList, type, selectList } = this.ruleForm
				const list = selectList.map((v) => {
					let child = v.child || []
					child = child.map((o) => {
						return { code: `${o.code}`, text: o.text }
					})
					return { code: `${v.code}`, text: v.text, child }
				})
				const data = {
					id,
					name,
					parameter: JSON.stringify({ isdefault }),
					tagIdList,
					type,
					data: list
				}
				let res
				if (data.id) {
					res = await componentmanageApi.update(data)
				} else {
					res = await componentmanageApi.create(data)
				}
				if (res.code === 0) {
					this.$message.success('保存成功')
					this.$emit('success')
				}
			})
		},
		validateNumberSingle(rule, value, callback, rowData) {
			const { selectList } = this.ruleForm
			const parentIndex = rowData.parentIndex
			const list = parentIndex >= 0 ? selectList[parentIndex].child : selectList
			const has = list.some((v) => v.id !== rowData.id && v.code === value)
			if (value === undefined) {
				callback(new Error('数据不能为空'))
			} else if (value >= 0 && has) {
				Message.closeAll()
				this.$message.error('数据已重复')
				callback(new Error('数据已重复'))
			} else {
				callback()
			}
		}
	}
}
</script>

<style lang="less">
.child-selectcontrols {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: ~'calc(100% - 85px)';
	padding: 0 20px;
	overflow: auto;
	.form-wrapper {
		flex: 1;
		width: 100%;
		height: ~'calc(100%  - 80px)';
		overflow: auto;
		.el-form-item__label {
			line-height: 34px;
		}
		.el-form-item__content {
			line-height: 34px;
		}
		.el-input__inner {
			height: 34px;
			line-height: 34px;
		}
		.tip-info {
			font-size: 12px;
			color: #ccc;
		}
		.between-item {
			.el-button {
				margin-left: 260px;
			}
		}
	}
	.tree-table-wrapper {
		width: 100%;
		margin-bottom: 20px;
		&.el-table td,
		&.el-table th {
			padding: 6px 0;
		}
		&.el-table .cell {
			display: flex;
		}
		.el-form-item__label {
			line-height: 30px;
		}
		.el-form-item__content {
      display: flex;
      align-items: center;
			line-height: 30px;
		}
    .no-child-arraw {
      padding: 0 5px;
      line-height: 1px;
    }
		.el-input-number__decrease,
		.el-input-number__increase {
			height: 28px;
		}
		.el-input__inner {
			height: 30px;
			line-height: 30px;
		}
		.action-wrapper {
			display: flex;
			align-items: center;
		}
	}
	.footer-btn {
		text-align: center;
		padding: 10px 0;
		background: #fff;
		border-top: 1px solid #eee;
		.el-button {
			margin-right: 30px;
		}
	}
	.el-input.is-disabled .el-input__inner {
		background-color: unset;
		color: unset;
	}
}
</style>
