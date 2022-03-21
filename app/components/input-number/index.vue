<template>
  <el-input
    v-bind="$attrs"
    class="input-number-wrapper"
    type="number"
    :value="value"
    :maxlength="maxlength"
    @input="handleInput"
    @keypress.native="handleKeyPress"
    @blur="handleBlur"
    @change="handleChage"
    @mousewheel.native.prevent
    @keydown.38.native.prevent
    @keydown.40.native.prevent
    @keyup.native="handleKeyUp"
  >
    <template slot="append">
      <slot name="append"></slot>
    </template>
    <slot></slot>
  </el-input>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    minValue: {
      type: Number
    },
    maxValue: {
      type: Number
    },
    value: [String, Number],
    // 精度
    precision: {
      type: Number,
      default: 0
    },
    // 最大长度
    maxlength: {
      type: [Number, String]
    },
    // 是否支持负数
    negative: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textInput: '' // 文本框中的值
    }
  },
  computed: {
    inputType() {
      return this.precision === 0 ? 'integer' : 'float'
    }
  },
  methods: {
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    handleInput(val = '') {
      const inputMaxLength = Number(this.maxlength)
      if (inputMaxLength && val.length > inputMaxLength) {
        val = val.slice(0, inputMaxLength)
      }
      // 前面的0去掉
      val = val ? val.toString().replace(/^0+(\d+)/g, '$1') : ''
      // 去掉后面的-
      if (this.negative) val = val.startsWith('-') ? '-' + val.replace(/-/g, '') : val.replace(/-/g, '')
      // 精度处理
      const decimals = val.split('.')[1] || ''
      const reg = new RegExp(`(.+\\\.\\\d{${this.precision}})(.*)$`, 'g') // 去掉精度后的数字
      const value = decimals && decimals.length > this.precision ? val.replace(reg, '$1') : val
      this.$emit('input', value)
    },
    handleKeyUp(e) {
      const val = event.target.value
      const code = e.which || e.keyCode
      if (code === 8) {
        // 删除,则重置this.textInput为当前值
        this.textInput = val
      }
    },
    handleChage(val) {
      this.$emit('change', val)
    },
    handleBlur(e) {
      let {value} = e.target
      if (/\.$/.test(value)) {
        // 如果以小数点.结尾则去掉小数点
        value = value.replace(/\.$/, '')
        this.$emit('input', value)
      }
      this.$emit('blur', e)
    },
    handleKeyPress(event) {
      const key = event.key // 输入字符的键值
      const value = event.target.value // 输入框现有的值
      this.textInput = `${this.textInput || value}`

      const numberKeySet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      const dotKeySet = ['.', 'Del'] // 'Del'为ie数字小键盘的'.'
      this.negative && numberKeySet.push('-') // 支持负数
      this.negative && dotKeySet.push('-') // 支持负数
      const actionKeySet = ['Backspace']

      // 0 的keyCode是48， 9的keyCode是57，小数点的keyCode为190,回退为8；
      if (!numberKeySet.includes(key) && !dotKeySet.includes(key) && !actionKeySet.includes(key)) {
        // 禁止输入【0~9和.,-】以外的字符
        event.preventDefault()
        return
      } else if (this.inputType === 'integer') {
        // 如果要求是整数
        if (dotKeySet.includes(key)) {
          // 禁止输入小数点
          event.preventDefault()
          return
        } else if (value.length === 1 && value === '0') {
          // 如果第一个字符是0，就禁止输入；
          // event.preventDefault()
        }
      } else {
        // 如果要求输入金额，可以保留两位小数
        if (value.length === 0 && !numberKeySet.includes(key)) {
          // 第一位除了数字，禁止输入其他的
          event.preventDefault()
          return
        } else if (value.length === 1 && value === '0' && !dotKeySet.includes(key) && !actionKeySet.includes(key)) {
          // 如果第一个字符是0，第二位必须只能输入小数点或者回车
          // event.preventDefault()
        } else if (this.textInput.includes('.') && dotKeySet.includes(key)) {
          // 如果已经包含小数点，就禁止输入小数点
          event.preventDefault()
          return
        } else if (value.split('.')[1] && value.split('.')[1].length === this.precision && !actionKeySet.includes(key)) {
          // 如果小数位的长度大于精度precision，则除了回退禁止输入
          // event.preventDefault()
        }
      }

      // 如果输入了小数点，并且value有值（如果文本框的内容不能转成数字，value为空）,则在最后加上小数点
      dotKeySet.includes(key) && value && (this.textInput = `${this.textInput}${key}`)
    }
  }
}
</script>

<style lang="less">
.input-number-wrapper {
  input[type='number'] {
    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>
