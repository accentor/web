<template>
  <div class="stats">
    <PlayCountCard :play-stats="playStats" title="" class="stats__play-count" />
    <TopTracksList
      class="stats__top-tracks"
      :play-stats="playStats"
      :use-track-length="useTrackLength"
      :title="I18n.t('stats.topTracks')"
    />
    <PercentagePlayedCard
      class="stats__percentage-played"
      :play-stats="playStats"
      :use-track-length="useTrackLength"
      :tracks="tracks"
      :title="
        artistName
          ? I18n.t('stats.percentageArtistPlayed', { artist: artistName })
          : I18n.t('stats.percentageLibraryPlayed')
      "
    />
    <TopAlbumsList
      class="stats__top-albums"
      :play-stats="playStats"
      :use-track-length="useTrackLength"
      :title="I18n.t('stats.topAlbums')"
    />
    <TopArtistsList
      class="stats__top-artists"
      :play-stats="playStats"
      :use-track-length="useTrackLength"
      :title="I18n.t('stats.topArtists')"
    />
    <PlaysPunchcard
      class="stats__punchcard"
      :plays="plays"
      :use-track-length="useTrackLength"
      :title="I18n.t('stats.punchcard')"
    />
  </div>
</template>

<script setup lang="ts">
import { type Play, type PlayStat, type Track } from "@accentor/api-client-js";
import PercentagePlayedCard from "@/components/PercentagePlayedCard.vue";
import PlayCountCard from "@/components/PlayCountCard.vue";
import PlaysPunchcard from "@/components/PlaysPunchcard.vue";
import TopArtistsList from "@/components/TopArtistsList.vue";
import TopTracksList from "@/components/TopTracksList.vue";
import TopAlbumsList from "@/components/TopAlbumsList.vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();

const { playStats, useTrackLength, tracks, plays, artistName } = defineProps<{
  playStats: PlayStat[];
  useTrackLength: boolean;
  tracks: Track[];
  plays: Play[];
  artistName: string | null;
}>();
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
