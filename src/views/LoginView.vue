<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watchEffect, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

watchEffect(() => {
  if (authStore.loggedIn) {
    router.push({ name: 'home' })
  }
})

const name: Ref<string> = ref('')
const password: Ref<string> = ref('')

async function submit() {
  await authStore.login({ name: name.value, password: password.value })
}
</script>

<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row no-gutters align="center" justify="center">
        <v-col md="4" sm="8" cols="12">
          <v-card class="elevation-12">
            <v-toolbar color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <!-- TODO(chvp): errors -->
              <v-form @submit.prevent="submit">
                <v-text-field
                  v-model="name"
                  label="Name"
                  placeholder="Name"
                  prepend-icon="mdi-account"
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  placeholder="Password"
                  prepend-icon="mdi-key"
                  type="password"
                  autocomplete="current-password"
                />
                <v-btn color="primary" class="ma-2" type="submit">Login</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <div></div>
</template>
