import { globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "@vue/eslint-config-prettier";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import vuetify from "eslint-plugin-vuetify";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{vue,ts}"],
  },
  globalIgnores(["**/dist/**"]),
  eslint.configs.recommended,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
    },
  },
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  ...vue.configs["flat/recommended"],
  ...vuetify.configs["flat/recommended"],
  vueTsConfigs.recommended,
  prettier,
  {
    rules: {
      curly: "error",
      "no-console": "error",
      "no-debugger": "error",
      "no-invalid-this": "error",
      "require-await": "error",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
);
