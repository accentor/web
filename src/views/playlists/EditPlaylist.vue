<template>
  <VContainer v-if="playlist" class="fill-height" fluid>
    <PlaylistForm :playlist="playlist" />
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import PlaylistForm from "../../components/PlaylistForm.vue";

export default {
  name: "EditPlaylist",
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.playlist.name }) };
  },
  components: { PlaylistForm },
  computed: {
    ...mapState("playlists", ["playlists"]),
    playlist: function () {
      return this.playlists[this.$route.params.id];
    },
  },
};
</script>
