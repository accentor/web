<template>
  <div>
    <span v-for="aa of album.album_artists" :key="`${aa.artist_id} ${aa.name}`"
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
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>
