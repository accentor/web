<template>
  <VCard :to="{ name: 'genre', params: { id: genre.id } }">
    <VCardTitle class="pt-5">
      {{ genre.name }}
    </VCardTitle>
    <VCardActions>
      <GenreActions :genre="genre" class="actions--sm-wide" />
    </VCardActions>
  </VCard>
</template>

<script>
import GenreActions from "./GenreActions.vue";

export default {
  name: "GenreCard",
  components: { GenreActions },
  props: {
    genre: { type: Object, required: true },
  },
};
</script>
