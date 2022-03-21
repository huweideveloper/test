<template>
  <el-select ref="elSelect" v-bind="$attrs" v-on="$listeners" @input.native="handleInput">
    <slot />
  </el-select>
</template>

<script>
export default {
  inheritAttrs: true,
  data() {
    return {}
  },
  methods: {
    handleInput(e) {
      // 当操作只触发input，却无keyup操作时执行。==实际场景是微软输入法，中文通过数字键选择输入文字时，只触发input，不触发keyup事件
      // debounce所以不会触发相同的查询2次
      this.$refs.elSelect.debouncedQueryChange(e)
    }
  }
}
</script>

<style></style>
