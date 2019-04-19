<template>
  <span>
    <VBtn @click="startTrack" color="primary" flat icon small>
      <VIcon>mdi-play</VIcon>
    </VBtn>
    <VBtn @click="addTrack" color="success" flat icon small>
      <VIcon>mdi-plus</VIcon>
    </VBtn>
    <span v-if="isModerator">
      <VBtn
        :to="{
          name: 'edit-track',
          params: { id: track.id },
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
        @click.stop.prevent="deleteTrack"
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
    },
    addTrack: function() {
      this.$store.commit("player/addTrack", this.track.id);
    }
  }
};
</script>
