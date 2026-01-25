import { defineStore } from "pinia";
import { computed, type ComputedRef, ref, type Ref } from "vue";
import { useArtistsStore } from "./artists";
import { useAlbumsStore } from "./albums";
import { useTracksStore } from "./tracks";
import { useAuthTokensStore } from "@/store/auth_tokens";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import { useCodecsStore } from "@/store/codecs";
import { useCoverFilenamesStore } from "@/store/cover_filenames";
import { useGenresStore } from "@/store/genres";
import { useImageTypesStore } from "@/store/image_types";
import { useLabelsStore } from "@/store/labels";
import { useLocationsStore } from "@/store/locations";
import { usePlaylistsStore } from "@/store/playlists";
import { usePlaysStore } from "@/store/plays";
import { useUsersStore } from "@/store/users";

export const useUtilityStore = defineStore("utility", () => {
  const albumsStore = useAlbumsStore();
  const artistsStore = useArtistsStore();
  const authTokensStore = useAuthTokensStore();
  const codecConversionsStore = useCodecConversionsStore();
  const codecsStore = useCodecsStore();
  const coverFilenamesStore = useCoverFilenamesStore();
  const genresStore = useGenresStore();
  const imageTypesStore = useImageTypesStore();
  const labelsStore = useLabelsStore();
  const locationsStore = useLocationsStore();
  const playlistsStore = usePlaylistsStore();
  const playsStore = usePlaysStore();
  const tracksStore = useTracksStore();
  const usersStore = useUsersStore();

  const currentDay: Ref<number> = ref(new Date().setHours(0, 0, 0, 0));

  function updateCurrentDay(): void {
    currentDay.value = new Date().setHours(0, 0, 0, 0);
  }

  const allRestored = (async (): Promise<void> => {
    await Promise.all([
      albumsStore.restored,
      artistsStore.restored,
      authTokensStore.restored,
      codecConversionsStore.restored,
      codecsStore.restored,
      coverFilenamesStore.restored,
      genresStore.restored,
      imageTypesStore.restored,
      labelsStore.restored,
      locationsStore.restored,
      playlistsStore.restored,
      playsStore.restored,
      tracksStore.restored,
      usersStore.restored,
    ]);
  })();

  const numberOfFlaggedItems: ComputedRef<number> = computed(
    () =>
      artistsStore.artistsFlagged.length +
      albumsStore.albumsFlagged.length +
      tracksStore.tracksFlagged.length,
  );

  return {
    allRestored,
    currentDay,
    updateCurrentDay,
    numberOfFlaggedItems,
  };
});
