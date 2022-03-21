<template>
	<div class="add-tag-list-wrapper">
		<el-select
			v-bind="$attrs"
			v-on="$listeners"
			class="tag-select"
			v-show="selectIds.length <= 10"
			v-model="selectIds"
			placeholder="请选择"
			filterable
			allow-create
			multiple
			:filter-method="queryTags"
			@change="handleSelectTag"
		>
			<el-option v-for="item in tagOptions" :key="item.id" :label="item.text" :value="item.id"> </el-option>
		</el-select>
	</div>
</template>

<script>
import componentmanageApi from '@/api/componentmanage.api.js'
export default {
	props: {
		value: {
			type: Array,
			default: () => []
		},
		defaultTagList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			oldSelectIds: [],
			selectIds: [],
			tagOptions: []
		}
	},
	watch: {
		selectIds(val) {
			this.$emit('input', val)
		},
		defaultTagList: {
			handler(val) {
				this.tagOptions = val || []
			},
			immediate: true,
			deep: true
		},
		value(val) {
			this.selectIds = val || []
		}
	},
	methods: {
		handleClose(index, tag) {
			this.selectIds.splice(this.selectIds.indexOf(tag.id), 1)
		},
		async queryTags(keyword) {
			const res = await componentmanageApi.searchlabel({
				pageSize: 100,
				category: 'component',
				text: keyword
			})
			this.tagOptions = res.data ? res.data.list : []
		},
		handleSelectTag(val) {
			this.chekIsNew()
			this.oldSelectIds = this.selectIds
		},
		// 判断选项是否是新增
		async chekIsNew() {
			const { oldSelectIds, selectIds } = this
			const isAdd = selectIds.length > oldSelectIds.length
			if (!isAdd) return
			const selVal = selectIds[selectIds.length - 1]
			const opt = this.tagOptions.find((v) => v.id === selVal)
			if (opt) return
			const res = await componentmanageApi.createlabel({ category: 'COMPONENT', text: selVal })
			if (res.code === 0) {
				if (res.data && res.data.id) {
					const id = res.data.id
					this.tagOptions.push({ id: id, text: selVal })
					this.$nextTick((v) => {
						this.selectIds.splice(this.selectIds.indexOf(id), 1)
						this.selectIds.push(id)
					})
				}
			}
		}
	}
}
</script>

<style lang="less">
.add-tag-list-wrapper {
	.tag-select {
		width: 100%;
		.el-input__inner {
			// height: 100px !important;
		}
	}
	.el-select .el-tag:not(:last-child) .el-select__tags-text,
	.el-select .el-tag:first-child .el-select__tags-text .el-tag + .el-tag {
		max-width: none;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
}
</style>
