<template>
  <VContainer v-if="artist" class="fill-height" fluid>
    <ArtistForm :artist="artist" />
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import ArtistForm from "@/components/ArtistForm.vue";
import { useArtistsStore } from "@/store/artists";
import i18n from "@/i18n";

const artistsStore = useArtistsStore();
const route = useRoute();
const artist = computed(() => {
  return artistsStore.artists[route.params.id as string];
});
const title = computed(() => {
  return i18n.global.t("page-titles.edit", { obj: artist.value?.name ?? "" });
});
useHead({ title });
</script>
