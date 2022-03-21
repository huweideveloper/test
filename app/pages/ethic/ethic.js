
import EthicStat from "@/components/stat/ethic-stat";

class UserStat extends Interstellar.pagesBase {
  complete() {
    
    this.init();
  }
  init() {
    new Vue({
      el: "#userStat",
      components: {
        EthicStat,
      },
    });
  }
}

module.exports = UserStat;
