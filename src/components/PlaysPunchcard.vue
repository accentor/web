<template>
  <VCard v-intersect="onIntersect" class="pa-2">
    <VCardTitle>{{ title }}</VCardTitle>
    <!-- 
    The viewbox represents:
    24 * 22 (For the dots) + 30 (for the y-axis) + 11 (for the final x-axis label)
    by
    7 * 22 (for the dots) + 10 (for the x-axis)
    -->
    <svg v-if="isIntersecting" viewBox="0 0 569 174" class="mx-4 mt-1">
      <!-- Offset 11 (half dot) + 1 (to visually center) -->
      <g y-axis transform="translate(0,12)">
        <text
          v-for="(label, index) in yLabels"
          :key="label"
          class="text-grey-darken-2 text-caption"
          fill="currentColor"
          x="28"
          :y="2 + 22 * index"
          text-anchor="end"
        >
          {{ label }}
        </text>
      </g>
      <!-- Offset 40 (for y axis) by 176 (area for dots) -->
      <g x-axis transform="translate(30,164)">
        <text
          v-for="(hour, index) in xLabels"
          :key="hour"
          :x="hour * 22"
          y="5"
          :text-anchor="
            index === 0
              ? 'start'
              : index === xLabels.length - 1
                ? 'end'
                : 'middle'
          "
          fill="currentColor"
          class="text-grey-darken-2 text-caption"
        >
          {{ hour }}
        </text>
      </g>
      <!-- Move all dots to the appropriate area: offset for y axis and half dot in each direction -->
      <g transform="translate(41,11)">
        <circle
          v-for="(dot, index) in svgData"
          :key="index"
          class="text-primary-darken-1"
          :cx="dot.cx"
          :cy="dot.cy"
          :r="dot.r"
          fill="currentColor"
        />
      </g>
    </svg>
  </VCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Play, Track } from "@accentor/api-client-js";
import { useTracksStore } from "@/store/tracks";
import i18n from "@/i18n";

const tracksStore = useTracksStore();

interface Props {
  plays: Play[];
  title: string;
  useTrackLength?: boolean;
}

const props = withDefaults(defineProps<Props>(), { useTrackLength: false });

function calcPlayCountForHours(plays: Play[]): number[] {
  const acc: number[] = new Array(168).fill(0);
  for (const play of plays) {
    const playedAt = new Date(play.played_at);
    const day = playedAt.getDay();
    const hour = playedAt.getHours();
    acc[day * 24 + hour]!++;
  }
  // Put sunday last
  acc.push(...acc.splice(0, 24));
  return acc;
}

function calcPlayTimeForHours(
  plays: Play[],
  tracks: Record<string, Track>,
): number[] {
  const binnedByTrack: Record<string, Play[]> = {};
  for (const play of plays) {
    if (!binnedByTrack[`${play.track_id}`]) {
      binnedByTrack[`${play.track_id}`] = [play];
    } else {
      binnedByTrack[`${play.track_id}`]!.push(play);
    }
  }

  const acc = new Array(168).fill(0);
  for (const track_id in binnedByTrack) {
    const length = tracks[track_id]?.length ?? 0;
    for (const play of binnedByTrack[track_id]!) {
      const playedAt = new Date(play.played_at);
      const day = playedAt.getDay();
      const hour = playedAt.getHours();
      acc[day * 24 + hour] += length;
    }
  }
  // Put sunday last
  acc.push(...acc.splice(0, 24));
  return acc;
}

const binnedPlays = computed(() =>
  props.useTrackLength
    ? calcPlayTimeForHours(props.plays, tracksStore.tracks)
    : calcPlayCountForHours(props.plays),
);

const svgData = computed(() => {
  const max = Math.max(...binnedPlays.value);
  const dots: { cx: number; cy: number; r: number }[] = [];
  binnedPlays.value.forEach((count, index) => {
    // We only want to keep/render all the hours where there is at least one play
    if (count) {
      // The radius of each dot ranges between 1 and 11
      const radius =
        Math.ceil((Math.sqrt(count) / Math.sqrt(max)) * 10000) / 1000 + 1;
      dots.push({
        cx: 22 * (index % 24),
        cy: 22 * Math.floor(index / 24),
        r: radius,
      });
    }
  });
  return dots;
});

const yLabels = [
  i18n.global.t("common.shortWeekdays.monday"),
  i18n.global.t("common.shortWeekdays.tuesday"),
  i18n.global.t("common.shortWeekdays.wednesday"),
  i18n.global.t("common.shortWeekdays.thursday"),
  i18n.global.t("common.shortWeekdays.friday"),
  i18n.global.t("common.shortWeekdays.saturday"),
  i18n.global.t("common.shortWeekdays.sunday"),
];

const xLabels = [0, 6, 12, 18, 24];
const isIntersecting = ref(false);
function onIntersect(newIsIntersecting: boolean): void {
  isIntersecting.value = newIsIntersecting;
}
</script>
