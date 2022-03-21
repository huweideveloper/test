<template>
  <div class="date-picker-range">
    <el-date-picker
      v-model="startDate"
      :picker-options="startPickerOptions"
      class="date-picker"
      type="date"
      value-format="yyyy-MM-dd"
      :editable="false"
      :placeholder="startPlaceholder"
      data-name="开始日期"
    ></el-date-picker>
    <span class="date-range-middle" data-name="至">至</span>
    <el-date-picker
      v-model="endDate"
      :picker-options="endPickerOptions"
      class="date-picker"
      type="date"
      value-format="yyyy-MM-dd"
      :editable="false"
      :placeholder="endPlaceholder"
      data-name="结束日期"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checkDate',
    event: 'change'
  },
  props: {
    checkDate: {
      type: Array,
      default() {
        return ['', '']
      }
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    }
  },
  data() {
    return {
      startPickerOptions: {
        disabledDate: (time) => {
          const end = this.endDate ? new Date(this.endDate).getTime() : Date.now()
          return time.getTime() > end
        }
      },
      endPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() || (this.startDate ? time.getTime() < this.startDateTime : false)
        }
      }
    }
  },
  computed: {
    startDate: {
      get() {
        return this.checkDate[0]
      },
      set(val) {
        this.$emit('change', [val || '', this.endDate || ''])
      }
    },
    endDate: {
      get() {
        return this.checkDate[1]
      },
      set(val) {
        this.$emit('change', [this.startDate || '', val || ''])
      }
    },
    startDateTime() {
      return this.startDate ? new Date(this.startDate + ' 00:00:00').getTime() : 0
    }
  }
}
</script>

<style lang="less">
.date-picker-range {
  display: inline-flex;
  vertical-align: middle;
  .date-picker {
    flex: 1 1;
    .el-input__inner {
      cursor: pointer;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: ~'calc(50% - 12px)';
  }
  .date-range-middle {
    width: 24px;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
  }
}
</style>
