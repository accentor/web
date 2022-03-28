<template>
  <VContainer class="fill-height" fluid>
    <PlaylistForm />
  </VContainer>
</template>

<script>
import PlaylistForm from "../../components/PlaylistForm";

export default {
  name: "NewPlaylist",
  metaInfo() {
    return { title: this.$t("music.playlist.new") };
  },
  components: { PlaylistForm },
};
</script>
