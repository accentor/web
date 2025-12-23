<template>
  <VContainer>
    <VRow>
      <VCol>
        <h1 class="text-h4">{{ pageTitle }}</h1>
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
        :playStats="playStats"
        title=""
        class="stats__play-count"
      />
      <TopTracksList
        class="stats__top-tracks"
        :playStats="playStats"
        :use-track-length="useTrackLength"
        :title="$t('stats.topTracks')"
      />
      <PercentagePlayedCard
        class="stats__percentage-played"
        :playStats="playStats"
        :use-track-length="useTrackLength"
        :tracks="filteredTracks"
        :title="
          artist_id
            ? $t('stats.percentageArtistPlayed', { artist: artistName })
            : $t('stats.percentageLibraryPlayed')
        "
      />
      <TopAlbumsList
        class="stats__top-albums"
        :playStats="playStats"
        :use-track-length="useTrackLength"
        :title="$t('stats.topAlbums')"
      />
      <TopArtistsList
        class="stats__top-artists"
        :playStats="playStats"
        :use-track-length="useTrackLength"
        :title="$t('stats.topArtists')"
      />
      <PlaysPunchcard
        class="stats__punchcard"
        :plays="filteredPlays"
        :use-track-length="useTrackLength"
        :title="$t('stats.punchcard')"
      />
    </div>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DateRangeSelect from "@/components/DateRangeSelect.vue";
import PercentagePlayedCard from "@/components/PercentagePlayedCard.vue";
import PlayCountCard from "@/components/PlayCountCard.vue";
import PlaysPunchcard from "@/components/PlaysPunchcard.vue";
import TopArtistsList from "@/components/TopArtistsList.vue";
import TopTracksList from "@/components/TopTracksList.vue";
import TopAlbumsList from "@/components/TopAlbumsList.vue";
import { filterPlaysByPeriod, filterPlaysByTracks } from "@/filters";
import $api from "../api";
import { PlaysScope } from "@accentor/api-client-js";

export default {
  name: "Stats",
  metaInfo() {
    return { title: this.pageTitle };
  },
  components: {
    DateRangeSelect,
    PercentagePlayedCard,
    PlayCountCard,
    PlaysPunchcard,
    TopAlbumsList,
    TopArtistsList,
    TopTracksList,
  },
  data() {
    return {
      period: {
        start: null,
        end: null,
      },
      useTrackLength: false,
      playStats: [],
    };
  },
  props: {
    artist_id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      plays: "plays/plays",
    }),

    ...mapState("artists", ["artists"]),
    artistName() {
      return this.artist_id && this.artists[this.artist_id]?.name;
    },
    pageTitle() {
      return this.artistName
        ? this.$t("common.stats-for-artist", { artist: this.artistName })
        : this.$t("common.stats");
    },
    pageSubtitle() {
      if (this.period.start && this.period.end) {
        return `${this.period.start.toLocaleDateString()} - ${this.period.end.toLocaleDateString()}`;
      }
      return "";
    },
    filteredPlays() {
      let plays = this.plays.filter(
        filterPlaysByPeriod(this.period.start, this.period.end),
      );
      if (this.artist_id) {
        plays = plays.filter(filterPlaysByTracks(this.filteredTracks));
      }
      return plays;
    },
    filteredTracks() {
      if (this.artist_id) {
        return this.$store.getters["tracks/tracksFilterByArtist"](
          this.artist_id,
        );
      }
      return this.$store.getters["tracks/tracks"];
    },
    playStatsScope() {
      const scope = new PlaysScope();
      if (this.period.start && this.period.end) {
        scope.playedAfter(this.period.start);
        scope.playedBefore(this.period.end);
      }
      if (this.artist_id) {
        scope.artist(this.artist_id);
      }
      return scope;
    },
  },
  methods: {
    async reloadPlays() {
      await this.$store.dispatch("plays/index");
    },
    async loadPlayStats() {
      const gen = $api.plays.stats(
        this.$store.state.auth.apiToken,
        this.playStatsScope,
      );
      let done = false;
      let results = [];
      while (!done) {
        let value = [];
        ({ value, done } = await gen.next());
        results.push(...value);
      }
      this.playStats = results;
    },
  },
  watch: {
    playStatsScope() {
      this.loadPlayStats();
    },
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
    "topAlbums"
    "topArtists"
    "punchcard";

  @media (min-width: map-get($grid-breakpoints, "sm")) {
    grid-template-areas:
      "topTracks topTracks"
      "playCount percentagePlayed"
      "topAlbums topAlbums"
      "topArtists topArtists"
      "punchcard punchcard";
  }

  @media (min-width: map-get($grid-breakpoints, "md")) {
    grid-template-areas:
      "topTracks topTracks topTracks topTracks playCount playCount"
      "topTracks topTracks topTracks topTracks percentagePlayed percentagePlayed"
      "topAlbums topAlbums topAlbums topArtists topArtists topArtists"
      "punchcard punchcard punchcard punchcard punchcard punchcard";
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

  &__top-artists {
    grid-area: topArtists;
  }

  &__punchcard {
    grid-area: punchcard;
  }
}
</style>
