<template>
  <VContainer class="fill-height" fluid>
    <vue-headful :title="$t('music.album.new') + ' | Accentor'" />
    <AlbumForm />
  </VContainer>
</template>

<script>
import AlbumForm from "../../components/AlbumForm";

export default {
  name: "NewAlbum",
  components: { AlbumForm },
};
</script>
