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
      <div class="grey--text">{{ album.release }}</div>
      <div v-if="labelForCatNr" class="grey--text">
        {{ catalogueNumber }}
      </div>
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
    album: {
      type: Object,
      required: true
    },
    labelForCatNr: {
      type: Object,
      required: false
    }
  },
  computed: {
    catalogueNumber() {
      if (this.labelForCatNr) {
        return this.album.album_labels.find(
          al => al.label_id === this.labelForCatNr.id
        ).catalogue_number;
      } else {
        return this.$t("music.label.catalogue-number-none");
      }
    }
  }
};
</script>
