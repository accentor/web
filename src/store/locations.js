import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { useBaseModelStore } from "./base";

export const useLocationsStore = defineStore("locations", () => {
  const {
    items: locations,
    index,
    create,
    destroy,
  } = useBaseModelStore(api.locations, "locations.locations", "location");

  const allLocations = computed(() =>
    Object.values(locations.value).sort((l1, l2) => l1.id - l2.id),
  );

  return {
    locations,
    allLocations,
    index,
    create,
    destroy,
  };
});
