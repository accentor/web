import { computed } from "vue";
import { defineStore } from "pinia";
import { AlbumsScope } from "@accentor/api-client-js";
import api from "@/api";
import {
  compareAlbumsByReleaseFirst,
  compareAlbumsByTitleFirst,
} from "@/comparators";
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
import { useUtilityStore } from "@/store/utility";
import { useTracksStore } from "@/store/tracks";
import { useErrorsStore } from "@/store/errors";
import { useAuthStore } from "@/store/auth";

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
  } = useBaseModelStore("albums.albums");

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

  function albumsFilterByArtist(id) {
    const aaFilter = (a) =>
      a.album_artists.filter((aa) => `${aa.artist_id}` === `${id}`).length > 0;
    return allAlbums.value.filter(aaFilter).sort(compareAlbumsByReleaseFirst());
  }

  function albumsFilterByLabel(id) {
    const alFilter = (a) =>
      a.album_labels.filter((l) => `${l.label_id}` === `${id}`).length > 0;
    return allAlbums.value.filter(alFilter).sort(compareAlbumsByReleaseFirst());
  }

  function removeArtistOccurence(oldID) {
    const newAlbums = {};
    for (let album of allAlbums.value) {
      const i = album.album_artists.findIndex((aa) => aa.artist_id === oldID);
      if (i >= 0) {
        album.album_artists.splice(i, 1);
      }
      newAlbums[album.id] = album;
    }
    setItems(newAlbums);
  }

  function updateArtistOccurence(newID, oldID) {
    const newAlbums = {};
    for (let album of allAlbums.value) {
      const i = album.album_artists.findIndex((aa) => aa.artist_id === oldID);
      if (i >= 0) {
        album.album_artists[i].artist_id = newID;
      }
      newAlbums[album.id] = album;
    }
    setItems(newAlbums);
  }

  function removeLabelOccurence(oldID) {
    const newAlbums = {};
    for (let album of allAlbums.value) {
      const i = album.album_labels.findIndex((l) => l.label_id === oldID);
      if (i >= 0) {
        album.album_labels.splice(i, 1);
      }
      newAlbums[album.id] = album;
    }
    setItems(newAlbums);
  }

  function updateLabelOccurence(newID, oldID) {
    const newAlbums = {};
    for (let album of allAlbums.value) {
      const i = album.album_labels.findIndex((l) => l.label_id === oldID);
      if (i >= 0) {
        if (album.album_labels.some((l) => l.label_id === newID)) {
          album.album_labels.splice(i, 1);
        } else {
          album.album_labels[i].label_id = newID;
        }
      }
      newAlbums[album.id] = album;
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
  const create = baseCreate(
    api.albums,
    authStore,
    errorsStore,
    "album",
    setItem,
  );
  const read = baseRead(api.albums, authStore, errorsStore, restored, setItem);
  const update = baseUpdate(
    api.albums,
    authStore,
    errorsStore,
    "album",
    setItem,
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
    authStore,
    errorsStore,
    removeItem,
    (newId, oldId) => tracksStore.updateAlbumOccurence(newId, oldId),
  );

  return {
    albums,
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
    removeArtistOccurence,
    updateArtistOccurence,
    removeLabelOccurence,
    updateLabelOccurence,
  };
});
