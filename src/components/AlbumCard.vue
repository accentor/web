<template>
  <VCard :to="{ name: 'album', params: { id: album.id } }">
    <VImg
      :aspect-ratio="1"
      :src="album.image500"
      v-if="album.image500 && !imageUnavailable"
      @error="setImageUnavailable"
    />
    <VImg
      :aspect-ratio="1"
      :src="album.image"
      v-else-if="album.image && !imageUnavailable"
      @error="setImageUnavailable"
    />
    <VImg
      :aspect-ratio="1"
      :src="require('@mdi/svg/svg/album.svg')"
      v-else
      class="grey lighten-3"
    />
    <VCardTitle class="pb-0 d-block text-truncate" :title="full_title">
      {{ album.title }}&nbsp;
      <span
        v-if="
          album.edition_description !== null && album.edition_description.length
        "
        class="grey--text"
      >
        ({{ album.edition_description }})
      </span>
    </VCardTitle>
    <VCardText>
      <AlbumArtists :album="album" :truncate="true" />
    </VCardText>
    <VCardText>
      <div class="grey--text">{{ album.release }}</div>
      <div v-if="labelForCatNr" class="grey--text">
        {{ catalogueNumber || $t("music.label.catalogue-number-none") }}
      </div>
    </VCardText>
    <VCardActions>
      <AlbumActions :album="album" class="actions--sm-wide" />
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
      required: true,
    },
    labelForCatNr: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      imageUnavailable: false,
    };
  },
  computed: {
    catalogueNumber() {
      if (this.labelForCatNr) {
        return this.album.album_labels.find(
          (al) => al.label_id === this.labelForCatNr.id
        ).catalogue_number;
      } else {
        return undefined;
      }
    },
    full_title() {
      let full_title = this.album.title;
      if (this.album.edition_description) {
        full_title += ` ${this.album.edition_description}`;
      }
      return full_title;
    },
  },
  methods: {
    setImageUnavailable() {
      this.imageUnavailable = true;
    },
  },
};
</script>
