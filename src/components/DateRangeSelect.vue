<template>
  <div>
    <VSelect
      v-model="selectedPreset"
      :items="periodPresets"
      :label="$t('components.dateRangeSelect.label')"
    >
      <template #item="{ item, props }">
        <VListItem
          v-bind="props"
          @click="showCustomRangeModal = item.value === 'customRange'"
        >
          {{ item.text }}
        </VListItem>
      </template>
      <template #selection="{ item }">
        <span>
          {{ item.value === "customRange" ? customRangeText : item.text }}
        </span>
      </template>
    </VSelect>
    <VDialog v-model="showCustomRangeModal" persistent width="290px">
      <VDatePicker v-model="customRange" scrollable :first-day-of-week="1">
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
      </VDatePicker>
    </VDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DateRangeSelect",
  emits: ["input"],
  data() {
    return {
      periodPresets: [
        {
          value: "last7Days",
          text: this.$t("components.dateRangeSelect.options.last7Days"),
        },
        {
          value: "lastMonth",
          text: this.$t("components.dateRangeSelect.options.lastMonth"),
        },
        {
          value: "thisYear",
          text: this.$t("components.dateRangeSelect.options.thisYear"),
        },
        {
          value: "allTime",
          text: this.$t("components.dateRangeSelect.options.allTime"),
        },
        {
          value: "customRange",
          text: this.$t("components.dateRangeSelect.options.customRange"),
        },
      ],
      selectedPreset: "last7Days",
      showCustomRangeModal: false,
      customRange: [],
    };
  },
  computed: {
    ...mapState("userSettings", ["locale"]),
    customRangeText() {
      return this.customRange.join(" - ");
    },
    period() {
      let end = new Date();
      let start = new Date();
      switch (this.selectedPreset) {
        case "last7Days":
          start.setDate(start.getDate() - 7);
          break;
        case "lastMonth":
          start.setMonth(start.getMonth() - 1);
          break;
        case "thisYear":
          start.setMonth(0, 1);
          break;
        case "allTime":
          start = new Date(0);
          break;
        case "customRange": {
          const range = this.customRange
            .map((d) => new Date(d))
            .sort((d1, d2) => d1 > d2);
          if (range.length) {
            start = range[0];
            end = range[1] || new Date(range[0]);
          }
          break;
        }
      }
      // Set start and end to beginning and end of day
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
  watch: {
    "$route.query.period": {
      handler() {
        const newSelectedPreset = this.$route.query.period;
        if (this.$route.query.period !== undefined) {
          if (this.periodPresets.find((p) => p.value === newSelectedPreset)) {
            this.selectedPreset = this.$route.query.period;
          } else if (this.customRange !== newSelectedPreset) {
            this.selectedPreset = "customRange";
            this.customRange = newSelectedPreset;
            this.emitSelection();
          }
        }
      },
      immediate: true,
    },
    selectedPreset: {
      handler(newValue) {
        if (newValue !== "customRange") {
          this.emitSelection();
        }
      },
      immediate: true,
    },
  },
  methods: {
    emitSelection() {
      this.$emit("input", this.period);
      this.showCustomRangeModal = false;
      // We only want to set a new query when the selection bubbles up
      const newPeriod =
        this.selectedPreset === "customRange"
          ? this.customRange
          : this.selectedPreset;
      if (newPeriod !== this.$route.query.period) {
        this.$router.push({
          query: {
            ...this.$route.query,
            period: newPeriod,
          },
        });
      }
    },
  },
};
</script>

<style></style>
