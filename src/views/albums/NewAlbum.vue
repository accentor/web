<template>
  <VContainer class="fill-height" fluid>
    <AlbumForm />
  </VContainer>
</template>

<script>
import AlbumForm from "../../components/AlbumForm.vue";

export default {
  name: "NewAlbum",
  metaInfo() {
    return { title: this.$t("music.album.new") };
  },
  components: { AlbumForm },
};
</script>
