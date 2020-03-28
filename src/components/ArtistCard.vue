<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg :aspect-ratio="1" :src="artist.image500" v-if="artist.image500" />
    <VImg :aspect-ratio="1" :src="artist.image" v-else-if="artist.image" />
    <VImg
      :aspect-ratio="1"
      :src="require('../assets/svg/account-music.svg')"
      v-else
      class="grey lighten-3"
    />
    <VCardTitle class="clamp clamp-2 pb-0 mb-4 h-6 minh-6">
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
    artist: { type: Object },
  },
};
</script>
