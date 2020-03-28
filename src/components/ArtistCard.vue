<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg :aspect-ratio="1" :src="artist.image500" v-if="artist.image500" />
    <VImg :aspect-ratio="1" :src="artist.image" v-else-if="artist.image" />
    <VImg
      :aspect-ratio="1"
      :src="require('@mdi/svg/svg/account-music.svg')"
      v-else
      class="grey lighten-3"
    />
    <VCardTitle class="d-block text-truncate">
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

<style lang="scss" scoped>
.text-truncate:hover {
  white-space: normal !important;
}
</style>
