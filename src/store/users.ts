import { computed } from "vue";
import api from "@/api";
import { compareStrings } from "@/comparators.ts";
import { defineStore } from "pinia";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";
import type { User, UserParams } from "@accentor/api-client-js";

export const useUsersStore = defineStore("users", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: users,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setStartLoading,
  } = useBaseModelStore<User>("users.users");

  const allUsers = computed(() => Object.values(users.value));
  const usersByName = computed(() =>
    [...allUsers.value].sort((u1, u2) => compareStrings(u1.name, u2.name)),
  );

  const index = baseIndex(
    api.users,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate<User, UserParams["user"], UserParams>(
    api.users,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ user: val }),
  );
  const update = baseUpdate<User, UserParams["user"], UserParams>(
    api.users,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ user: val }),
  );
  const destroy = baseDestroy(api.users, authStore, errorsStore, removeItem);

  return {
    users,
    restored,
    allUsers,
    usersByName,
    index,
    create,
    update,
    destroy,
  };
});
