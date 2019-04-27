<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg :aspect-ratio="1" :src="artist.image" v-if="artist.image" />
    <VCardTitle primary-title>
      <h3>{{ artist.name }}</h3>
    </VCardTitle>
    <VCardActions>
      <ArtistActions :artist="artist" />
    </VCardActions>
  </VCard>
</template>

<script>
import ArtistActions from "./ArtistActions";
import { mapGetters } from "vuex";

export default {
  name: "ArtistCard",
  components: { ArtistActions },
  props: {
    artist: { type: Object }
  },
  computed: {
    ...mapGetters("auth", ["isModerator"])
  }
};
</script>
