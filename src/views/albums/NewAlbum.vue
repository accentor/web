<template>
  <VContainer class="fill-height" fluid>
    <AlbumForm />
  </VContainer>
</template>

<script>
// @ts-nocheck
import AlbumForm from "../../components/AlbumForm.vue";

export default {
  name: "NewAlbum",
  components: { AlbumForm },
  head() {
    return { title: this.$t("music.album.new") };
  },
};
</script>
