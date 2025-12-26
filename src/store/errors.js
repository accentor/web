import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";

export const useErrorsStore = defineStore("errors", () => {
  const authStore = useAuthStore();

  const errors = ref([]);

  function addError(error) {
    if (error.unauthorized) {
      authStore.clearAuthData();
    }
    errors.value.push(error);

    // We want to log our errors here, to help with debugging

    console.error(error);
  }

  function clearErrors() {
    errors.value = [];
  }

  return {
    errors,
    addError,
    clearErrors,
  };
});
