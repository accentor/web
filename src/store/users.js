import { computed } from "vue";
import api from "@/api";
import { compareStrings } from "../comparators";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";

export const useUsersStore = defineStore("users", () => {
  const {
    items: users,
    index,
    create,
    update,
    destroy,
  } = useBaseModelStore(api.users, "users.users", "user");

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
