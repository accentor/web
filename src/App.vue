<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { usePreferredDark } from '@vueuse/core'
import { watch } from 'vue'

const theme = useTheme()
const prefersDark = usePreferredDark()
watch(prefersDark, () => (theme.global.name.value = prefersDark.value ? 'dark' : 'light'), {
  immediate: true
})
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style scoped></style>
