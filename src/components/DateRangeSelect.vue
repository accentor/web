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

<script>
import { mapState } from "pinia";
import { useUserSettingsStore } from "../store/user_settings";
import { useDate } from "vuetify";

export default {
  name: "DateRangeSelect",
  emits: ["input"],
  data() {
    return {
      periodPresets: [
        {
          value: "last7Days",
          title: this.$t("components.dateRangeSelect.options.last7Days"),
        },
        {
          value: "lastMonth",
          title: this.$t("components.dateRangeSelect.options.lastMonth"),
        },
        {
          value: "thisYear",
          title: this.$t("components.dateRangeSelect.options.thisYear"),
        },
        {
          value: "allTime",
          title: this.$t("components.dateRangeSelect.options.allTime"),
        },
        {
          value: "customRange",
          title: this.$t("components.dateRangeSelect.options.customRange"),
        },
      ],
      selectedPreset: "last7Days",
      showCustomRangeModal: false,
      customRange: [],
      dateAdapter: useDate(),
    };
  },
  computed: {
    ...mapState(useUserSettingsStore, ["locale"]),
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
            end = range[range.length - 1];
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
          } else {
            const start = this.dateAdapter.parseISO(newSelectedPreset[0]);
            const end = this.dateAdapter.parseISO(newSelectedPreset[1]);
            if (this.customRange[0] !== start || this.customRange[1] !== end) {
              this.selectedPreset = "customRange";
              const newRange = [start];
              do {
                newRange.push(
                  this.dateAdapter.addDays(newRange[newRange.length - 1], 1),
                );
              } while (
                this.dateAdapter.isBefore(newRange[newRange.length - 1], end)
              );
              this.customRange = newRange;
              this.emitSelection();
            }
          }
        }
      },
      immediate: true,
    },
    selectedPreset: {
      handler(newValue) {
        if (newValue !== "customRange") {
          this.emitSelection();
        } else {
          this.showCustomRangeModal = true;
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
          ? [
              this.dateAdapter.toISO(this.customRange[0]),
              this.dateAdapter.toISO(
                this.customRange[this.customRange.length - 1],
              ),
            ]
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
