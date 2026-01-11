import { createI18n } from "vue-i18n";
import { en as enVuetify, nl as nlVuetify } from "vuetify/locale";
import enMessages from "@/locales/en.json";
import nlMessages from "@/locales/nl.json";

const messages = {
  en: {
    $vuetify: enVuetify,
    ...enMessages,
  },
  nl: {
    $vuetify: nlVuetify,
    ...nlMessages,
  },
};

type MessageSchema = (typeof messages)["en"];

export default createI18n<[MessageSchema], "en" | "nl">({
  legacy: false,
  locale: import.meta.env.VITE_I18N_LOCALE || "en",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
  messages,
  datetimeFormats: {
    en: {
      short: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
      long: {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
      },
    },
    nl: {
      short: {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      },
      long: {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        minute: "numeric",
        hour: "numeric",
      },
    },
  },
});
