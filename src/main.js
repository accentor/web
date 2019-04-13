import Vue from "vue";
import Main from "./Main.vue";
import router from "./router";
import store from "./store/store";

import Vuetify from "vuetify/lib";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/src/stylus/app.styl";

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  iconfont: "mdi"
});

new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount("#main");
