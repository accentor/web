<template>
  <VCard :to="{ name: 'genre', params: { id: genre.id } }">
    <VCardTitle class="pt-5">
      {{ genre.name }}
    </VCardTitle>
    <VCardActions>
      <GenreActions :genre="genre" class="sm:actions--wide" />
    </VCardActions>
  </VCard>
</template>

<script>
import GenreActions from "./GenreActions";

export default {
  name: "GenreCard",
  components: { GenreActions },
  props: {
    genre: { type: Object, required: true },
  },
};
</script>
