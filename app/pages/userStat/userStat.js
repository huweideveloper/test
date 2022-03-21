import LabelStat from "@/components/stat/label-stat";
import EthicStat from "@/components/stat/ethic-stat";
import GroupStat from "@/components/stat/group-stat";
import {
  permissions,
  permissionsShow
} from '../../directives/directives';

class UserStat extends Interstellar.pagesBase {
  complete() {
    $("#content").css({margin:0})
    $("#menu").hide();
    $(".word_header").hide();
    this.init();
  }
  async init() {
    new Vue({
      el: "#userStat",
      directives: {
        permissions: await permissions()
      },
      components: {
        EthicStat,
        LabelStat,
        GroupStat,
      },
      data() {
        return {
          tabs: [],
          currentComponent: "",
        };
      },
      async mounted() {
        this.init();
      },
      methods: {
        async init(){
          const showList = await permissionsShow(["ethic$$stat", "group&&stat", "label$$stat"]);
          let currentComponent = '';
          const tabsConfig = [
            { type: "", text: "伦理统计", componentName: "EthicStat", show: showList[0], },
            { type: "", text: "入组统计", componentName: "GroupStat", show: showList[1], },
            { type: "", text: "标注统计", componentName: "LabelStat", show: showList[2], },
          ];
          for( let i = 0; i < tabsConfig.length; i++ ){
            const isShow = showList[i];
            if( isShow ){
              tabsConfig[i].type = "primary";
              currentComponent = tabsConfig[i].componentName;
              break;
            }
          }
          this.tabs = tabsConfig;
          this.currentComponent = currentComponent;
        },
        clickTabs(index) {
          this.tabs.forEach((item, i) => {
            this.$set(this.tabs[i], "type", index == i ? "primary" : "");
          });
          this.currentComponent = this.tabs[index].componentName;
        },
        create(){
          
        }
      },
    });
  }
}

module.exports = UserStat;
