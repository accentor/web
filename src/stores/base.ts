import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useAuthStore } from './auth'

export const useBaseStore = defineStore('base', () => {
  const authStore = useAuthStore()
  const errors: Ref<[string, string][]> = ref([])

  function addError(error: any) {
    if (typeof error == 'object' && error.unauthorized != undefined) {
      authStore.logout()
    }
    if (typeof error == 'string') {
      errors.value.push(['Error', error])
    } else if (error == 'object') {
      for (const key of Object.keys(error)) {
        errors.value.push([key, error[key]])
      }
    }
  }

  function clearErrors() {
    errors.value = []
  }

  return { errors, addError, clearErrors }
})
