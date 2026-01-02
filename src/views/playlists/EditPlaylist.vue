<template>
  <VContainer v-if="playlist" class="fill-height" fluid>
    <PlaylistForm :playlist="playlist" />
  </VContainer>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import PlaylistForm from "../../components/PlaylistForm.vue";
import { usePlaylistsStore } from "../../store/playlists";

export default {
  name: "EditPlaylist",
  components: { PlaylistForm },
  head() {
    return { title: this.$t("page-titles.edit", { obj: this.playlist.name }) };
  },
  computed: {
    ...mapState(usePlaylistsStore, ["playlists"]),
    playlist: function () {
      return this.playlists[this.$route.params.id];
    },
  },
};
</script>
