<template>
  <VContainer>
    <VRow>
      <VCol>
        <h1 class="text-h4">{{ $t("common.stats") }}</h1>
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
    <div class="stats">
      <PlayCountCard
        :plays="filteredPlays"
        title=""
        class="stats__play-count"
      />
      <TopTracksList
        class="stats__top-tracks"
        :plays="filteredPlays"
        :use-track-length="useTrackLength"
        :title="$t('stats.topTracks')"
      />
      <PercentagePlayedCard
        class="stats__percentage-played"
        :plays="filteredPlays"
        :use-track-length="useTrackLength"
        :tracks="tracks"
        :title="$t('stats.percentageLibraryPlayed')"
      />
    </div>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DateRangeSelect from "@/components/DateRangeSelect";
import PercentagePlayedCard from "@/components/PercentagePlayedCard";
import PlayCountCard from "@/components/PlayCountCard";
import TopTracksList from "@/components/TopTracksList";
import { filterPlaysByPeriod } from "@/filters";

export default {
  name: "Stats",
  metaInfo() {
    return { title: this.$t("common.stats") };
  },
  components: {
    DateRangeSelect,
    PercentagePlayedCard,
    PlayCountCard,
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
};
</script>

<style lang="scss" scoped>
.stats {
  display: grid;
  grid-auto-columns: 1fr;
  gap: 1rem;
  grid-template-areas:
    "playCount"
    "topTracks"
    "percentagePlayed";

  @media (min-width: map-get($grid-breakpoints, "sm")) {
    grid-template-areas:
      "topTracks topTracks"
      "playCount percentagePlayed";
  }

  @media (min-width: map-get($grid-breakpoints, "md")) {
    grid-template-areas:
      "topTracks topTracks playCount"
      "topTracks topTracks percentagePlayed";
  }

  &__percentage-played {
    grid-area: percentagePlayed;
  }

  &__play-count {
    grid-area: playCount;
  }

  &__top-tracks {
    grid-area: topTracks;
  }
}
</style>
