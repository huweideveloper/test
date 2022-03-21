
import GroupStat from "@/components/stat/group-stat";

class UserStat extends Interstellar.pagesBase {
  complete() {
    
    this.init();
  }
  init() {
    new Vue({
      el: "#userStat",
      components: {
        GroupStat,
      },
      data(){
        return {
          showConfig:true
        }
      }
    });
  }
}

module.exports = UserStat;
