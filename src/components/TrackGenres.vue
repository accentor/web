<template>
  <div v-if="genres">
    <span v-for="tg of trackGenres" :key="tg.id">
      <RouterLink :to="{ name: 'genre', params: { id: tg.id } }">
        {{ tg.name }}
      </RouterLink>
      <span v-if="trackGenres.indexOf(tg) !== trackGenres.length - 1"> / </span>
    </span>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { compareStrings } from "../comparators";
import { useGenresStore } from "../store/genres";

export default {
  name: "TrackGenres",
  props: {
    track: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useGenresStore, ["genres"]),
    trackGenres() {
      return this.track.genre_ids
        .filter((tg) => `${tg}` in this.genres)
        .map((tg) => this.genres[tg])
        .sort((g1, g2) => {
          return compareStrings(g1.normalized_name, g2.normalized_name);
        });
    },
  },
};
</script>
