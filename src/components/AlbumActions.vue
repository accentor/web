<template>
  <span>
    <VTooltip bottom :disabled="playableTracks.length !== 0">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="startTracks"
            :disabled="playableTracks.length === 0"
            color="primary"
            class="ml-0 ma-1 ma-sm-2"
            text
            icon
            small
          >
            <VIcon>mdi-play</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.album.no-tracks-to-play") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="playableTracks.length !== 0">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="addTracks"
            :disabled="playableTracks.length === 0"
            color="success"
            class="ma-1 ma-sm-2"
            text
            icon
            small
            v-on="on"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.album.no-tracks-to-add") }}</span>
    </VTooltip>
    <EditReviewComment :item="album" :update="flag" />
    <VTooltip bottom :disabled="!waitingForReload" v-if="isModerator">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{
              name: 'edit-album',
              params: { id: album.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="edit"
            class="ma-1 ma-sm-2"
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
    <VTooltip bottom :disabled="!waitingForReload" v-if="isModerator">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="deleteAlbum"
            :disabled="album.loaded < startLoading"
            color="danger"
            class="mr-0 ma-1 ma-sm-2"
            text
            href="#"
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
import { mapActions, mapGetters, mapState } from "vuex";
import EditReviewComment from "./EditReviewComment";

export default {
  name: "AlbumActions",
  components: { EditReviewComment },
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("albums", ["startLoading"]),
    tracks() {
      return this.$store.getters["tracks/tracksFilterByAlbum"](this.album.id);
    },
    playableTracks() {
      return this.tracks
        .filter((track) => track.length !== null)
        .map((obj) => obj.id);
    },
    waitingForReload() {
      return this.startLoading > this.album.loaded;
    },
  },
  methods: {
    ...mapActions("albums", ["destroy", "update"]),
    deleteAlbum: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.album.id);
      }
    },
    startTracks: function () {
      if (this.playableTracks.length > 0) {
        this.$store.commit("player/playTracks", this.playableTracks);
        if (this.playableTracks.length !== this.tracks.length) {
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
        if (this.playableTracks.length !== this.tracks.length) {
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
    flag(id, reviewComment) {
      return this.update({
        id,
        newAlbum: { review_comment: reviewComment },
      });
    },
  },
};
</script>
