<template>
  <VCard :to="{ name: 'album', params: { id: album.id } }">
    <VImg :aspect-ratio="1" :src="album.image" v-if="album.image" />
    <VCardTitle primary-title>
      <div>
        <div class="headline">{{ album.title }}</div>
        <span>
          {{ album.album_artists | album_artists }}
        </span>
      </div>
    </VCardTitle>
    <VCardText>
      <span class="grey--text">
        {{ album.release }}
      </span>
    </VCardText>
    <VCardActions>
      <AlbumActions :album="album" />
    </VCardActions>
  </VCard>
</template>
<script>
import AlbumActions from "./AlbumActions";

export default {
  name: "AlbumCard",
  components: { AlbumActions },
  props: {
    album: { type: Object }
  }
};
</script>
