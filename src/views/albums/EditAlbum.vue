<template>
  <VContainer v-if="album" class="fill-height" fluid>
    <AlbumForm :album="album" />
  </VContainer>
</template>

<script>
import { mapState } from "pinia";
import AlbumForm from "../../components/AlbumForm.vue";
import { useAlbumsStore } from "../../store/albums";

export default {
  name: "EditAlbum",
  components: { AlbumForm },
  head() {
    return { title: this.$t("page-titles.edit", { obj: this.album?.title }) };
  },
  computed: {
    ...mapState(useAlbumsStore, ["albums"]),
    album: function () {
      return this.albums[this.$route.params.id];
    },
  },
};
</script>
