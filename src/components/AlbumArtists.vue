<template>
  <div
    v-if="albumArtists.length !== 0"
    :class="{ 'd-block text-truncate': truncate }"
    :title="title"
  >
    <span v-for="aa of albumArtists" :key="`${aa.artist_id} ${aa.name}`"
      ><RouterLink :to="{ name: 'artist', params: { id: aa.artist_id } }">{{
        aa.name
      }}</RouterLink
      >{{ aa.separator }}</span
    >
  </div>
  <div v-else>
    <span>{{ I18n.t("music.artist.various") }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Album } from "@accentor/api-client-js";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();

interface Props {
  album: Album;
  truncate?: boolean;
}

const props = withDefaults(defineProps<Props>(), { truncate: false });

const albumArtists = computed(() =>
  [...props.album.album_artists].sort((a1, a2) => a1.order - a2.order),
);
const title = computed(() =>
  albumArtists.value.reduce(
    (acc, cur) => `${acc}${cur.name}${cur.separator ?? ""}`,
    "",
  ),
);
</script>
