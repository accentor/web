<template>
  <VContainer class="fill-height" fluid v-if="album">
    <vue-headful
      :title="$t('page-titles.edit', { obj: album.title }) + ' | Accentor'"
    />
    <AlbumForm :album="album" />
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import AlbumForm from "../..//components/AlbumForm";

export default {
  name: "EditAlbum",
  components: { AlbumForm },
  computed: {
    ...mapState("albums", ["albums"]),
    album: function () {
      return this.albums[this.$route.params.id];
    },
  },
};
</script>
