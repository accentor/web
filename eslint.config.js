import { globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import globals from "globals";
import prettier from "@vue/eslint-config-prettier";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import vuetify from "eslint-plugin-vuetify";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{vue,js}"],
  },
  globalIgnores(["**/dist/**"]),
  eslint.configs.recommended,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
    },
  },
  ...vue.configs["flat/recommended"],
  ...vuetify.configs["flat/recommended"],
  prettier,
  {
    rules: {
      curly: "error",
      "no-console": "error",
      "no-debugger": "error",
      "vue/multi-word-component-names": "off",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
];
