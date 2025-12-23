<template>
  <span class="actions">
    <VBtn
      :to="{
        name: 'stats',
        query: { artist_id: artist.id },
      }"
      color="primary"
      class="actions__button"
      text
      icon
      small
      v-if="extended"
    >
      <VIcon>mdi-chart-bar</VIcon>
    </VBtn>
    <AddToPlaylist :item="artist" type="artist" />
    <EditReviewComment :item="artist" :update="flag" />
    <VTooltip bottom :disabled="!waitingForReload" v-if="isModerator">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{
              name: 'edit-artist',
              params: { id: artist.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="edit"
            class="actions__button"
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
          <ArtistMergeDialog :artist="artist" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload" v-if="isModerator">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="deleteArtist"
            :disabled="waitingForReload"
            color="danger"
            class="actions__button mr-0"
            href="#"
            text
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
import { mapActions, mapState } from "vuex";
import { mapState as mapPiniaState } from "pinia";
import EditReviewComment from "./EditReviewComment.vue";
import ArtistMergeDialog from "./ArtistMergeDialog.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
import { useAuthStore } from "../store/auth";

export default {
  name: "ArtistActions",
  components: { AddToPlaylist, ArtistMergeDialog, EditReviewComment },
  props: {
    artist: {
      type: Object,
      required: true,
    },
    extended: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapPiniaState(useAuthStore, ["isModerator"]),
    ...mapState("artists", ["startLoading"]),
    waitingForReload() {
      return this.startLoading > this.artist.loaded;
    },
  },
  methods: {
    ...mapActions("artists", ["destroy", "update"]),
    deleteArtist: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.artist.id);
      }
    },
    flag(id, reviewComment) {
      return this.update({
        id,
        newArtist: { review_comment: reviewComment },
      });
    },
  },
};
</script>
