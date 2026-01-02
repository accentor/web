import eslint from "@eslint/js";
import globals from 'globals'
import prettier from "@vue/eslint-config-prettier";
import vue from 'eslint-plugin-vue'
import vueParser from "vue-eslint-parser"
import vuetify from 'eslint-plugin-vuetify'

export default [
    ...vue.configs['flat/recommended'],
    ...vuetify.configs['flat/recommended'],
    eslint.configs.recommended,
    {
        files: ["*.vue", "**/*.vue"],
        languageOptions: {
            parser: vueParser
        }
    },
    prettier,
    {
        rules: {
            'vue/multi-word-component-names': 'off',
        },
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.browser
            }
        }
    }
]