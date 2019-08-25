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
      color="edit"
      class="ma-2"
      text
      icon
      small
    >
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VBtn
      @click.stop.prevent="deleteArtist"
      v-if="isModerator"
      color="danger"
      class="ma-2"
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
