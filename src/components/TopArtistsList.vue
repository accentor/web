<template>
  <VCard class="pa-2">
    <VCardTitle>{{ title }}</VCardTitle>
    <TopList :list-data="listData" :show-length="useTrackLength" />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PlayStat } from "@accentor/api-client-js";
import artistSvgUrl from "@mdi/svg/svg/account-music.svg" with { type: "url" };
import { calcPlayStatsForArtists } from "@/reducers.ts";
import TopList from "@/components/TopList.vue";
import { useArtistsStore } from "@/store/artists";
import { useTracksStore } from "@/store/tracks";

const artistsStore = useArtistsStore();
const tracksStore = useTracksStore();

interface Props {
  playStats: PlayStat[];
  title: string;
  useTrackLength?: boolean;
}

const props = withDefaults(defineProps<Props>(), { useTrackLength: false });

const topArtists = computed(() =>
  Object.entries(
    calcPlayStatsForArtists(
      props.playStats,
      tracksStore.tracks,
      props.useTrackLength,
    ),
  )
    .sort((t1, t2) => t2[1] - t1[1])
    .slice(0, 10),
);

const listData = computed(() =>
  [...topArtists.value].map((tt) => {
    const artist = artistsStore.artists[tt[0]];
    return {
      count: tt[1],
      label: artist?.name ?? "",
      image: artist?.image250 ?? artistSvgUrl,
    };
  }),
);
</script>
