<template>
  <span>
    <EditReviewComment :item="artist" :update="flag" />
    <VBtn
      :to="{
        name: 'edit-artist',
        params: { id: artist.id },
        query: { redirect: $route.fullPath }
      }"
      v-if="isModerator"
      color="orange"
      flat
      icon
      small
    >
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VBtn
      @click.stop.prevent="deleteArtist"
      v-if="isModerator"
      color="red"
      href="#"
      flat
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
  name: "ArtistActions",
  components: { EditReviewComment },
  props: {
    artist: {}
  },
  computed: {
    ...mapGetters("auth", ["isModerator"])
  },
  methods: {
    ...mapActions("artists", ["destroy", "update"]),
    deleteArtist: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.artist.id);
      }
    },
    flag(id, reviewComment) {
      return this.update({
        id,
        newArtist: { review_comment: reviewComment }
      });
    }
  }
};
</script>
