<template>
  <div>
    <VSelect
      v-model="selectedPreset"
      min-width="180"
      :items="periodPresets"
      :label="$t('components.dateRangeSelect.label')"
    />
    <VDialog v-model="showCustomRangeModal" persistent max-width="380">
      <VCard>
        <VCardText>
          <VDatePicker
            v-model="customRange"
            control-variant="modal"
            multiple="range"
            scrollable
            :first-day-of-week="1"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            color="primary"
            class="ma-2"
            @click="showCustomRangeModal = false"
          >
            {{ $t("common.cancel") }}
          </VBtn>
          <VBtn
            variant="text"
            color="primary"
            class="ma-2"
            @click="emitSelection"
          >
            {{ $t("common.ok") }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "vuetify";
import i18n from "@/i18n.ts";

const route = useRoute();
const router = useRouter();

const emit = defineEmits<{ input: [{ start: Date; end: Date }] }>();
const periodPresets = [
  {
    value: "last7Days" as const,
    title: i18n.global.t("components.dateRangeSelect.options.last7Days"),
  },
  {
    value: "lastMonth" as const,
    title: i18n.global.t("components.dateRangeSelect.options.lastMonth"),
  },
  {
    value: "thisYear" as const,
    title: i18n.global.t("components.dateRangeSelect.options.thisYear"),
  },
  {
    value: "allTime" as const,
    title: i18n.global.t("components.dateRangeSelect.options.allTime"),
  },
  {
    value: "customRange" as const,
    title: i18n.global.t("components.dateRangeSelect.options.customRange"),
  },
];

const selectedPreset = ref<
  "last7Days" | "lastMonth" | "thisYear" | "allTime" | "customRange"
>("last7Days");
const showCustomRangeModal = ref(false);
const customRange = ref<Date[]>([]);
const dateAdapter = useDate();
const period = computed(() => {
  let end = new Date();
  let start = new Date();
  switch (selectedPreset.value) {
    case "last7Days":
      start = dateAdapter.addDays(start, -7) as Date;
      break;
    case "lastMonth":
      start = dateAdapter.addMonths(start, -1) as Date;
      break;
    case "thisYear":
      start = dateAdapter.setDate(dateAdapter.setMonth(start, 0), 1) as Date;
      break;
    case "allTime":
      start = new Date(0);
      break;
    case "customRange": {
      const range = [...customRange.value].sort(
        (d1, d2) => d2.getTime() - d1.getTime(),
      );
      if (range.length) {
        start = range[0]!;
        end = range[range.length - 1]!;
      }
      break;
    }
  }
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
});

watch(
  () => route.query.period,
  () => {
    const newSelectedPreset = route.query.period;
    if (newSelectedPreset) {
      if (typeof newSelectedPreset === "string") {
        const foundPreset = periodPresets.find(
          (p) => p.value === newSelectedPreset,
        );
        if (foundPreset) {
          selectedPreset.value = foundPreset.value;
        }
      } else if (
        "length" in newSelectedPreset &&
        newSelectedPreset.length === 2
      ) {
        const start = dateAdapter.parseISO(
          newSelectedPreset[0] as string,
        ) as Date;
        const end = dateAdapter.parseISO(
          newSelectedPreset[1] as string,
        ) as Date;
        if (
          customRange.value[0] !== start ||
          customRange.value[customRange.value.length - 1] !== end
        ) {
          selectedPreset.value = "customRange";
          const newRange = [start];
          do {
            newRange.push(
              dateAdapter.addDays(newRange[newRange.length - 1], 1) as Date,
            );
          } while (dateAdapter.isBefore(newRange[newRange.length - 1], end));
          customRange.value = newRange;
          emitSelection();
        }
      }
    }
  },
  { immediate: true },
);

watch(
  selectedPreset,
  (
    newValue:
      | "last7Days"
      | "lastMonth"
      | "thisYear"
      | "allTime"
      | "customRange",
  ) => {
    if (newValue !== "customRange") {
      emitSelection();
    } else {
      showCustomRangeModal.value = true;
    }
  },
  { immediate: true },
);

function emitSelection(): void {
  emit("input", period.value);
  showCustomRangeModal.value = false;
  // We only want to set a new query when the selection bubbles up
  const newPeriod =
    selectedPreset.value === "customRange"
      ? [
          dateAdapter.toISO(customRange.value[0]),
          dateAdapter.toISO(customRange.value[customRange.value.length - 1]),
        ]
      : selectedPreset.value;

  if (newPeriod !== route.query.period) {
    router.push({
      query: {
        ...route.query,
        period: newPeriod,
      },
    });
  }
}
</script>
