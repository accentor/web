import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import Main from "./Main.vue";
import router from "./router";
import store from "./store/store";

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  iconfont: "mdi"
});

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter(
  "length",
  l => `${Math.floor(l / 60)}:${`${l % 60}`.padStart(2, "0")}`
);

new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount("#main");
