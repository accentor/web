import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import colors from 'vuetify/util/colors'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import App from './App.vue'
import router from './router'
import sqlitePlugin from './sqlite'

const app = createApp(App)

app.use(
  createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: colors.blue.darken2,
            'primary-darken-1': colors.blue.darken3,
            secondary: colors.red.darken2,
            'secondary-darken-1': colors.red.darken3
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: colors.blue.base,
            'primary-darken-1': colors.blue.lighten1,
            secondary: colors.red.base,
            'secondary-darken-1': colors.red.lighten1
          }
        }
      }
    }
  })
)
app.use(createPinia())
app.use(router)
app.use(sqlitePlugin, { file: '/db/accentor.sqlite3' })

app.mount('#app')
