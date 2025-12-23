import { computed, del, ref, markRaw } from "vue";
import api from "@/api";
import { fetchAllPinia } from "./actions";
import { compareStrings } from "../comparators";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useErrorsStore } from "./errors";
import { useLocalStorage } from "@vueuse/core";
import { ShallowObjectSerializer } from "./persistence";

export const useUsersStore = defineStore("users", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const users = useLocalStorage(
    "users.users",
    {},
    { serializer: ShallowObjectSerializer },
  );
  const startLoading = ref(new Date(0));

  function setUsers(payload) {
    const oldUsers = users.value;
    users.value = {};
    for (let id in oldUsers) {
      users.value[id] = oldUsers[id];
    }
    const loaded = new Date();
    for (let user of payload) {
      user.loaded = loaded;
      users.value[user.id] = markRaw(user);
    }
  }

  function setUser({ id, user }) {
    const oldUsers = users.value;
    users.value = {};
    for (let id in oldUsers) {
      users.value[id] = oldUsers[id];
    }
    user.loaded = new Date();
    users.value[id] = markRaw(user);
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeUser(id) {
    del(users.value, id);
  }

  function removeOld() {
    const oldUsers = users.value;
    users.value = {};
    for (let id in oldUsers) {
      if (oldUsers[id].loaded > startLoading.value) {
        users.value[id] = oldUsers[id];
      }
    }
  }

  async function index() {
    const generator = api.users.index(authStore.apiToken);
    try {
      await fetchAllPinia(generator, setUsers, setStartLoading, removeOld);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function create(newUser) {
    try {
      const result = await api.users.create(authStore.apiToken, {
        user: newUser,
      });
      setUser({ id: result.id, user: result });
      return result.id;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function update(id, newUser) {
    try {
      const result = await api.users.update(authStore.apiToken, id, {
        user: newUser,
      });
      setUser({ id, user: result });
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function destroy(id) {
    try {
      await api.users.destroy(authStore.apiToken, id);
      removeUser(id);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  const allUsers = computed(() => Object.values(users.value));
  const usersByName = computed(() =>
    [...allUsers.value].sort((u1, u2) => compareStrings(u1.name, u2.name)),
  );

  return {
    users,
    allUsers,
    usersByName,
    index,
    create,
    update,
    destroy,
  };
});
