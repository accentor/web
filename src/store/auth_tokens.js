import { computed } from "vue";
import { defineStore } from "pinia";
import {
  destroy as baseDestroy,
  index as baseIndex,
  useBaseModelStore,
} from "@/store/base";
import api from "@/api";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const useAuthTokensStore = defineStore("auth-tokens", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: authTokens,
    addItems,
    removeItem,
    removeOld,
    restored,
    setStartLoading,
  } = useBaseModelStore("authTokens.authTokens");

  const allAuthTokens = computed(() =>
    Object.values(authTokens.value).sort((a1, a2) => a1.id - a2.id),
  );

  const index = baseIndex(
    api.auth_tokens,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const destroy = baseDestroy(
    api.auth_tokens,
    authStore,
    errorsStore,
    removeItem,
  );

  return {
    authTokens: allAuthTokens,
    index,
    destroy,
  };
});
