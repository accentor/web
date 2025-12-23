import { ref, del, computed, watch, markRaw } from "vue";
import { defineStore } from "pinia";

import api from "@/api";
import { fetchAllPinia } from "@/store/actions";
import { useErrorsStore } from "@/store/errors";
import { useUsersStore } from "@/store/users";
import router from "@/router";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";
import { ShallowObjectSerializer } from "./persistence";

export const useAuthStore = defineStore("auth", () => {
  const errorsStore = useErrorsStore();
  const usersStore = useUsersStore();

  const apiToken = useLocalStorage("auth.apiToken", null, {
    serializer: StorageSerializers.object,
  });
  const userId = useLocalStorage("auth.userId", null, {
    serializer: StorageSerializers.object,
  });
  const id = useLocalStorage("auth.id", null, {
    serializer: StorageSerializers.object,
  });
  const startLoading = ref(new Date(0));
  const authTokens = useLocalStorage(
    "auth.authTokens",
    {},
    { serializer: ShallowObjectSerializer },
  );

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
      apiToken.value = result.token;
      userId.value = result.user_id;
      id.value = result.id;
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  function clearAuthData() {
    apiToken.value = null;
    userId.value = null;
    id.value = null;
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

  function setAuthTokens(payload) {
    const oldAuthTokens = authTokens.value;
    authTokens.value = {};
    for (let id in oldAuthTokens) {
      authTokens.value[id] = oldAuthTokens[id];
    }
    const loaded = new Date();
    for (let obj of payload) {
      obj.loaded = loaded;
      authTokens.value[obj.id] = markRaw(obj);
    }
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeAuthToken(id) {
    del(authTokens.value, id);
  }

  function removeOld() {
    const oldAuthTokens = authTokens.value;
    authTokens.value = {};
    for (let id in oldAuthTokens) {
      if (oldAuthTokens[id].loaded > startLoading.value) {
        authTokens.value[id] = oldAuthTokens[id];
      }
    }
  }

  async function index() {
    const generator = api.auth_tokens.index(apiToken.value);
    try {
      await fetchAllPinia(generator, setAuthTokens, setStartLoading, removeOld);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function destroy(id) {
    try {
      await api.auth_tokens.destroy(apiToken.value, id);
      removeAuthToken(id);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  const sortedAuthTokens = computed(() =>
    Object.values(authTokens.value).sort((a1, a2) => a1.id - a2.id),
  );
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
    authTokens: sortedAuthTokens,
    loggedIn,
    currentSession,
    currentUser,
    isAdmin,
    isModerator,
    login,
    clearAuthData,
    logout,
    destroy,
    index,
  };
});
