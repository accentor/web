<template>
  <div>
    <VSelect
      :items="periodPresets"
      :label="$t('components.dateRangeSelect.label')"
      v-model="selectedPreset"
    >
      <template v-slot:item="{ item, on, attrs }">
        <VListItem
          v-on="on"
          v-bind="attrs"
          @click="showCustomRangeModal = item.value === 'customRange'"
        >
          {{ item.text }}
        </VListItem>
      </template>
      <template v-slot:selection="{ item }">
        <span>
          {{ item.value === "customRange" ? customRangeText : item.text }}
        </span>
      </template>
    </VSelect>
    <VDialog persistent width="290px" v-model="showCustomRangeModal">
      <VDatePicker
        v-model="customRange"
        scrollable
        range
        :first-day-of-week="1"
        :locale="locale"
      >
        <VSpacer></VSpacer>
        <VBtn
          text
          color="primary"
          class="ma-2"
          @click="showCustomRangeModal = false"
        >
          {{ $t("common.cancel") }}
        </VBtn>
        <VBtn text color="primary" class="ma-2" @click="emitSelection">
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
    },
  },
};
</script>

<style></style>
