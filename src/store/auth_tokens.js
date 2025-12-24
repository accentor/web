import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";
import { computed } from "vue";
import api from "@/api";

export const useAuthTokensStore = defineStore("auth-tokens", () => {
  const {
    items: authTokens,
    index,
    destroy,
  } = useBaseModelStore(api.auth_tokens, "authTokens.authTokens", "auth_token");

  const allAuthTokens = computed(() =>
    Object.values(authTokens.value).sort((a1, a2) => a1.id - a2.id),
  );

  return {
    authTokens: allAuthTokens,
    index,
    destroy,
  };
});
