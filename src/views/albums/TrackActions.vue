<template>
  <span>
    <VBtn @click="startTrack" color="primary" dark fab outline small>
      <VIcon>mdi-play</VIcon>
    </VBtn>
    <span v-if="isModerator">
      <VBtn
        :to="{ name: 'edit-track', params: { id: track.id } }"
        color="orange"
        dark
        fab
        outline
        small
      >
        <VIcon>mdi-pencil</VIcon>
      </VBtn>
      <VBtn
        @click.stop.prevent="deleteTrack"
        color="red"
        dark
        fab
        href="#"
        outline
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
  name: "TrackActions",
  props: {
    track: {}
  },
  computed: {
    ...mapGetters("auth", ["isModerator"])
  },
  methods: {
    ...mapActions("tracks", ["destroy"]),
    deleteTrack: function() {
      if (confirm("Are you sure?")) {
        this.destroy(this.track.id);
      }
    },
    startTrack: function() {
      this.$store.commit("player/playTrack", this.track.id);
    }
  }
};
</script>
