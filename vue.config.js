module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/sass/main.scss"`,
      },
    },
  },
  chainWebpack: (config) => {
    ["vue-modules", "vue", "normal-modules", "normal"].forEach((match) => {
      config.module
        .rule("scss")
        .oneOf(match)
        .use("sass-loader")
        .tap((opt) =>
          Object.assign(opt, { prependData: `@import '~@/sass/main.scss';` })
        );
    });
  },
};
