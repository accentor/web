<template>
  <VCard class="pa-2">
    <VCardTitle> {{ I18n.t("stats.topTracks") }}</VCardTitle>
    <TopList
      :list-data="topTracks"
      :show-length="useTrackLength"
      :paginate="true"
    />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TopList from "@/components/TopList.vue";
import { type Play, type PlayStat, type Track } from "@accentor/api-client-js";
import { useI18n } from "vue-i18n";
import { useTracksStore } from "@/store/tracks";
import { buildTopTracks } from "@/util";

const I18n = useI18n();
const tracksStore = useTracksStore();

const { playStats, useTrackLength } = defineProps<{
  playStats: PlayStat[];
  useTrackLength: boolean;
  tracks: Track[];
  plays: Play[];
  artistName: string | null;
}>();

const useProp = computed(() =>
  useTrackLength ? ("total_length" as const) : ("count" as const),
);

const topTracks = computed(() =>
  buildTopTracks(playStats, tracksStore.tracks, { sortBy: useProp.value }),
);
</script>
