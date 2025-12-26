import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { compareStrings } from "../comparators";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import { useBaseModelStore } from "./base";

export const usePlaylistsStore = defineStore("playlists", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: playlists,
    index,
    create,
    read,
    update,
    destroy,
    startLoading,
  } = useBaseModelStore(api.playlists, "playlists.playlists", "playlist");

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
