<template>
  <VCard :to="{ name: 'genre', params: { id: genre.id } }">
    <VCardTitle primary-title>
      <h3>{{ genre.name }}</h3>
    </VCardTitle>
    <VCardActions>
      <GenreActions :genre="genre" />
    </VCardActions>
  </VCard>
</template>

<script>
import GenreActions from "./GenreActions";

export default {
  name: "GenreCard",
  components: { GenreActions },
  props: {
    genre: { type: Object }
  }
};
</script>
