import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  useBaseModelStore,
} from "./base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const useLocationsStore = defineStore("locations", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: locations,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setStartLoading,
  } = useBaseModelStore("locations.locations");

  const allLocations = computed(() =>
    Object.values(locations.value).sort((l1, l2) => l1.id - l2.id),
  );

  const index = baseIndex(
    api.locations,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate(
    api.locations,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ location: val }),
  );
  const destroy = baseDestroy(
    api.locations,
    authStore,
    errorsStore,
    removeItem,
  );

  return {
    locations,
    allLocations,
    index,
    create,
    destroy,
  };
});
