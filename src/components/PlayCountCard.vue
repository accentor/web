<template>
  <VCard class="px-2 py-4">
    <div class="text-center mb-4 text-h6 font-weight-regular">
      {{ I18n.t("stats.count.playCount.before") }}
      <span
        class="text-h4 d-block"
        :class="
          data.animatedCount ? 'text-primary' : 'text-grey text--darken-1'
        "
      >
        {{ Math.floor(data.animatedCount) }}
      </span>
      {{ I18n.t("stats.count.playCount.after") }}
    </div>
    <div class="text-center text-h6 font-weight-regular">
      {{ I18n.t("stats.count.playTime.before") }}
      <div class="play-time text-grey-darken-3">
        <span
          class="text-h4 d-block text-right"
          :class="
            data.animatedTime.days
              ? 'text-primary text--darken-1'
              : 'text-grey text--darken-1'
          "
        >
          {{ Math.floor(data.animatedTime.days) }}
        </span>
        <span class="text-subtitle-1 text-left">
          {{
            I18n.t(
              "stats.count.playTime.days",
              Math.floor(data.animatedTime.days),
            )
          }}
        </span>
        <span
          class="text-h4 d-block text-right"
          :class="
            data.animatedTime.days + data.animatedTime.hours
              ? 'text-primary text--darken-1'
              : 'text-grey text--darken-1'
          "
        >
          {{ Math.floor(data.animatedTime.hours) }}
        </span>
        <span class="text-subtitle-1 text-left">
          {{
            I18n.t(
              "stats.count.playTime.hours",
              Math.floor(data.animatedTime.hours),
            )
          }}
        </span>
        <span
          class="text-h4 d-block text-right"
          :class="
            data.animatedTime.days +
            data.animatedTime.hours +
            data.animatedTime.minutes
              ? 'text-primary text--darken-1'
              : 'text-grey text--darken-1'
          "
        >
          {{ Math.floor(data.animatedTime.minutes) }}
        </span>
        <span class="text-subtitle-1 text-left">
          {{
            I18n.t(
              "stats.count.playTime.minutes",
              Math.floor(data.animatedTime.minutes),
            )
          }}
        </span>
      </div>
      {{ I18n.t("stats.count.playTime.after") }}
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { gsap } from "gsap";
import type { PlayStat } from "@accentor/api-client-js";
import { useI18n } from "vue-i18n";

const I18n = useI18n();

interface Props {
  playStats: PlayStat[];
  title: string;
}

const props = defineProps<Props>();

const data = ref({
  animatedCount: 0,
  animatedTime: { days: 0, hours: 0, minutes: 0 },
});

const playCount = computed(() =>
  props.playStats.reduce((acc, cur) => acc + cur.count, 0),
);
const playTime = computed(() =>
  props.playStats.reduce((acc, cur) => acc + cur.total_length, 0),
);

watch(playCount, (newValue) =>
  gsap.to(data.value, { duration: 1.2, animatedCount: newValue }),
);
watch(playTime, async (newValue) => {
  const newDays = Math.floor(newValue / 86400);
  const newHours = Math.floor((newValue % 86400) / 3600);
  const newMinutes = Math.floor((newValue % 3600) / 60);
  if (data.value.animatedTime.days || newDays) {
    await gsap.to(data.value.animatedTime, {
      duration: 0.4,
      days: newDays,
    });
  }
  await gsap.to(data.value.animatedTime, { duration: 0.5, hours: newHours });
  await gsap.to(data.value.animatedTime, {
    duration: 0.5,
    minutes: newMinutes,
  });
});
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
