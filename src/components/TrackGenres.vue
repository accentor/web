<template>
  <div v-if="genres">
    <span v-for="genre_id of track.genre_ids" :key="genre_id">
      <RouterLink :to="{ name: 'genre', params: { id: genre_id } }">
        {{ genres[genre_id].name }}
      </RouterLink>
      <span
        v-if="track.genre_ids.indexOf(genre_id) !== track.genre_ids.length - 1"
      >
        /
      </span>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TrackGenres",
  props: {
    track: {}
  },
  computed: {
    ...mapState("genres", ["genres"])
  }
};
</script>
