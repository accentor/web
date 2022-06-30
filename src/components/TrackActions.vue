<template>
  <span class="text-no-wrap actions">
    <VTooltip bottom :disabled="track.length !== null">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click="startTrack"
            :disabled="track.length === null"
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
      <span>{{ $t("music.track.empty") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="track.length !== null">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click="addTrack"
            :disabled="track.length === null"
            color="success"
            class="actions__button"
            text
            icon
            small
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("music.track.empty") }}</span>
    </VTooltip>
    <AddToPlaylist :item="track" type="track" />
    <EditReviewComment :item="track" :update="flag" />
    <VMenu v-if="isModerator">
      <template v-slot:activator="{ on, attrs }">
        <VBtn class="actions__button mr-0" small icon v-bind="attrs" v-on="on">
          <VIcon>mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList dense>
        <VMenu open-on-hover offset-x left v-if="track.length">
          <template v-slot:activator="{ on }">
            <VListItem v-on="on">
              <VListItemIcon v-on="on">
                <VIcon color="info">mdi-file-music</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>
                  {{ $t("music.track.file") }}
                </VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
          <VList dense>
            <VListItem v-if="Object.keys(locations).length > 1">
              <VListItemContent>
                <VListItemTitle> {{ $t("library.location") }}: </VListItemTitle>
                <VListItemSubtitle>
                  {{ locations[track.location_id].path }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
            <VListItem>
              <VListItemContent>
                <VListItemTitle> {{ $t("library.filename") }}: </VListItemTitle>
                <VListItemSubtitle>
                  {{ track.filename }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
            <VListItem>
              <VListItemContent>
                <VListItemTitle>
                  {{ $t("music.track.bitrate") }}:
                </VListItemTitle>
                <VListItemSubtitle>
                  {{ track.bitrate }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
            <VListItem v-if="track.hasOwnProperty('sample_rate')">
              <VListItemContent>
                <VListItemTitle>
                  {{ $t("music.track.sample_rate") }}:
                </VListItemTitle>
                <VListItemSubtitle>
                  {{ track.sample_rate }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
            <VListItem v-if="track.hasOwnProperty('bit_depth')">
              <VListItemContent>
                <VListItemTitle>
                  {{ $t("music.track.bit_depth") }}:
                </VListItemTitle>
                <VListItemSubtitle>
                  {{ track.bit_depth }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
            <VListItem>
              <VListItemContent>
                <VListItemTitle> {{ $t("common.added-on") }}: </VListItemTitle>
                <VListItemSubtitle>
                  {{ $d(new Date(track.created_at), "long") }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </VList>
        </VMenu>
        <VTooltip bottom :disabled="!waitingForReload">
          <template v-slot:activator="{ on }">
            <VListItem
              :to="{
                name: 'edit-track',
                params: { id: track.id },
                query: { redirect: $route.fullPath },
              }"
              :disabled="waitingForReload"
              v-on="on"
            >
              <VListItemIcon>
                <VIcon color="edit">mdi-pencil</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>{{ $t("music.track.edit") }}</VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
        <VTooltip bottom :disabled="!waitingForReload">
          <template v-slot:activator="{ on }">
            <VListItem
              :to="{
                name: 'merge-track',
                params: { id: track.id },
                query: { redirect: $route.fullPath },
              }"
              :disabled="waitingForReload"
              v-on="on"
            >
              <VListItemIcon>
                <VIcon color="edit">mdi-merge</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>
                  {{ $t("music.track.merge.merge") }}
                </VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
          <span>{{ $t("common.disabled-while-loading") }}</span>
        </VTooltip>
        <VTooltip bottom :disabled="!waitingForReload">
          <template v-slot:activator="{ on }">
            <VListItem
              @click.stop.prevent="deleteTrack"
              :disabled="waitingForReload"
              v-on="on"
            >
              <VListItemIcon>
                <VIcon color="danger">mdi-delete</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>{{ $t("music.track.delete") }}</VListItemTitle>
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

export default {
  name: "TrackActions",
  components: { AddToPlaylist, EditReviewComment },
  props: {
    track: { type: Object, required: true },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("tracks", ["startLoading"]),
    ...mapState("codecs", ["codecs"]),
    ...mapState("locations", ["locations"]),
    waitingForReload() {
      return this.startLoading > this.track.loaded;
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
