import { computed, type ComputedRef, type Ref, watch } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { type ApiError, useErrorsStore } from "@/store/errors";
import { useUsersStore } from "@/store/users";
import router from "@/router";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";
import type { AuthTokenParams, User } from "@accentor/api-client-js";

export type AuthStore = ReturnType<typeof useAuthStore>;

export const useAuthStore = defineStore("auth", () => {
  const errorsStore = useErrorsStore();
  const usersStore = useUsersStore();

  const _apiToken: Ref<string | null> = useLocalStorage("auth.apiToken", null, {
    serializer: StorageSerializers.object,
  });
  const apiToken = computed(() => _apiToken.value);
  const _userId: Ref<number | null> = useLocalStorage("auth.userId", null, {
    serializer: StorageSerializers.object,
  });
  const userId = computed(() => _userId.value);
  const _id: Ref<number | null> = useLocalStorage("auth.id", null, {
    serializer: StorageSerializers.object,
  });
  const id = computed(() => _id.value);

  async function login(data: AuthTokenParams): Promise<boolean> {
    try {
      const result = await api.auth_tokens.create({
        auth_token: {
          application: __APPLICATION_VERSION__,
        },
        ...data,
      });
      _apiToken.value = result.token;
      _userId.value = result.user_id;
      _id.value = result.id;
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  }

  function clearAuthData(): void {
    _apiToken.value = null;
    _userId.value = null;
    _id.value = null;
  }

  async function logout(): Promise<boolean> {
    try {
      await api.auth_tokens.destroy(apiToken.value!, id.value!);
      clearAuthData();
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  }

  const loggedIn = computed(() => apiToken.value !== null);
  const currentSession = computed(() => id.value);
  const currentUser: ComputedRef<User | undefined> = computed(() =>
    userId.value ? usersStore.users[userId.value] : undefined,
  );
  const isAdmin = computed(() => currentUser.value?.permission === "admin");
  const isModerator = computed(
    () => isAdmin.value || currentUser.value?.permission === "moderator",
  );

  watch(loggedIn, () => {
    if (!loggedIn.value) {
      router.push({ name: "login" });
    }
  });

  return {
    apiToken,
    loggedIn,
    currentSession,
    currentUser,
    isAdmin,
    isModerator,
    login,
    clearAuthData,
    logout,
  };
});
