<template>
  <VContainer class="fill-height" fluid v-if="playlist">
    <PlaylistForm :playlist="playlist" />
  </VContainer>
</template>

<script>
import { mapState } from "pinia";
import PlaylistForm from "../../components/PlaylistForm.vue";
import { usePlaylistsStore } from "../../store/playlists";

export default {
  name: "EditPlaylist",
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.playlist.name }) };
  },
  components: { PlaylistForm },
  computed: {
    ...mapState(usePlaylistsStore, ["playlists"]),
    playlist: function () {
      return this.playlists[this.$route.params.id];
    },
  },
};
</script>
