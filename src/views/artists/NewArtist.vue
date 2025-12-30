<template>
  <VContainer class="fill-height" fluid>
    <ArtistForm />
  </VContainer>
</template>

<script>
import ArtistForm from "../../components/ArtistForm.vue";

export default {
  name: "NewArtist",
  components: { ArtistForm },
  head() {
    return { title: this.$t("music.artist.new") };
  },
};
</script>
