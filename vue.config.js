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
        additionalData: `@import "~@/sass/main.scss"`,
      },
    },
  },
  configureWebpack: (config) => {
    config.cache = process.env.SKIP_CACHE !== "true";
  },
  chainWebpack: (config) => {
    config.module
      .rule("js")
      .use("babel-loader")
      .tap((opt) =>
        Object.assign(opt, {
          cacheDirectory: process.env.SKIP_CACHE !== "true",
        })
      );
    config
      .plugin("eslint")
      .tap((args) => [
        Object.assign(args[0], { cache: process.env.SKIP_CACHE !== "true" }),
      ]);
    ["vue-modules", "vue", "normal-modules", "normal"].forEach((match) => {
      config.module
        .rule("scss")
        .oneOf(match)
        .use("sass-loader")
        .tap((opt) =>
          Object.assign(opt, { additionalData: `@import '~@/sass/main.scss';` })
        );
    });
  },
};
