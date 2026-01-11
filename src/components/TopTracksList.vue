<template>
  <VCard class="pa-2">
    <VCardTitle> {{ title }}</VCardTitle>
    <TopList :list-data="listData" :show-length="useTrackLength" />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PlayStat } from "@accentor/api-client-js";
import TopList from "@/components/TopList.vue";
import { useTracksStore } from "@/store/tracks";

const tracksStore = useTracksStore();

interface Props {
  playStats: PlayStat[];
  title: string;
  useTrackLength?: boolean;
}

const props = withDefaults(defineProps<Props>(), { useTrackLength: false });
const useProp = computed(() =>
  props.useTrackLength ? ("total_length" as const) : ("count" as const),
);
const topTracks = computed(() =>
  [...props.playStats]
    .sort((t1, t2) => t2[useProp.value] - t1[useProp.value])
    .slice(0, 10),
);
const listData = computed(() =>
  [...topTracks.value].map((tt) => {
    const track = tracksStore.tracks[tt.track_id];
    const trackArtists = (track?.track_artists || [])
      .filter((a) => !a.hidden)
      .sort((a1, a2) => a1.order - a2.order)
      .map((a) => a.name)
      .join(" / ");
    const label = `${trackArtists} - ${track?.title}`;
    return { count: tt[useProp.value], label };
  }),
);
</script>
