// 输出格式化的时间（YYYY-MM-DD）
export function formatDate(time) {
  if (time < new Date('2000-01-01').valueOf()) return ''
  const date = new Date(time)
  const fullYear = date.getFullYear()
  const currentMonth = date.getMonth() + 1
  const month = currentMonth < 10 ? '0' + currentMonth : currentMonth
  const currentDay = date.getDate()
  const day = currentDay < 10 ? '0' + currentDay : currentDay
  return `${fullYear}-${month}-${day}`
}

// 输出格式化的时间（YYYY-MM-DD）
export function formatDateTime(time) {
  if (time < new Date('2000-01-01').valueOf()) return ''
  const date = new Date(time)
  const fullYear = date.getFullYear()
  const currentMonth = date.getMonth() + 1
  const month = currentMonth < 10 ? '0' + currentMonth : currentMonth
  const currentDay = date.getDate()
  const day = currentDay < 10 ? '0' + currentDay : currentDay
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let min = date.getMinutes();
  min = min < 10 ? '0' + min : min;
  let s = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  return `${fullYear}-${month}-${day} ${h}:${min}:${s}`
}

// 格式化数据保留小数
export function formatNumber(value, decimals = 2) {
  if (!value) return value
  if (isNaN(value)) return value
  return Number(value).toFixed(decimals)
}
