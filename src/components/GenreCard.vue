<template>
  <VCard :to="{ name: 'genre', params: { id: genre.id } }">
    <VCardTitle class="pt-5">
      {{ genre.name }}
    </VCardTitle>
    <VCardActions>
      <GenreActions :genre="genre" />
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import type { Genre } from "@accentor/api-client-js";
import GenreActions from "./GenreActions.vue";

defineProps<{ genre: Genre }>();
</script>
