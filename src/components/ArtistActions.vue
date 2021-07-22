<template>
  <span class="actions">
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
import { mapActions, mapGetters, mapState } from "vuex";
import EditReviewComment from "./EditReviewComment";
import ArtistMergeDialog from "./ArtistMergeDialog";

export default {
  name: "ArtistActions",
  components: { ArtistMergeDialog, EditReviewComment },
  props: {
    artist: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
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
