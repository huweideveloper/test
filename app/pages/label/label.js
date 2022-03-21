import LabelStat from "@/components/stat/label-stat";

class UserStat extends Interstellar.pagesBase {
  complete() {
    
    this.init();
  }
  init() {
    new Vue({
      el: "#userStat",
      components: {
        LabelStat,
      },
    });
  }
}

module.exports = UserStat;
