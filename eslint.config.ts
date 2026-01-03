import { globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "@vue/eslint-config-prettier";
import vue from "eslint-plugin-vue";
import vuetify from "eslint-plugin-vuetify";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
  configureVueProject,
} from "@vue/eslint-config-typescript";

configureVueProject({ scriptLangs: ["ts", "js"] });

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{vue,ts,js}"],
  },
  globalIgnores(["**/dist/**"]),
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  ...vue.configs["flat/recommended"],
  ...vuetify.configs["flat/recommended"],
  vueTsConfigs.recommended,
  prettier,
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: [
      "**/*.ts",
      "**/components/{AddToPlaylist,AlbumActions,AlbumArtists,AlbumCard,AlbumMergeDialog,EditReviewComment,Errors}.vue",
    ],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
);
