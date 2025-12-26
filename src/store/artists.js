import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { compareStrings } from "../comparators";
import { ArtistsScope } from "@accentor/api-client-js";
import { useBaseModelStore } from "./base";
import { useAlbumsStore } from "./albums";
import { useTracksStore } from "./tracks";

export const useArtistsStore = defineStore("artists", () => {
  const albumsStore = useAlbumsStore();
  const tracksStore = useTracksStore();

  const {
    items: artists,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
    startLoading,
  } = useBaseModelStore(api.artists, "artists.artists", "artist", {
    baseScope: new ArtistsScope(),
    extraDestroyOperations: (id) => {
      albumsStore.removeArtistOccurence(id);
      tracksStore.removeArtistOccurence(id);
    },
    extraMergeOperations: (newId, oldId) => {
      albumsStore.updateArtistOccurence(newId, oldId);
      tracksStore.updateArtistOccurence(newId, oldId);
    },
  });
  const allArtists = computed(() => Object.values(artists.value));
  const artistsByName = computed(() =>
    [...allArtists.value].sort((a1, a2) =>
      compareStrings(a1.normalized_name, a2.normalized_name),
    ),
  );
  const artistsFlagged = computed(() => {
    return artistsByName.value
      .filter((t) => t.review_comment !== null)
      .sort((a1, a2) => compareStrings(a1.normalized_name, a2.normalized_name));
  });

  return {
    artists,
    allArtists,
    artistsByName,
    artistsFlagged,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
    startLoading,
  };
});
