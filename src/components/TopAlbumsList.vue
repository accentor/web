<template>
  <VCard class="pa-2">
    <VRow>
      <VCol>
        <VCardTitle>{{ title }}</VCardTitle>
      </VCol>
      <VCol class="d-flex justify-end">
        <VSwitch
          v-model="useAverage"
          density="compact"
          hide-details
          :label="$t('stats.useAverage')"
          class="mr-4"
        />
      </VCol>
    </VRow>
    <TopList
      :list-data="listData"
      :show-length="!useAverage && useTrackLength"
    />
  </VCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { PlayStat } from "@accentor/api-client-js";
import albumSvgUrl from "@mdi/svg/svg/album.svg" with { type: "url" };
import { calcPlayCountForAlbums, calcPlayTimeForAlbums } from "@/reducers.ts";
import TopList from "@/components/TopList.vue";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";

const albumsStore = useAlbumsStore();
const tracksStore = useTracksStore();

interface Props {
  playStats: PlayStat[];
  title: string;
  useTrackLength?: boolean;
}

const props = withDefaults(defineProps<Props>(), { useTrackLength: false });
const useAverage = ref(true);

const topAlbums = computed(() =>
  Object.entries(
    props.useTrackLength
      ? calcPlayTimeForAlbums(
          props.playStats,
          tracksStore.tracks,
          useAverage.value,
        )
      : calcPlayCountForAlbums(
          props.playStats,
          tracksStore.tracks,
          useAverage.value,
        ),
  )
    .sort((a1, a2) => a2[1] - a1[1])
    .slice(0, 10),
);

const listData = computed(() =>
  [...topAlbums.value].map((tt) => {
    const album = albumsStore.albums[tt[0]];
    const albumArtists = [...(album?.album_artists || [])]
      .sort((a1, a2) => a2.order - a1.order)
      .reduce((acc, a) => {
        return `${acc}${a.name}${a.separator}`;
      }, "");
    return {
      count: tt[1],
      label: `${albumArtists} - ${album?.title}`,
      image: album?.image250 ?? albumSvgUrl,
    };
  }),
);
</script>
