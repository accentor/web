import { computed } from "vue";
import { defineStore } from "pinia";
import {
  type Album,
  type AlbumParams,
  AlbumsScope,
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
  type ModelItemsType,
  type Loaded,
} from "@/store/base";
import { useUtilityStore } from "@/store/utility";
import { useTracksStore } from "@/store/tracks";
import { useErrorsStore } from "@/store/errors";
import { useAuthStore } from "@/store/auth";
import { compareAlbumsByReleaseFirst, compareAlbumsByTitleFirst } from "@/util";

export const useAlbumsStore = defineStore("albums", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const tracksStore = useTracksStore();
  const utilityStore = useUtilityStore();

  const {
    items: albums,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setItems,
    startLoading,
    setStartLoading,
  } = useBaseModelStore<Album>("albums.albums");

  const allAlbums = computed(() => Object.values(albums.value));
  const albumsByTitle = computed(() =>
    [...allAlbums.value].sort(compareAlbumsByTitleFirst),
  );
  const albumsFlagged = computed(() => {
    return albumsByTitle.value
      .filter((t) => t.review_comment !== null)
      .sort(compareAlbumsByTitleFirst);
  });
  const albumsOnThisDay = computed(() => {
    const today = new Date(utilityStore.currentDay);
    return allAlbums.value
      .filter(
        (r) =>
          `${r.release.slice(-5, -3)}` ===
            `${today.getMonth() + 1}`.padStart(2, "0") &&
          `${r.release.slice(-2)}` === `${today.getDate()}`.padStart(2, "0"),
      )
      .sort(compareAlbumsByReleaseFirst(true));
  });

  function albumsFilterByArtist(id: number): Loaded<Album>[] {
    const aaFilter = (a: Album): boolean =>
      a.album_artists.filter((aa) => `${aa.artist_id}` === `${id}`).length > 0;
    return allAlbums.value.filter(aaFilter).sort(compareAlbumsByReleaseFirst());
  }

  function albumsFilterByLabel(id: number): Loaded<Album>[] {
    const alFilter = (a: Album): boolean =>
      a.album_labels.filter((l) => `${l.label_id}` === `${id}`).length > 0;
    return allAlbums.value.filter(alFilter).sort(compareAlbumsByReleaseFirst());
  }

  function removeArtistOccurrence(oldID: number): void {
    const newAlbums: ModelItemsType<Album> = {};
    for (const album of allAlbums.value) {
      const i = album.album_artists.findIndex((aa) => aa.artist_id === oldID);
      if (i >= 0) {
        album.album_artists.splice(i, 1);
      }
      newAlbums[`${album.id}`] = album;
    }
    setItems(newAlbums);
  }

  function updateArtistOccurrence(newID: number, oldID: number): void {
    const newAlbums: ModelItemsType<Album> = {};
    for (const album of allAlbums.value) {
      const i = album.album_artists.findIndex((aa) => aa.artist_id === oldID);
      if (i >= 0) {
        album.album_artists[i]!.artist_id = newID;
      }
      newAlbums[`${album.id}`] = album;
    }
    setItems(newAlbums);
  }

  function removeLabelOccurrence(oldID: number): void {
    const newAlbums: ModelItemsType<Album> = {};
    for (const album of allAlbums.value) {
      const i = album.album_labels.findIndex((l) => l.label_id === oldID);
      if (i >= 0) {
        album.album_labels.splice(i, 1);
      }
      newAlbums[`${album.id}`] = album;
    }
    setItems(newAlbums);
  }

  function updateLabelOccurrence(newID: number, oldID: number): void {
    const newAlbums: ModelItemsType<Album> = {};
    for (const album of allAlbums.value) {
      const i = album.album_labels.findIndex((l) => l.label_id === oldID);
      if (i >= 0) {
        if (album.album_labels.some((l) => l.label_id === newID)) {
          album.album_labels.splice(i, 1);
        } else {
          album.album_labels[i]!.label_id = newID;
        }
      }
      newAlbums[`${album.id}`] = album;
    }
    setItems(newAlbums);
  }

  const index = baseIndex(
    api.albums,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
    new AlbumsScope(),
  );
  const create = baseCreate<Album, AlbumParams["album"], AlbumParams>(
    api.albums,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ album: val }),
  );
  const read = baseRead(api.albums, authStore, errorsStore, restored, setItem);
  const update = baseUpdate<Album, AlbumParams["album"], AlbumParams>(
    api.albums,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ album: val }),
  );
  const destroy = baseDestroy(api.albums, authStore, errorsStore, removeItem);
  const destroyEmpty = baseDestroyEmpty(
    api.albums,
    authStore,
    errorsStore,
    index,
  );
  const merge = baseMerge(
    api.albums,
    read,
    authStore,
    errorsStore,
    removeItem,
    (newId, oldId) => tracksStore.updateAlbumOccurrence(newId, oldId),
  );

  return {
    albums,
    restored,
    allAlbums,
    albumsByTitle,
    albumsFlagged,
    albumsOnThisDay,
    albumsFilterByArtist,
    albumsFilterByLabel,
    startLoading,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
    removeArtistOccurrence,
    updateArtistOccurrence,
    removeLabelOccurrence,
    updateLabelOccurrence,
  };
});
