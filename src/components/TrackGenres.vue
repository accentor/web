<template>
  <div v-if="genres">
    <span v-for="tg of track_genres" :key="tg.id">
      <RouterLink :to="{ name: 'genre', params: { id: tg.id } }">
        {{ tg.name }}
      </RouterLink>
      <span v-if="track_genres.indexOf(tg) !== track_genres.length - 1">
        /
      </span>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { compareStrings } from "../comparators";

export default {
  name: "TrackGenres",
  props: {
    track: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("genres", ["genres"]),
    track_genres() {
      return this.track.genre_ids
        .filter((tg) => this.genres.hasOwnProperty(`${tg}`))
        .map((tg) => this.genres[tg])
        .sort((g1, g2) => {
          return compareStrings(g1.normalized_name, g2.normalized_name);
        });
    },
  },
};
</script>
