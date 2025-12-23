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
      <span>{{ $t("music.album.no-tracks-to-play") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="playableTracks.length !== 0">
      <template #activator="{ props }">
        <VBtn
          :disabled="playableTracks.length === 0"
          color="success"
          class="actions__button"
          variant="text"
          icon
          size="small"
          v-bind="props"
          @click.stop.prevent="addTracks"
        >
          <VIcon>mdi-plus</VIcon>
        </VBtn>
      </template>
      <span>{{ $t("music.album.no-tracks-to-add") }}</span>
    </VTooltip>
    <AddToPlaylist :item="album" type="album" />
    <EditReviewComment :item="album" :update="flag" />
    <VMenu v-if="isModerator">
      <template #activator="{ props }">
        <VBtn
          class="actions__button mr-0"
          size="small"
          icon
          v-bind="props"
          @click.stop.prevent
        >
          <VIcon>mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList density="compact">
        <VTooltip location="bottom" :disabled="!waitingForReload">
          <template #activator="{ props }">
            <VListItem
              :to="{
                name: 'edit-album',
                params: { id: album.id },
                query: { redirect: $route.fullPath },
              }"
              :disabled="waitingForReload"
              v-bind="props"
            >
              <template #prepend>
                <VIcon color="edit">mdi-pencil</VIcon>
              </template>

              <VListItemTitle>{{ $t("music.album.edit") }}</VListItemTitle>
            </VListItem>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
        <VTooltip location="bottom" :disabled="!waitingForReload">
          <template #activator="{ props }">
            <span v-bind="props">
              <AlbumMergeDialog :album="album" :disabled="waitingForReload" />
            </span>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
        <VTooltip
          v-if="isModerator"
          location="bottom"
          :disabled="!waitingForReload"
        >
          <template #activator="{ props }">
            <VListItem
              :disabled="waitingForReload"
              v-bind="props"
              @click.stop.prevent="deleteAlbum"
            >
              <template #prepend>
                <VIcon color="danger">mdi-delete</VIcon>
              </template>

              <VListItemTitle>{{ $t("music.album.delete") }}</VListItemTitle>
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
import EditReviewComment from "./EditReviewComment.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
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
