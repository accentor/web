<template>
  <VCard :to="{ name: 'album', params: { id: album.id } }">
    <VImg :aspect-ratio="1" :src="album.image" v-if="album.image" />
    <VCardTitle primary-title>
      <div>
        <div class="headline">
          {{ album.title }}
          <span v-if="album.edition_description !== null" class="grey--text">
            ({{ album.edition_description }})
          </span>
        </div>
        <AlbumArtists :album="album" />
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
import AlbumArtists from "./AlbumArtists";

export default {
  name: "AlbumCard",
  components: { AlbumArtists, AlbumActions },
  props: {
    album: { type: Object }
  }
};
</script>
