<template>
  <VCard class="pa-2">
    <VCardTitle class="break-word">{{ title }}</VCardTitle>
    <div class="ma-2">
      <svg viewBox="0 0 250 250">
        <circle
          cx="125"
          cy="125"
          r="100"
          fill="transparent"
          stroke="currentColor"
          stroke-width="30"
          :stroke-dasharray="circumference"
          class="text-grey-lighten-2"
        ></circle>
        <circle
          cx="125"
          cy="125"
          r="100"
          fill="transparent"
          stroke="currentColor"
          class="text-primary"
          stroke-width="30"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashOffset"
          transform="rotate(-90, 125, 125)"
        ></circle>
        <text x="130" y="125" text-anchor="middle" class="text-h6 percentage">
          {{ Math.round(data.animatedPercentage * 1000) / 10.0 }}%
        </text>
      </svg>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import type { PlayStat, Track } from "@accentor/api-client-js";
import { computed, ref, watch } from "vue";

interface Props {
  playStats: PlayStat[];
  tracks: Track[];
  title: string;
  useTrackLength?: boolean;
}

const circumference = 2 * Math.PI * 100;
const props = withDefaults(defineProps<Props>(), { useTrackLength: false });
const data = ref({ animatedPercentage: 0 });
const playedTracksInPeriod = computed(() =>
  props.playStats.map((p) => p.track_id),
);
const playedTracksLength = computed(() =>
  playedTracksInPeriod.value.reduce(
    (acc, cur) => acc + (props.tracks.find((t) => t.id === cur)?.length ?? 0),
    0,
  ),
);
const totalTracksLength = computed(() =>
  props.tracks.reduce((acc, cur) => acc + (cur.length ?? 0), 0),
);
const percentage = computed(() => {
  if (!props.tracks.length) {
    return 0;
  }

  const playsCount = props.useTrackLength
    ? playedTracksLength.value
    : playedTracksInPeriod.value.length;
  const tracksCount = props.useTrackLength
    ? totalTracksLength.value
    : props.tracks.length;
  return playsCount / tracksCount;
});
const strokeDashOffset = computed(() => {
  const strokeDiff = data.value.animatedPercentage * circumference;
  return circumference - strokeDiff;
});

watch(percentage, (newValue) =>
  gsap.to(data.value, { duration: 0.8, animatedPercentage: newValue }),
);
</script>

<style>
.percentage {
  fill: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}
</style>
