<template>
  <span class="text-no-wrap actions">
    <VTooltip location="bottom" :disabled="track.length !== null">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="track.length === null"
            color="primary"
            class="actions__button"
            variant="text"
            icon
            size="small"
            @click="startTrack"
          >
            <VIcon>mdi-play</VIcon>
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
            class="actions__button"
            variant="text"
            icon
            size="small"
            @click="addTrack"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.track.empty") }}</span>
    </VTooltip>
    <AddToPlaylist :item="track" type="track" />
    <EditReviewComment :item="track" :update="flag" />
    <VMenu>
      <template #activator="{ props }">
        <VBtn
          class="actions__button mr-0"
          size="small"
          icon
          v-bind="props"
        >
          <VIcon>mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList density="compact">
        <VMenu
          v-if="track.length && isModerator"
          open-on-hover
          location="left"
        >
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
          <VListItemIcon>
            <VIcon color="info">mdi-download</VIcon>
          </VListItemIcon>

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
                <VIcon color="edit">mdi-pencil</VIcon>
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
                <VIcon color="edit">mdi-merge</VIcon>
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
              @click.stop.prevent="deleteTrack"
              v-bind="props"
            >
              <template #prepend>
                <VIcon color="danger">mdi-delete</VIcon>
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
import { mapActions, mapGetters, mapState } from "vuex";
import { baseURL } from "../api";
import EditReviewComment from "./EditReviewComment.vue";
import AddToPlaylist from "./AddToPlaylist.vue";

export default {
  name: "TrackActions",
  components: { AddToPlaylist, EditReviewComment },
  props: {
    track: { type: Object, required: true },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("auth", ["apiToken"]),
    ...mapState("tracks", ["startLoading"]),
    ...mapState("codecs", ["codecs"]),
    ...mapState("locations", ["locations"]),
    waitingForReload() {
      return this.startLoading > this.track.loaded;
    },
    downloadURL() {
      return `${baseURL}/tracks/${this.track.id}/download?token=${this.apiToken}`;
    },
  },
  methods: {
    ...mapActions("tracks", ["destroy", "update"]),
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
        this.$store.commit("player/playTrack", this.track.id);
      } else {
        this.$store.commit("addError", {
          playlist: ["player.no-tracks-added"],
        });
      }
    },
    addTrack: function () {
      if (this.track.length !== null) {
        this.$store.commit("player/addTrack", this.track.id);
      } else {
        this.$store.commit("addError", {
          playlist: ["player.no-tracks-added"],
        });
      }
    },
    flag(id, reviewComment) {
      return this.update({
        id,
        newTrack: { review_comment: reviewComment },
      });
    },
  },
};
</script>
