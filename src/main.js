import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import Meta from "vue-meta";
import Main from "./Main.vue";
import router from "./router";
import store from "./store/store";
import i18n from "./i18n";
import colors from "vuetify/lib/util/colors";

Vue.config.productionTip = false;

Vue.filter(
  "length",
  (l) => `${Math.floor(l / 60)}:${`${l % 60}`.padStart(2, "0")}`
);

Vue.use(Vuetify);
Vue.use(Meta, { refreshOnceOnNavigation: true });

new Vue({
  router,
  store,
  i18n,
  vuetify: new Vuetify({
    lang: { t: (key, ...params) => i18n.t(key, params) },
    theme: {
      themes: {
        light: {
          info: colors.blue,
          success: colors.green,
          danger: colors.red,
          edit: colors.orange,
          flag: colors.red,
        },
      },
    },
  }),
  render: (h) => h(Main),
}).$mount("#main");
