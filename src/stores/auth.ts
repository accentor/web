import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed, type Ref } from 'vue'
import api from '@/api'
import { useBaseStore } from './base'

export const useAuthStore = defineStore('auth', () => {
  const baseStore = useBaseStore()

  const secret: Ref<string | null> = useStorage('auth_secret', null)
  const deviceId: Ref<string | null> = useStorage('auth_device_id', null)
  const userId: Ref<number | null> = useStorage('auth_user_id', null)
  const id: Ref<number | null> = useStorage('auth_id', null)

  const loggedIn = computed(() => deviceId.value != null && secret.value != null)

  async function login(data: { name: string; password: string }) {
    try {
      const result = await api.auth_tokens.create({
        ...data,
        auth_token: { user_agent: `AccentorWeb/${APP_VERSION} on ${navigator.userAgent}` }
      })
      secret.value = result.secret
      deviceId.value = result.device_id
      userId.value = result.user_id
      id.value = result.id
      return true
    } catch (error: any) {
      baseStore.addError(error)
      return false
    }
  }

  function logout() {
    secret.value = null
    deviceId.value = null
    userId.value = null
    id.value = null
  }

  return { secret, deviceId, userId, loggedIn, login, logout }
})
