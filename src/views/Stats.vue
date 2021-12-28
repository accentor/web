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
      <TopAlbumsList
        class="stats__top-albums"
        :plays="filteredPlays"
        :use-track-length="useTrackLength"
        :title="$t('stats.topAlbums')"
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
import TopAlbumsList from "@/components/TopAlbumsList";
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
    TopAlbumsList,
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

<style lang="scss" scoped>
.stats {
  display: grid;
  grid-auto-columns: 1fr;
  gap: 1rem;
  grid-template-areas:
    "playCount"
    "topTracks"
    "percentagePlayed"
    "topAlbums";

  @media (min-width: map-get($grid-breakpoints, "sm")) {
    grid-template-areas:
      "topTracks topTracks"
      "playCount percentagePlayed"
      "topAlbums topAlbums";
  }

  @media (min-width: map-get($grid-breakpoints, "md")) {
    grid-template-areas:
      "topTracks topTracks playCount"
      "topTracks topTracks percentagePlayed"
      "topAlbums topAlbums topAlbums";
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

  &__top-albums {
    grid-area: topAlbums;
  }
}
</style>
