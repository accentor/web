<template>
  <VCard class="pa-2">
    <VCardTitle> {{ I18n.t("stats.topTracks") }}</VCardTitle>
    <TopList
      :list-data="listData"
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
  [...playStats].sort((t1, t2) => t2[useProp.value] - t1[useProp.value]),
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
