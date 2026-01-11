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

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useGenresStore } from "@/store/genres";
import { compareStrings } from "@/util";

interface Props {
  track: { genre_ids: number[] };
}

const props = defineProps<Props>();
const { genres } = storeToRefs(useGenresStore());

const trackGenres = computed(() => {
  return props.track.genre_ids
    .filter((genreId) => `${genreId}` in genres.value)
    .map((genreId) => genres.value[`${genreId}`]!)
    .sort((g1, g2) => compareStrings(g1.normalized_name, g2.normalized_name));
});
</script>
