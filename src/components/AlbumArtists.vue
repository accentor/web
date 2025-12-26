<template>
  <div
    v-if="album_artists.length !== 0"
    :class="{ 'd-block text-truncate': truncate }"
    :title="title"
  >
    <span v-for="aa of album_artists" :key="`${aa.artist_id} ${aa.name}`"
      ><RouterLink :to="{ name: 'artist', params: { id: aa.artist_id } }">{{
        aa.name
      }}</RouterLink
      >{{ aa.separator }}</span
    >
  </div>
  <div v-else>
    <span>{{ $t("music.artist.various") }}</span>
  </div>
</template>

<script>
export default {
  name: "AlbumArtists",
  props: {
    album: {
      type: Object,
      required: true,
    },
    truncate: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    album_artists() {
      return [...this.album.album_artists].sort(
        (a1, a2) => a1.order - a2.order,
      );
    },
    title() {
      return this.album_artists.reduce(
        (acc, cur) => `${acc}${cur.name}${cur.separator ?? ""}`,
        "",
      );
    },
  },
};
</script>
