import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import Meta from "vue-meta";
import Root from "./Root.vue";
import router from "./router";
import store from "./store/store";
import i18n from "./i18n";
import colors from "vuetify/lib/util/colors";
import ClickOutside from "vuetify/lib/directives/click-outside";
import { createPinia, PiniaVuePlugin } from "pinia";
import Router from "vue-router";

Vue.config.productionTip = false;

Vue.filter("length", (l) => {
  const hours = Math.floor(l / 3600);
  const minutes = Math.floor((l % 3600) / 60);
  const seconds = `${l % 60}`.padStart(2, "0");
  return hours
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
});

Vue.use(Vuetify);
Vue.directive("click-outside", ClickOutside);
Vue.use(Meta, { refreshOnceOnNavigation: true });
Vue.use(PiniaVuePlugin);
Vue.use(Router);

const pinia = createPinia();

new Vue({
  pinia,
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
  render: (h) => h(Root),
}).$mount("#main");
