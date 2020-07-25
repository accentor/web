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
    <VMenu>
      <template v-slot:activator="{ on, attrs }">
        <VBtn class="ma-1" small icon v-bind="attrs" v-on="on">
          <VIcon>mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList>
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
                <VListItemTitle>Edit Track</VListItemTitle>
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
                <VListItemTitle>Delete Track</VListItemTitle>
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

export default {
  name: "TrackActions",
  components: { EditReviewComment },
  props: {
    track: { type: Object, required: true },
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

<style lang="scss" scoped>
.flip-icon-leave {
  transform: none;
}

.flip-icon-leave-active {
  transition-duration: 750ms;
  transition-property: transform;
  transition-timing-function: ease-in;
}

.flip-icon-leave-to {
  transform: rotate(0.5turn);
}
</style>
