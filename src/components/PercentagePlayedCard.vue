<template>
  <VCard class="pa-2">
    <VCardTitle>{{ title }}</VCardTitle>
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
          class="grey--text text--lighten-2"
        ></circle>
        <circle
          cx="125"
          cy="125"
          r="100"
          fill="transparent"
          stroke="currentColor"
          class="primary--text"
          stroke-width="30"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashOffset"
          transform="rotate(-90, 125, 125)"
        ></circle>
        <text x="130" y="125" text-anchor="middle" class="text-h6">
          {{ Math.round(animatedPercentage * 1000) / 10.0 }}%
        </text>
      </svg>
    </div>
  </VCard>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "PercentagePlayedCard",
  props: {
    plays: {
      type: Array,
      required: true,
    },
    tracks: {
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
      animatedPercentage: 0,
    };
  },
  computed: {
    playedTracksInPeriod() {
      const trackIds = this.plays.map((p) => p.track_id);
      return [...new Set(trackIds)];
    },
    playedTracksLength() {
      return this.playedTracksInPeriod.reduce((acc, cur) => {
        return acc + (this.tracks.find((t) => t.id === cur)?.length || 0);
      }, 0);
    },
    totalTracksLength() {
      return this.tracks.reduce((acc, cur) => {
        return acc + cur.length;
      }, 0);
    },
    circumference() {
      // 2πr
      return 2 * Math.PI * 100;
    },
    percentage() {
      if (!this.tracks.length) {
        return 0;
      }

      const playsCount = this.useTrackLength
        ? this.playedTracksLength
        : this.playedTracksInPeriod.length;
      const tracksCount = this.useTrackLength
        ? this.totalTracksLength
        : this.tracks.length;
      return (1.0 * playsCount) / tracksCount;
    },
    strokeDashOffset() {
      const strokeDiff = this.animatedPercentage * this.circumference;
      return this.circumference - strokeDiff;
    },
  },
  watch: {
    percentage(newValue) {
      gsap.to(this.$data, { duration: 0.8, animatedPercentage: newValue });
    },
  },
};
</script>

<style></style>
