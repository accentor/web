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
  },
  data() {
    return {
      animatedPercentage: 0,
    };
  },
  computed: {
    playedTracksInPeriod() {
      const trackIds = this.plays.map((p) => p.track_id);
      return [...new Set(trackIds)].length;
    },
    circumference() {
      // 2πr
      return 2 * Math.PI * 100;
    },
    percentage() {
      return this.tracks.length
        ? (this.playedTracksInPeriod * 1.0) / this.tracks.length
        : 0;
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
