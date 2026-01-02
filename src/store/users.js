import { computed } from "vue";
import api from "@/api";
import { compareStrings } from "../comparators";
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
  } = useBaseModelStore("users.users");

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
  const create = baseCreate(api.users, authStore, errorsStore, "user", setItem);
  const update = baseUpdate(api.users, authStore, errorsStore, "user", setItem);
  const destroy = baseDestroy(api.users, authStore, errorsStore, removeItem);

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
