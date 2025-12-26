<template>
  <VCard :to="{ name: 'album', params: { id: album.id } }">
    <VImg
      v-if="album.image500 && !imageUnavailable"
      :aspect-ratio="1"
      :src="album.image500"
      @error="setImageUnavailable"
    />
    <VImg
      v-else-if="album.image && !imageUnavailable"
      :aspect-ratio="1"
      :src="album.image"
      @error="setImageUnavailable"
    />
    <VImg
      v-else
      :aspect-ratio="1"
      :src="albumSvgUrl"
      class="bg-grey-lighten-3"
    />
    <VCardTitle class="pb-0 d-block text-truncate" :title="full_title">
      {{ album.title }}&nbsp;
      <span v-if="album.edition_description !== null" class="text-grey">
        ({{ album.edition_description }})
      </span>
    </VCardTitle>
    <VCardText>
      <AlbumArtists :album="album" :truncate="true" />
    </VCardText>
    <VCardText>
      <div class="text-grey">{{ album.release }}</div>
      <div v-if="labelForCatNr" class="text-grey">
        {{ catalogueNumber || $t("music.label.catalogue-number-none") }}
      </div>
    </VCardText>
    <VCardActions>
      <AlbumActions :album="album" class="actions--sm-wide" />
    </VCardActions>
  </VCard>
</template>
<script>
import AlbumActions from "./AlbumActions.vue";
import AlbumArtists from "./AlbumArtists.vue";
import albumSvgUrl from "@mdi/svg/svg/album.svg";

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
      default: null,
    },
  },
  data() {
    return {
      imageUnavailable: false,
      albumSvgUrl,
    };
  },
  computed: {
    catalogueNumber() {
      if (this.labelForCatNr) {
        return this.album.album_labels.find(
          (al) => al.label_id === this.labelForCatNr.id,
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
