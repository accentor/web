<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg :aspect-ratio="1" :src="artist.image500" v-if="artist.image500" />
    <VImg :aspect-ratio="1" :src="artist.image" v-else-if="artist.image" />
    <VCardTitle class="pt-5">
      {{ artist.name }}
    </VCardTitle>
    <VCardActions>
      <ArtistActions :artist="artist" />
    </VCardActions>
  </VCard>
</template>

<script>
import ArtistActions from "./ArtistActions";

export default {
  name: "ArtistCard",
  components: { ArtistActions },
  props: {
    artist: { type: Object }
  }
};
</script>
