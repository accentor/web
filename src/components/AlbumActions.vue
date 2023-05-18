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
      <span>{{ $t("music.album.no-tracks-to-play") }}</span>
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
      <span>{{ $t("music.album.no-tracks-to-add") }}</span>
    </VTooltip>
    <AddToPlaylist :item="album" type="album" />
    <EditReviewComment :item="album" :update="flag" />
    <VMenu v-if="isModerator">
      <template v-slot:activator="{ on, attrs }">
        <VBtn
          class="actions__button mr-0"
          small
          icon
          v-bind="attrs"
          v-on="on"
          @click.stop.prevent
        >
          <VIcon>mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList dense>
        <VTooltip bottom :disabled="!waitingForReload">
          <template v-slot:activator="{ on }">
            <VListItem
              :to="{
                name: 'edit-album',
                params: { id: album.id },
                query: { redirect: $route.fullPath },
              }"
              :disabled="waitingForReload"
              v-on="on"
            >
              <VListItemIcon>
                <VIcon color="edit">mdi-pencil</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>{{ $t("music.album.edit") }}</VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
        <VTooltip bottom :disabled="!waitingForReload">
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <AlbumMergeDialog :album="album" :disabled="waitingForReload" />
            </span>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
        <VTooltip bottom :disabled="!waitingForReload" v-if="isModerator">
          <template v-slot:activator="{ on }">
            <VListItem
              @click.stop.prevent="deleteAlbum"
              :disabled="waitingForReload"
              v-on="on"
            >
              <VListItemIcon>
                <VIcon color="danger">mdi-delete</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>{{ $t("music.album.delete") }}</VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
      </VList>
    </VMenu>
  </span>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import EditReviewComment from "./EditReviewComment";
import AddToPlaylist from "./AddToPlaylist";
import AlbumMergeDialog from "./AlbumMergeDialog.vue";

export default {
  name: "AlbumActions",
  components: { AddToPlaylist, AlbumMergeDialog, EditReviewComment },
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
