<template>
  <span class="text-no-wrap actions">
    <VTooltip location="bottom" :disabled="track.length !== null">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="track.length === null"
            color="primary"
            variant="text"
            icon
            size="small"
            @click="startTrack"
          >
            <VIcon size="x-large">mdi-play</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.track.empty") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="track.length !== null">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="track.length === null"
            color="success"
            variant="text"
            icon
            size="small"
            @click="addTrack"
          >
            <VIcon size="x-large">mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.track.empty") }}</span>
    </VTooltip>
    <AddToPlaylist :item="track" type="track" />
    <EditReviewComment :item="track" :update="flag" />
    <VMenu>
      <template #activator="{ props }">
        <VBtn class="mr-0" size="small" icon variant="text" v-bind="props">
          <VIcon size="x-large">mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList density="compact">
        <VMenu v-if="track.length && isModerator" open-on-hover location="left">
          <template #activator="{ props }">
            <VListItem v-bind="props">
              <template #prepend>
                <VIcon color="info">mdi-file-music</VIcon>
              </template>

              <VListItemTitle>
                {{ $t("music.track.file") }}
              </VListItemTitle>
            </VListItem>
          </template>
          <VList density="compact">
            <VListItem v-if="Object.keys(locations).length > 1">
              <VListItemTitle> {{ $t("library.location") }}: </VListItemTitle>
              <VListItemSubtitle>
                {{ locations[track.location_id].path }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem>
              <VListItemTitle> {{ $t("library.filename") }}: </VListItemTitle>
              <VListItemSubtitle>
                {{ track.filename }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ $t("music.track.bitrate") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.bitrate }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem v-if="track.hasOwnProperty('sample_rate')">
              <VListItemTitle>
                {{ $t("music.track.sample_rate") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.sample_rate }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem v-if="track.hasOwnProperty('bit_depth')">
              <VListItemTitle>
                {{ $t("music.track.bit_depth") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.bit_depth }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem>
              <VListItemTitle> {{ $t("common.added-on") }}: </VListItemTitle>
              <VListItemSubtitle>
                {{ $d(new Date(track.created_at), "long") }}
              </VListItemSubtitle>
            </VListItem>
          </VList>
        </VMenu>
        <VListItem
          v-if="track.length"
          :href="downloadURL"
          download
          target="_blank"
        >
          <template #prepend>
            <VIcon color="info">mdi-download</VIcon>
          </template>

          <VListItemTitle>{{ $t("music.track.download") }}</VListItemTitle>
        </VListItem>
        <VTooltip
          v-if="isModerator"
          location="bottom"
          :disabled="!waitingForReload"
        >
          <template #activator="{ props }">
            <VListItem
              :to="{
                name: 'edit-track',
                params: { id: track.id },
                query: { redirect: $route.fullPath },
              }"
              :disabled="waitingForReload"
              v-bind="props"
            >
              <template #prepend>
                <VIcon color="warning">mdi-pencil</VIcon>
              </template>

              <VListItemTitle>{{ $t("music.track.edit") }}</VListItemTitle>
            </VListItem>
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
              :to="{
                name: 'merge-track',
                params: { id: track.id },
                query: { redirect: $route.fullPath },
              }"
              :disabled="waitingForReload"
              v-bind="props"
            >
              <template #prepend>
                <VIcon color="warning">mdi-merge</VIcon>
              </template>

              <VListItemTitle>
                {{ $t("music.track.merge.merge") }}
              </VListItemTitle>
            </VListItem>
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
              @click.stop.prevent="deleteTrack"
            >
              <template #prepend>
                <VIcon color="error">mdi-delete</VIcon>
              </template>

              <VListItemTitle>{{ $t("music.track.delete") }}</VListItemTitle>
            </VListItem>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
      </VList>
    </VMenu>
  </span>
</template>

<script>
// @ts-nocheck
import { mapActions, mapState } from "pinia";
import { baseURL } from "../api";
import EditReviewComment from "./EditReviewComment.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
import { useAuthStore } from "../store/auth";
import { useCodecsStore } from "../store/codecs";
import { useLocationsStore } from "../store/locations";
import { useTracksStore } from "../store/tracks";
import { usePlayerStore } from "../store/player";
import { useErrorsStore } from "../store/errors";

export default {
  name: "TrackActions",
  components: { AddToPlaylist, EditReviewComment },
  props: {
    track: { type: Object, required: true },
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator", "apiToken"]),
    ...mapState(useTracksStore, ["startLoading"]),
    ...mapState(useCodecsStore, ["codecs"]),
    ...mapState(useLocationsStore, ["locations"]),
    waitingForReload() {
      return this.startLoading > this.track.loaded;
    },
    downloadURL() {
      return `${baseURL}/tracks/${this.track.id}/download?token=${this.apiToken}`;
    },
  },
  methods: {
    ...mapActions(useErrorsStore, ["addError"]),
    ...mapActions(usePlayerStore, {
      playTrack: "playTrack",
      addTrackToPlayer: "addTrack",
    }),
    ...mapActions(useTracksStore, ["destroy", "update"]),
    deleteTrack: function () {
      let message = this.$t("common.are-you-sure");
      if (this.track.length) {
        message += ` ${this.$t("music.track.delete-file-explanation")}`;
      }
      if (confirm(message)) {
        this.destroy(this.track.id);
      }
    },
    startTrack: function () {
      if (this.track.length !== null) {
        this.playTrack(this.track.id);
      } else {
        this.addError({ playlist: ["player.no-tracks-added"] });
      }
    },
    addTrack: function () {
      if (this.track.length !== null) {
        this.addTrackToPlayer(this.track.id);
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
