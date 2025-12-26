<template>
  <VContainer class="fill-height" fluid v-if="album">
    <AlbumForm :album="album" />
  </VContainer>
</template>

<script>
import { mapState } from "pinia";
import AlbumForm from "../../components/AlbumForm.vue";
import { useAlbumsStore } from "../../store/albums";

export default {
  name: "EditAlbum",
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.album?.title }) };
  },
  components: { AlbumForm },
  computed: {
    ...mapState(useAlbumsStore, ["albums"]),
    album: function () {
      return this.albums[this.$route.params.id];
    },
  },
};
</script>
