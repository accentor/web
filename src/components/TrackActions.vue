<template>
  <span>
    <VTooltip bottom :disabled="track.length !== null">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click="startTrack"
            :disabled="track.length === null"
            color="primary"
            class="ma-1"
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
            class="ma-1"
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
    <EditReviewComment :item="track" :update="flag" />
    <VBtn
      :to="{
        name: 'edit-track',
        params: { id: track.id },
        query: { redirect: $route.fullPath },
      }"
      v-if="isModerator"
      color="edit"
      class="ma-1"
      text
      icon
      small
    >
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VBtn
      @click.stop.prevent="deleteTrack"
      v-if="isModerator"
      color="danger"
      class="ma-1"
      href="#"
      text
      icon
      small
    >
      <VIcon>mdi-delete</VIcon>
    </VBtn>
  </span>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import EditReviewComment from "./EditReviewComment";

export default {
  name: "TrackActions",
  components: { EditReviewComment },
  props: {
    track: { type: Object, required: true },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
  },
  methods: {
    ...mapActions("tracks", ["destroy", "update"]),
    deleteTrack: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
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
