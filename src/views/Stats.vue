<template>
  <VContainer>
    <VRow>
      <VCol>
        <h1>{{ $t("common.stats") }}</h1>
      </VCol>
      <VCol>
        <DateRangeSelect @input="(e) => (period = e)" />
      </VCol>
    </VRow>
    <VRow>
      <PercentagePlayedCard
        :plays="filteredPlays"
        :tracks="tracks"
        :title="$t('stats.percentageLibraryPlayed')"
      />
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DateRangeSelect from "@/components/DateRangeSelect";
import PercentagePlayedCard from "@/components/PercentagePlayedCard";
import { filterPlaysByPeriod } from "@/filters";

export default {
  name: "Stats",
  metaInfo() {
    return { title: this.$t("common.stats") };
  },
  components: {
    DateRangeSelect,
    PercentagePlayedCard,
  },
  data() {
    return {
      period: {
        start: null,
        end: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      plays: "plays/plays",
      tracks: "tracks/tracks",
    }),
    ...mapState("userSettings", ["locale"]),
    filteredPlays() {
      return this.plays.filter(
        filterPlaysByPeriod(this.period.start, this.period.end)
      );
    },
  },
};
</script>

<style></style>
