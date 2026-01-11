<template>
  <VContainer v-if="artist" class="fill-height" fluid>
    <ArtistForm :artist="artist" />
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@unhead/vue";
import ArtistForm from "@/components/ArtistForm.vue";
import { useArtistsStore } from "@/store/artists";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const props = defineProps<{ id: string }>();

const artistsStore = useArtistsStore();
const artist = computed(() => artistsStore.artists[props.id]);
const title = computed(() =>
  I18n.t("page-titles.edit", { obj: artist.value?.name ?? "" }),
);
useHead({ title });
</script>
