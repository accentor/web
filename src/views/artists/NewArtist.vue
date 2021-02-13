<template>
  <VContainer class="fill-height" fluid>
    <ArtistForm />
  </VContainer>
</template>

<script>
import ArtistForm from "../../components/ArtistForm";

export default {
  name: "NewArtist",
  components: { ArtistForm },
  metaInfo() {
    return { title: this.$t("music.artist.new") };
  },
};
</script>
