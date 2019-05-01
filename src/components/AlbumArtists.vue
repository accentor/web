<template>
  <div>
    <span v-for="aa of album_artists" :key="`${aa.artist_id} ${aa.name}`"
      ><RouterLink :to="{ name: 'artist', params: { id: aa.artist_id } }">{{
        aa.name
      }}</RouterLink
      >{{ aa.separator }}</span
    >
  </div>
</template>
<script>
export default {
  name: "AlbumArtists",
  props: {
    album: {}
  },
  computed: {
    album_artists() {
      return this.album.album_artists
        .map(aa => aa)
        .sort((a1, a2) => a1.order - a2.order);
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>
