<template>
  <VCard :to="{ name: 'album', params: { id: album.id } }">
    <VImg :aspect-ratio="1" :src="album.image500" v-if="album.image500" />
    <VImg :aspect-ratio="1" :src="album.image" v-else-if="album.image" />
    <VCardTitle class="pb-0">
      {{ album.title }}&nbsp;
      <span v-if="album.edition_description !== null" class="grey--text">
        ({{ album.edition_description }})
      </span>
    </VCardTitle>
    <VCardText>
      <AlbumArtists :album="album" />
    </VCardText>
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
import AlbumArtists from "./AlbumArtists";

export default {
  name: "AlbumCard",
  components: { AlbumArtists, AlbumActions },
  props: {
    album: { type: Object }
  }
};
</script>
