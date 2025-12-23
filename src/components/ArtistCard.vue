<template>
  <VCard :to="{ name: 'artist', params: { id: artist.id } }">
    <VImg
      v-if="artist.image500 && !imageUnavailable"
      :aspect-ratio="1"
      :src="artist.image500"
      @error="setImageUnavailable"
    />
    <VImg
      v-else-if="artist.image"
      :aspect-ratio="1"
      :src="artist.image"
      @error="setImageUnavailable"
    />
    <VImg
      v-else
      :aspect-ratio="1"
      :src="require('@mdi/svg/svg/account-music.svg')"
      class="bg-grey-lighten-3"
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

export default {
  name: "ArtistCard",
  components: { ArtistActions },
  props: {
    artist: { type: Object, required: true },
  },
  data() {
    return {
      imageUnavailable: false,
    };
  },
  methods: {
    setImageUnavailable() {
      this.imageUnavailable = true;
    },
  },
};
</script>
