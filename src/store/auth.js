import { computed, watch } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { useErrorsStore } from "@/store/errors";
import { useUsersStore } from "@/store/users";
import router from "@/router";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  const errorsStore = useErrorsStore();
  const usersStore = useUsersStore();

  const _apiToken = useLocalStorage("auth.apiToken", null, {
    serializer: StorageSerializers.object,
  });
  const apiToken = computed(() => _apiToken.value);
  const _userId = useLocalStorage("auth.userId", null, {
    serializer: StorageSerializers.object,
  });
  const userId = computed(() => _userId.value);
  const _id = useLocalStorage("auth.id", null, {
    serializer: StorageSerializers.object,
  });
  const id = computed(() => _id.value);

  async function login(data) {
    try {
      const result = await api.auth_tokens.create({
        auth_token: {
          // This is defined by vite at build time
          // eslint-disable-next-line no-undef
          application: __APPLICATION_VERSION__,
        },
        ...data,
      });
      _apiToken.value = result.token;
      _userId.value = result.user_id;
      _id.value = result.id;
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  function clearAuthData() {
    _apiToken.value = null;
    _userId.value = null;
    _id.value = null;
  }

  async function logout() {
    try {
      await api.auth_tokens.destroy(apiToken.value, id.value);
      clearAuthData();
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  const loggedIn = computed(() => apiToken.value !== null);
  const currentSession = computed(() => id.value);
  const currentUser = computed(() => usersStore.users[userId.value]);
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
