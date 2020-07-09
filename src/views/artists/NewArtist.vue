<template>
  <VContainer class="fill-height" fluid>
    <vue-headful :title="$t('music.artist.new') + ' | Accentor'" />
    <ArtistForm />
  </VContainer>
</template>

<script>
import ArtistForm from "../../components/ArtistForm";

export default {
  name: "NewArtist",
  components: { ArtistForm },
};
</script>
