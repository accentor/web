<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg
      v-if="artist.image500 && !imageUnavailable"
      cover
      :aspect-ratio="1"
      :src="artist.image500"
      @error="setImageUnavailable"
    />
    <VImg
      v-else-if="artist.image"
      cover
      :aspect-ratio="1"
      :src="artist.image"
      @error="setImageUnavailable"
    />
    <VImg
      v-else
      :aspect-ratio="1"
      :src="artistSvgUrl"
      class="bg-grey-lighten-3"
    />
    <VCardTitle class="d-block text-truncate" :title="artist.name">
      {{ artist.name }}
    </VCardTitle>
    <VCardActions>
      <ArtistActions :artist="artist" />
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Artist } from "@accentor/api-client-js";
import ArtistActions from "./ArtistActions.vue";
import artistSvgUrl from "@mdi/svg/svg/account-music.svg" with { type: "url" };
import type { Loaded } from "@/store/base.ts";

interface Props {
  artist: Loaded<Artist>;
}

defineProps<Props>();

const imageUnavailable = ref<boolean>(false);

function setImageUnavailable(): void {
  imageUnavailable.value = false;
}
</script>
