<template>
  <VContainer class="fill-height" fluid>
    <PlaylistForm />
  </VContainer>
</template>

<script>
import PlaylistForm from "../../components/PlaylistForm.vue";

export default {
  name: "NewPlaylist",
  components: { PlaylistForm },
  head() {
    return { title: this.$t("music.playlist.new") };
  },
};
</script>
