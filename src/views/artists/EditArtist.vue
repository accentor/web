<template>
  <VContainer class="fill-height" fluid v-if="artist">
    <ArtistForm :artist="artist" />
  </VContainer>
</template>

<script>
import { mapState } from "pinia";
import ArtistForm from "../../components/ArtistForm.vue";
import { useArtistsStore } from "../../store/artists";

export default {
  name: "EditArtist",
  components: { ArtistForm },
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.artist?.name }) };
  },
  computed: {
    ...mapState(useArtistsStore, ["artists"]),
    artist: function () {
      return this.artists[this.$route.params.id];
    },
  },
};
</script>
