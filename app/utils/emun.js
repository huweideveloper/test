


const types = {
  input: "input",         //输入
  select: "select",       //选择
}

// 入组统计 统计方式
const chartMode = {
  heap: "heap",           //堆积
  auratus: "auratus",     //簇状
}


//页面状态
const PageType = {
  create: "create", //新建
  edit: "edit",     //编辑
  view: "view",   //查看
}

//项目类型
const ProjectType = {
  label: 1,    //标注项目
}


//项目状态
const ProjectStatus = {
  off: 1,
  on: 2,
  offText: "未启用",
  onText: "启用"
}

const TEXT = "Text";
/**
 *  changeEnumValue(1, ProjectStatus);          //未启用
 *  changeEnumValue("未启用", ProjectStatus);   //1
 */
function toggleEnumValue(initValue, config) {
  let value = "";
  Object.keys(config).forEach(key => {
    if (config[key] === initValue) {
      const _key = key.split(TEXT)[0];
      const _value = key.indexOf(TEXT) === -1 ? config[key + TEXT] : config[_key];
      value = _value;
    }
  })
  if( value === "" ){
    console.warn("toggleEnumValue函数返回值为'', 请检查")
  }
  return value;
}

export {
  toggleEnumValue,
  types,
  chartMode,
  ProjectStatus,
  PageType,
  ProjectType
}