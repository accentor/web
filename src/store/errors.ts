import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { useAuthStore } from "./auth";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
  UnknownError,
  UnprocessableContentError,
} from "@accentor/api-client-js";
import { PlayerError } from "@/errors";

export type ErrorsStore = ReturnType<typeof useErrorsStore>;

export const useErrorsStore = defineStore("errors", () => {
  const authStore = useAuthStore();

  const errors: Ref<Error[]> = ref([]);

  function addError(error: Error): void {
    if (error instanceof UnauthorizedError) {
      authStore.clearAuthData();
    }
    errors.value.push(error);

    if (
      [
        UnauthorizedError,
        ForbiddenError,
        NotFoundError,
        UnprocessableContentError,
        PlayerError,
      ].some((constructor) => error instanceof constructor)
    ) {
      // We provide enough info inside the application for the user to resolve these errors
      return;
    }

    // Otherwise, we log the errors to help with debugging
    if (error instanceof UnexpectedError || error instanceof UnknownError) {
      // For errors from our API client, we log the details as these are relevant to debug
      // eslint-disable-next-line no-console
      console.error(error.message, error.details, error);
    } else {
      // Any other error, we just log as is
      // eslint-disable-next-line no-console
      console.error(error);
    }
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
