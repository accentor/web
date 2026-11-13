<template>
  <VCard class="pa-2" :to="{ name: 'tracks-stats', query: route.query }">
    <VCardTitle> {{ title }}</VCardTitle>
    <TopList :list-data="topTracks" :show-length="useTrackLength" />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PlayStat } from "@accentor/api-client-js";
import TopList from "@/components/TopList.vue";
import { useTracksStore } from "@/store/tracks";
import { useRoute } from "vue-router";
import { buildTopTracks } from "@/util";

const route = useRoute();
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
  buildTopTracks(props.playStats, tracksStore.tracks, {
    sortBy: useProp.value,
    limit: 10,
  }),
);
</script>
