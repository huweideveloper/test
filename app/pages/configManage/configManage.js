
import configGroup from "./components/configGroup.vue";

class Config extends Interstellar.pagesBase {
  complete() {
    this.init();
  }
  init() {
    new Vue({
      el: "#config-manage",
      components: {
        configGroup,
      },
      data() {
        return {
          componentsName: ["configGroup"],
          currentComponent: "configGroup",
        };
      },
      async mounted() {
        $("#main-body #content #right-content").css({margin:0})
      },
      methods: {
        select(index){
          this.currentComponent = this.componentsName[index];
        }
      },
    });
  }
}

module.exports = Config;
