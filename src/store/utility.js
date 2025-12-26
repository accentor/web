import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useArtistsStore } from "./artists";
import { useAlbumsStore } from "./albums";
import { useTracksStore } from "./tracks";

export const useUtilityStore = defineStore("utility", () => {
  const albumsStore = useAlbumsStore();
  const artistsStore = useArtistsStore();
  const tracksStore = useTracksStore();

  const currentDay = ref(new Date().setHours(0, 0, 0, 0));

  function updateCurrentDay() {
    currentDay.value = new Date().setHours(0, 0, 0, 0);
  }

  const numberOfFlaggedItems = computed(
    () =>
      artistsStore.artistsFlagged.length +
      albumsStore.albumsFlagged.length +
      tracksStore.tracksFlagged.length,
  );

  return {
    currentDay,
    updateCurrentDay,
    numberOfFlaggedItems,
  };
});
