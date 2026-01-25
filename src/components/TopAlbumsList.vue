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
          :label="I18n.t('stats.useAverage')"
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
import type { PlayStat, Track } from "@accentor/api-client-js";
import albumSvgUrl from "@mdi/svg/svg/album.svg" with { type: "url" };
import TopList from "@/components/TopList.vue";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const albumsStore = useAlbumsStore();
const tracksStore = useTracksStore();

interface Props {
  playStats: PlayStat[];
  title: string;
  useTrackLength?: boolean;
}

const props = withDefaults(defineProps<Props>(), { useTrackLength: false });
const useAverage = ref(true);

function calcPlayTimeForAlbums(
  playStats: { total_length: number; track_id: number }[],
  tracks: Record<string, Track>,
  useAverage = false,
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const stat of playStats) {
    const album_id = tracks[stat.track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(`${album_id}` in acc)) {
      acc[`${album_id}`] = stat.total_length;
    } else {
      acc[`${album_id}`]! += stat.total_length;
    }
  }

  if (useAverage) {
    const arr = Object.values(tracks);
    for (const album_id in acc) {
      const totalLength = arr
        .filter((t) => `${t.album_id}` === album_id)
        .reduce((a, b) => a + (b.length ?? 0), 0);
      // Since we can't divide by zero, we set albums without any trackLengths to 0
      acc[album_id] = totalLength === 0 ? 0 : acc[album_id]! / totalLength;
    }
  }
  return acc;
}

function calcPlayCountForAlbums(
  playStats: { count: number; track_id: number }[],
  tracks: Record<string, Track>,
  useAverage = false,
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const stat of playStats) {
    const album_id = tracks[stat.track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(`${album_id}` in acc)) {
      acc[`${album_id}`] = stat.count;
    } else {
      acc[`${album_id}`]! += stat.count;
    }
  }

  if (useAverage) {
    const arr = Object.values(tracks);
    for (const album_id in acc) {
      const nrOfTracks = arr.filter((t) => `${t.album_id}` === album_id).length;
      acc[album_id] = acc[album_id]! / nrOfTracks;
    }
  }
  return acc;
}

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
      .sort((a1, a2) => a1.order - a2.order)
      .reduce((acc, a) => {
        return `${acc}${a.name}${a.separator ?? ""}`;
      }, "");
    return {
      count: tt[1],
      label: `${albumArtists} - ${album?.title}`,
      image: album?.image250 ?? albumSvgUrl,
    };
  }),
);
</script>
