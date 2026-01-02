<template>
  <VContainer v-if="artist" class="fill-height" fluid>
    <ArtistForm :artist="artist" />
  </VContainer>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import ArtistForm from "../../components/ArtistForm.vue";
import { useArtistsStore } from "../../store/artists";

export default {
  name: "EditArtist",
  components: { ArtistForm },
  head() {
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
