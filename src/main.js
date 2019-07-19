import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import Main from "./Main.vue";
import router from "./router";
import store from "./store/store";
import i18n from "./i18n";

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  iconfont: "mdi",
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
});

Vue.filter(
  "length",
  l => `${Math.floor(l / 60)}:${`${l % 60}`.padStart(2, "0")}`
);

new Vue({
  router,
  store,
  i18n,
  render: h => h(Main)
}).$mount("#main");
