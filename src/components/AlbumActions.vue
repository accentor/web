<template>
  <span>
    <VBtn @click.stop.prevent="startTracks" color="primary" flat icon small>
      <VIcon>mdi-play</VIcon>
    </VBtn>
    <VBtn @click.stop.prevent="addTracks" color="success" flat icon small>
      <VIcon>mdi-plus</VIcon>
    </VBtn>
    <span v-if="isModerator">
      <VBtn
        :to="{ name: 'edit-album', params: { id: album.id } }"
        color="orange"
        flat
        icon
        small
      >
        <VIcon>mdi-pencil</VIcon>
      </VBtn>
      <VBtn
        @click.stop.prevent="deleteAlbum"
        color="red"
        flat
        href="#"
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

export default {
  name: "AlbumActions",
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
    ...mapActions("albums", ["destroy"]),
    deleteAlbum: function() {
      if (confirm("Are you sure?")) {
        this.destroy(this.album.id);
      }
    },
    startTracks: function() {
      this.$store.commit("player/playTracks", this.tracks);
    },
    addTracks: function() {
      this.$store.commit("player/addTracks", this.tracks);
    }
  }
};
</script>
