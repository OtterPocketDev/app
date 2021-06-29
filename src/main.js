import "@babel/polyfill";
import "mutationobserver-shim";
import Raphael from "raphael/raphael";
global.Raphael = Raphael;
import Vue from "vue";
import "./plugins";
import App from "./App.vue";
import router from "./router";
import "./directives";
import "./mixins/baseUrl";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
