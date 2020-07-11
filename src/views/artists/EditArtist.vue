<template>
  <VContainer class="fill-height" fluid v-if="artist">
    <vue-headful
      :title="$t('page-titles.edit', { obj: artist.name }) + ' | Accentor'"
    />
    <ArtistForm :artist="artist" />
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import ArtistForm from "../../components/ArtistForm";

export default {
  name: "EditArtist",
  components: { ArtistForm },
  computed: {
    ...mapState("artists", ["artists"]),
    artist: function () {
      return this.artists[this.$route.params.id];
    },
  },
};
</script>
