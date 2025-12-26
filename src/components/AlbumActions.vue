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
import { mapState, mapActions } from "pinia";
import EditReviewComment from "./EditReviewComment.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
import AlbumMergeDialog from "./AlbumMergeDialog.vue";
import { useAuthStore } from "../store/auth";
import { useAlbumsStore } from "../store/albums";
import { useTracksStore } from "../store/tracks";
import { usePlayerStore } from "../store/player";
import { useErrorsStore } from "../store/errors";

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
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useAlbumsStore, ["startLoading"]),
    tracks() {
      return useTracksStore().tracksFilterByAlbum(this.album.id);
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
    ...mapActions(useAlbumsStore, ["destroy", "update"]),
    ...mapActions(usePlayerStore, {
      playTracks: "playTracks",
      addTracksToPlayer: "addTracks",
    }),
    ...mapActions(useErrorsStore, ["addError"]),
    deleteAlbum: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.album.id);
      }
    },
    startTracks: function () {
      if (this.playableTracks.length > 0) {
        this.playTracks(this.playableTracks);
        if (this.playableTracks.length !== this.tracks.length) {
          this.addError({ playlist: ["player.not-all-tracks-added"] });
        }
      } else {
        this.addError({ playlist: ["player.no-tracks-added"] });
      }
    },
    addTracks: function () {
      if (this.playableTracks.length > 0) {
        this.addTracksToPlayer(this.playableTracks);
        if (this.playableTracks.length !== this.tracks.length) {
          this.addError({ playlist: ["player.not-all-tracks-added"] });
        }
      } else {
        this.addError({ playlist: ["player.no-tracks-added"] });
      }
    },
    flag(id, reviewComment) {
      return this.update(id, { review_comment: reviewComment });
    },
  },
};
</script>
