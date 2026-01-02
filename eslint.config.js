import { globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import globals from "globals";
import prettier from "@vue/eslint-config-prettier";
import vue from 'eslint-plugin-vue'
import vuetify from 'eslint-plugin-vuetify'
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript'

configureVueProject({ scriptLangs: ['ts', 'js'] })

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{vue,ts,js}'],
    },
    globalIgnores(["**/dist/**"]),
    eslint.configs.recommended,
    ...vue.configs['flat/recommended'],
    ...vuetify.configs['flat/recommended'],
    vueTsConfigs.recommended,
    prettier,
    {
        rules: {
            curly: "error",
            "no-console": "error",
            "no-debugger": "error",
            'vue/multi-word-component-names': 'off',
        },
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.browser
            }
        }
    }
)
