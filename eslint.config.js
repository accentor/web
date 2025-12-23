import globals from 'globals'
import eslint from "@eslint/js";
import vue from 'eslint-plugin-vue'
import vuetify from 'eslint-plugin-vuetify'
import prettier from "@vue/eslint-config-prettier";

export default [
    ...vue.configs['flat/recommended'],
    ...vuetify.configs['flat/recommended'],
    eslint.configs.recommended,
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