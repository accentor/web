<template>
  <span>
    <EditReviewComment :item="artist" :update="flag" />
    <span v-if="isModerator">
      <VBtn
        :to="{
          name: 'edit-artist',
          params: { id: artist.id },
          query: { redirect: $route.fullPath }
        }"
        color="orange"
        flat
        icon
        small
      >
        <VIcon>mdi-pencil</VIcon>
      </VBtn>
      <VBtn
        @click.stop.prevent="deleteArtist"
        color="red"
        href="#"
        flat
        icon
        small
      >
        <VIcon>mdi-delete</VIcon>
      </VBtn>
    </span>
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
      if (confirm("Are you sure?")) {
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
