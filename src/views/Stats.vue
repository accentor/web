<template>
  <VContainer>
    <VRow>
      <VCol>
        <h1 class="text-h4">{{ $t("common.stats") }}</h1>
        <p class="text-subtitle-1">{{ pageSubtitle }}</p>
      </VCol>
      <VCol class="d-flex justify-end">
        <VSwitch
          v-model="useTrackLength"
          :label="$t('stats.useTrackLength')"
          class="mr-4"
        />
        <DateRangeSelect @input="(e) => (period = e)" />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="9">
        <TopTracksList
          class="stats__top-tracks"
          :plays="filteredPlays"
          :use-track-length="useTrackLength"
          :title="$t('stats.topTracks')"
        />
      </VCol>
      <VCol cols="12" md="3">
        <PercentagePlayedCard
          class="stats__percentage-played"
          :plays="filteredPlays"
          :use-track-length="useTrackLength"
          :tracks="tracks"
          :title="$t('stats.percentageLibraryPlayed')"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DateRangeSelect from "@/components/DateRangeSelect";
import PercentagePlayedCard from "@/components/PercentagePlayedCard";
import TopTracksList from "@/components/TopTracksList";
import { filterPlaysByPeriod } from "@/filters";
import { getFormattedDate } from "@/dates";

export default {
  name: "Stats",
  metaInfo() {
    return { title: this.$t("common.stats") };
  },
  components: {
    DateRangeSelect,
    PercentagePlayedCard,
    TopTracksList,
  },
  data() {
    return {
      period: {
        start: null,
        end: null,
      },
      useTrackLength: false,
    };
  },
  created() {
    this.reloadPlays();
  },
  computed: {
    ...mapGetters({
      plays: "plays/plays",
      tracks: "tracks/tracks",
    }),
    ...mapState("userSettings", ["locale"]),
    pageSubtitle() {
      if (this.period.start && this.period.end) {
        return `${this.period.start.toLocaleDateString()} - ${this.period.end.toLocaleDateString()}`;
      }
      return "";
    },
    filteredPlays() {
      return this.plays.filter(
        filterPlaysByPeriod(this.period.start, this.period.end)
      );
    },
  },
  methods: {
    async reloadPlays() {
      await this.$store.dispatch("plays/index");
    },
  },
  watch: {
    useTrackLength() {
      if (this.useTrackLength.toString() !== this.$route.query.useTrackLength) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            useTrackLength: this.useTrackLength,
          },
        });
      }
    },
    "$route.query.useTrackLength": {
      handler() {
        this.useTrackLength = this.$route.query.useTrackLength === "true";
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
