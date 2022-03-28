<template>
  <span class="actions">
    <VTooltip bottom :disabled="playableTracks.length !== 0">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="startTracks"
            :disabled="playableTracks.length === 0"
            color="primary"
            class="actions__button"
            text
            icon
            small
          >
            <VIcon>mdi-play</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.playlist.no-tracks-to-play") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="playableTracks.length !== 0">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="addTracks"
            :disabled="playableTracks.length === 0"
            color="success"
            class="actions__button"
            text
            icon
            small
            v-on="on"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.playlist.no-tracks-to-add") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload" v-if="isAllowedToEdit">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{
              name: 'edit-playlist',
              params: { id: playlist.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="edit"
            class="actions__button"
            text
            icon
            small
          >
            <VIcon>mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload" v-if="isAllowedToEdit">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="deletePlaylist"
            :disabled="waitingForReload"
            color="danger"
            class="actions__button mr-0"
            href="#"
            text
            icon
            small
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
import { mapActions, mapState } from "vuex";

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
    ...mapState("auth", { currentUser: "user_id" }),
    ...mapState("playlists", ["startLoading"]),
    ...mapState("tracks", ["tracks"]),
    waitingForReload() {
      return this.startLoading > this.playlist.loaded;
    },
    isAllowedToEdit() {
      return [null, this.currentUser].includes(this.playlist.user_id);
    },
    playlistTracks() {
      switch (this.playlist.playlist_type) {
        case "album":
          return this.playlist.item_ids
            .map((album_id) =>
              this.$store.getters["tracks/tracksFilterByAlbum"](album_id)
            )
            .flat();
        case "artist":
          return this.playlist.item_ids
            .map((artist_id) =>
              this.$store.getters["tracks/tracksFilterByArtist"](artist_id)
            )
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
    ...mapActions("playlists", ["destroy", "update"]),
    deletePlaylist: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.playlist.id);
      }
    },
    startTracks: function () {
      if (this.playableTracks.length > 0) {
        this.$store.commit("player/playTracks", this.playableTracks);
        if (this.playableTracks.length !== this.playlistTracks.length) {
          this.$store.commit("addError", {
            playlist: ["player.not-all-tracks-added"],
          });
        }
      } else {
        this.$store.commit("addError", {
          playlist: ["player.no-tracks-added"],
        });
      }
    },
    addTracks: function () {
      if (this.playableTracks.length > 0) {
        this.$store.commit("player/addTracks", this.playableTracks);
        if (this.playableTracks.length !== this.playlistTracks.length) {
          this.$store.commit("addError", {
            playlist: ["player.not-all-tracks-added"],
          });
        }
      } else {
        this.$store.commit("addError", {
          playlist: ["player.no-tracks-added"],
        });
      }
    },
  },
};
</script>
