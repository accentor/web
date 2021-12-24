<template>
  <VCard class="px-2 py-4">
    <div class="text-center mb-4">
      <span class="text-subtitle d-block">
        {{ $t("stats.count.playCount.before") }}
      </span>
      <span class="text-h5 d-block">{{ Math.floor(animatedCount) }}</span>
      <span class="text-subtitle d-block">
        {{ $t("stats.count.playCount.after") }}
      </span>
    </div>
    <div class="text-center">
      <span class="text-subtitle d-block">
        {{ $t("stats.count.playTime.before") }}
      </span>
      <span class="text-h5 d-block">
        {{ Math.floor(animatedTime) | length }}
      </span>
      <span class="text-subtitle d-block">
        {{ $t("stats.count.playTime.after") }}
      </span>
    </div>
  </VCard>
</template>

<script>
import { mapState } from "vuex";
import { gsap } from "gsap";

export default {
  name: "PlayCountCard",
  props: {
    plays: {
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
      animatedCount: 0,
      animatedTime: 0,
    };
  },
  computed: {
    ...mapState("tracks", ["tracks"]),
    playCount() {
      return this.plays.length;
    },
    playTime() {
      return this.plays.reduce((acc, cur) => {
        return acc + (this.tracks[cur.track_id]?.length || 0);
      }, 0);
    },
  },
  watch: {
    playCount(newValue) {
      gsap.to(this.$data, { duration: 1.2, animatedCount: newValue });
    },
    playTime(newValue) {
      gsap.to(this.$data, { duration: 1.4, animatedTime: newValue });
    },
  },
};
</script>

<style></style>
