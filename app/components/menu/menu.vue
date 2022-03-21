<template>
  <div class="tac">
    <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color="#0a2634"
        text-color="#fff"
        active-text-color="#4c9fa9"
      >
        <el-submenu
          v-for="(item, index) in menuList"
          :key="item.name"
          :index="index+''"
        >
          <template slot="title">
            <i :class="'iconfont ' + item.iconClassName"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(subItem, subIndex) in item.children"
            :key="item.id + '-' + subIndex"
            :index="index + '-' + subIndex"
          >
            {{ subItem.title }}

            <!-- 为了让以前的垃圾代码能跑起来加的 -->
            <span :id="item.id">
              <span class="twolink" :link="subItem.routeName"></span>
            </span>

          </el-menu-item>
        </el-submenu>
      </el-menu>
  </div>
</template>

<script>
import { open } from '../../utils/window';
import {
  getSessionStorage
} from '../../utils/storage'
export default {
  name: "menu-component",
  data() {
    return {
      defaultActive: "",
      menuList: [
        {
          title: "标注模块",
          iconClassName: "icon-quanbu",
          name: "mark",
          type: "fs", //垃圾字段
          children: [],
        },
        {
          title: "算法模块",
          iconClassName: "icon-quanbu",
          name: "alg",
          type: "fs", //垃圾字段
          children: [],
        },
        {
          title: "审批模块",
          iconClassName: "icon-danxuankuang",
          name: "audit",
          children: [],
        },
        {
          title: "账户管理",
          iconClassName: "icon-zhanghuguanli",
          name: "account",
          children: [],
        },
        {
          title: "标注数据导出",
          iconClassName: "icon-danchuchuangkou",
          name: "export",
          children: [],
        },
        {
          title: "基础数据维护",
          iconClassName: "icon-shujuguanli",
          name: "config",
          children: [],
        },
        {
          title: "系统运营",
          iconClassName: "icon-zhanghuguanli",
          name: "operate",
          children: [],
        },
        {
          title: "数据看板",
          iconClassName: "icon-zhanghuguanli",
          name: "board",
          children: [],
        },
        {
          title: "统计模块",
          iconClassName: "icon-zhanghuguanli",
          name: "stat",
          children: [],
        },
        {
          title: "机构管理",
          iconClassName: "icon-zhanghuguanli",
          name: "manage",
          children: [],
        },
      ],
    };
  },
  mounted() {
    this.setMenuList();
    this.setDefaultActive();
    window.addEventListener("hashchange", this.setDefaultActive.bind(this))
  },
  methods: {
    setDefaultActive(){
      const urlArray = location.hash.split("/");
      const routeName = urlArray[1];
      if( routeName ){
        const indexInfo = this.getIndexInfoByRouteName(routeName);
        if( indexInfo ) this.defaultActive = indexInfo;
      }
    },
    getIndexInfoByRouteName(routeName){
       let indexInfo = "";
       this.menuList.forEach((item,index)=>{
         item.children.forEach((subItem,subIndex)=>{
           if( subItem.routeName === routeName ){
             indexInfo = index + "-" + subIndex;
           }
         })
       })
       return indexInfo;
    },
    handleSelect(indexInfo) {
        const [index, subIndex] = indexInfo.split("-");
        if( index && subIndex ){
          const routeName = this.menuList[index].children[subIndex].routeName;
          const params = this.menuList[index].type;
          open(routeName + (params ? "/" + params : "") );
        }
    },
    setMenuList() {
      const resourceList = getSessionStorage("resourceList", []);
      let menuList = JSON.parse(JSON.stringify(this.menuList));
      resourceList.forEach((item) => {
        const [routeName, menuName] = this.getRouteNameAndMenuName(item.type);
        if (menuName) {
          const index = menuList.findIndex(
            (subItem) => subItem.name === menuName
          );
          if (index > -1) {
            menuList[index].id = item.id;
            menuList[index].children.push({
                title: item.name,
                routeName,
              });
          }
        }
      });
      this.menuList = menuList;
      this.test();
    },
    getRouteNameAndMenuName(type) {
      const [routeName, menuName] =  type.indexOf("$$") > -1 ? type.split("$$") : type.split("&&");
      return [routeName, menuName];
    },
    test(){
      const config = {
        0: [
          {
            title: "新标注项目",
            routeName: 'labelProject',
          },
          {
            title: "新标注任务",
            routeName: 'labelTask',
          }
        ]
      }
      let menuList = JSON.parse(JSON.stringify(this.menuList));
      Object.keys(config).forEach(key=>{
        menuList[key].children = [
          ...menuList[key].children,
          ...config[key]
        ] 
      })
      this.menuList = menuList;
    }
  },
};
</script>

<style lang="less">
.menu {
  .el-submenu .el-menu-item{
    min-width: auto;
  }
  .el-submenu__title {
    i {
      color: #fff;
      font-size: 20px;
    }
    span {
      font-size: 15px;
      margin-left: 5px;
    }
    .el-submenu__icon-arrow{
        right: 10px;
    }
  }
}
</style>
