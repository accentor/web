import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { compareStrings } from "../comparators";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  read as baseRead,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useErrorsStore } from "@/store/errors";
import { useAuthStore } from "@/store/auth";

export const usePlaylistsStore = defineStore("playlists", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: playlists,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    startLoading,
    setStartLoading,
  } = useBaseModelStore("playlists.playlists");

  const allPlaylists = computed(() => Object.values(playlists.value));
  const playlistsByName = computed(() =>
    [...allPlaylists.value].sort((p1, p2) =>
      compareStrings(p1.name.toLowerCase(), p2.name.toLowerCase()),
    ),
  );
  const editablePlaylists = computed(() =>
    playlistsByName.value.filter(
      (p) => p.access === "shared" || p.user_id === authStore.currentUser.id,
    ),
  );
  const albumPlaylists = computed(() =>
    playlistsByName.value.filter((p) => p.playlist_type === "album"),
  );
  const artistPlaylists = computed(() =>
    playlistsByName.value.filter((p) => p.playlist_type === "artist"),
  );

  const index = baseIndex(
    api.playlists,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate(
    api.playlists,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ playlist: val }),
  );
  const read = baseRead(
    api.playlists,
    authStore,
    errorsStore,
    restored,
    setItem,
  );
  const update = baseUpdate(
    api.playlists,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ playlist: val }),
  );
  const destroy = baseDestroy(
    api.playlists,
    authStore,
    errorsStore,
    removeItem,
  );

  async function addItem(id, newItem) {
    try {
      await api.playlists.addItem(authStore.apiToken, id, {
        playlist: newItem,
      });
      return await read(id);
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  return {
    playlists,
    allPlaylists,
    playlistsByName,
    editablePlaylists,
    albumPlaylists,
    artistPlaylists,
    startLoading,
    index,
    create,
    read,
    update,
    destroy,
    addItem,
  };
});
