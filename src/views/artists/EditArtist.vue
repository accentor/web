<template>
  <VContainer v-if="artist" class="fill-height" fluid>
    <ArtistForm :artist="artist" />
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import ArtistForm from "../../components/ArtistForm.vue";

export default {
  name: "EditArtist",
  components: { ArtistForm },
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.artist?.name }) };
  },
  computed: {
    ...mapState("artists", ["artists"]),
    artist: function () {
      return this.artists[this.$route.params.id];
    },
  },
};
</script>
