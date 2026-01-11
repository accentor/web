import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";

import { createPinia } from "pinia";
import { useI18n } from "vue-i18n";
import { createHead, VueHeadMixin } from "@unhead/vue/client";
import { createApp } from "vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import {
  createVueI18nAdapter,
  type VueI18nAdapterParams,
} from "vuetify/locale/adapters/vue-i18n";

import Root from "./Root.vue";
import router from "@/router";
import i18n from "@/i18n";

const pinia = createPinia();
const head = createHead({
  init: [
    {
      titleTemplate: "%s | Accentor",
    },
  ],
});

const app = createApp(Root);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(head);
app.mixin(VueHeadMixin);
app.use(
  createVuetify({
    locale: {
      adapter: createVueI18nAdapter({
        i18n,
        useI18n,
      } as unknown as VueI18nAdapterParams),
    },
    theme: {
      defaultTheme: "system",
    },
  }),
);
app.mount("#main");
