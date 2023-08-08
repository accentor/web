<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { watchEffect, ref, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { DaoCollection } from '@/sqlite'

const router = useRouter()
const authStore = useAuthStore()
const { users, tracks, killAllFiles }: DaoCollection = inject('db')!

const drawer = ref(false)
const loading = ref(false)

watchEffect(() => {
  if (!authStore.loggedIn) {
    router.push({ name: 'login' })
  }
})

function logout() {
  authStore.logout()
}

async function loadData() {
  loading.value = true
  const promises: Promise<void>[] = []
  promises.push(tracks.refresh())
  promises.push(users.refresh())
  for (let p of promises) {
    try {
      await p
    } catch (error: any) {
      // TODO(chvp): Add to global errors state
      console.error(error)
    }
  }
  loading.value = false
}
</script>

<template>
  <v-app-bar color="primary">
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </template>
    <v-toolbar-title class="font-weight-medium">Accentor</v-toolbar-title>
    <template #append>
      <v-btn variant="text" icon @click="killAllFiles">
        <v-icon>mdi-delete-sweep</v-icon>
      </v-btn>
      <v-btn :disabled="loading" variant="text" icon @click="loadData">
        <v-icon>mdi-refresh {{ loading ? 'mdi-spin' : '' }}</v-icon>
      </v-btn>
      <v-btn variant="text" icon @click="logout">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Home" :to="{ name: 'home' }" exact />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-container>
      <router-view />
    </v-container>
  </v-main>
</template>
