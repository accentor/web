<template>
  <span>
    <VBtn
      @click.stop.prevent="startTracks"
      color="primary"
      class="ma-2"
      text
      icon
      small
    >
      <VIcon>mdi-play</VIcon>
    </VBtn>
    <VBtn
      @click.stop.prevent="addTracks"
      color="success"
      class="ma-2"
      text
      icon
      small
    >
      <VIcon>mdi-plus</VIcon>
    </VBtn>
    <EditReviewComment :item="album" :update="flag" />
    <VBtn
      :to="{
        name: 'edit-album',
        params: { id: album.id },
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
      @click.stop.prevent="deleteAlbum"
      v-if="isModerator"
      color="danger"
      class="ma-2"
      text
      href="#"
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
  name: "AlbumActions",
  components: { EditReviewComment },
  props: {
    album: {}
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    tracks() {
      const getter = this.$store.getters["tracks/tracksFilterByAlbum"];
      return getter(this.album.id).map(t => t.id);
    }
  },
  methods: {
    ...mapActions("albums", ["destroy", "update"]),
    deleteAlbum: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.album.id);
      }
    },
    startTracks: function() {
      this.$store.commit("player/playTracks", this.tracks);
    },
    addTracks: function() {
      this.$store.commit("player/addTracks", this.tracks);
    },
    flag(id, reviewComment) {
      return this.update({
        id,
        newAlbum: { review_comment: reviewComment }
      });
    }
  }
};
</script>
