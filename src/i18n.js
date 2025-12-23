import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const modules = import.meta.glob("@/locales/**/*.json", { eager: true });
  const messages = {};
  Object.keys(modules).forEach((path) => {
    const locale = path.match(/\/([A-Za-z0-9-_]+)\.json$/i)[1];
    messages[locale] = modules[path];
  });
  return messages;
}

const datetimeFormats = {
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
};

export const i18n = createI18n({
  locale: import.meta.env.VITE_I18N_LOCALE || "en",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),
  datetimeFormats,
});
