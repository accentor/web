<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg
      :aspect-ratio="1"
      :src="artist.image500"
      v-if="artist.image500 && !imageUnavailable"
      @error="setImageUnavailable"
    />
    <VImg
      :aspect-ratio="1"
      :src="artist.image"
      v-else-if="artist.image"
      @error="setImageUnavailable"
    />
    <VImg
      :aspect-ratio="1"
      :src="artistSvgUrl"
      v-else
      class="grey lighten-3"
    />
    <VCardTitle class="d-block text-truncate" :title="artist.name">
      {{ artist.name }}
    </VCardTitle>
    <VCardActions>
      <ArtistActions :artist="artist" class="actions--sm-wide" />
    </VCardActions>
  </VCard>
</template>

<script>
import ArtistActions from "./ArtistActions.vue";
import artistSvgUrl from "@mdi/svg/svg/account-music.svg";

export default {
  name: "ArtistCard",
  components: { ArtistActions },
  props: {
    artist: { type: Object, required: true },
  },
  data() {
    return {
      imageUnavailable: false,
      artistSvgUrl,
    };
  },
  methods: {
    setImageUnavailable() {
      this.imageUnavailable = true;
    },
  },
};
</script>
