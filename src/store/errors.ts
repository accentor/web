import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { useAuthStore } from "./auth";

export type ApiError = Record<string, string[]>;
export type ErrorsStore = ReturnType<typeof useErrorsStore>;

export const useErrorsStore = defineStore("errors", () => {
  const authStore = useAuthStore();

  const errors: Ref<ApiError[]> = ref([]);

  function addError(error: ApiError): void {
    if (error.unauthorized) {
      authStore.clearAuthData();
    }
    errors.value.push(error);

    // We want to log our errors here, to help with debugging
    // eslint-disable-next-line no-console
    console.error(error);
  }

  function clearErrors(): void {
    errors.value = [];
  }

  return {
    errors,
    addError,
    clearErrors,
  };
});
