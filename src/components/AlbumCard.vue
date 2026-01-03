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
    <VCardTitle class="pb-0 d-block text-truncate" :title="fullTitle">
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
        {{ catalogueNumber || I18n.t("music.label.catalogue-number-none") }}
      </div>
    </VCardText>
    <VCardActions>
      <AlbumActions :album="album" />
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import type { Album, Label } from "@accentor/api-client-js";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import AlbumActions from "./AlbumActions.vue";
import AlbumArtists from "./AlbumArtists.vue";
import albumSvgUrl from "@mdi/svg/svg/album.svg" with { type: "url" };

const I18n = useI18n();

interface Props {
  album: Album & { loaded: Date };
  labelForCatNr?: Label;
}
const props = defineProps<Props>();

const imageUnavailable = ref<boolean>(false);
const catalogueNumber = computed<string | undefined>(() => {
  if (props.labelForCatNr) {
    const albumLabel = props.album.album_labels.find(
      (al) => al.label_id === props.labelForCatNr!.id,
    );
    return albumLabel?.catalogue_number ?? undefined;
  }
  return undefined;
});

const fullTitle = computed<string>(() => {
  let result = props.album.title;
  if (props.album.edition_description) {
    result += ` ${props.album.edition_description}`;
  }
  return result;
});

function setImageUnavailable(): void {
  imageUnavailable.value = true;
}
</script>
