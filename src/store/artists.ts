import { computed } from "vue";
import { defineStore } from "pinia";
import {
  type Artist,
  type ArtistParams,
  ArtistsScope,
} from "@accentor/api-client-js";
import api from "@/api";
import {
  useBaseModelStore,
  index as baseIndex,
  create as baseCreate,
  read as baseRead,
  update as baseUpdate,
  destroy as baseDestroy,
  destroyEmpty as baseDestroyEmpty,
  merge as baseMerge,
} from "@/store/base";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";
import { compareStrings } from "@/util";

export const useArtistsStore = defineStore("artists", () => {
  const albumsStore = useAlbumsStore();
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const tracksStore = useTracksStore();

  const {
    items: artists,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    startLoading,
    setStartLoading,
  } = useBaseModelStore<Artist>("artists.artists");
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

  const index = baseIndex(
    api.artists,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
    new ArtistsScope(),
  );
  const create = baseCreate<Artist, ArtistParams["artist"], ArtistParams>(
    api.artists,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ artist: val }),
  );
  const read = baseRead(api.artists, authStore, errorsStore, restored, setItem);
  const update = baseUpdate<Artist, ArtistParams["artist"], ArtistParams>(
    api.artists,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ artist: val }),
  );
  const destroy = baseDestroy(
    api.artists,
    authStore,
    errorsStore,
    removeItem,
    (id) => {
      albumsStore.removeArtistOccurrence(id);
      tracksStore.removeArtistOccurrence(id);
    },
  );
  const destroyEmpty = baseDestroyEmpty(
    api.artists,
    authStore,
    errorsStore,
    index,
  );
  const merge = baseMerge(
    api.artists,
    read,
    authStore,
    errorsStore,
    removeItem,
    (newId, oldId) => {
      albumsStore.updateArtistOccurrence(newId, oldId);
      tracksStore.updateArtistOccurrence(newId, oldId);
    },
  );

  return {
    artists,
    restored,
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
