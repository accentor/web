import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import { createApp } from "vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import colors from "vuetify/util/colors";
import Root from "./Root.vue";
import router from "./router";
import i18n from "./i18n";
import { createPinia  } from "pinia";
import {useI18n} from "vue-i18n";

const pinia = createPinia();
const app = createApp(Root)
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(createVuetify({
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
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
}))

app.config.globalProperties.$filters = {
    length: (l) => {
        const hours = Math.floor(l / 3600);
        const minutes = Math.floor((l % 3600) / 60);
        const seconds = `${l % 60}`.padStart(2, "0");
        return hours
            ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
            : `${minutes}:${seconds}`;
    },
};

app.mount("#main");
