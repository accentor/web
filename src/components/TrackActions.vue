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
    <EditReviewComment :item="track" :update="flag" v-if="!isModerator" />
    <VBtn
      class="ma-1"
      color="edit"
      small
      icon
      @click.stop="expanded = !expanded"
    >
      <VIcon v-if="expanded">mdi-arrow-expand-left</VIcon>
      <VIcon v-else>mdi-arrow-expand-right</VIcon>
    </VBtn>
    <VSlideXReverseTransition>
      <span v-show="expanded">
        <EditReviewComment :item="track" :update="flag" />
        <VBtn
          :to="{
            name: 'edit-track',
            params: { id: track.id },
            query: { redirect: $route.fullPath },
          }"
          :disabled="waitingForReload"
          color="edit"
          class="ma-1 flex-grow-0 flex-basis-auto"
          text
          icon
          small
        >
          <VIcon>mdi-pencil</VIcon>
        </VBtn>

        <VBtn
          @click.stop.prevent="deleteTrack"
          :disabled="waitingForReload"
          color="danger"
          class="ma-1 flex-grow-0 flex-basis-auto"
          text
          icon
          small
        >
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </span>
    </VSlideXReverseTransition>
  </span>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import EditReviewComment from "./EditReviewComment";

export default {
  name: "TrackActions",
  components: { EditReviewComment },
  props: {
    track: { type: Object, required: true },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("tracks", ["startLoading"]),
    waitingForReload() {
      return this.startLoading > this.track.loaded;
    },
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
