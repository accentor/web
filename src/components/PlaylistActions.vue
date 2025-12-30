<template>
  <span class="actions">
    <VTooltip location="bottom" :disabled="playableTracks.length !== 0">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="playableTracks.length === 0"
            color="primary"
            class="actions__button"
            variant="text"
            icon
            size="small"
            @click.stop.prevent="startTracks"
          >
            <VIcon>mdi-play</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.playlist.no-tracks-to-play") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="playableTracks.length !== 0">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="playableTracks.length === 0"
            color="success"
            class="actions__button"
            variant="text"
            icon
            size="small"
            @click.stop.prevent="addTracks"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.playlist.no-tracks-to-add") }}</span>
    </VTooltip>
    <VTooltip
      v-if="isAllowedToEdit"
      location="bottom"
      :disabled="!waitingForReload"
    >
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :to="{
              name: 'edit-playlist',
              params: { id: playlist.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="warning"
            class="actions__button"
            variant="text"
            icon
            size="small"
          >
            <VIcon>mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip
      v-if="isAllowedToEdit"
      location="bottom"
      :disabled="!waitingForReload"
    >
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="waitingForReload"
            color="error"
            class="actions__button mr-0"
            href="#"
            variant="text"
            icon
            size="small"
            @click.stop.prevent="deletePlaylist"
          >
            <VIcon>mdi-delete</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
  </span>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "../store/auth";
import { usePlaylistsStore } from "../store/playlists";
import { useTracksStore } from "../store/tracks";
import { useErrorsStore } from "../store/errors";
import { usePlayerStore } from "../store/player";

export default {
  name: "PlaylistActions",
  components: {},
  props: {
    playlist: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useAuthStore, ["currentUser"]),
    ...mapState(usePlaylistsStore, ["startLoading"]),
    ...mapState(useTracksStore, ["tracks"]),
    waitingForReload() {
      return this.startLoading > this.playlist.loaded;
    },
    isAllowedToEdit() {
      return (
        this.playlist.access === "shared" ||
        this.playlist.user_id === this.currentUser.id
      );
    },
    playlistTracks() {
      const tracksStore = useTracksStore();
      switch (this.playlist.playlist_type) {
        case "album":
          return this.playlist.item_ids
            .map((album_id) => tracksStore.tracksFilterByAlbum(album_id))
            .flat();
        case "artist":
          return this.playlist.item_ids
            .map((artist_id) => tracksStore.tracksFilterByArtist(artist_id))
            .flat();
        case "track":
          return this.playlist.item_ids.map((id) => this.tracks[id]);
        default:
          return [];
      }
    },
    playableTracks() {
      return this.playlistTracks
        .filter((track) => track.length !== null)
        .map((obj) => obj.id);
    },
  },
  methods: {
    ...mapActions(useErrorsStore, ["addError"]),
    ...mapActions(usePlayerStore, ["playTracks", "addTracks"]),
    ...mapActions(usePlaylistsStore, ["destroy", "update"]),
    deletePlaylist: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.playlist.id);
      }
    },
    startTracks: function () {
      if (this.playableTracks.length > 0) {
        this.playTracks(this.playableTracks);
        if (this.playableTracks.length !== this.playlistTracks.length) {
          this.addError({ playlist: ["player.not-all-tracks-added"] });
        }
      } else {
        this.addError({ playlist: ["player.no-tracks-added"] });
      }
    },
    addTracks: function () {
      if (this.playableTracks.length > 0) {
        this.addTracks(this.playableTracks);
        if (this.playableTracks.length !== this.playlistTracks.length) {
          this.addError({ playlist: ["player.not-all-tracks-added"] });
        }
      } else {
        this.addError({ playlist: ["player.no-tracks-added"] });
      }
    },
  },
};
</script>
