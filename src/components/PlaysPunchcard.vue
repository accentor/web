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

<script>
import { mapState } from "pinia";
import { calcPlayCountForHours, calcPlayTimeForHours } from "@/reducers";
import { useTracksStore } from "../store/tracks";

export default {
  name: "PlaysPunchcard",
  props: {
    plays: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    useTrackLength: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      yLabels: [
        this.$t("common.shortWeekdays.monday"),
        this.$t("common.shortWeekdays.tuesday"),
        this.$t("common.shortWeekdays.wednesday"),
        this.$t("common.shortWeekdays.thursday"),
        this.$t("common.shortWeekdays.friday"),
        this.$t("common.shortWeekdays.saturday"),
        this.$t("common.shortWeekdays.sunday"),
      ],
      xLabels: [0, 6, 12, 18, 24],
      isIntersecting: false,
    };
  },
  computed: {
    ...mapState(useTracksStore, ["tracks"]),
    binnedPlays() {
      const bin = this.useTrackLength
        ? calcPlayTimeForHours(this.plays, this.tracks)
        : calcPlayCountForHours(this.plays);
      return bin;
    },
    svgData() {
      const max = Math.max(...this.binnedPlays);
      const dots = [];
      this.binnedPlays.forEach((count, index) => {
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
    },
  },
  methods: {
    onIntersect(entries) {
      // We only have one entry (the `VCard`)
      // and simply check whether that is intersecting with the viewport
      this.isIntersecting = entries[0].isIntersecting;
    },
  },
};
</script>

<style lang="scss" scoped></style>
