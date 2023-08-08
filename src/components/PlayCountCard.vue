<template>
  <VCard class="px-2 py-4">
    <div
      class="text-center mb-4 text-h6 font-weight-regular grey--text text--darken-3"
    >
      {{ $t("stats.count.playCount.before") }}
      <span
        class="text-h4 d-block"
        :class="animatedCount ? 'primary--text' : 'grey--text text--darken-1'"
      >
        {{ Math.floor(animatedCount) }}
      </span>
      {{ $t("stats.count.playCount.after") }}
    </div>
    <div class="text-center text-h6 font-weight-regular">
      {{ $t("stats.count.playTime.before") }}
      <div class="play-time grey--text text--darken-3">
        <span
          class="text-h4 d-block text-right text--darken-1"
          :class="animatedTime.days ? 'primary--text' : 'grey--text'"
        >
          {{ Math.floor(animatedTime.days) }}
        </span>
        <span class="text-subtitle-1 text-left">
          {{ $tc("stats.count.playTime.days", Math.floor(animatedTime.days)) }}
        </span>
        <span
          class="text-h4 d-block text-right text--darken-1"
          :class="
            animatedTime.days + animatedTime.hours
              ? 'primary--text'
              : 'grey--text'
          "
        >
          {{ Math.floor(animatedTime.hours) }}
        </span>
        <span class="text-subtitle-1 text-left">
          {{
            $tc("stats.count.playTime.hours", Math.floor(animatedTime.hours))
          }}
        </span>
        <span
          class="text-h4 d-block text-right text--darken-1"
          :class="
            animatedTime.days + animatedTime.hours + animatedTime.minutes
              ? 'primary--text'
              : 'grey--text'
          "
        >
          {{ Math.floor(animatedTime.minutes) }}
        </span>
        <span class="text-subtitle-1 text-left">
          {{
            $tc(
              "stats.count.playTime.minutes",
              Math.floor(animatedTime.minutes),
            )
          }}
        </span>
      </div>
      {{ $t("stats.count.playTime.after") }}
    </div>
  </VCard>
</template>

<script>
import { mapState } from "vuex";
import { gsap } from "gsap";

export default {
  name: "PlayCountCard",
  props: {
    playStats: {
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
      animatedTime: {
        days: 0,
        hours: 0,
        minutes: 0,
      },
    };
  },
  computed: {
    ...mapState("tracks", ["tracks"]),
    playCount() {
      return this.playStats.reduce((acc, cur) => acc + cur.count, 0);
    },
    playTime() {
      return this.playStats.reduce((acc, cur) => acc + cur.total_length, 0);
    },
  },
  watch: {
    playCount(newValue) {
      gsap.to(this.$data, { duration: 1.2, animatedCount: newValue });
    },
    async playTime(newValue) {
      const newDays = Math.floor(newValue / 86400);
      const newHours = Math.floor((newValue % 86400) / 3600);
      const newMinutes = Math.floor(((newValue % 86400) % 3600) / 60);
      if (this.$data.animatedTime.days || newDays) {
        await gsap.to(this.$data.animatedTime, {
          duration: 0.4,
          days: newDays,
        });
      }
      await gsap.to(this.$data.animatedTime, {
        duration: 0.5,
        hours: newHours,
      });
      await gsap.to(this.$data.animatedTime, {
        duration: 0.6,
        minutes: newMinutes,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.play-time {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 0.125rem;
  row-gap: 0.375rem;
  align-items: flex-end;
}
</style>
