import { defineStore } from "pinia";
import { computed, type ComputedRef, ref, type Ref } from "vue";
import { useArtistsStore } from "./artists";
import { useAlbumsStore } from "./albums";
import { useTracksStore } from "./tracks";

export const useUtilityStore = defineStore("utility", () => {
  const albumsStore = useAlbumsStore();
  const artistsStore = useArtistsStore();
  const tracksStore = useTracksStore();

  const currentDay: Ref<number> = ref(new Date().setHours(0, 0, 0, 0));

  function updateCurrentDay(): void {
    currentDay.value = new Date().setHours(0, 0, 0, 0);
  }

  const numberOfFlaggedItems: ComputedRef<number> = computed(
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
