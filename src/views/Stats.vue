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
        :play-stats="playStats"
        title=""
        class="stats__play-count"
      />
      <TopTracksList
        class="stats__top-tracks"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :title="$t('stats.topTracks')"
      />
      <PercentagePlayedCard
        class="stats__percentage-played"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :tracks="filteredTracks"
        :title="
          artistId
            ? $t('stats.percentageArtistPlayed', { artist: artistName })
            : $t('stats.percentageLibraryPlayed')
        "
      />
      <TopAlbumsList
        class="stats__top-albums"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :title="$t('stats.topAlbums')"
      />
      <TopArtistsList
        class="stats__top-artists"
        :play-stats="playStats"
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
import { mapActions, mapState } from "pinia";
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
import { useArtistsStore } from "../store/artists";
import { useTracksStore } from "../store/tracks";
import { usePlaysStore } from "../store/plays";
import { useAuthStore } from "../store/auth";

export default {
  name: "Stats",
  components: {
    DateRangeSelect,
    PercentagePlayedCard,
    PlayCountCard,
    PlaysPunchcard,
    TopAlbumsList,
    TopArtistsList,
    TopTracksList,
  },
  props: {
    artistId: {
      type: Number,
      default: null,
    },
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
  head() {
    return { title: this.pageTitle };
  },
  computed: {
    ...mapState(usePlaysStore, { plays: "allPlays" }),
    ...mapState(useArtistsStore, ["artists"]),
    artistName() {
      return this.artistId && this.artists[this.artistId]?.name;
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
      if (this.artistId) {
        plays = plays.filter(filterPlaysByTracks(this.filteredTracks));
      }
      return plays;
    },
    filteredTracks() {
      const tracksStore = useTracksStore();
      if (this.artistId) {
        return tracksStore.tracksFilterByArtist(this.artistId);
      }
      return tracksStore.allTracks;
    },
    playStatsScope() {
      const scope = new PlaysScope();
      if (this.period.start && this.period.end) {
        scope.playedAfter(this.period.start);
        scope.playedBefore(this.period.end);
      }
      if (this.artistId) {
        scope.artist(this.artistId);
      }
      return scope;
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
  methods: {
    ...mapActions(usePlaysStore, { reloadPlays: "index" }),
    async loadPlayStats() {
      const gen = $api.plays.stats(
        useAuthStore().apiToken,
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
};
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "vuetify/settings";

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

  @media #{map.get(settings.$display-breakpoints, "sm-and-up")} {
    grid-template-areas:
      "topTracks topTracks"
      "playCount percentagePlayed"
      "topAlbums topAlbums"
      "topArtists topArtists"
      "punchcard punchcard";
  }

  @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
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
